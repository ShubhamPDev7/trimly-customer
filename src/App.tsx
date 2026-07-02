import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "@/pages/auth/LoginPage"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import AppShell from "@/layouts/AppShell"
import HomePage from "@/pages/home/HomePage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookings" element={<div className="p-4">Bookings placeholder</div>} />
            <Route path="/queue" element={<div className="p-4">Queue placeholder</div>} />
            <Route path="/loyalty" element={<div className="p-4">Loyalty placeholder</div>} />
            <Route path="/profile" element={<div className="p-4">Profile placeholder</div>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App