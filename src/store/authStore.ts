import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "OWNER" | "STAFF" | "CUSTOMER"

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  name: string | null
  email: string | null
  phone: string | null
  role: UserRole | null
  isAuthenticated: boolean
  setAuth: (data: {
    accessToken: string
    refreshToken: string
    userId: string
    name: string
    email: string | null
    phone: string | null
    role: string
  }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      name: null,
      email: null,
      phone: null,
      role: null,
      isAuthenticated: false,
      setAuth: (data) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role as UserRole,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          name: null,
          email: null,
          phone: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "trimly-customer-auth",
    }
  )
)