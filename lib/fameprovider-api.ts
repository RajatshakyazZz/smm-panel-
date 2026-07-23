import { ServiceType } from './types';

export interface FameProviderService {
  service: number;
  name: string;
  category: string;
  type: ServiceType;
  rate: string; // Rate per 1000 in USD string, e.g. "0.08"
  min: string;
  max: string;
  refill: boolean;
  cancel: boolean;
}

export interface FameProviderBalance {
  balance: string;
  currency: string;
}

export interface FameProviderAddOrderResponse {
  order?: number;
  error?: string;
}

export interface FameProviderOrderStatus {
  charge?: string;
  start_count?: string;
  status?: string; // Pending, Processing, In progress, Completed, Partial, Canceled
  remains?: string;
  currency?: string;
  error?: string;
}

export class FameProviderClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string = 'https://fameprovider.com/api/v2', apiKey: string = '') {
    this.apiUrl = apiUrl || 'https://fameprovider.com/api/v2';
    this.apiKey = apiKey;
  }

  private async postRequest<T>(params: Record<string, string | number>): Promise<T | null> {
    try {
      const formData = new URLSearchParams();
      formData.append('key', this.apiKey);
      
      for (const [key, value] of Object.entries(params)) {
        if (key !== 'key') {
          formData.append(key, String(value));
        }
      }

      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'FameProvider-SMM-Panel-Client/2.0',
        },
        body: formData.toString(),
        cache: 'no-store',
      });

      if (!res.ok) {
        console.warn(`[FameProvider API] HTTP Error ${res.status} ${res.statusText}`);
        return null;
      }

      const data = await res.json();
      return data as T;
    } catch (err) {
      console.error('[FameProvider API] Exception:', err);
      return null;
    }
  }

  /**
   * Get all services from FameProvider
   */
  async getServices(): Promise<FameProviderService[] | null> {
    return this.postRequest<FameProviderService[]>({ action: 'services' });
  }

  /**
   * Get FameProvider Balance
   */
  async getBalance(): Promise<FameProviderBalance | null> {
    return this.postRequest<FameProviderBalance>({ action: 'balance' });
  }

  /**
   * Add Order
   */
  async addOrder(data: {
    service: number;
    link: string;
    quantity: number;
    comments?: string;
    runs?: number;
    interval?: number;
    username?: string;
    min?: number;
    max?: number;
    posts?: number;
    delay?: number;
  }): Promise<FameProviderAddOrderResponse | null> {
    return this.postRequest<FameProviderAddOrderResponse>({
      action: 'add',
      ...data,
    });
  }

  /**
   * Get Order Status
   */
  async getStatus(orderId: number): Promise<FameProviderOrderStatus | null> {
    return this.postRequest<FameProviderOrderStatus>({
      action: 'status',
      order: orderId,
    });
  }

  /**
   * Get Multiple Orders Status
   */
  async getMultiStatus(orderIds: number[]): Promise<Record<string, FameProviderOrderStatus> | null> {
    return this.postRequest<Record<string, FameProviderOrderStatus>>({
      action: 'status',
      orders: orderIds.join(','),
    });
  }

  /**
   * Request Refill
   */
  async requestRefill(orderId: number): Promise<{ refill?: number; error?: string } | null> {
    return this.postRequest<{ refill?: number; error?: string }>({
      action: 'refill',
      order: orderId,
    });
  }

  /**
   * Get Refill Status
   */
  async getRefillStatus(refillId: number): Promise<{ status?: string; error?: string } | null> {
    return this.postRequest<{ status?: string; error?: string }>({
      action: 'refill_status',
      refill: refillId,
    });
  }

  /**
   * Cancel Orders
   */
  async cancelOrders(orderIds: number[]): Promise<Array<{ order: number; cancel?: number; error?: string }> | null> {
    return this.postRequest<Array<{ order: number; cancel?: number; error?: string }>>({
      action: 'cancel',
      orders: orderIds.join(','),
    });
  }
}
