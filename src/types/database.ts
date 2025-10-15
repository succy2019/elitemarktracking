export interface User {
  id: number
  email: string
  name: string
  amount: string
  status: string
  phone: string
  address : string
  message: string
  track_id: string
  payment_to: string
  account_number: string
  estimated_processing_time: string
  money_due: string
  progress_percentage: number
  created_at: string
  updated_at: string
}

export interface Track {
  id: number
  user_id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}


export interface UserSettings {
  user_id: number
  notifications_enabled: number
  theme: string
  updated_at: string
}


export interface Admin {
  id: number
  email: string
  password: string
  created_at: string
  updated_at: string
}