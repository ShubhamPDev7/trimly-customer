import { apiClient } from "./client"
import type {
  WalkInQueueEntryResponse,
  WalkInJoinRequest,
  PagedWalkInHistoryResponse,
} from "@/types/walkin"

export const joinQueue = async (
  shopId: string,
  data: WalkInJoinRequest
): Promise<WalkInQueueEntryResponse> => {
  const res = await apiClient.post<WalkInQueueEntryResponse>(`/shops/${shopId}/walk-in-queue`, data)
  return res.data
}

export const cancelQueueEntry = async (
  shopId: string,
  entryId: string
): Promise<WalkInQueueEntryResponse> => {
  const res = await apiClient.patch<WalkInQueueEntryResponse>(
    `/shops/${shopId}/walk-in-queue/${entryId}/cancel`
  )
  return res.data
}

export const getMyWalkInHistory = async (
  page = 0,
  size = 10
): Promise<PagedWalkInHistoryResponse> => {
  const res = await apiClient.get<PagedWalkInHistoryResponse>("/customers/me/walk-in-history", {
    params: { page, size },
  })
  return res.data
}

export const getQueuePositionStreamUrl = (shopId: string, entryId: string): string => {
  const API_URL = import.meta.env.VITE_API_URL
  return `${API_URL}/shops/${shopId}/walk-in-queue/${entryId}/position`
}