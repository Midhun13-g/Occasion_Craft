import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CreateOrderRequest {
  template_id: string;
  amount: number;
  user_name: string;
  user_email: string;
}

export interface CreateOrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
    created_at: number;
  };
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  user_data: any;
  user_name: string;
  user_email: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  page?: {
    id: string;
    unique_slug: string;
    template_id: string;
  };
}

export class PaymentService {
  static async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await axios.post(`${API_URL}/payments/create-order`, request, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  }

  static async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await axios.post(`${API_URL}/payments/verify-payment`, request, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
  }
}

export const paymentService = PaymentService;
