import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { useShopPublicProfile } from "@/hooks/useShops"
import { useAvailableSlots, useCreateBooking } from "@/hooks/useBookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const todayStr = new Date().toISOString().slice(0, 10)

type Step = "services" | "staff" | "datetime" | "confirm"

export default function BookingFlowPage() {
  const { shopId } = useParams<{ shopId: string }>()
  const navigate = useNavigate()
  const { data: shop, isLoading } = useShopPublicProfile(shopId)
  const createMutation = useCreateBooking(shopId)

  const [step, setStep] = useState<Step>("services")
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [staffId, setStaffId] = useState("")
  const [date, setDate] = useState(todayStr)
  const [timeSlot, setTimeSlot] = useState("")

  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(shopId, date, staffId)

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectedServices = shop?.services.filter((s) => selectedServiceIds.includes(s.id)) ?? []
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0)
  const selectedStaff = shop?.staff.find((st) => st.userId === staffId)

  const handleConfirm = async () => {
    try {
      await createMutation.mutateAsync({
        staffId,
        bookingDate: date,
        timeSlot: timeSlot + ":00",
        serviceIds: selectedServiceIds,
      })
      toast.success("Booking confirmed!")
      navigate("/bookings")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create booking")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    )
  }

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  const filteredSlots =
    slotsData?.availableSlots.filter((slot) => {
      if (date !== todayStr) return true
      const [h, m] = slot.split(":").map(Number)
      return h * 60 + m > nowMinutes
    }) ?? []

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-3.5 backdrop-blur-md safe-top">
        <button
          onClick={() => (step === "services" ? navigate(-1) : setStep(prevStep(step)))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="font-heading text-lg font-semibold">{stepTitle(step)}</h1>
      </div>

      <div className="p-4">
        {step === "services" && (
          <div className="space-y-2.5">
            {shop?.services.map((s) => (
              <Card
                key={s.id}
                className={`cursor-pointer transition-colors ${
                  selectedServiceIds.includes(s.id) ? "border-foreground" : ""
                }`}
                onClick={() => toggleService(s.id)}
              >
                <CardContent className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.category}
                      {s.estTimeMinutes != null && ` · ${s.estTimeMinutes} min`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">₹{s.price}</p>
                    {selectedServiceIds.includes(s.id) && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "staff" && (
          <div className="space-y-2.5">
            {shop?.staff.map((st) => (
              <Card
                key={st.userId}
                className={`cursor-pointer transition-colors ${
                  staffId === st.userId ? "border-foreground" : ""
                }`}
                onClick={() => setStaffId(st.userId)}
              >
                <CardContent className="flex items-center gap-3 p-3.5">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={st.photoUrl ?? undefined} />
                    <AvatarFallback>{st.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{st.name}</p>
                    {st.specialties && (
                      <p className="text-xs text-muted-foreground">{st.specialties}</p>
                    )}
                  </div>
                  {staffId === st.userId && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">Select Date</p>
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setTimeSlot("")
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Select Time</p>
              {slotsLoading && <p className="text-sm text-muted-foreground">Loading slots...</p>}
              {!slotsLoading && filteredSlots.length === 0 && (
                <p className="text-sm text-muted-foreground">No slots available on this date.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {filteredSlots.map((slot) => {
                  const display = slot.slice(0, 5)
                  return (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(display)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm ${
                        timeSlot === display
                          ? "border-foreground bg-foreground text-background"
                          : "border-input"
                      }`}
                    >
                      {display}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Shop</p>
                  <p className="font-medium">{shop?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Staff</p>
                  <p className="font-medium">{selectedStaff?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date &amp; Time</p>
                  <p className="font-medium">{date} at {timeSlot}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Services</p>
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span>₹{s.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-border/60 pt-3 font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 p-4 backdrop-blur-md safe-bottom">
        {step !== "confirm" ? (
          <Button
            className="w-full"
            size="lg"
            disabled={!canProceed(step, selectedServiceIds, staffId, timeSlot)}
            onClick={() => setStep(nextStep(step))}
          >
            Continue
          </Button>
        ) : (
          <Button
            className="w-full"
            size="lg"
            disabled={createMutation.isPending}
            onClick={handleConfirm}
          >
            {createMutation.isPending ? "Booking..." : `Confirm Booking · ₹${total}`}
          </Button>
        )}
      </div>
    </div>
  )
}

function stepTitle(step: Step) {
  switch (step) {
    case "services": return "Select Services"
    case "staff": return "Select Staff"
    case "datetime": return "Select Date & Time"
    case "confirm": return "Confirm Booking"
  }
}

function nextStep(step: Step): Step {
  if (step === "services") return "staff"
  if (step === "staff") return "datetime"
  if (step === "datetime") return "confirm"
  return "confirm"
}

function prevStep(step: Step): Step {
  if (step === "staff") return "services"
  if (step === "datetime") return "staff"
  if (step === "confirm") return "datetime"
  return "services"
}

function canProceed(step: Step, serviceIds: string[], staffId: string, timeSlot: string) {
  if (step === "services") return serviceIds.length > 0
  if (step === "staff") return !!staffId
  if (step === "datetime") return !!timeSlot
  return true
}