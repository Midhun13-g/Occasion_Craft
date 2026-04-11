export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      templates: {
        Row: Template;
        Insert: Omit<Template, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_pages: {
        Row: UserPage;
        Insert: Omit<UserPage, 'id' | 'created_at' | 'view_count'>;
        Update: Partial<Omit<UserPage, 'id' | 'created_at'>>;
      };
      template_requests: {
        Row: TemplateRequest;
        Insert: Omit<TemplateRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TemplateRequest, 'id' | 'created_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at'>>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'created_at'>;
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, { Row: Record<string, unknown>; }>; 
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown; }>;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'simple' | 'complex';
  category: string;
  price: number;
  config: FormConfig;
  preview_url: string | null;
  preview_type: 'image' | 'video' | 'iframe';
  template_url: string;
  is_active: boolean;
  features: string[];
  demo_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserPage {
  id: string;
  template_id: string;
  unique_slug: string;
  user_name: string;
  user_email: string;
  user_data: Record<string, unknown>;
  payment_id: string;
  view_count: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface TemplateRequest {
  id: string;
  template_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  template_id: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'successful' | 'failed';
  user_email: string;
  user_name: string;
  page_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

export interface FormConfig {
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'select' | 'image' | 'color';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
  aiSuggestion?: boolean;
}
