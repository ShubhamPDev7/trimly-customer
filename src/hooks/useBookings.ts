import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking, getAvailableSlots } from "@/api/booking"
import type { BookingRequest } from "@/types/booking"

export function useAvailableSlots(shopId: string | undefined, date: string, staffId: string) {
  return useQuery({
    queryKey: ["available-slots", shopId, date, staffId],
    queryFn: () => getAvailableSlots(shopId!, date, staffId),
    enabled: !!shopId && !!date && !!staffId,
  })
}

export function useCreateBooking(shopId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BookingRequest) => createBooking(shopId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
  })
}