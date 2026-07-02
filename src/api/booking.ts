import { apiClient } from "./client"
import type {
  BookingRequest,
  BookingResponse,
  AvailableSlotsResponse,
  PagedBookingsResponse,
  BookingStatus,
} from "@/types/booking"

export const createBooking = async (
  shopId: string,
  data: BookingRequest
): Promise<BookingResponse> => {
  const res = await apiClient.post<BookingResponse>(`/shops/${shopId}/bookings`, data)
  return res.data
}

export const getAvailableSlots = async (
  shopId: string,
  date: string,
  staffId: string
): Promise<AvailableSlotsResponse> => {
  const res = await apiClient.get<AvailableSlotsResponse>(
    `/shops/${shopId}/bookings/available-slots`,
    { params: { date, staffId } }
  )
  return res.data
}

export const getMyBookings = async (
  shopId: string,
  params: { status?: BookingStatus; page?: number; size?: number }
): Promise<PagedBookingsResponse> => {
  const res = await apiClient.get<PagedBookingsResponse>(`/shops/${shopId}/bookings`, { params })
  return res.data
}