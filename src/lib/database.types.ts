export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock: number
          is_featured: boolean
          is_on_sale: boolean
          sale_price: number | null
          sale_ends_at: string | null
          unit: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock: number
          is_featured?: boolean
          is_on_sale?: boolean
          sale_price?: number | null
          sale_ends_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          stock?: number
          is_featured?: boolean
          is_on_sale?: boolean
          sale_price?: number | null
          sale_ends_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          status: string
          items: Json
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          status?: string
          items: Json
        }
        Update: {
          id?: string
          created_at?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          delivery_address?: string
          total_amount?: number
          status?: string
          items?: Json
        }
      }
    }
  }
}