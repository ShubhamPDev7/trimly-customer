import { apiClient } from "./client"
import type { AuthResponse } from "@/types/auth"

export const sendOtpRequest = async (phone: string): Promise<void> => {
  await apiClient.post("/auth/send-otp", null, { params: { phone } })
}

export const verifyOtpRequest = async (phone: string, code: string): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>("/auth/verify-otp", null, {
    params: { phone, code },
  })
  return res.data
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone?: string
  password: string
  role: "CUSTOMER"
}

export const loginRequest = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>("/auth/login", data)
  return res.data
}

export const registerRequest = async (data: RegisterRequest): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>("/auth/register", data)
  return res.data
}