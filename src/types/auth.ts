export interface AuthResponse {
  token: string
  refreshToken: string
  userId: string
  name: string
  email: string | null
  role: string
}