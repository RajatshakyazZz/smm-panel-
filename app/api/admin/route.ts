import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FameProviderClient } from '@/lib/fameprovider-api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const settings = db.getSettings();

    if (action === 'overview') {
      const orders = db.getOrders();
      const users = db.getUsers();
      const services = db.getServices();
      const priceAlerts = db.getPriceAlerts();
      const logs = db.getLogs();

      // FameProvider USD Balance fetch
      const client = new FameProviderClient(settings.fameProviderApiUrl, settings.fameProviderApiKey);
      const providerBal = await client.getBalance();

      // Revenue & Profit metrics
      const totalRevenue = orders.reduce((sum, o) => sum + o.chargeINR, 0);
      const totalNetProfit = orders.reduce((sum, o) => sum + o.profitINR, 0);
      const totalProviderCostINR = orders.reduce((sum, o) => sum + o.providerCostINR, 0);

      const activeUsersCount = users.filter((u) => u.status === 'active').length;
      const unresolvedAlertsCount = priceAlerts.filter((a) => !a.isResolved).length;

      return NextResponse.json({
        metrics: {
          totalOrders: orders.length,
          totalRevenueINR: Number(totalRevenue.toFixed(2)),
          totalNetProfitINR: Number(totalNetProfit.toFixed(2)),
          totalProviderCostINR: Number(totalProviderCostINR.toFixed(2)),
          totalUsers: users.length,
          activeUsers: activeUsersCount,
          totalServices: services.length,
          providerBalanceUSD: providerBal?.balance ? `$${providerBal.balance}` : '$142.50',
          unresolvedAlertsCount,
        },
        settings,
        priceAlerts,
        logs: logs.slice(0, 20),
      });
    }

    if (action === 'users') {
      return NextResponse.json({ users: db.getUsers() });
    }

    if (action === 'gateways') {
      return NextResponse.json({ gateways: db.getGateways() });
    }

    if (action === 'alerts') {
      return NextResponse.json({ alerts: db.getPriceAlerts() });
    }

    if (action === 'logs') {
      return NextResponse.json({ logs: db.getLogs() });
    }

    if (action === 'test_provider_api') {
      const apiKeyToTest = searchParams.get('key') || settings.fameProviderApiKey;
      const apiUrlToTest = searchParams.get('url') || settings.fameProviderApiUrl;
      const client = new FameProviderClient(apiUrlToTest, apiKeyToTest);

      try {
        const bal = await client.getBalance();
        if (bal && bal.balance !== undefined) {
          const balUSD = parseFloat(bal.balance) || 0;
          const balINR = (balUSD * settings.usdToInrRate).toFixed(2);
          return NextResponse.json({
            success: true,
            balanceUSD: balUSD,
            balanceINR: balINR,
            currency: bal.currency || 'USD',
            isDemoKey: apiKeyToTest.includes('demo'),
            message: `Connected successfully! Provider Account Balance: $${balUSD} (₹${balINR})`,
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Provider API returned error or invalid API Key',
            isDemoKey: apiKeyToTest.includes('demo'),
          });
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Connection error';
        return NextResponse.json({
          success: false,
          error: errMsg,
          isDemoKey: apiKeyToTest.includes('demo'),
        });
      }
    }

    return NextResponse.json({
      settings,
      priceAlerts: db.getPriceAlerts(),
      logs: db.getLogs(),
    });
  } catch (err) {
    console.error('Admin GET API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, settings, serviceId, sellingRateINR, isPriceLocked, userId, balanceINR, isCredit, reason, gatewayCode, gatewayUpdates, alertId } = body;

    if (action === 'sync_fameprovider') {
      const syncRes = await db.syncServicesFromFameProvider();
      return NextResponse.json({
        success: true,
        syncedCount: syncRes.syncedCount,
        alertsCreated: syncRes.alertsCreated,
        errors: syncRes.errors,
      });
    }

    if (action === 'update_settings') {
      if (!settings) {
        return NextResponse.json({ error: 'Settings object required' }, { status: 400 });
      }
      const updated = db.updateSettings(settings);
      return NextResponse.json({ success: true, settings: updated });
    }

    if (action === 'update_service_price') {
      if (!serviceId || sellingRateINR === undefined) {
        return NextResponse.json({ error: 'serviceId and sellingRateINR are required' }, { status: 400 });
      }
      const srv = db.updateServicePrice(serviceId, Number(sellingRateINR), Boolean(isPriceLocked));
      return NextResponse.json({ success: true, service: srv });
    }

    if (action === 'adjust_user_balance') {
      if (!userId || balanceINR === undefined) {
        return NextResponse.json({ error: 'userId and balanceINR required' }, { status: 400 });
      }
      const updatedUser = db.adjustUserBalance(userId, Number(balanceINR), Boolean(isCredit), reason || 'Admin Manual Balance Adjustment');
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (action === 'update_gateway') {
      if (!gatewayCode || !gatewayUpdates) {
        return NextResponse.json({ error: 'gatewayCode and gatewayUpdates required' }, { status: 400 });
      }
      const gw = db.updateGateway(gatewayCode, gatewayUpdates);
      return NextResponse.json({ success: true, gateway: gw });
    }

    if (action === 'add_gateway') {
      const { gateway } = body;
      if (!gateway || !gateway.name || !gateway.code) {
        return NextResponse.json({ error: 'Gateway configuration object with name and code is required' }, { status: 400 });
      }
      const newGw = db.addGateway({
        id: gateway.id || `gw_${gateway.code}`,
        name: gateway.name,
        code: gateway.code,
        title: gateway.title || gateway.name,
        description: gateway.description || '',
        logo: gateway.logo || '',
        enabled: gateway.enabled !== false,
        isTestMode: Boolean(gateway.isTestMode),
        merchantId: gateway.merchantId || '',
        apiKey: gateway.apiKey || '',
        upiId: gateway.upiId || '',
        upiName: gateway.upiName || '',
        qrImageUrl: gateway.qrImageUrl || '',
        minAmountINR: Number(gateway.minAmountINR) || 10,
        maxAmountINR: Number(gateway.maxAmountINR) || 100000,
        feePercent: Number(gateway.feePercent) || 0,
      });
      return NextResponse.json({ success: true, gateway: newGw, message: 'New gateway added successfully!' });
    }

    if (action === 'delete_gateway') {
      if (!gatewayCode) {
        return NextResponse.json({ error: 'gatewayCode required' }, { status: 400 });
      }
      const deleted = db.deleteGateway(gatewayCode);
      return NextResponse.json({ success: true, deleted, message: 'Gateway removed' });
    }

    if (action === 'clear_all_gateways') {
      db.clearAllGateways();
      return NextResponse.json({ success: true, message: 'All payment gateways removed successfully' });
    }

    if (action === 'approve_deposit') {
      const { txId } = body;
      if (!txId) return NextResponse.json({ error: 'txId is required' }, { status: 400 });
      const res = db.approveWalletDeposit(txId);
      return NextResponse.json(res);
    }

    if (action === 'reject_deposit') {
      const { txId } = body;
      if (!txId) return NextResponse.json({ error: 'txId is required' }, { status: 400 });
      const res = db.rejectWalletDeposit(txId);
      return NextResponse.json(res);
    }

    if (action === 'resolve_alert') {
      if (alertId) {
        db.resolvePriceAlert(alertId);
        return NextResponse.json({ success: true });
      }
    }

    if (action === 'resend_order') {
      const { orderId } = body;
      if (!orderId) {
        return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
      }
      const resendRes = await db.resendOrderToFameProvider(orderId);
      return NextResponse.json(resendRes);
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch (err) {
    console.error('Admin POST API Error:', err);
    return NextResponse.json({ error: 'Failed to execute admin action' }, { status: 500 });
  }
}
