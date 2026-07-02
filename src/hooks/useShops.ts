import { useQuery } from "@tanstack/react-query"
import { searchShops, getLocalities, getShopPublicProfile } from "@/api/shop"

export function useShopSearch(query: string, locality: string) {
  return useQuery({
    queryKey: ["shop-search", query, locality],
    queryFn: () => searchShops(query, locality),
  })
}

export function useLocalities() {
  return useQuery({
    queryKey: ["localities"],
    queryFn: getLocalities,
  })
}

export function useShopPublicProfile(shopId: string | undefined) {
  return useQuery({
    queryKey: ["shop-public", shopId],
    queryFn: () => getShopPublicProfile(shopId!),
    enabled: !!shopId,
  })
}