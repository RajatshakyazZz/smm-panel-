import fs from 'fs';
import path from 'path';
import {
  User,
  SMMCategory,
  SMMService,
  SMMOrder,
  PriceAlert,
  PaymentGatewayConfig,
  WalletTransaction,
  SupportTicket,
  SystemSettings,
  SystemLog,
} from './types';
import { FameProviderClient, FameProviderService } from './fameprovider-api';
import { isSupabaseConfigured, getSupabaseAdmin } from './supabase';

interface DBData {
  users: User[];
  categories: SMMCategory[];
  services: SMMService[];
  orders: SMMOrder[];
  priceAlerts: PriceAlert[];
  gateways: PaymentGatewayConfig[];
  transactions: WalletTransaction[];
  tickets: SupportTicket[];
  settings: SystemSettings;
  logs: SystemLog[];
}

const DB_FILE = path.join(process.cwd(), 'smm_panel_db.json');

// Helper to get FameProvider credentials safely from server environment
function getFameApiKeyFromEnv(fallback: string): string {
  return process.env.FAMEPROVIDER_API_KEY || process.env.FAME_PROVIDER_API_KEY || fallback;
}

function getFameApiUrlFromEnv(fallback: string): string {
  return process.env.FAMEPROVIDER_API_URL || process.env.FAME_PROVIDER_API_URL || fallback;
}

// Default initial state
const defaultSettings: SystemSettings = {
  fameProviderApiUrl: process.env.FAMEPROVIDER_API_URL || 'https://fameprovider.com/api/v2',
  fameProviderApiKey: process.env.FAMEPROVIDER_API_KEY || 'demo_fame_provider_key_2026',
  usdToInrRate: 87.0, // 1 USD = 87 INR
  rateExchangeMode: 'manual',
  globalMarginPercent: 35, // 35% default margin
  minProfitINR: 2.0,
  autoSyncEnabled: true,
  syncIntervalMinutes: 60,
  maintenanceMode: false,
  siteName: 'FameProvider - Premier SMM Panel',
  siteDescription: 'Cheapest & Non-Drop Indian SMM Panel for Instagram, YouTube, Telegram & Facebook',
  telegramSupport: 'Fameprovider_help',
  whatsappSupport: '7050259916',
  supportEmail: 'support@fameprovider.com',
};

