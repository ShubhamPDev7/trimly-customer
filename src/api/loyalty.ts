import { apiClient } from "./client"
import type { CustomerLoyaltyAccountResponse, MyReferralCodeResponse } from "@/types/loyalty"

export const getMyLoyaltyAccounts = async (): Promise<CustomerLoyaltyAccountResponse[]> => {
  const res = await apiClient.get<CustomerLoyaltyAccountResponse[]>("/customers/me/loyalty-accounts")
  return res.data
}

export const getMyReferralCode = async (): Promise<MyReferralCodeResponse> => {
  const res = await apiClient.get<MyReferralCodeResponse>("/customers/me/referral-code")
  return res.data
}