import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { useShopPublicProfile } from "@/hooks/useShops"
import { useJoinQueue } from "@/hooks/useWalkInQueue"
import { useQueueStore } from "@/store/queueStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function JoinQueuePage() {
  const { shopId } = useParams<{ shopId: string }>()
  const navigate = useNavigate()
  const { data: shop, isLoading } = useShopPublicProfile(shopId)
  const joinMutation = useJoinQueue(shopId)
  const setActiveEntry = useQueueStore((s) => s.setActiveEntry)

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [preferredStaffId, setPreferredStaffId] = useState<string>("")

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectedServices = shop?.services.filter((s) => selectedServiceIds.includes(s.id)) ?? []
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0)

  const handleJoin = async () => {
    if (!shopId || !shop) return
    try {
      const entry = await joinMutation.mutateAsync({
        serviceIds: selectedServiceIds,
        preferredStaffId: preferredStaffId || undefined,
      })
      setActiveEntry({ shopId, entryId: entry.id, shopName: shop.name })
      toast.success("Joined the queue!")
      navigate("/queue")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to join queue")
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

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-3.5 backdrop-blur-md safe-top">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="font-heading text-lg font-semibold">Join Walk-in Queue</h1>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <p className="mb-2.5 text-sm font-medium text-muted-foreground">Select services</p>
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
        </div>

        {shop && shop.staff.length > 0 && (
          <div>
            <p className="mb-2.5 text-sm font-medium text-muted-foreground">
              Preferred barber <span className="text-xs">(optional)</span>
            </p>
            <div className="space-y-2.5">
              <Card
                className={`cursor-pointer transition-colors ${
                  preferredStaffId === "" ? "border-foreground" : ""
                }`}
                onClick={() => setPreferredStaffId("")}
              >
                <CardContent className="flex items-center justify-between p-3.5">
                  <p className="font-medium">No preference</p>
                  {preferredStaffId === "" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
              {shop.staff.map((st) => (
                <Card
                  key={st.userId}
                  className={`cursor-pointer transition-colors ${
                    preferredStaffId === st.userId ? "border-foreground" : ""
                  }`}
                  onClick={() => setPreferredStaffId(st.userId)}
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
                    {preferredStaffId === st.userId && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 p-4 backdrop-blur-md safe-bottom">
        <Button
          className="w-full"
          size="lg"
          disabled={selectedServiceIds.length === 0 || joinMutation.isPending}
          onClick={handleJoin}
        >
          {joinMutation.isPending ? "Joining..." : `Join Queue${total ? ` · ₹${total}` : ""}`}
        </Button>
      </div>
    </div>
  )
}