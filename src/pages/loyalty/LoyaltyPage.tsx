import { Gift, Copy, Share2, Store } from "lucide-react"
import { useMyLoyaltyAccounts, useMyReferralCode } from "@/hooks/useLoyalty"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return fallbackCopy(text)
    }
  }
  return fallbackCopy(text)
}

export default function LoyaltyPage() {
  const { data: accounts, isLoading: accountsLoading } = useMyLoyaltyAccounts()
  const { data: referral, isLoading: referralLoading } = useMyReferralCode()

  const handleShare = async () => {
    if (!referral) return
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({ text: referral.shareMessage })
        return
      } catch {
        // user cancelled or share failed, fall through to copy
      }
    }
    const ok = await copyText(referral.shareMessage)
    toast[ok ? "success" : "error"](ok ? "Copied to clipboard" : "Couldn't copy — long-press to select and copy manually")
  }

  const handleCopyCode = async () => {
    if (!referral) return
    const ok = await copyText(referral.referralCode)
    toast[ok ? "success" : "error"](ok ? "Code copied" : "Couldn't copy — long-press to select and copy manually")
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-heading text-xl font-semibold">Rewards</h1>

      <div>
        <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Gift className="h-4 w-4" />
          Your Points
        </p>

        {accountsLoading && (
          <div className="space-y-2.5">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        )}

        {!accountsLoading && accounts?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No points yet — you'll earn points every time you pay at a shop.
          </p>
        )}

        <div className="space-y-2.5">
          {accounts?.map((acc) => (
            <Card key={acc.shopId}>
              <CardContent className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="font-medium">{acc.shopName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{acc.balance} pts</p>
                  <p className="text-xs text-muted-foreground">worth ₹{acc.balanceInRupees}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-medium text-muted-foreground">Refer & Earn</p>
        <Card>
          <CardContent className="p-4 space-y-3">
            {referralLoading && <Skeleton className="h-10 w-full rounded-lg" />}
            {referral && (
              <>
                <p className="text-sm text-muted-foreground">
                  Share your code with friends. When they book, you both earn points.
                </p>
                <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-3.5 py-2.5">
                  <span className="select-all font-heading text-lg font-semibold tracking-wide">
                    {referral.referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <Button className="w-full" onClick={handleShare}>
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Share Code
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}