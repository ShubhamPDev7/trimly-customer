import { apiClient } from "./client"
import type {
  BookingRequest,
  BookingResponse,
  AvailableSlotsResponse,
  PagedBookingsResponse,
  BookingStatus,
  BillResponse,
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
  params: { status?: BookingStatus; page?: number; size?: number }
): Promise<PagedBookingsResponse> => {
  const res = await apiClient.get<PagedBookingsResponse>("/bookings/mine", { params })
  return res.data
}

export const getMyBookingBill = async (bookingId: string): Promise<BillResponse> => {
  const res = await apiClient.get<BillResponse>(`/bookings/${bookingId}/bill`)
  return res.data
}