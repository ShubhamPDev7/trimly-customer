import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar } from "lucide-react"
import { useMyBookings, useMyBookingBill } from "@/hooks/useBookings"
import { Receipt, ChevronDown } from "lucide-react"
import type { BookingStatus } from "@/types/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
}

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL")
  const { data, isLoading } = useMyBookings(filter === "ALL" ? undefined : filter)

  return (
    <div className="space-y-4 p-4">
      <h1 className="font-heading text-xl font-semibold tracking-tight">My Bookings</h1>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as BookingStatus | "ALL")}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Upcoming</TabsTrigger>
          <TabsTrigger value="COMPLETED">Past</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && data?.bookings.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <Calendar className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No bookings here yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {data?.bookings.map((b) => (
          <Card
            key={b.id}
            className="cursor-pointer"
            onClick={() => navigate(`/shop/${b.shopId}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{b.bookingDate} · {b.timeSlot.slice(0, 5)}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {b.services.map((s) => (
                      <span key={s.serviceId} className="text-sm font-medium">
                        {s.serviceName}
                        {s !== b.services[b.services.length - 1] && ","}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status] ?? ""}`}
                >
                  {b.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">₹{b.totalAmount}</p>
              {b.status === "COMPLETED" && (
                <div onClick={(e) => e.stopPropagation()}>
                  <BillDetails bookingId={b.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BillDetails({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const { data: bill, isLoading, isError } = useMyBookingBill(open ? bookingId : undefined)

  return (
    <div className="mt-2 border-t border-border/60 pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1">
          <Receipt className="h-3.5 w-3.5" />
          View Bill
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2 rounded-lg bg-muted p-3 text-sm">
          {isLoading && <p className="text-muted-foreground">Loading bill...</p>}
          {isError && <p className="text-muted-foreground">Not billed yet.</p>}
          {bill && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">₹{bill.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Mode</span>
                <span className="font-medium">{bill.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{bill.paymentStatus}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}