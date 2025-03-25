export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected'

export interface Job {
  id: string
  user_id: string
  company: string
  position: string
  location: string
  description: string
  requirements: string
  salary_range?: string
  job_url?: string
  status: JobStatus
  created_at: string
  updated_at: string
  saved_date?: string
  applied_date?: string
  interview_date?: string
  offer_date?: string
  rejected_date?: string
  notes?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  type?: string
  experience_level?: string
}

export interface Activity {
  id: string
  job_id: string
  user_id: string
  type: 'created' | 'updated' | 'status_changed' | 'note_added'
  details: string
  created_at: string
}

export interface DashboardStats {
  total_jobs: number
  jobs_by_status: {
    [key in JobStatus]: number
  }
  recent_activities: Activity[]
  application_rate: number
  interview_rate: number
  offer_rate: number
}

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>
      }
      activities: {
        Row: Activity
        Insert: Omit<Activity, 'id' | 'created_at'>
        Update: Partial<Omit<Activity, 'id' | 'created_at'>>
      }
    }
  }
} 