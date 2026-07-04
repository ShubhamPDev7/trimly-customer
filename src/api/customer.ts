import { apiClient } from "./client"
import type { CustomerProfileResponse, UpdateProfileRequest } from "@/types/customer"

export const getMyProfile = async (): Promise<CustomerProfileResponse> => {
  const res = await apiClient.get<CustomerProfileResponse>("/customers/me")
  return res.data
}

export const updateMyProfile = async (
  data: UpdateProfileRequest
): Promise<CustomerProfileResponse> => {
  const res = await apiClient.put<CustomerProfileResponse>("/customers/me", data)
  return res.data
}

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete("/customers/me")
}