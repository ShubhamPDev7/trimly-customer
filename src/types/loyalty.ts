export interface CustomerLoyaltyAccountResponse {
  shopId: string
  shopName: string
  balance: number
  balanceInRupees: number
  updatedAt: string
}

export interface MyReferralCodeResponse {
  referralCode: string
  shareMessage: string
}