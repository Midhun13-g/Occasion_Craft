// Example: TypeScript MySQL connection utility for TemplateMart backend
// Use this if you're running a Node.js/Express server instead of Supabase Edge Functions

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'templatemart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Example template queries
export const templateQueries = {
  async getAll(): Promise<any[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM templates WHERE is_active = ? ORDER BY created_at DESC',
        [true]
      );
      return rows as any[];
    } finally {
      connection.release();
    }
  },

  async getById(id: string): Promise<any | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM templates WHERE id = ? AND is_active = ?',
        [id, true]
      );
      return (rows as any[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(template: any): Promise<string> {
    const connection = await pool.getConnection();
    try {
      const id = require('crypto').randomUUID();
      await connection.query(
        `INSERT INTO templates 
         (id, name, description, type, category, price, config, preview_url, 
          preview_type, component_name, features, demo_data, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          template.name,
          template.description,
          template.type,
          template.category,
          template.price,
          JSON.stringify(template.config),
          template.preview_url,
          template.preview_type,
          template.component_name,
          JSON.stringify(template.features || []),
          JSON.stringify(template.demo_data || {}),
          true,
        ]
      );
      return id;
    } finally {
      connection.release();
    }
  },

  async update(id: string, updates: any): Promise<void> {
    const connection = await pool.getConnection();
    try {
      const updates_clause = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'config' || key === 'features' || key === 'demo_data') {
          updates_clause.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else {
          updates_clause.push(`${key} = ?`);
          values.push(value);
        }
      }

      values.push(id);

      const query = `UPDATE templates SET ${updates_clause.join(', ')} WHERE id = ?`;
      await connection.query(query, values);
    } finally {
      connection.release();
    }
  },

  async delete(id: string): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM templates WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  },
};

// Example user page queries
export const pageQueries = {
  async create(page: any): Promise<string> {
    const connection = await pool.getConnection();
    try {
      const id = require('crypto').randomUUID();
      await connection.query(
        `INSERT INTO user_pages 
         (id, template_id, unique_slug, user_name, user_email, user_data, payment_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          page.template_id,
          page.unique_slug,
          page.user_name,
          page.user_email,
          JSON.stringify(page.user_data),
          page.payment_id,
          true,
        ]
      );
      return id;
    } finally {
      connection.release();
    }
  },

  async getBySlug(slug: string): Promise<any | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM user_pages WHERE unique_slug = ? AND is_active = ?',
        [slug, true]
      );
      return (rows as any[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async incrementViewCount(id: string): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.query('UPDATE user_pages SET view_count = view_count + 1 WHERE id = ?', [
        id,
      ]);
    } finally {
      connection.release();
    }
  },
};

// Example payment queries
export const paymentQueries = {
  async create(payment: any): Promise<string> {
    const connection = await pool.getConnection();
    try {
      const id = require('crypto').randomUUID();
      await connection.query(
        `INSERT INTO payments 
         (id, razorpay_order_id, template_id, amount, currency, status, user_email, user_name) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payment.razorpay_order_id,
          payment.template_id,
          payment.amount,
          payment.currency || 'INR',
          'created',
          payment.user_email,
          payment.user_name,
        ]
      );
      return id;
    } finally {
      connection.release();
    }
  },

  async getByOrderId(orderId: string): Promise<any | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM payments WHERE razorpay_order_id = ?',
        [orderId]
      );
      return (rows as any[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async update(id: string, updates: any): Promise<void> {
    const connection = await pool.getConnection();
    try {
      const update_clause = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        update_clause.push(`${key} = ?`);
        values.push(value);
      }
      values.push(id);

      const query = `UPDATE payments SET ${update_clause.join(', ')} WHERE id = ?`;
      await connection.query(query, values);
    } finally {
      connection.release();
    }
  },
};

export default pool;
