import { Outlet, NavLink } from "react-router-dom"
import { Home, CalendarClock, Users, Gift, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFcmRegistration } from "@/hooks/useFcm"

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/bookings", label: "Bookings", icon: CalendarClock },
  { to: "/queue", label: "Queue", icon: Users },
  { to: "/loyalty", label: "Rewards", icon: Gift },
  { to: "/profile", label: "Profile", icon: User },
]

export default function AppShell() {
  useFcmRegistration()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-border/60 bg-background/95 px-1 py-1.5 shadow-[var(--shadow-soft-lg)] backdrop-blur-md safe-bottom">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}