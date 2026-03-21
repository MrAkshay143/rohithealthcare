import { useState } from 'react'
import { Menu, X, LogOut, ExternalLink } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { useContent } from '@/hooks/useContent'

export function AdminMobileNav({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const content = useContent()
  const siteName = content['site_name'] || 'Admin'

  return (
    <>
      {/* Top bar on mobile */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#012b26] flex items-center justify-between px-4 py-3 shadow-lg">
        <div>
          <p className="font-black text-white text-sm leading-none tracking-tight">{siteName}</p>
          <p className="text-[10px] text-white/40 font-medium">Admin Panel</p>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Slide-out sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-[#012b26] transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-black text-white text-sm leading-none tracking-tight">{siteName}</p>
            <p className="text-[10px] text-white/40 font-medium">Admin Panel</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div onClick={() => setOpen(false)}>
          <AdminSidebar />
        </div>

        <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-0.5 mt-auto">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all font-medium">
            <ExternalLink className="w-4 h-4 shrink-0" /> View Site
          </a>
          <button
            onClick={onLogout}
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Logout
          </button>
        </div>
      </div>
    </>
  )
}
