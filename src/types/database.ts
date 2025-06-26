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
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          client_name: string | null
          description: string | null
          default_schedule_template: Json | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_name?: string | null
          description?: string | null
          default_schedule_template?: Json | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          client_name?: string | null
          description?: string | null
          default_schedule_template?: Json | null
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          publish_date: string | null
          status: string
          current_step: string | null
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          publish_date?: string | null
          status?: string
          current_step?: string | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          project_id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          publish_date?: string | null
          status?: string
          current_step?: string | null
          assigned_to?: string | null
          updated_at?: string
        }
      }
      production_steps: {
        Row: {
          id: string
          video_id: string
          step_type: string
          step_order: number
          due_date: string | null
          completed_at: string | null
          url: string | null
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          step_type: string
          step_order: number
          due_date?: string | null
          completed_at?: string | null
          url?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          step_type?: string
          step_order?: number
          due_date?: string | null
          completed_at?: string | null
          url?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
      }
      feedback_items: {
        Row: {
          id: string
          step_id: string
          type: 'general' | 'time_specific'
          content: string
          time_range: string | null
          is_completed: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_id: string
          type: 'general' | 'time_specific'
          content: string
          time_range?: string | null
          is_completed?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'general' | 'time_specific'
          content?: string
          time_range?: string | null
          is_completed?: boolean
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          feedback_item_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feedback_item_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          video_id: string | null
          type: string
          title: string
          message: string | null
          is_read: boolean
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id?: string | null
          type: string
          title: string
          message?: string | null
          is_read?: boolean
          sent_at?: string
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      schedule_templates: {
        Row: {
          id: string
          project_id: string | null
          name: string
          steps: Json
          is_default: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          name: string
          steps: Json
          is_default?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          project_id?: string | null
          name?: string
          steps?: Json
          is_default?: boolean
          updated_at?: string
        }
      }
    }
  }
}