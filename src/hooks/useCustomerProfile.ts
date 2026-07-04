import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyProfile, updateMyProfile, deleteMyAccount } from "@/api/customer"
import { useAuthStore } from "@/store/authStore"
import type { UpdateProfileRequest } from "@/types/customer"

export function useMyProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()
  const updateAuthFields = useAuthStore((s) => s.updateProfileFields)

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateMyProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["my-profile"], updated)
      updateAuthFields({ name: updated.name, email: updated.email, phone: updated.phone })
    },
  })
}

export function useDeleteMyAccount() {
  return useMutation({
    mutationFn: deleteMyAccount,
  })
}