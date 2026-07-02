export interface ReviewResponse {
  id: string
  shopId: string
  reviewerId: string
  bookingId: string | null
  walkInQueueEntryId: string | null
  rating: number
  comment: string | null
  ownerReply: string | null
  ownerRepliedAt: string | null
  createdAt: string
}

export interface PagedReviewsResponse {
  content: ReviewResponse[]
  totalElements: number
  totalPages: number
  number: number
  last: boolean
}

export interface ShopRatingSummaryResponse {
  averageRating: number
  totalReviews: number
}