import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getSiteContent } from '@/services/content'
import { ContentContext } from '@/hooks/useContent'
import { PublicLayout } from '@/components/PublicLayout'
import AdminLayout from '@/pages/admin/AdminLayout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ServicesPage from '@/pages/ServicesPage'
import DoctorsPage from '@/pages/DoctorsPage'
import GalleryPage from '@/pages/GalleryPage'
import BlogsPage from '@/pages/BlogsPage'
import BlogPostPage from '@/pages/BlogPostPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLogin from '@/pages/admin/AdminLoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboardPage'
import AdminBlogs from '@/pages/admin/AdminBlogsPage'
import AdminDoctors from '@/pages/admin/AdminDoctorsPage'
import AdminGallery from '@/pages/admin/AdminGalleryPage'
import AdminHero from '@/pages/admin/AdminHeroPage'
import AdminContent from '@/pages/admin/AdminContentPage'
import AdminSettings from '@/pages/admin/AdminSettingsPage'
import AdminEnquiries from '@/pages/admin/AdminEnquiriesPage'
import AdminServices from '@/pages/admin/AdminServicesPage'
import { ToastContainer } from '@/components/Toast'

export default function App() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const refreshContent = useCallback(() => {
    getSiteContent().then((c) => {
      setContent(c)
      setLoading(false)
    })
  }, [])

  useEffect(() => { refreshContent() }, [refreshContent])

  // Refresh content when navigating away from admin pages
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) refreshContent()
  }, [location.pathname, refreshContent])

  // Listen for content-updated events from admin save
  useEffect(() => {
    const handler = () => refreshContent()
    window.addEventListener('content-updated', handler)
    return () => window.removeEventListener('content-updated', handler)
  }, [refreshContent])

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="pt-16 sm:pt-20">
          <div className="h-105 sm:h-130 bg-gray-100 w-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
          <div className="flex flex-col items-center gap-3">
            <div className="h-4 w-24 rounded-full bg-[#015851]/10" />
            <div className="h-8 w-72 rounded-lg bg-gray-200" />
            <div className="h-4 w-96 rounded-full bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ContentContext.Provider value={content}>
      <ToastContainer />
        <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </ContentContext.Provider>
  )
}
