import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { BusinessSettingsProvider } from './contexts/BusinessSettingsContext'

// Public Website
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Highlights from './components/Highlights/Highlights'
import ExperienceSection from './components/ExperienceSection/ExperienceSection'
import VenueSpaces from './components/VenueSpaces/VenueSpaces'
import GallerySection from './components/GallerySection/GallerySection'
import Availability from './components/Availability/Availability'
import Reviews from './components/Reviews/Reviews'
import EnquirySection from './components/EnquirySection/EnquirySection'
import FAQSection from './components/FAQSection/FAQSection'
import FloatingButtons from './components/FloatingButtons/FloatingButtons'
import Footer from './components/Footer/Footer'
import Preloader from './components/Preloader/Preloader'

// Admin
import AdminLayout from './components/Admin/AdminLayout'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminEnquiries from './pages/admin/Enquiries'
import AdminEvents from './pages/admin/Events'
import AdminAvailability from './pages/admin/Availability'
import AdminGallery from './pages/admin/Gallery'
import AdminReviews from './pages/admin/Reviews'
import AdminSettings from './pages/admin/Settings'
import AdminProfile from './pages/admin/Profile'


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  // Wait for auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3ED]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#42151F]/15 border-t-[#C6A15B]" />

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#42151F]/50">
            Loading
          </p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}


/* =========================================================
   PUBLIC WEBSITE
========================================================= */

function PublicSite() {
  return (
    <BusinessSettingsProvider>
      <div className="min-h-screen bg-[#F7F3ED]">

        <Preloader />

        <Navbar />

        <main>
          <Hero />

          <Highlights />

          <ExperienceSection />

          <VenueSpaces />

          <GallerySection />

          <Availability />

          <Reviews />

          <FAQSection />

          <FloatingButtons />

          <EnquirySection />
        </main>

        <Footer />

      </div>
    </BusinessSettingsProvider>
  )
}


/* =========================================================
   ADMIN ROUTES
========================================================= */

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      {/* /admin */}
      <Route
        index
        element={<Dashboard />}
      />

      {/* /admin/enquiries */}
      <Route
        path="enquiries"
        element={<AdminEnquiries />}
      />

      {/* /admin/events */}
      <Route
        path="events"
        element={<AdminEvents />}
      />

      {/* /admin/availability */}
      <Route
        path="availability"
        element={<AdminAvailability />}
      />

      {/* /admin/gallery */}
      <Route
        path="gallery"
        element={<AdminGallery />}
      />

      {/* /admin/reviews */}
      <Route
        path="reviews"
        element={<AdminReviews />}
      />

      {/* /admin/settings */}
      <Route
        path="settings"
        element={<AdminSettings />}
      />

      {/* /admin/profile */}
      <Route
        path="profile"
        element={<AdminProfile />}
      />
    </Route>
  )
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* =====================================================
              PUBLIC
          ====================================================== */}

          <Route
            path="/"
            element={<PublicSite />}
          />


          {/* =====================================================
              ADMIN LOGIN
          ====================================================== */}

          <Route
            path="/admin/login"
            element={<Login />}
          />


          {/* =====================================================
              PROTECTED ADMIN
          ====================================================== */}

          {AdminRoutes()}


          {/* =====================================================
              FALLBACK
          ====================================================== */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App