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
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#015851]/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#015851]" />
          </div>
        </div>

        {/* 404 */}
        <p className="text-8xl font-black text-[#015851] tracking-tight leading-none mb-4">
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          {content['notfound_heading'] ?? 'Page Not Found'}
        </h1>
        <p className="text-gray-500 text-base sm:text-lg mb-10 leading-relaxed">
          {content['notfound_text'] ?? "Sorry, the page you're looking for doesn't exist or may have been moved. Let us help you find your way back."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#015851] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#015851]/20 hover:bg-[#013f39] transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" />
            {content['notfound_home_btn'] ?? 'Back to Home'}
          </Link>
          <a
            href={`tel:+${content['contact_phone'] ?? ''}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#015851] px-7 py-3.5 text-sm font-bold text-[#015851] hover:bg-[#015851] hover:text-white transition-all hover:scale-105"
          >
            <PhoneCall className="h-4 w-4" />
            {content['notfound_call_btn'] ?? 'Call Us'}
          </a>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wide">
            {content['notfound_links_label'] ?? 'Quick Links'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: content['footer_link_5_label'] ?? "About", href: "/about" },
              { label: content['footer_link_2_label'] ?? "Our Team", href: "/doctors" },
              { label: content['footer_link_6_label'] ?? "Services", href: "/services" },
              { label: content['footer_link_3_label'] ?? "Gallery", href: "/gallery" },
              { label: content['footer_link_4_label'] ?? "News & Camps", href: "/blogs" },
              { label: content['footer_link_7_label'] ?? "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-[#015851] hover:text-[#015851] font-medium transition-colors shadow-sm"
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
