import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scissors } from "lucide-react"
import { sendOtpRequest, verifyOtpRequest } from "@/api/auth"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from "@/components/shared/PhoneInput"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendOtpRequest(phone)
      setStep("code")
      toast.success("OTP sent!")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await verifyOtpRequest(phone, code)
      setAuth({
        accessToken: data.token,
        refreshToken: data.refreshToken,
        userId: data.userId,
        name: data.name,
        email: null,
        phone: data.email,
        role: data.role,
      })
      toast.success("Welcome to Trimly!")
      navigate("/")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)]">
            <Scissors className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Trimly</h1>
            <p className="text-sm text-muted-foreground">Book your next appointment in seconds</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft-lg)]">
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput id="phone" value={phone} onChange={setPhone} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Enter OTP sent to {phone}</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-xs text-muted-foreground hover:underline"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}