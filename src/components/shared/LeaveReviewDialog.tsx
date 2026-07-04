import { useState } from "react"
import { Star } from "lucide-react"
import { useCreateReview } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  shopId: string
  bookingId?: string
  walkInQueueEntryId?: string
}

export default function LeaveReviewDialog({
  open,
  onOpenChange,
  shopId,
  bookingId,
  walkInQueueEntryId,
}: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const createReviewMutation = useCreateReview(shopId)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }
    try {
      await createReviewMutation.mutateAsync({
        rating,
        comment: comment.trim() || undefined,
        bookingId,
        walkInQueueEntryId,
      })
      toast.success("Review posted, thanks!")
      onOpenChange(false)
      setRating(0)
      setComment("")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post review")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>Share your experience with this shop.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="How was your visit? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? "Posting..." : "Post Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}