import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PublicNavbar from "./components/PublicNavbar";
import UserNavbar from "./components/UserNavbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import UserPackages from "./pages/UserPackages";
import SearchPlaces from "./pages/SearchPlaces";
import MyTrips from "./pages/MyTrips";
import Recommendations from "./pages/Recommendations";
import MyReviews from "./pages/MyReviews";
import SuggestPlace from "./pages/SuggestPlace";
import GuideDashboard from "./pages/GuideDashboard";
import { isLoggedIn } from "./utils";
import ThemeToggle from "./components/ThemeToggle";

function Protected({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(sessionStorage.getItem("stg_user") || "{}");
    const actualRole = user.role || "user";
    if (role && actualRole !== role) return <Navigate to={actualRole === "guide" ? "/guide" : "/user"} replace />;
  } catch {}
  return children;
}

function Layout() {
  const location = useLocation();
  const isUserArea = location.pathname.startsWith("/user");
  const isGuideArea = location.pathname.startsWith("/guide");
  return (
    <>
      <ThemeToggle />
      {!isGuideArea && (isUserArea ? <UserNavbar /> : <PublicNavbar />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/user" element={<Protected role="user"><UserDashboard /></Protected>} />
        <Route path="/guide" element={<Protected role="guide"><GuideDashboard /></Protected>} />
        <Route path="/guide/profile" element={<Protected role="guide"><Profile /></Protected>} />
        <Route path="/user/profile" element={<Protected role="user"><Profile /></Protected>} />
        <Route path="/user/packages" element={<Protected role="user"><UserPackages /></Protected>} />
        <Route path="/user/search" element={<Protected role="user"><SearchPlaces /></Protected>} />
        <Route path="/user/trips" element={<Protected role="user"><MyTrips /></Protected>} />
        <Route path="/user/recommendations" element={<Protected role="user"><Recommendations /></Protected>} />
        <Route path="/user/recommendations/places" element={<Protected role="user"><Recommendations mode="places" /></Protected>} />
        <Route path="/user/recommendations/packages" element={<Protected role="user"><Recommendations mode="packages" /></Protected>} />
        <Route path="/user/reviews" element={<Protected role="user"><MyReviews /></Protected>} />
        <Route path="/user/suggest-place" element={<Protected role="user"><SuggestPlace /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <Layout />;
}
