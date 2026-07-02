import { apiClient } from "./client"
import type { ShopSearchResponse, ShopPublicProfileResponse } from "@/types/shop"

export const searchShops = async (
  query?: string,
  locality?: string
): Promise<ShopSearchResponse[]> => {
  const res = await apiClient.get<ShopSearchResponse[]>("/shops/search", {
    params: { query: query || undefined, locality: locality || undefined },
  })
  return res.data
}

export const getLocalities = async (): Promise<string[]> => {
  const res = await apiClient.get<string[]>("/shops/localities")
  return res.data
}

export const getShopPublicProfile = async (shopId: string): Promise<ShopPublicProfileResponse> => {
  const res = await apiClient.get<ShopPublicProfileResponse>(`/shops/${shopId}/public`)
  return res.data
}