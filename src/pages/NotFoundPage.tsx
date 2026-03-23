import { Link } from "react-router-dom";
import { Home, PhoneCall, AlertCircle } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";

export default function NotFoundPage() {
  const content = useContent();
  useSEO('home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#e0f2f0] via-white to-[#e0f2f0] px-4">
      {/* Card */}
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#4e66b3]/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#4e66b3]" />
          </div>
        </div>

        {/* 404 */}
        <p className="text-5xl sm:text-6xl font-black text-[#4e66b3] tracking-tight leading-none mb-2 sm:mb-3">
          404
        </p>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {content['notfound_heading'] || 'Page Not Found'}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-4">
          {content['notfound_text'] || "Sorry, the page you're looking for doesn't exist or may have been moved. Let us help you find your way back."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4e66b3] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#4e66b3]/20 hover:bg-[#3a4f99] transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" />
            {content['notfound_home_btn'] || 'Back to Home'}
          </Link>
          <a
            href={`tel:+${content['contact_phone'] || ''}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#4e66b3] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#4e66b3] hover:bg-[#4e66b3] hover:text-white transition-all hover:scale-105"
          >
            <PhoneCall className="h-4 w-4" />
            {content['notfound_call_btn'] || 'Call Us'}
          </a>
        </div>

        {/* Quick links */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            {content['notfound_links_label'] || 'Quick Links'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: content['footer_link_5_label'] || "About", href: "/about" },
              { label: content['footer_link_2_label'] || "Our Team", href: "/doctors" },
              { label: content['footer_link_6_label'] || "Services", href: "/services" },
              { label: content['footer_link_3_label'] || "Gallery", href: "/gallery" },
              { label: content['footer_link_4_label'] || "News & Camps", href: "/blogs" },
              { label: content['footer_link_7_label'] || "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] sm:text-xs text-gray-600 hover:border-[#4e66b3] hover:text-[#4e66b3] font-medium transition-colors shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
