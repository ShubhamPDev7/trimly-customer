export interface BookedServiceResponse {
  serviceId: string
  serviceName: string
  priceAtBooking: number
}

export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED"

export interface BookingResponse {
  id: string
  shopId: string
  customerId: string | null
  staffId: string
  guestName: string | null
  guestPhone: string | null
  bookingDate: string
  timeSlot: string
  status: BookingStatus
  services: BookedServiceResponse[]
  totalAmount: number
  createdAt: string
}

export interface BookingRequest {
  staffId: string
  bookingDate: string
  timeSlot: string
  serviceIds: string[]
}

export interface AvailableSlotsResponse {
  shopId: string
  staffId: string
  date: string
  slotIntervalMinutes: number
  availableSlots: string[]
}

export interface PagedBookingsResponse {
  bookings: BookingResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type PaymentMode = "CASH" | "ONLINE" | "UPI" | "RAZORPAY"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export interface BillResponse {
  id: string
  shopId: string
  bookingId: string
  totalAmount: number
  paymentMode: PaymentMode
  paymentStatus: PaymentStatus
  createdAt: string
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
}