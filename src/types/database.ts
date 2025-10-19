// Database Types for Supabase

export type UserRole = 'admin' | 'jobseeker';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormField {
  key: string;
  validation: {
    required: boolean;
  };
}

export interface ApplicationFormSection {
  title: string;
  fields: ApplicationFormField[];
}

export interface ApplicationFormConfig {
  sections: ApplicationFormSection[];
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  display_text: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  job_type: string;
  description: string;
  number_of_candidates: number;
  salary_min: number;
  salary_max: number;
  salary_range?: SalaryRange;
  status: 'active' | 'inactive' | 'draft';
  application_form_config: ApplicationFormConfig;
  created_at: string;
  updated_at: string;
  started_on?: string;
}

export interface ApplicantAttribute {
  key: string;
  label: string;
  value: string;
  order: number;
}

export interface Applicant {
  id: string;
  job_id: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  domicile?: string;
  linkedin_link?: string;
  date_of_birth?: string;
  photo_profile?: string;
  attributes?: ApplicantAttribute[];
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
      };
      applicants: {
        Row: Applicant;
        Insert: Omit<Applicant, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Applicant, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
