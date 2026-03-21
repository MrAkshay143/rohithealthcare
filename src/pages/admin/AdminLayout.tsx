import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ExternalLink } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminMobileNav } from "@/components/AdminMobileNav";
import { api } from "@/services/api";
import { useContent } from "@/hooks/useContent";

export default function AdminLayout() {
  const navigate = useNavigate();
  const content = useContent();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api.get('/auth/check')
      .then((data: any) => {
        if (!data?.authenticated) navigate('/admin/login', { replace: true });
        else setChecked(true);
      })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try { await api.post('/auth/logout', {}); } catch {}
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="animate-spin h-8 w-8 border-4 border-[#015851] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <AdminMobileNav onLogout={handleLogout} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-56 xl:w-60 bg-[#012b26] flex-col h-screen sticky top-0 shrink-0 shadow-xl">
          <div className="px-5 py-5 border-b border-white/10">
            <p className="font-black text-white text-sm leading-none tracking-tight">
              {content['site_name'] || 'Admin'}
            </p>
            <p className="text-[11px] text-white/40 mt-1 font-medium">Admin Panel</p>
          </div>

          <AdminSidebar />

          <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-0.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all font-medium"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              View Site
            </a>
            <button
              onClick={handleLogout}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-auto">
          <main className="p-4 sm:p-6 xl:p-8 max-w-350">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
