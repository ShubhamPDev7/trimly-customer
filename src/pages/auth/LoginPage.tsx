import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Scissors, Eye, EyeOff } from "lucide-react"
import { sendOtpRequest, verifyOtpRequest, loginRequest, registerRequest } from "@/api/auth"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from "@/components/shared/PhoneInput"
import { toast } from "sonner"

type Method = "otp" | "password"
type PasswordMode = "signin" | "signup"

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [method, setMethod] = useState<Method>("otp")

  // OTP state
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [otpStep, setOtpStep] = useState<"phone" | "code">("phone")

  // Password state
  const [pwMode, setPwMode] = useState<PasswordMode>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pwPhone, setPwPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const applyAuth = (data: { token: string; refreshToken: string; userId: string; name: string; email: string | null; role: string }) => {
    setAuth({
      accessToken: data.token,
      refreshToken: data.refreshToken,
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: null,
      role: data.role,
    })
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendOtpRequest(phone)
      setOtpStep("code")
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
      applyAuth({ ...data, email: null })
      toast.success("Welcome to Trimly!")
      navigate("/")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data =
        pwMode === "signin"
          ? await loginRequest({ email, password })
          : await registerRequest({ name, email, phone: pwPhone || undefined, password, role: "CUSTOMER" })
      applyAuth(data)
      toast.success(pwMode === "signin" ? "Welcome back!" : "Account created!")
      navigate("/")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
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
          <div className="mb-5 flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setMethod("otp")}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                method === "otp" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => setMethod("password")}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                method === "password" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Email
            </button>
          </div>

          {method === "otp" && (
            otpStep === "phone" ? (
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
                  onClick={() => setOtpStep("phone")}
                  className="w-full text-center text-xs text-muted-foreground hover:underline"
                >
                  Change phone number
                </button>
              </form>
            )
          )}

          {method === "password" && (
            <>
              <div className="mb-4 flex rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setPwMode("signin")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                    pwMode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setPwMode("signup")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                    pwMode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {pwMode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {pwMode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="pwPhone">Phone Number</Label>
                    <PhoneInput id="pwPhone" value={pwPhone} onChange={setPwPhone} required />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : pwMode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}