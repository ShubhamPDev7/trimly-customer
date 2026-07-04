import { Users, Clock, X, Star } from "lucide-react"
import { useState } from "react"
import { useQueueStore } from "@/store/queueStore"
import { useQueuePositionStream, useCancelQueueEntry, useMyWalkInHistory } from "@/hooks/useWalkInQueue"
import { useMyReviewedIds } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import LeaveReviewDialog from "@/components/shared/LeaveReviewDialog"
import { toast } from "sonner"

function formatWait(minutes: number | null) {
  if (minutes == null) return null
  if (minutes <= 0) return "You're next!"
  if (minutes < 60) return `~${minutes} min wait`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `~${h}h ${m}m wait`
}

export default function QueuePage() {
  const activeEntry = useQueueStore((s) => s.activeEntry)
  const clearActiveEntry = useQueueStore((s) => s.clearActiveEntry)
  const { snapshot, error } = useQueuePositionStream(activeEntry?.shopId, activeEntry?.entryId)
  const cancelMutation = useCancelQueueEntry(activeEntry?.shopId)
  const { data: historyPage, isLoading: historyLoading } = useMyWalkInHistory()
  const { data: reviewedIds } = useMyReviewedIds()
  const [reviewDialogEntryId, setReviewDialogEntryId] = useState<string | null>(null)

  const isFinished =
    snapshot &&
    (snapshot.status === "COMPLETED" ||
      snapshot.status === "CANCELLED" ||
      snapshot.status === "NO_SHOW")

  if (isFinished) {
    clearActiveEntry()
  }

  const handleLeaveQueue = async () => {
    if (!activeEntry) return
    try {
      await cancelMutation.mutateAsync(activeEntry.entryId)
      clearActiveEntry()
      toast.success("You've left the queue")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to leave queue")
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-heading text-xl font-semibold">Walk-in Queue</h1>

      {activeEntry && !isFinished ? (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-muted-foreground" />
              <p className="font-medium">{activeEntry.shopName}</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {!error && !snapshot && (
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            )}

            {snapshot && snapshot.status === "WAITING" && (
              <div>
                <p className="text-3xl font-semibold">
                  {snapshot.position != null ? `#${snapshot.position}` : "—"}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatWait(snapshot.estimatedWaitMinutes)}
                </p>
              </div>
            )}

            {snapshot && snapshot.status === "IN_PROGRESS" && (
              <p className="text-sm font-medium text-primary">You're being served now</p>
            )}

            {snapshot?.status === "WAITING" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLeaveQueue}
                disabled={cancelMutation.isPending}
              >
                <X className="mr-1.5 h-4 w-4" />
                {cancelMutation.isPending ? "Leaving..." : "Leave Queue"}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          You're not in a queue right now. Join one from a shop's profile page.
        </p>
      )}

      <div>
        <p className="mb-2.5 text-sm font-medium text-muted-foreground">Past Visits</p>
        {historyLoading && (
          <div className="space-y-2.5">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        )}
        {!historyLoading && historyPage?.content.length === 0 && (
          <p className="text-sm text-muted-foreground">No past walk-ins yet.</p>
        )}
        <div className="space-y-2.5">
          {historyPage?.content.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {entry.services.map((s) => s.serviceName).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.joinedAt).toLocaleDateString()} · {entry.status}
                    </p>
                  </div>
                </div>
                {entry.status === "COMPLETED" &&
                  reviewedIds &&
                  !reviewedIds.walkInQueueEntryIds.includes(entry.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full gap-1.5"
                      onClick={() => setReviewDialogEntryId(entry.id)}
                    >
                      <Star className="h-3.5 w-3.5" />
                      Leave a Review
                    </Button>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {reviewDialogEntryId && (
        <LeaveReviewDialog
          open={!!reviewDialogEntryId}
          onOpenChange={(open) => !open && setReviewDialogEntryId(null)}
          shopId={historyPage!.content.find((e) => e.id === reviewDialogEntryId)!.shopId}
          walkInQueueEntryId={reviewDialogEntryId}
        />
      )}
    </div>
  )
}