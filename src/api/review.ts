import { apiClient } from "./client"
import type {
  PagedReviewsResponse,
  ShopRatingSummaryResponse,
  ReviewRequest,
  ReviewResponse,
  MyReviewedIdsResponse,
} from "@/types/review"

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

export const createReview = async (
  shopId: string,
  data: ReviewRequest
): Promise<ReviewResponse> => {
  const res = await apiClient.post<ReviewResponse>(`/shops/${shopId}/reviews`, data)
  return res.data
}

export const getMyReviewedIds = async (): Promise<MyReviewedIdsResponse> => {
  const res = await apiClient.get<MyReviewedIdsResponse>("/customers/me/reviewed-ids")
  return res.data
}