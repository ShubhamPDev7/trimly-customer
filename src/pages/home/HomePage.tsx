import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, MapPin } from "lucide-react"
import { useShopSearch } from "@/hooks/useShops"
import { useAuthStore } from "@/store/authStore"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const navigate = useNavigate()
  const name = useAuthStore((s) => s.name)
  const [query, setQuery] = useState("")
  const { data: shops, isLoading } = useShopSearch(query, "")

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="text-sm text-muted-foreground">Welcome{name ? `, ${name}` : ""}</p>
        <h1 className="font-heading text-xl font-semibold tracking-tight">Find your barber</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search shops, localities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && shops?.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-10">No shops found.</p>
      )}

      <div className="space-y-3">
        {shops?.map((shop) => (
          <Card
            key={shop.id}
            className="cursor-pointer overflow-hidden rounded-2xl transition-shadow hover:shadow-[var(--shadow-soft-lg)]"
            onClick={() => navigate(`/shop/${shop.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{shop.name}</h3>
                  {shop.locality && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {shop.locality}
                    </p>
                  )}
                </div>
                {shop.openNow ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Open now
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Closed
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                {shop.averageRating != null && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {shop.averageRating} ({shop.totalReviews ?? 0})
                  </span>
                )}
                {shop.totalServices != null && <span>{shop.totalServices} services</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}