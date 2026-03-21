import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  FileText,
  Settings2,
  Images,
  Shield,
  MessageSquare,
  Briefcase,
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare, exact: false },
  { href: '/admin/doctors', label: 'Doctors', icon: Users, exact: false },
  { href: '/admin/services', label: 'Services', icon: Briefcase, exact: false },
  { href: '/admin/blogs', label: 'Blogs & News', icon: FileText, exact: false },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, exact: false },
  { href: '/admin/hero', label: 'Hero Slides', icon: Images, exact: false },
  { href: '/admin/content', label: 'Site Content', icon: Settings2, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Shield, exact: false },
]

export function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            to={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/55 hover:bg-white/8 hover:text-white/90'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : ''}`}
            />
            <span className="truncate">{label}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
