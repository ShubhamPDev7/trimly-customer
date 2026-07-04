import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, LogOut, Trash2 } from "lucide-react"
import { useMyProfile, useUpdateMyProfile, useDeleteMyAccount } from "@/hooks/useCustomerProfile"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import PhoneInput from "@/components/shared/PhoneInput"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useMyProfile()
  const updateMutation = useUpdateMyProfile()
  const deleteMutation = useDeleteMyAccount()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setEmail(profile.email ?? "")
      setPhone(profile.phone ?? "")
    }
  }, [profile])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        name,
        email: email || undefined,
        phone: phone || undefined,
      })
      toast.success("Profile updated")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile")
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteMutation.mutateAsync()
      clearAuth()
      navigate("/login")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete account")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarFallback>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-lg font-semibold">{profile?.name}</h1>
          {profile?.createdAt && (
            <p className="text-xs text-muted-foreground">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput id="phone" value={phone} onChange={setPhone} />
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={updateMutation.isPending || !name.trim()}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2.5">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setLogoutConfirmOpen(true)}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <ConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Log out?"
        description="You'll need to sign in again to book or view your appointments."
        confirmLabel="Log Out"
        onConfirm={handleLogout}
        destructive={false}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete your account?"
        description="This will permanently delete your account. This action cannot be undone."
        confirmLabel="Delete Account"
        onConfirm={handleDeleteAccount}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}