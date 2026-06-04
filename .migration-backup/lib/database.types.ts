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
      opportunities: {
        Row: {
          id: number
          user_id: string
          title: string
          organization: string | null
          description: string | null
          application_link: string | null
          opportunity_type: Database["public"]["Enums"]["opportunity_type"] | null
          deadline: string | null
          status: Database["public"]["Enums"]["status"] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          organization?: string | null
          description?: string | null
          application_link?: string | null
          opportunity_type?: Database["public"]["Enums"]["opportunity_type"] | null
          deadline?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          organization?: string | null
          description?: string | null
          application_link?: string | null
          opportunity_type?: Database["public"]["Enums"]["opportunity_type"] | null
          deadline?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      opportunity_type: | "Scholarship" | "Competition" | "Internship" | "Workshop" | "Summer Program" | "Exchange Program" | "Other"
      status: | "Saved" | "Planning" | "Applying" | "Submitted" | "Accepted" | "Rejected"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
