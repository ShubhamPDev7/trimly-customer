export interface CustomerProfileResponse {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
}

export interface UpdateProfileRequest {
  name: string
  phone?: string
  email?: string
}