import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SearchServicemen from "./pages/SearchServicemen";
import Services from "./pages/Services";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="services" element={<Services />} />
        <Route path="servicemen" element={<SearchServicemen />} />

        <Route element={<ProtectedRoute />}>
          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<BookingHistory />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
