import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getShopReviews, getShopRatingSummary, createReview, getMyReviewedIds } from "@/api/review"
import type { ReviewRequest } from "@/types/review"

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

export function useMyReviewedIds() {
  return useQuery({
    queryKey: ["my-reviewed-ids"],
    queryFn: getMyReviewedIds,
  })
}

export function useCreateReview(shopId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReviewRequest) => createReview(shopId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviewed-ids"] })
      queryClient.invalidateQueries({ queryKey: ["shop-reviews", shopId] })
      queryClient.invalidateQueries({ queryKey: ["shop-rating-summary", shopId] })
    },
  })
}