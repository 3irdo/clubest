import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'member' | 'admin' | 'instructor';
          phone: string | null;
          membership_status: 'active' | 'inactive' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      trainings: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          duration_minutes: number;
          instructor_id: string | null;
          max_participants: number;
          status: 'scheduled' | 'completed' | 'cancelled';
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          stock: number;
          image_url: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          concept: string;
          status: 'pending' | 'confirmed' | 'rejected';
          payment_date: string | null;
          created_at: string;
        };
      };
    };
  };
};
