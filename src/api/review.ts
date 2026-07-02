import { apiClient } from "./client"
import type { PagedReviewsResponse, ShopRatingSummaryResponse } from "@/types/review"

export const getShopReviews = async (
  shopId: string,
  page = 0,
  size = 20
): Promise<PagedReviewsResponse> => {
  const res = await apiClient.get<PagedReviewsResponse>(`/shops/${shopId}/reviews`, {
    params: { page, size },
  })
  return res.data
}

export const getShopRatingSummary = async (shopId: string): Promise<ShopRatingSummaryResponse> => {
  const res = await apiClient.get<ShopRatingSummaryResponse>(`/shops/${shopId}/reviews/summary`)
  return res.data
}