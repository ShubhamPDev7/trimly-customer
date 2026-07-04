import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking, getAvailableSlots, getMyBookings, getMyBookingBill } from "@/api/booking"
import type { BookingStatus } from "@/types/booking"
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

export function useMyBookings(status?: BookingStatus, page = 0) {
  return useQuery({
    queryKey: ["my-bookings", status, page],
    queryFn: () => getMyBookings({ status, page, size: 20 }),
  })
}

export function useMyBookingBill(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["my-booking-bill", bookingId],
    queryFn: () => getMyBookingBill(bookingId!),
    enabled: !!bookingId,
    retry: false,
  })
}