export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      form_templates: {
        Row: {
          id: string;
          created_by: string | null;
          name: string;
          description: string | null;
          fields: Json;
          created_at: string;
          updated_at: string;
          is_premium: boolean | null;
          price: number | null;
          preview_image_url: string | null;
        };
        Insert: {
          id?: string;
          created_by?: string | null;
          name: string;
          description?: string | null;
          fields?: Json;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean | null;
          price?: number | null;
          preview_image_url?: string | null;
        };
        Update: {
          id?: string;
          created_by?: string | null;
          name?: string;
          description?: string | null;
          fields?: Json;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean | null;
          price?: number | null;
          preview_image_url?: string | null;
        };
      };
      forms: {
        Row: {
          id: string;
          template_id: string | null;
          created_by: string | null;
          name: string;
          description: string | null;
          fields: Json;
          settings: Json;
          status: "draft" | "published" | "archived";
          is_public: boolean;
          embed_settings: Json;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          template_id?: string | null;
          created_by?: string | null;
          name: string;
          description?: string | null;
          fields?: Json;
          settings?: Json;
          status?: "draft" | "published" | "archived";
          is_public?: boolean;
          embed_settings?: Json;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          template_id?: string | null;
          created_by?: string | null;
          name?: string;
          description?: string | null;
          fields?: Json;
          settings?: Json;
          status?: "draft" | "published" | "archived";
          is_public?: boolean;
          embed_settings?: Json;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          submitter_ip: string | null;
          data: Json;
          metadata: Json;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          submitter_ip?: string | null;
          data: Json;
          metadata?: Json;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          submitter_ip?: string | null;
          data?: Json;
          metadata?: Json;
          submitted_at?: string;
        };
      };
      embedding_sites: {
        Row: {
          id: string;
          created_by: string | null;
          domain: string;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by?: string | null;
          domain: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string | null;
          domain?: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      form_embeddings: {
        Row: {
          id: string;
          form_id: string;
          site_id: string;
          embedding_key: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          site_id: string;
          embedding_key: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          site_id?: string;
          embedding_key?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      embed_logs: {
        Row: {
          id: string;
          embedding_key: string;
          referer: string | null;
          user_agent: string | null;
          event_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          embedding_key: string;
          referer?: string | null;
          user_agent?: string | null;
          event_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          embedding_key?: string;
          referer?: string | null;
          user_agent?: string | null;
          event_type?: string;
          created_at?: string;
        };
      };
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          transaction_type: "purchase" | "usage" | "refund";
          reference_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          transaction_type: "purchase" | "usage" | "refund";
          reference_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          transaction_type?: "purchase" | "usage" | "refund";
          reference_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      purchased_templates: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          price_paid: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          price_paid: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string;
          price_paid?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      // Add views here if you have any
    };
    Functions: {
      create_form_from_json: {
        Args: {
          user_id: string;
          form_data: Json;
        };
        Returns: string;
      };
      create_template_from_json: {
        Args: {
          user_id: string;
          template_data: Json;
        };
        Returns: string;
      };
      create_form_from_template: {
        Args: {
          user_id: string;
          template_id: string;
          form_name: string;
          form_description: string;
        };
        Returns: string;
      };
      is_form_creator: {
        Args: {
          form_id: string;
        };
        Returns: boolean;
      };
      is_template_creator: {
        Args: {
          template_id: string;
        };
        Returns: boolean;
      };
      is_site_creator: {
        Args: {
          site_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      // Add enums here if you have any
    };
  };
}
