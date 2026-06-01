export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string | null
          id_client: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
        }
        Insert: {
          created_at?: string | null
          id_client?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Update: {
          created_at?: string | null
          id_client?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          client_id: string
          created_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id_document: string
          size_bytes: number
          sort_order: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id_document?: string
          size_bytes?: number
          sort_order?: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id_document?: string
          size_bytes?: number
          sort_order?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          client_id: string
          created_at: string | null
          end_date: string
          id_membership: string
          id_user: string
          start_date: string
          status: Database["public"]["Enums"]["membership_status"] | null
          type: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          end_date: string
          id_membership?: string
          id_user: string
          start_date: string
          status?: Database["public"]["Enums"]["membership_status"] | null
          type: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          end_date?: string
          id_membership?: string
          id_user?: string
          start_date?: string
          status?: Database["public"]["Enums"]["membership_status"] | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_membership_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "fk_membership_user"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          client_id: string
          created_at: string | null
          id_notification: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id_notification?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id_notification?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          concept: string | null
          created_at: string | null
          id_payment: string
          id_user: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
        }
        Insert: {
          amount: number
          client_id: string
          concept?: string | null
          created_at?: string | null
          id_payment?: string
          id_user: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
        }
        Update: {
          amount?: number
          client_id?: string
          concept?: string | null
          created_at?: string | null
          id_payment?: string
          id_user?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "fk_payment_user"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          client_id: string
          created_at: string | null
          description: string | null
          id_product: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          id_product?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          id_product?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
        ]
      }
      profiles: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          id_role: string
          image_url: string | null
          is_active: boolean | null
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          first_name: string
          id: string
          id_role: string
          image_url?: string | null
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          id_role?: string
          image_url?: string | null
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "fk_profile_role"
            columns: ["id_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id_role"]
          },
        ]
      }
      roles: {
        Row: {
          id_role: string
          name: string
        }
        Insert: {
          id_role?: string
          name: string
        }
        Update: {
          id_role?: string
          name?: string
        }
        Relationships: []
      }
      sale_details: {
        Row: {
          id_product: string
          id_sale: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id_product: string
          id_sale: string
          quantity: number
          unit_price: number
        }
        Update: {
          id_product?: string
          id_sale?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_sale_detail_product"
            columns: ["id_product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id_product"]
          },
          {
            foreignKeyName: "fk_sale_detail_sale"
            columns: ["id_sale"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id_sale"]
          },
        ]
      }
      sales: {
        Row: {
          client_id: string
          created_at: string | null
          id_sale: string
          id_user: string
          total: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id_sale?: string
          id_user: string
          total?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id_sale?: string
          id_user?: string
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sale_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "fk_sale_user"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          capacity: number
          client_id: string
          coach_id: string | null
          created_at: string | null
          date: string
          id_training: string
          status: Database["public"]["Enums"]["training_status"] | null
          time: string
        }
        Insert: {
          capacity: number
          client_id: string
          coach_id?: string | null
          created_at?: string | null
          date: string
          id_training?: string
          status?: Database["public"]["Enums"]["training_status"] | null
          time: string
        }
        Update: {
          capacity?: number
          client_id?: string
          coach_id?: string | null
          created_at?: string | null
          date?: string
          id_training?: string
          status?: Database["public"]["Enums"]["training_status"] | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_training_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id_client"]
          },
          {
            foreignKeyName: "fk_training_coach"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_training: {
        Row: {
          attendance: boolean | null
          id_training: string
          id_user: string
        }
        Insert: {
          attendance?: boolean | null
          id_training: string
          id_user: string
        }
        Update: {
          attendance?: boolean | null
          id_training?: string
          id_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_training_training"
            columns: ["id_training"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id_training"]
          },
          {
            foreignKeyName: "fk_user_training_user"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      membership_status: "ACTIVE" | "EXPIRED" | "CANCELLED"
      payment_method_type: "CASH" | "TRANSFER" | "CARD"
      training_status: "SCHEDULED" | "COMPLETED" | "CANCELED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      membership_status: ["ACTIVE", "EXPIRED", "CANCELLED"],
      payment_method_type: ["CASH", "TRANSFER", "CARD"],
      training_status: ["SCHEDULED", "COMPLETED", "CANCELED"],
    },
  },
} as const

