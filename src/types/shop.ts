export interface ShopSearchResponse {
  id: string
  name: string
  address: string | null
  locality: string | null
  timezone: string
  averageRating: number | null
  totalReviews: number | null
  totalServices: number | null
  openNow: boolean
}

export interface ServiceItemResponse {
  id: string
  shopId: string
  category: "MALE" | "FEMALE" | "CHILDREN"
  name: string
  price: number
  estTimeMinutes: number | null
  imageUrl: string | null
}

export interface ShopHoursResponse {
  id: string
  shopId: string
  dayOfWeek: number
  closed: boolean
  openTime: string | null
  closeTime: string | null
}

export interface BarberPublicProfile {
  userId: string
  name: string
  bio: string | null
  specialties: string | null
  experienceYears: number | null
  instagramHandle: string | null
  photoUrl: string | null
}

export interface CancellationPolicyResponse {
  id: string
  shopId: string
  minHoursBeforeCancel: number
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface ShopPublicProfileResponse {
  id: string
  name: string
  address: string | null
  locality: string | null
  timezone: string
  averageRating: number | null
  totalReviews: number | null
  services: ServiceItemResponse[]
  hours: ShopHoursResponse[]
  staff: BarberPublicProfile[]
  cancellationPolicy: CancellationPolicyResponse | null
}