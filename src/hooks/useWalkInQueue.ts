import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { joinQueue, cancelQueueEntry, getMyWalkInHistory, getQueuePositionStreamUrl } from "@/api/walkin"
import { useAuthStore } from "@/store/authStore"
import type { WalkInJoinRequest, QueuePositionSnapshot } from "@/types/walkin"

export function useJoinQueue(shopId: string | undefined) {
  return useMutation({
    mutationFn: (data: WalkInJoinRequest) => joinQueue(shopId!, data),
  })
}

export function useCancelQueueEntry(shopId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) => cancelQueueEntry(shopId!, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-walk-in-history"] })
    },
  })
}

export function useMyWalkInHistory(page = 0) {
  return useQuery({
    queryKey: ["my-walk-in-history", page],
    queryFn: () => getMyWalkInHistory(page, 10),
  })
}

// EventSource cannot send an Authorization header, so this endpoint is consumed
// manually via fetch + a streaming reader instead of the native EventSource API.
export function useQueuePositionStream(shopId: string | undefined, entryId: string | undefined) {
  const [snapshot, setSnapshot] = useState<QueuePositionSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!shopId || !entryId) return

    const token = useAuthStore.getState().accessToken
    const controller = new AbortController()
    abortRef.current = controller

    const run = async () => {
      try {
        const res = await fetch(getQueuePositionStreamUrl(shopId, entryId), {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "text/event-stream",
          },
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          setError("Unable to connect to queue updates.")
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split("\n\n")
          buffer = events.pop() ?? ""

          for (const rawEvent of events) {
            const dataLine = rawEvent
              .split("\n")
              .find((line) => line.startsWith("data:"))
            if (!dataLine) continue

            const jsonStr = dataLine.replace(/^data:\s*/, "")
            try {
              const parsed: QueuePositionSnapshot = JSON.parse(jsonStr)
              setSnapshot(parsed)
            } catch {
              // ignore malformed chunk
            }
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError("Lost connection to queue updates.")
        }
      }
    }

    run()

    return () => {
      controller.abort()
    }
  }, [shopId, entryId])

  return { snapshot, error }
}