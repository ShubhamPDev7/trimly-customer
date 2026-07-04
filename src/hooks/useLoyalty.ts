import { useQuery } from "@tanstack/react-query"
import { getMyLoyaltyAccounts, getMyReferralCode } from "@/api/loyalty"

export function useMyLoyaltyAccounts() {
  return useQuery({
    queryKey: ["my-loyalty-accounts"],
    queryFn: getMyLoyaltyAccounts,
  })
}

export function useMyReferralCode() {
  return useQuery({
    queryKey: ["my-referral-code"],
    queryFn: getMyReferralCode,
  })
}