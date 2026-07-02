import { useQuery } from "@tanstack/react-query"
import { getShopReviews, getShopRatingSummary } from "@/api/review"

export function useShopReviews(shopId: string | undefined, page = 0) {
  return useQuery({
    queryKey: ["shop-reviews", shopId, page],
    queryFn: () => getShopReviews(shopId!, page),
    enabled: !!shopId,
  })
}

export function useShopRatingSummary(shopId: string | undefined) {
  return useQuery({
    queryKey: ["shop-rating-summary", shopId],
    queryFn: () => getShopRatingSummary(shopId!),
    enabled: !!shopId,
  })
}