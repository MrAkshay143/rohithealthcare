import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, Image as ImageIcon, Settings2, ExternalLink, Images, Shield, MessageSquare, LayoutDashboard } from "lucide-react";
import { api } from "@/services/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({ doctors: 0, blogs: 0, gallery: 0, heroSlides: 0, content: 0 });
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    document.title = 'Dashboard | Admin';
    api.get('/admin/stats').then(setStats).catch(() => {});
    api.get('/enquiries/stats').then((s: any) => {
      setEnquiryCount(s.total ?? 0);
      setNewLeads(s.new ?? 0);
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Enquiries',      value: enquiryCount,      Icon: MessageSquare, bg: 'bg-indigo-50', color: 'text-indigo-600', href: '/admin/enquiries' },
    { label: 'Doctors',        value: stats.doctors,     Icon: Users,      bg: 'bg-blue-50',    color: 'text-blue-600',    href: '/admin/doctors' },
    { label: 'Blog Posts',     value: stats.blogs,       Icon: FileText,   bg: 'bg-green-50',   color: 'text-green-600',   href: '/admin/blogs' },
    { label: 'Gallery Photos', value: stats.gallery,     Icon: ImageIcon,  bg: 'bg-purple-50',  color: 'text-purple-600',  href: '/admin/gallery' },
    { label: 'Hero Slides',    value: stats.heroSlides,  Icon: Images,     bg: 'bg-rose-50',    color: 'text-rose-600',    href: '/admin/hero' },
    { label: 'Customer Leads', value: newLeads,         Icon: Settings2,  bg: 'bg-amber-50',   color: 'text-amber-600',   href: '/admin/enquiries' },
    { label: 'Settings',       value: '⚙',              Icon: Shield,     bg: 'bg-gray-50',    color: 'text-gray-600',    href: '/admin/settings' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#015851] to-[#018a7e] flex items-center justify-center shrink-0 shadow-lg shadow-[#015851]/20">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of your clinic&apos;s content and data.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {cards.map(({ label, value, Icon, bg, color, href }) => (
          <Link key={label} to={href}
            className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500 truncate">{label}</p>
              <p className="text-xl font-black text-gray-900">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { href: '/admin/blogs', label: 'Publish a new blog post' },
            { href: '/admin/gallery', label: 'Add gallery photos' },
            { href: '/admin/doctors', label: 'Manage doctor profiles' },
            { href: '/admin/hero', label: 'Manage hero slides' },
            { href: '/admin/content', label: 'Edit site text & content' },
            { href: '/admin/settings', label: 'Change password & settings' },
          ].map(({ href, label }) => (
            <Link key={href} to={href}
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-[#015851]/5 hover:text-[#015851] transition-colors text-sm font-medium text-gray-700 group">
              {label}
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
