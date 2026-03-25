import { Routes, Route } from 'react-router-dom'
import { useEffect, useState, useCallback, Suspense, lazy } from 'react'
import { getHomeBundle, invalidateHomeBundleCache } from '@/services/content'
import type { HomeBundleData } from '@/services/content'
import { ContentContext, HomeBundleContext } from '@/hooks/useContent'
import { PublicLayout } from '@/components/PublicLayout'
import AdminLayout from '@/pages/admin/AdminLayout'
import { ToastContainer } from '@/components/Toast'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'))
const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
const BlogsPage = lazy(() => import('@/pages/BlogsPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AdminLogin = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminBlogs = lazy(() => import('@/pages/admin/AdminBlogsPage'))
const AdminDoctors = lazy(() => import('@/pages/admin/AdminDoctorsPage'))
const AdminGallery = lazy(() => import('@/pages/admin/AdminGalleryPage'))
const AdminHero = lazy(() => import('@/pages/admin/AdminHeroPage'))
const AdminContent = lazy(() => import('@/pages/admin/AdminContentPage'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminEnquiries = lazy(() => import('@/pages/admin/AdminEnquiriesPage'))
const AdminServices = lazy(() => import('@/pages/admin/AdminServicesPage'))

export default function App() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [bundle, setBundle] = useState<HomeBundleData | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshContent = useCallback(() => {
    invalidateHomeBundleCache()
    getHomeBundle().then((b) => {
      setContent(b.content)
      setBundle(b)
      setLoading(false)
    })
  }, [])

  useEffect(() => { refreshContent() }, [refreshContent])

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
            <div className="h-4 w-24 rounded-full bg-[#4e66b3]/10" />
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
    <HomeBundleContext.Provider value={bundle}>
      <ToastContainer />
      <Suspense fallback={
        <div className="min-h-screen bg-white animate-pulse flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#4e66b3] mb-4"></div>
          <p className="text-gray-500 font-medium tracking-wide">Loading content...</p>
        </div>
      }>
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
      </Suspense>
    </HomeBundleContext.Provider>
    </ContentContext.Provider>
  )
}
