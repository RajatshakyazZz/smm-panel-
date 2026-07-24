export type UserRole = 'super_admin' | 'admin' | 'manager' | 'support' | 'customer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  balanceINR: number;
  spentINR: number;
  apiKey: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = 'Default' | 'Custom Comments' | 'Subscriptions' | 'Package' | 'Poll';

export interface SMMCategory {
  id: string;
  name: string;
  icon: string; // lucide-react icon name or image
  sortOrder: number;
  isActive: boolean;
}

export interface SMMService {
  id: string;
  providerServiceId: number;
  name: string;
  category: string;
  type: ServiceType;
  providerRateUSD: number; // Rate per 1000 in USD from FameProvider
  calculatedRateINR: number; // Provider rate converted to INR
  marginPercent: number; // Profit margin percentage
  sellingRateINR: number; // Final selling price per 1000 in INR
  isPriceLocked: boolean; // If true, selling rate won't automatically update on sync
  minQuantity: number;
  maxQuantity: number;
  refillSupported: boolean;
  cancelSupported: boolean;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'In progress' | 'Completed' | 'Partial' | 'Canceled' | 'Refunded';

export interface SMMOrder {
  id: string;
  userId: string;
  username: string;
  serviceId: string;
  serviceName: string;
  category: string;
  providerOrderId?: number;
  link: string;
  quantity: number;
  chargeINR: number;
  providerCostUSD: number;
  providerCostINR: number;
  profitINR: number;
  startCount: number;
  remains: number;
  status: OrderStatus;
  isProviderDispatched?: boolean;
  providerResponseNote?: string;
  providerError?: string;
  refillId?: string;
  refillStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  providerServiceId: number;
  field: 'price' | 'min' | 'max' | 'refill' | 'cancel' | 'status';
  oldValue: string | number;
  newValue: string | number;
  changePercent?: number;
  isResolved: boolean;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  code: 'personal_upi' | 'phonepe' | 'razorpay' | 'paytm' | 'cashfree' | 'easebuzz' | 'payu';
  title: string;
  description: string;
  logo: string;
  enabled: boolean;
  isTestMode: boolean;
  merchantId?: string;
  apiKey?: string;
  apiSecret?: string;
  upiId?: string;
  upiName?: string;
  qrImageUrl?: string;
  minAmountINR: number;
  maxAmountINR: number;
  feePercent: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  username: string;
  gatewayCode: string;
  gatewayName: string;
  amountINR: number;
  feeINR: number;
  netINR: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transactionRef: string;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  orderId?: string;
  status: 'Open' | 'Answered' | 'Customer-Reply' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  fameProviderApiUrl: string;
  fameProviderApiKey: string;
  usdToInrRate: number; // e.g. 87.00
  rateExchangeMode: 'manual' | 'auto';
  globalMarginPercent: number; // e.g. 35
  minProfitINR: number; // e.g. 1.0
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  maintenanceMode: boolean;
  siteName: string;
  siteDescription: string;
  telegramSupport: string;
  whatsappSupport: string;
  supportEmail: string;
}

export interface SystemLog {
  id: string;
  type: 'PROVIDER_API' | 'CRON_SYNC' | 'PRICE_ALERT' | 'WALLET' | 'ORDER' | 'SYSTEM';
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: Record<string, unknown>;
  createdAt: string;
}
