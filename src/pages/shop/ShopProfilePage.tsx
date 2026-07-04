import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, MapPin, Clock, AtSign } from "lucide-react"
import { useShopPublicProfile } from "@/hooks/useShops"
import { useShopReviews, useShopRatingSummary } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const DAY_LABELS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function ShopProfilePage() {
  const { shopId } = useParams<{ shopId: string }>()
  const navigate = useNavigate()
  const { data: shop, isLoading } = useShopPublicProfile(shopId)
  const { data: ratingSummary } = useShopRatingSummary(shopId)
  const { data: reviewsPage } = useShopReviews(shopId)

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    )
  }

  if (!shop) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Shop not found.</div>
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-foreground/90 to-foreground/70 px-4 pb-6 pt-safe-top text-background">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/15 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{shop.name}</h1>
        {shop.locality && (
          <p className="mt-1 flex items-center gap-1 text-sm opacity-80">
            <MapPin className="h-3.5 w-3.5" />
            {shop.address ? `${shop.address}, ` : ""}
            {shop.locality}
          </p>
        )}
        {ratingSummary && ratingSummary.totalReviews > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="font-medium">{ratingSummary.averageRating.toFixed(1)}</span>
            <span className="opacity-70">({ratingSummary.totalReviews} reviews)</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Tabs defaultValue="services">
          <TabsList className="w-full">
            <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
            <TabsTrigger value="staff" className="flex-1">Staff</TabsTrigger>
            <TabsTrigger value="hours" className="flex-1">Hours</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-4 space-y-2.5">
            {shop.services.length === 0 && (
              <p className="text-sm text-muted-foreground">No services listed yet.</p>
            )}
            {shop.services.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.category}
                      {s.estTimeMinutes != null && ` · ${s.estTimeMinutes} min`}
                    </p>
                  </div>
                  <p className="font-semibold">₹{s.price}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="staff" className="mt-4 space-y-2.5">
            {shop.staff.length === 0 && (
              <p className="text-sm text-muted-foreground">No staff listed yet.</p>
            )}
            {shop.staff.map((st) => (
              <Card key={st.userId}>
                <CardContent className="flex gap-3 p-3.5">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={st.photoUrl ?? undefined} />
                    <AvatarFallback>{st.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{st.name}</p>
                      {st.instagramHandle && (
                        <a
                          href={`https://instagram.com/${st.instagramHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground"
                        >
                          <AtSign className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {st.experienceYears != null && (
                      <p className="text-xs text-muted-foreground">{st.experienceYears} yrs experience</p>
                    )}
                    {st.specialties && (
                      <p className="mt-1 text-xs text-muted-foreground">{st.specialties}</p>
                    )}
                    {st.bio && <p className="mt-1 text-sm">{st.bio}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hours" className="mt-4 space-y-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => {
              const h = shop.hours.find((x) => x.dayOfWeek === d)
              return (
                <div key={d} className="flex items-center justify-between border-b border-border/60 py-2 text-sm last:border-0">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {DAY_LABELS[d]}
                  </span>
                  <span className="text-muted-foreground">
                    {!h || h.closed
                      ? "Closed"
                      : `${h.openTime?.slice(0, 5)} - ${h.closeTime?.slice(0, 5)}`}
                  </span>
                </div>
              )
            })}
            {shop.cancellationPolicy && (
              <p className="pt-3 text-xs text-muted-foreground">
                Cancellations require {shop.cancellationPolicy.minHoursBeforeCancel}+ hours notice.
              </p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 space-y-2.5">
            {reviewsPage?.content.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
            {reviewsPage?.content.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-3.5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  {r.comment && <p className="mt-1.5 text-sm">{r.comment}</p>}
                  {r.ownerReply && (
                    <div className="mt-2 rounded-lg bg-muted p-2.5 text-xs">
                      <span className="font-medium">Owner reply: </span>
                      {r.ownerReply}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky action buttons */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 p-4 backdrop-blur-md safe-bottom flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          size="lg"
          onClick={() => navigate(`/shop/${shopId}/queue-join`)}
        >
          Join Queue
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={() => navigate(`/shop/${shopId}/book`)}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  )
}