interface PaymentConfig {
  merchantId: string;
  apiKey: string;
  callbackUrl: string;
}

interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  description: string;
  provider: 'orange' | 'wave';
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

export class PaymentService {
  private orangeConfig: PaymentConfig;
  private waveConfig: PaymentConfig;

  constructor() {
    this.orangeConfig = {
      merchantId: process.env.ORANGE_MERCHANT_ID || '',
      apiKey: process.env.ORANGE_API_KEY || '',
      callbackUrl: `${process.env.APP_URL}/api/payments/callback/orange`,
    };

    this.waveConfig = {
      merchantId: process.env.WAVE_MERCHANT_ID || '',
      apiKey: process.env.WAVE_API_KEY || '',
      callbackUrl: `${process.env.APP_URL}/api/payments/callback/wave`,
    };
  }

  async initiateOrangeMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Format phone number
      const formattedPhone = request.phoneNumber.startsWith('+221') 
        ? request.phoneNumber.substring(4) 
        : request.phoneNumber;

      // Prepare Orange Money API request
      const payload = {
        merchant_key: this.orangeConfig.merchantId,
        currency: "XOF",
        order_id: Date.now().toString(),
        amount: request.amount,
        description: request.description,
        customer_phone_number: formattedPhone,
        callback_url: this.orangeConfig.callbackUrl,
      };

      // Make request to Orange Money API
      const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.orangeConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Orange Money payment failed');
      }

      return {
        success: true,
        transactionId: data.pay_token,
        paymentUrl: data.payment_url,
      };

    } catch (error) {
      console.error('Orange Money payment error:', error);
      return {
        success: false,
        error: 'Failed to initiate Orange Money payment',
      };
    }
  }

  async initiateWavePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Format phone number
      const formattedPhone = request.phoneNumber.startsWith('+221') 
        ? request.phoneNumber.substring(4) 
        : request.phoneNumber;

      // Prepare Wave API request
      const payload = {
        merchant_id: this.waveConfig.merchantId,
        amount: request.amount,
        client_phone: formattedPhone,
        description: request.description,
        callback_url: this.waveConfig.callbackUrl,
      };

      // Make request to Wave API
      const response = await fetch('https://api.wave.com/v1/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.waveConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Wave payment failed');
      }

      return {
        success: true,
        transactionId: data.wave_transaction_id,
        paymentUrl: data.checkout_url,
      };

    } catch (error) {
      console.error('Wave payment error:', error);
      return {
        success: false,
        error: 'Failed to initiate Wave payment',
      };
    }
  }

  async verifyPayment(transactionId: string, provider: 'orange' | 'wave'): Promise<boolean> {
    try {
      if (provider === 'orange') {
        const response = await fetch(`https://api.orange.com/orange-money-webpay/dev/v1/transactionstatus/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${this.orangeConfig.apiKey}`,
          },
        });
        const data = await response.json();
        return data.status === 'SUCCESSFUL';
      } else {
        const response = await fetch(`https://api.wave.com/v1/checkout/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${this.waveConfig.apiKey}`,
          },
        });
        const data = await response.json();
        return data.status === 'COMPLETED';
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
} 