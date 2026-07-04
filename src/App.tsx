import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "@/pages/auth/LoginPage"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import AppShell from "@/layouts/AppShell"
import HomePage from "@/pages/home/HomePage"
import BookingFlowPage from "@/pages/booking/BookingFlowPage"
import ShopProfilePage from "@/pages/shop/ShopProfilePage"
import MyBookingsPage from "@/pages/bookings/MyBookingsPage"
import QueuePage from "@/pages/queue/QueuePage"
import JoinQueuePage from "@/pages/queue/JoinQueuePage"


function App() {
  return (
    <>  
      <Routes>
        <Route path="/login" element={<LoginPage />} />
       <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/loyalty" element={<div className="p-4">Loyalty placeholder</div>} />
            <Route path="/profile" element={<div className="p-4">Profile placeholder</div>} />
          </Route>
          <Route path="/shop/:shopId" element={<ShopProfilePage />} />
          <Route path="/shop/:shopId/book" element={<BookingFlowPage />} />
          <Route path="/shop/:shopId/queue-join" element={<JoinQueuePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App