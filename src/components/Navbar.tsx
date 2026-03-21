import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, PhoneCall } from "lucide-react";
import { Logo } from "./Logo";
import { useContent } from "@/hooks/useContent";
import { isTrueValue } from "@/services/content";

const NAV_HREFS = ['/', '/about', '/doctors', '/services', '/gallery', '/blogs', '/contact'];

export function Navbar() {
  const content = useContent();
  const phone = content['contact_phone'] ?? '';
  const ctaLabel = content['navbar_cta_label'] ?? 'Call Now';
  const customLogo = content['site_logo'] ?? '';
  const ctaDesktop = isTrueValue(content['navbar_cta_desktop']);
  const ctaMobile = isTrueValue(content['navbar_cta_mobile']);
  const logoDesktop = isTrueValue(content['navbar_logo_desktop']);
  const logoMobile = isTrueValue(content['navbar_logo_mobile']);

  // Build nav links from content labels
  const navLinks = NAV_HREFS.map((href, i) => ({
    name: content[`navbar_link_${i + 1}_label`] ?? '',
    href,
    desktop: isTrueValue(content[`navbar_link_${i + 1}_desktop`]),
    mobile: isTrueValue(content[`navbar_link_${i + 1}_mobile`]),
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-1.5" : "bg-white py-2 sm:py-2.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className={`block ${logoDesktop ? '' : 'md:hidden'} ${logoMobile ? '' : 'hidden md:block'} ${!logoDesktop && !logoMobile ? 'hidden!' : ''}`}>
            <Logo className="text-[1.0rem] sm:text-[1.1rem]" customLogo={customLogo} />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.filter(l => l.desktop && l.name).map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 lg:px-4 py-2 text-sm font-semibold transition-colors rounded-full ${
                    isActive
                      ? "text-brand-green bg-brand-green-light"
                      : "text-gray-600 hover:text-brand-green hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-green" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {ctaDesktop && (
              <a
                href={`tel:+${phone}`}
                className="hidden md:flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 lg:px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-all hover:scale-105"
              >
                <PhoneCall className="h-4 w-4" />
                {ctaLabel}
              </a>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-brand-green focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"
        } bg-white`}
      >
        <div className="px-4 py-6 space-y-1 shadow-inner">
          {navLinks.filter(l => l.mobile && l.name).map((link) => {
            const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-green-light text-brand-green"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-green"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {ctaMobile && (
            <div className="pt-4 mt-2 border-t border-gray-100">
              <a
                href={`tel:+${phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3.5 text-base font-bold text-white shadow-md shadow-brand-green/20"
              >
                <PhoneCall className="h-5 w-5" />
                {ctaLabel}
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