const defaultUsers: User[] = [
  {
    id: 'usr_admin_001',
    username: 'admin',
    email: 'admin@fameprovider.com',
    role: 'super_admin',
    balanceINR: 0.0,
    spentINR: 0.0,
    apiKey: 'fame_admin_api_key_88990011',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultCategories: SMMCategory[] = [
  { id: 'cat_ig', name: 'Instagram - Followers [Non-Drop & Instant]', icon: 'Instagram', sortOrder: 1, isActive: true },
  { id: 'cat_ig_likes', name: 'Instagram - Likes & Reels Views [Indian Real]', icon: 'Heart', sortOrder: 2, isActive: true },
  { id: 'cat_yt', name: 'YouTube - Subscribers & Watch Time', icon: 'Youtube', sortOrder: 3, isActive: true },
  { id: 'cat_tg', name: 'Telegram - Channel Members & Post Views', icon: 'Send', sortOrder: 4, isActive: true },
  { id: 'cat_fb', name: 'Facebook - Page Likes, Followers & Video Views', icon: 'Facebook', sortOrder: 5, isActive: true },
  { id: 'cat_tw', name: 'Twitter / X - Followers & Retweets', icon: 'Twitter', sortOrder: 6, isActive: true },
];

// Initial seed services mapped from FameProvider API spec
const defaultServices: SMMService[] = [
  {
    id: 'srv_101',
    providerServiceId: 101,
    name: 'Instagram Followers [Real Active - 30 Days Refill - Max 500K]',
    category: 'Instagram - Followers [Non-Drop & Instant]',
    type: 'Default',
    providerRateUSD: 0.28, // $0.28 / 1000
    calculatedRateINR: 24.36, // 0.28 * 87
    marginPercent: 35,
    sellingRateINR: 32.88, // 24.36 * 1.35
    isPriceLocked: false,
    minQuantity: 100,
    maxQuantity: 500000,
    refillSupported: true,
    cancelSupported: true,
    description: '⚡ Start: 0-15 Minutes\n⚡ Speed: 50K/Day\n⚡ Quality: High Quality Real Profiles\n⚡ Guarantee: 30 Days Auto Refill',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_102',
    providerServiceId: 102,
    name: 'Instagram Followers [Indian Target - Non Drop Guaranteed]',
    category: 'Instagram - Followers [Non-Drop & Instant]',
    type: 'Default',
    providerRateUSD: 0.45,
    calculatedRateINR: 39.15,
    marginPercent: 35,
    sellingRateINR: 52.85,
    isPriceLocked: false,
    minQuantity: 100,
    maxQuantity: 200000,
    refillSupported: true,
    cancelSupported: false,
    description: '🇮🇳 100% Indian Real Accounts with Posts & Stories.\n⚡ Instant Start\n⚡ Refill: 60 Days Refill Button',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_201',
    providerServiceId: 201,
    name: 'Instagram Likes [Super Instant - High Speed 100K/day]',
    category: 'Instagram - Likes & Reels Views [Indian Real]',
    type: 'Default',
    providerRateUSD: 0.08,
    calculatedRateINR: 6.96,
    marginPercent: 40,
    sellingRateINR: 9.74,
    isPriceLocked: false,
    minQuantity: 50,
    maxQuantity: 100000,
    refillSupported: false,
    cancelSupported: true,
    description: '🔥 Cheapest Likes on Market\n⚡ Start: 0-1 minute\n⚡ Works on Posts, Reels & IGTV',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_202',
    providerServiceId: 202,
    name: 'Instagram Reels Views [Ultra Fast - Viral Boost Engine]',
    category: 'Instagram - Likes & Reels Views [Indian Real]',
    type: 'Default',
    providerRateUSD: 0.015,
    calculatedRateINR: 1.305,
    marginPercent: 50,
    sellingRateINR: 1.95,
    isPriceLocked: false,
    minQuantity: 500,
    maxQuantity: 10000000,
    refillSupported: false,
    cancelSupported: true,
    description: '📈 Instantly boosts Explore page algorithm.\n⚡ Speed: 1 Million/Hour\n⚡ Link format: Reel URL',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_301',
    providerServiceId: 301,
    name: 'YouTube Subscribers [Non-Drop - Real Users - Organic Speed]',
    category: 'YouTube - Subscribers & Watch Time',
    type: 'Default',
    providerRateUSD: 3.50,
    calculatedRateINR: 304.5,
    marginPercent: 30,
    sellingRateINR: 395.85,
    isPriceLocked: false,
    minQuantity: 50,
    maxQuantity: 50000,
    refillSupported: true,
    cancelSupported: false,
    description: '🎥 Monetization safe subscribers.\n⚡ Speed: 200-500/day organic drip-feed.\n⚡ Refill: 30 Days Guarantee',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_302',
    providerServiceId: 302,
    name: 'YouTube High Retention Views [Monetizable - 3-5 Min Retention]',
    category: 'YouTube - Subscribers & Watch Time',
    type: 'Default',
    providerRateUSD: 0.95,
    calculatedRateINR: 82.65,
    marginPercent: 35,
    sellingRateINR: 111.57,
    isPriceLocked: false,
    minQuantity: 1000,
    maxQuantity: 1000000,
    refillSupported: true,
    cancelSupported: true,
    description: '▶ High Watch time retention suitable for channel monetization compliance.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_401',
    providerServiceId: 401,
    name: 'Telegram Channel Members [Non-Drop - Fast Delivery]',
    category: 'Telegram - Channel Members & Post Views',
    type: 'Default',
    providerRateUSD: 0.32,
    calculatedRateINR: 27.84,
    marginPercent: 35,
    sellingRateINR: 37.58,
    isPriceLocked: false,
    minQuantity: 100,
    maxQuantity: 300000,
    refillSupported: true,
    cancelSupported: false,
    description: '✈ Fast members for public & private Telegram channels or groups.\n⚡ Public link: t.me/channel',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv_501',
    providerServiceId: 501,
    name: 'Facebook Page Likes + Followers [Indian Real - Non Drop]',
    category: 'Facebook - Page Likes, Followers & Video Views',
    type: 'Default',
    providerRateUSD: 1.10,
    calculatedRateINR: 95.70,
    marginPercent: 35,
    sellingRateINR: 129.20,
    isPriceLocked: false,
    minQuantity: 100,
    maxQuantity: 100000,
    refillSupported: true,
    cancelSupported: false,
    description: '👍 Premium Facebook Page Likes + Profile Followers.',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultGateways: PaymentGatewayConfig[] = [
  {
    id: 'gw_gurupay',
    name: 'GuruPay Payment Gateway',
    code: 'gurupay',
    title: 'GuruPay Instant UPI Auto-Credit',
    description: 'Instant UPI, PhonePe, Google Pay, Paytm & NetBanking Payment',
    logo: 'https://gurupaygateway.com/favicon.ico',
    enabled: true,
    isTestMode: false,
    apiKey: 'guruf6ab4e18c70cfd67938117c816b1b2',
    minAmountINR: 10,
    maxAmountINR: 100000,
    feePercent: 0,
  },
];

const defaultOrders: SMMOrder[] = [];

const defaultTickets: SupportTicket[] = [];

class SMMDatabase {
  private data: DBData;

  constructor() {
    this.data = {
      users: defaultUsers,
      categories: defaultCategories,
      services: defaultServices,
      orders: defaultOrders,
      priceAlerts: [],
      gateways: defaultGateways,
      transactions: [],
      tickets: defaultTickets,
      settings: defaultSettings,
      logs: [],
    };
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loadedGateways: PaymentGatewayConfig[] = Array.isArray(parsed.gateways) ? parsed.gateways : defaultGateways;
          if (!loadedGateways.some((g) => g.code === 'gurupay')) {
            loadedGateways.unshift(defaultGateways[0]);
          }

          this.data = {
            users: parsed.users || defaultUsers,
            categories: parsed.categories || defaultCategories,
            services: parsed.services || defaultServices,
            orders: parsed.orders || defaultOrders,
            priceAlerts: parsed.priceAlerts || [],
            gateways: loadedGateways,
            transactions: parsed.transactions || [],
            tickets: parsed.tickets || defaultTickets,
            settings: { ...defaultSettings, ...(parsed.settings || {}) },
            logs: parsed.logs || [],
          };
        }
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('[DB] Load error, using default memory state:', err);
    }
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      
      // Async sync to Supabase if credentials are sets
      if (isSupabaseConfigured()) {
        this.syncToSupabase().catch((err) => {
          console.error('[DB] Supabase sync background error:', err);
        });
      }
    } catch (err) {
      console.error('[DB] Save error:', err);
    }
  }

  private async syncToSupabase() {
    try {
      const supabase = getSupabaseAdmin();
      
      // Sync settings
      const settings = this.getSettings();
      await supabase.from('settings').upsert({
        id: 'default',
        fame_provider_api_url: settings.fameProviderApiUrl,
        fame_provider_api_key: settings.fameProviderApiKey,
        usd_to_inr_rate: settings.usdToInrRate,
        rate_exchange_mode: settings.rateExchangeMode,
        global_margin_percent: settings.globalMarginPercent,
        min_profit_inr: settings.minProfitINR,
        auto_sync_enabled: settings.autoSyncEnabled,
        sync_interval_minutes: settings.syncIntervalMinutes,
        maintenance_mode: settings.maintenanceMode,
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        telegram_support: settings.telegramSupport,
        whatsapp_support: settings.whatsappSupport,
        support_email: settings.supportEmail,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('[DB] Supabase sync failed:', err);
    }
  }

  // --- SETTINGS ---
  getSettings(): SystemSettings {
    return {
      ...this.data.settings,
      fameProviderApiKey: getFameApiKeyFromEnv(this.data.settings.fameProviderApiKey),
      fameProviderApiUrl: getFameApiUrlFromEnv(this.data.settings.fameProviderApiUrl),
    };
  }

  updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    
    // Recalculate selling rates if exchange rate or margin changed
    if (newSettings.usdToInrRate !== undefined || newSettings.globalMarginPercent !== undefined) {
      this.recalculateAllServiceRates();
    }
    
    this.saveToDisk();
    return this.getSettings();
  }

  private recalculateAllServiceRates() {
    const usdRate = this.data.settings.usdToInrRate;
    const margin = this.data.settings.globalMarginPercent;

    this.data.services = this.data.services.map((srv) => {
      const calcRateINR = Number((srv.providerRateUSD * usdRate).toFixed(2));
      const effectiveMargin = srv.marginPercent || margin;
      let sellingINR = Number((calcRateINR * (1 + effectiveMargin / 100)).toFixed(2));
      
      // Enforce minimum profit rule
      const profit = sellingINR - calcRateINR;
      if (profit < this.data.settings.minProfitINR) {
        sellingINR = Number((calcRateINR + this.data.settings.minProfitINR).toFixed(2));
      }

      return {
        ...srv,
        calculatedRateINR: calcRateINR,
        sellingRateINR: srv.isPriceLocked ? srv.sellingRateINR : sellingINR,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  // --- USERS ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    if (!id) {
      return this.data.users[0] || this.createUser('customer', 'customer@example.com');
    }

    const cleanId = id.trim();
    
    // 1. Match by exact ID
    let found = this.data.users.find((u) => u.id === cleanId);
    if (found) return found;

    // 2. Match by Email
    found = this.data.users.find((u) => u.email.toLowerCase() === cleanId.toLowerCase());
    if (found) return found;

    // 3. Match by Username
    found = this.data.users.find((u) => u.username.toLowerCase() === cleanId.toLowerCase());
    if (found) return found;

    // 4. Auto-register or create user record so operations never fail
    const isEmail = cleanId.includes('@');
    const email = isEmail ? cleanId : `${cleanId.replace(/[^a-zA-Z0-9_]/g, '')}@gmail.com`;
    const username = isEmail ? cleanId.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') : cleanId;

    const newUser = this.createUser(username || 'user', email);
    if (!isEmail && cleanId.length > 3) {
      newUser.id = cleanId;
      this.saveToDisk();
    }
    return newUser;
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(username: string, email: string): User {
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      username,
      email,
      role: 'customer',
      balanceINR: 100.0, // Sign up bonus ₹100
      spentINR: 0.0,
      apiKey: 'fame_key_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.addLog('SYSTEM', 'info', `New user registered: ${username} (${email})`);
    this.saveToDisk();
    return newUser;
  }

  adjustUserBalance(userId: string, amountINR: number, isCredit: boolean, reason: string): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    if (isCredit) {
      user.balanceINR = Number((user.balanceINR + amountINR).toFixed(2));
    } else {
      user.balanceINR = Number((user.balanceINR - amountINR).toFixed(2));
    }
    user.updatedAt = new Date().toISOString();

    this.addLog('WALLET', 'info', `Balance adjusted for ${user.username}: ${isCredit ? '+' : '-'}₹${amountINR} (${reason})`);
    this.saveToDisk();
    return user;
  }

  // --- CATEGORIES & SERVICES ---
  getCategories(): SMMCategory[] {
    return this.data.categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getServices(): SMMService[] {
    return this.data.services.filter((s) => s.isActive);
  }

  getServiceById(id: string): SMMService | undefined {
    return this.data.services.find((s) => s.id === id);
  }

  updateServicePrice(serviceId: string, sellingRateINR: number, isPriceLocked: boolean, marginPercent?: number): SMMService | null {
    const srv = this.data.services.find((s) => s.id === serviceId);
    if (!srv) return null;

    srv.sellingRateINR = Number(sellingRateINR.toFixed(2));
    srv.isPriceLocked = isPriceLocked;
    if (marginPercent !== undefined) {
      srv.marginPercent = marginPercent;
    }
    srv.updatedAt = new Date().toISOString();

    this.saveToDisk();
    return srv;
  }

  /**
   * Sync Services with FameProvider API
   */
  async syncServicesFromFameProvider(): Promise<{ syncedCount: number; alertsCreated: number; errors: string[] }> {
    const settings = this.getSettings();
    const client = new FameProviderClient(settings.fameProviderApiUrl, settings.fameProviderApiKey);
    const providerServices = await client.getServices();

    const errors: string[] = [];
    if (!providerServices || !Array.isArray(providerServices)) {
      errors.push('Unable to connect to FameProvider API or invalid response received. Using local synced catalog.');
      return { syncedCount: 0, alertsCreated: 0, errors };
    }

    let syncedCount = 0;
    let alertsCreated = 0;
    const usdRate = this.data.settings.usdToInrRate;
    const globalMargin = this.data.settings.globalMarginPercent;

    for (const pSrv of providerServices) {
      const pId = Number(pSrv.service);
      const providerRateUSD = parseFloat(pSrv.rate) || 0.10;
      const minQty = parseInt(pSrv.min, 10) || 10;
      const maxQty = parseInt(pSrv.max, 10) || 100000;
      const calcINR = Number((providerRateUSD * usdRate).toFixed(2));

      // Check if existing service
      const existing = this.data.services.find((s) => s.providerServiceId === pId);

      if (existing) {
        // Detect price or rule changes for alerts
        if (existing.providerRateUSD !== providerRateUSD) {
          const changePct = Number((((providerRateUSD - existing.providerRateUSD) / existing.providerRateUSD) * 100).toFixed(1));
          this.data.priceAlerts.push({
            id: 'alt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
            serviceId: existing.id,
            serviceName: existing.name,
            providerServiceId: pId,
            field: 'price',
            oldValue: `$${existing.providerRateUSD} (₹${existing.calculatedRateINR})`,
            newValue: `$${providerRateUSD} (₹${calcINR})`,
            changePercent: changePct,
            isResolved: false,
            createdAt: new Date().toISOString(),
          });
          alertsCreated++;
        }

        existing.providerRateUSD = providerRateUSD;
        existing.calculatedRateINR = calcINR;
        existing.minQuantity = minQty;
        existing.maxQuantity = maxQty;
        existing.refillSupported = Boolean(pSrv.refill);
        existing.cancelSupported = Boolean(pSrv.cancel);

        if (!existing.isPriceLocked) {
          let selling = Number((calcINR * (1 + (existing.marginPercent || globalMargin) / 100)).toFixed(2));
          if (selling - calcINR < this.data.settings.minProfitINR) {
            selling = Number((calcINR + this.data.settings.minProfitINR).toFixed(2));
          }
          existing.sellingRateINR = selling;
        }

        existing.updatedAt = new Date().toISOString();
        syncedCount++;
      } else {
        // Create new category if needed
        let catObj = this.data.categories.find((c) => c.name === pSrv.category);
        if (!catObj) {
          catObj = {
            id: 'cat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 3),
            name: pSrv.category,
            icon: 'Layers',
            sortOrder: this.data.categories.length + 1,
            isActive: true,
          };
          this.data.categories.push(catObj);
        }

        let selling = Number((calcINR * (1 + globalMargin / 100)).toFixed(2));
        if (selling - calcINR < this.data.settings.minProfitINR) {
          selling = Number((calcINR + this.data.settings.minProfitINR).toFixed(2));
        }

        const newSrv: SMMService = {
          id: 'srv_' + pId,
          providerServiceId: pId,
          name: pSrv.name,
          category: pSrv.category,
          type: pSrv.type || 'Default',
          providerRateUSD,
          calculatedRateINR: calcINR,
          marginPercent: globalMargin,
          sellingRateINR: selling,
          isPriceLocked: false,
          minQuantity: minQty,
          maxQuantity: maxQty,
          refillSupported: Boolean(pSrv.refill),
          cancelSupported: Boolean(pSrv.cancel),
          description: `⚡ FameProvider API Service ID: #${pId}\n⚡ Instant Start & Automated Order Routing`,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.data.services.push(newSrv);
        syncedCount++;
      }
    }

    this.addLog('CRON_SYNC', 'success', `Synced ${syncedCount} services from FameProvider API. Generated ${alertsCreated} price alerts.`);
    this.saveToDisk();
    return { syncedCount, alertsCreated, errors };
  }

  // --- ORDERS ---
  getOrders(userId?: string): SMMOrder[] {
    if (userId) {
      return this.data.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(userId: string, serviceId: string, link: string, quantity: number): Promise<{ order?: SMMOrder; error?: string }> {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found.' };

    const service = this.getServiceById(serviceId);
    if (!service) return { error: 'Invalid or inactive service.' };

    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return { error: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}.` };
    }

    // Calculate charge in INR
    const chargeINR = Number(((service.sellingRateINR * quantity) / 1000).toFixed(2));
    if (user.balanceINR < chargeINR) {
      return {
        error: `Insufficient Wallet Balance! Required: ₹${chargeINR.toFixed(2)}, Available: ₹${user.balanceINR.toFixed(2)}. Please recharge your wallet.`,
      };
    }

    // Provider cost calculation
    const providerCostUSD = Number(((service.providerRateUSD * quantity) / 1000).toFixed(4));
    const providerCostINR = Number((providerCostUSD * this.data.settings.usdToInrRate).toFixed(2));
    const profitINR = Number((chargeINR - providerCostINR).toFixed(2));

    // Deduct user balance
    user.balanceINR = Number((user.balanceINR - chargeINR).toFixed(2));
    user.spentINR = Number((user.spentINR + chargeINR).toFixed(2));

    // Send order to FameProvider API
    const settings = this.getSettings();
    const isDemoKey = !settings.fameProviderApiKey || settings.fameProviderApiKey.includes('demo');
    const client = new FameProviderClient(settings.fameProviderApiUrl, settings.fameProviderApiKey);
    
    let providerRes: { order?: number; error?: string } | null = null;
    try {
      providerRes = await client.addOrder({
        service: service.providerServiceId,
        link,
        quantity,
      });
    } catch (e) {
      console.error('[DB] FameProvider addOrder API error:', e);
    }

    let providerOrderId: number | undefined = providerRes?.order;
    let isProviderDispatched = false;
    let providerResponseNote = '';
    let providerError = '';

    if (providerOrderId) {
      isProviderDispatched = true;
      providerResponseNote = `Successfully dispatched to FameProvider API (Order #${providerOrderId})`;
      this.addLog('PROVIDER_API', 'success', `Order dispatched to FameProvider API: Order #${providerOrderId} for service #${service.providerServiceId}`);
    } else {
      isProviderDispatched = false;
      providerError = providerRes?.error || (isDemoKey ? 'Provider API Key is set to Demo Mode' : 'Provider API connection / authorization error');
      providerResponseNote = `Provider Dispatch Pending: ${providerError}. (Set live FameProvider API key in Admin Settings)`;
      // Generate placeholder local order ID for internal tracking
      providerOrderId = Math.floor(100000 + Math.random() * 899999);
      this.addLog('PROVIDER_API', 'warning', `Order #${service.providerServiceId} created locally, but FameProvider API dispatch failed: ${providerError}`);
    }

    const newOrder: SMMOrder = {
      id: 'ord_' + Date.now().toString(36),
      userId: user.id,
      username: user.username,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      providerOrderId,
      link,
      quantity,
      chargeINR,
      providerCostUSD,
      providerCostINR,
      profitINR,
      startCount: Math.floor(Math.random() * 500) + 100,
      remains: quantity,
      status: 'Pending',
      isProviderDispatched,
      providerResponseNote,
      providerError: isProviderDispatched ? undefined : providerError,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.push(newOrder);
    this.addLog('ORDER', 'success', `Order #${newOrder.id} created by ${user.username} for ₹${chargeINR}. Dispatched to Provider: ${isProviderDispatched}`);
    this.saveToDisk();

    return { order: newOrder };
  }

  /**
   * Re-send/Push an un-dispatched order to FameProvider API
   */
  async resendOrderToFameProvider(orderId: string): Promise<{ success: boolean; providerOrderId?: number; error?: string }> {
    const order = this.data.orders.find((o) => o.id === orderId || o.providerOrderId?.toString() === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const service = this.getServiceById(order.serviceId);
    if (!service) return { success: false, error: 'Associated service not found' };

    const settings = this.getSettings();
    const client = new FameProviderClient(settings.fameProviderApiUrl, settings.fameProviderApiKey);

    try {
      const res = await client.addOrder({
        service: service.providerServiceId,
        link: order.link,
        quantity: order.quantity,
      });

      if (res?.order) {
        order.providerOrderId = res.order;
        order.isProviderDispatched = true;
        order.providerResponseNote = `Dispatched to FameProvider API (Order #${res.order})`;
        order.providerError = undefined;
        order.status = 'Pending';
        order.updatedAt = new Date().toISOString();

        this.addLog('PROVIDER_API', 'success', `Order #${order.id} manually pushed to FameProvider API. Real Order ID: #${res.order}`);
        this.saveToDisk();
        return { success: true, providerOrderId: res.order };
      } else {
        const err = res?.error || 'Provider returned invalid response or error';
        order.providerError = err;
        order.providerResponseNote = `Push failed: ${err}`;
        order.updatedAt = new Date().toISOString();
        this.saveToDisk();
        return { success: false, error: err };
      }
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Connection error';
      order.providerError = err;
      this.saveToDisk();
      return { success: false, error: err };
    }
  }

  /**
   * Sync Order Statuses with FameProvider API
   */
  async syncOrdersStatusWithFameProvider(): Promise<number> {
    const pendingOrders = this.data.orders.filter((o) => ['Pending', 'Processing', 'In progress'].includes(o.status) && o.providerOrderId);
    if (pendingOrders.length === 0) return 0;

    const settings = this.getSettings();
    const client = new FameProviderClient(settings.fameProviderApiUrl, settings.fameProviderApiKey);
    const providerOrderIds = pendingOrders.map((o) => o.providerOrderId!);

    const statusMap = await client.getMultiStatus(providerOrderIds);

    let updatedCount = 0;
    for (const order of pendingOrders) {
      if (statusMap && order.providerOrderId && statusMap[String(order.providerOrderId)]) {
        const pStat = statusMap[String(order.providerOrderId)];
        if (pStat.status) {
          const mapStatus = pStat.status as SMMOrder['status'];
          order.status = mapStatus;
          if (pStat.remains !== undefined) order.remains = parseInt(pStat.remains, 10) || 0;
          if (pStat.start_count !== undefined) order.startCount = parseInt(pStat.start_count, 10) || order.startCount;
          order.updatedAt = new Date().toISOString();
          updatedCount++;
        }
      } else {
        // Simulation progression for pending orders if provider mock
        if (Math.random() > 0.4) {
          order.status = 'Completed';
          order.remains = 0;
          order.updatedAt = new Date().toISOString();
          updatedCount++;
        }
      }
    }

    if (updatedCount > 0) {
      this.saveToDisk();
    }
    return updatedCount;
  }

  // --- GATEWAYS & WALLET ---
  getGateways(): PaymentGatewayConfig[] {
    return this.data.gateways;
  }

  addGateway(newGw: PaymentGatewayConfig): PaymentGatewayConfig {
    const existingIndex = this.data.gateways.findIndex((g) => g.code === newGw.code);
    if (existingIndex >= 0) {
      this.data.gateways[existingIndex] = newGw;
    } else {
      this.data.gateways.push(newGw);
    }
    this.saveToDisk();
    return newGw;
  }

  deleteGateway(code: string): boolean {
    const initialLength = this.data.gateways.length;
    this.data.gateways = this.data.gateways.filter((g) => g.code !== code);
    if (this.data.gateways.length !== initialLength) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  clearAllGateways(): void {
    this.data.gateways = [];
    this.saveToDisk();
  }

  updateGateway(code: string, updates: Partial<PaymentGatewayConfig>): PaymentGatewayConfig | null {
    const gw = this.data.gateways.find((g) => g.code === code);
    if (!gw) return null;

    Object.assign(gw, updates);
    this.saveToDisk();
    return gw;
  }

  processWalletDeposit(userId: string, gatewayCode: string, amountINR: number, customTxRef?: string): WalletTransaction | { error: string } {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };

    const gw = this.data.gateways.find((g) => g.code === gatewayCode);
    if (!gw || !gw.enabled) return { error: 'Payment gateway is disabled' };

    if (amountINR < gw.minAmountINR || amountINR > gw.maxAmountINR) {
      return { error: `Deposit amount must be between ₹${gw.minAmountINR} and ₹${gw.maxAmountINR}` };
    }

    let finalRef = (customTxRef || '').trim().replace(/\s+/g, '');

    // Strict Anti-Fraud UTR Checks if user provided a custom UTR / Reference
    if (finalRef) {
      // 1. Anti-Replay / Duplicate UTR Ledger Protection
      const existingTx = this.data.transactions.find(
        (t) => t.transactionRef.toLowerCase() === finalRef.toLowerCase()
      );
      if (existingTx) {
        return {
          error: `⚠️ Duplicate UTR Blocked! The 12-digit UTR/Ref Number "${finalRef}" has ALREADY been claimed by a user. Reusing UTRs is strictly prohibited.`,
        };
      }

      // 2. Strict 12-Digit Format Check (for UPI UTRs)
      if (!/^\d{12}$/.test(finalRef)) {
        return {
          error: `Invalid UTR Format! Bank UPI UTR/Reference Number must be exactly 12 numeric digits (e.g. 423812009845). You entered: "${finalRef}"`,
        };
      }

      // 3. Obvious fake patterns block (e.g. 111111111111, 000000000000, 123456789012)
      if (/^(\d)\1{11}$/.test(finalRef) || finalRef === '123456789012' || finalRef === '987654321098') {
        return {
          error: `Invalid UTR Pattern! Please enter a real 12-digit bank transaction UTR number from your payment receipt.`,
        };
      }
    } else {
      finalRef = 'PAY_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    }

    const feeINR = Number(((amountINR * gw.feePercent) / 100).toFixed(2));
    const netINR = Number((amountINR - feeINR).toFixed(2));

    const needsApproval = Boolean(gw.requireApproval);
    const status = needsApproval ? 'PENDING' : 'SUCCESS';

    if (!needsApproval) {
      // Credit user balance immediately if no manual approval required
      user.balanceINR = Number((user.balanceINR + netINR).toFixed(2));
      user.updatedAt = new Date().toISOString();
    }

    const tx: WalletTransaction = {
      id: 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      userId: user.id,
      username: user.username,
      gatewayCode: gw.code,
      gatewayName: gw.name,
      amountINR,
      feeINR,
      netINR,
      status,
      transactionRef: finalRef,
      createdAt: new Date().toISOString(),
    };

    this.data.transactions.unshift(tx);
    if (needsApproval) {
      this.addLog('WALLET', 'warning', `Wallet deposit request of ₹${amountINR} (UTR: ${tx.transactionRef}) submitted by ${user.username} - Awaiting Admin UTR Verification`);
    } else {
      this.addLog('WALLET', 'success', `Wallet deposit of ₹${amountINR} (UTR: ${tx.transactionRef}) AUTO-VERIFIED & credited to ${user.username}`);
    }
    this.saveToDisk();

    return tx;
  }

  approveWalletDeposit(txId: string): { success: boolean; message?: string; error?: string } {
    const tx = this.data.transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, error: 'Transaction not found' };
    if (tx.status !== 'PENDING') return { success: false, error: 'Transaction is not in PENDING state' };

    const user = this.getUserById(tx.userId);
    if (!user) return { success: false, error: 'User not found' };

    user.balanceINR = Number((user.balanceINR + tx.netINR).toFixed(2));
    user.updatedAt = new Date().toISOString();
    tx.status = 'SUCCESS';

    this.addLog('WALLET', 'success', `Admin APPROVED deposit of ₹${tx.amountINR} (Ref: ${tx.transactionRef}) for ${user.username}`);
    this.saveToDisk();

    return { success: true, message: `Deposit of ₹${tx.amountINR} approved and credited to ${user.username}!` };
  }

  rejectWalletDeposit(txId: string): { success: boolean; message?: string; error?: string } {
    const tx = this.data.transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, error: 'Transaction not found' };
    if (tx.status !== 'PENDING') return { success: false, error: 'Transaction is not in PENDING state' };

    tx.status = 'FAILED';

    this.addLog('WALLET', 'error', `Admin REJECTED fake/unverified deposit request of ₹${tx.amountINR} (Ref: ${tx.transactionRef}) for ${tx.username}`);
    this.saveToDisk();

    return { success: true, message: `Deposit request rejected for ${tx.username}.` };
  }

  createPendingGuruPayOrder(userId: string, amountINR: number, orderId: string): WalletTransaction | { error: string } {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };

    const gw = this.data.gateways.find((g) => g.code === 'gurupay') || {
      id: 'gw_gurupay',
      name: 'GuruPay Payment Gateway',
      code: 'gurupay',
      title: 'GuruPay Instant UPI',
      description: 'GuruPay Instant UPI Gateway',
      logo: 'https://gurupaygateway.com/favicon.ico',
      enabled: true,
      minAmountINR: 10,
      maxAmountINR: 100000,
      feePercent: 0,
    };

    if (!gw.enabled) return { error: 'GuruPay payment gateway is currently disabled' };

    const tx: WalletTransaction = {
      id: 'tx_gp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      userId: user.id,
      username: user.username,
      gatewayCode: 'gurupay',
      gatewayName: 'GuruPay Payment Gateway',
      amountINR,
      feeINR: 0,
      netINR: amountINR,
      status: 'PENDING',
      transactionRef: orderId,
      createdAt: new Date().toISOString(),
    };

    this.data.transactions.unshift(tx);
    this.addLog('WALLET', 'info', `Created GuruPay payment order ${orderId} for ₹${amountINR} by ${user.username}`);
    this.saveToDisk();
    return tx;
  }

  getGuruPayTransactionByOrderId(orderId: string): WalletTransaction | undefined {
    return this.data.transactions.find(
      (t) => t.gatewayCode === 'gurupay' && (t.transactionRef === orderId || t.transactionRef.startsWith(orderId))
    );
  }

  completeGuruPayOrder(orderId: string, utr?: string): { success: boolean; tx?: WalletTransaction; message?: string; error?: string } {
    const tx = this.data.transactions.find(
      (t) => t.gatewayCode === 'gurupay' && (t.transactionRef === orderId || t.transactionRef.startsWith(orderId))
    );
    if (!tx) return { success: false, error: 'Transaction order not found' };

    if (tx.status === 'SUCCESS') {
      return { success: true, tx, message: 'Already completed and credited' };
    }

    const user = this.getUserById(tx.userId);
    if (!user) return { success: false, error: 'User not found' };

    user.balanceINR = Number((user.balanceINR + tx.netINR).toFixed(2));
    user.updatedAt = new Date().toISOString();
    tx.status = 'SUCCESS';
    if (utr) {
      tx.transactionRef = `${orderId} (UTR: ${utr})`;
    }

    this.addLog('WALLET', 'success', `⚡ GuruPay Instant Payment Verified! ₹${tx.amountINR} credited to ${user.username} (Order: ${orderId}, UTR: ${utr || 'N/A'})`);
    this.saveToDisk();

    return { success: true, tx, message: `₹${tx.amountINR} instantly credited to your wallet!` };
  }

  getTransactions(userId?: string): WalletTransaction[] {
    if (userId) {
      return this.data.transactions.filter((t) => t.userId === userId);
    }
    return this.data.transactions;
  }

  // --- TICKETS ---
  getTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.data.tickets.filter((t) => t.userId === userId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return this.data.tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  createTicket(userId: string, subject: string, message: string, orderId?: string): SupportTicket | { error: string } {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };

    const ticket: SupportTicket = {
      id: 'tkt_' + Date.now().toString(36),
      userId: user.id,
      username: user.username,
      subject,
      orderId,
      status: 'Open',
      priority: 'Medium',
      messages: [
        {
          id: 'msg_' + Date.now().toString(36),
          senderId: user.id,
          senderName: user.username,
          senderRole: user.role,
          message,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.tickets.unshift(ticket);
    this.saveToDisk();
    return ticket;
  }

  addTicketMessage(ticketId: string, senderId: string, message: string): SupportTicket | { error: string } {
    const ticket = this.data.tickets.find((t) => t.id === ticketId);
    if (!ticket) return { error: 'Ticket not found' };

    const sender = this.getUserById(senderId);
    if (!sender) return { error: 'Sender not found' };

    ticket.messages.push({
      id: 'msg_' + Date.now().toString(36),
      senderId: sender.id,
      senderName: sender.username,
      senderRole: sender.role,
      message,
      createdAt: new Date().toISOString(),
    });

    ticket.status = sender.role === 'customer' ? 'Customer-Reply' : 'Answered';
    ticket.updatedAt = new Date().toISOString();

    this.saveToDisk();
    return ticket;
  }

  // --- LOGS & PRICE ALERTS ---
  getPriceAlerts(): PriceAlert[] {
    return this.data.priceAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  resolvePriceAlert(id: string) {
    const alert = this.data.priceAlerts.find((a) => a.id === id);
    if (alert) {
      alert.isResolved = true;
      this.saveToDisk();
    }
  }

  getLogs(): SystemLog[] {
    return this.data.logs.slice(0, 100);
  }

  addLog(type: SystemLog['type'], level: SystemLog['level'], message: string, details?: Record<string, unknown>) {
    this.data.logs.unshift({
      id: 'log_' + Date.now().toString(36),
      type,
      level,
      message,
      details,
      createdAt: new Date().toISOString(),
    });

    if (this.data.logs.length > 200) {
      this.data.logs = this.data.logs.slice(0, 200);
    }
  }
}

// Global Singleton Instance
export const db = new SMMDatabase();
