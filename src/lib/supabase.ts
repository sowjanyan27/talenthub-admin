import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          department: string;
          location: string;
          employment_type: string;
          status: string;
          description: string | null;
          requirements: string[] | null;
          min_salary: number | null;
          max_salary: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department: string;
          location: string;
          employment_type?: string;
          status?: string;
          description?: string | null;
          requirements?: string[] | null;
          min_salary?: number | null;
          max_salary?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          department?: string;
          location?: string;
          employment_type?: string;
          status?: string;
          description?: string | null;
          requirements?: string[] | null;
          min_salary?: number | null;
          max_salary?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          skills: string[] | null;
          years_of_experience: number;
          education: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          skills?: string[] | null;
          years_of_experience?: number;
          education?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          skills?: string[] | null;
          years_of_experience?: number;
          education?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: string;
          match_score: number;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          status?: string;
          match_score?: number;
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          status?: string;
          match_score?: number;
          applied_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
