import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, MessageCircle, HeartPulse, Youtube, Facebook } from "lucide-react";
import { Logo } from "./Logo";
import { useContent } from "@/hooks/useContent";
import { isTrueValue } from "@/services/content";

const FOOTER_HREFS = ['/', '/doctors', '/gallery', '/blogs', '/about', '/services', '/contact'];

export function Footer() {
  const content = useContent();
  const phone = content['contact_phone'] ?? '';
  const phoneDisplay = content['contact_phone_display'] ?? '';
  const whatsapp = content['contact_whatsapp'] ?? '';
  const email = content['contact_email'] ?? '';
  const addressShort = content['footer_address_short'] ?? '';
  const hoursWeekday = content['contact_hours_weekday'] ?? '';
  const hoursSunday = content['contact_hours_sunday'] ?? '';
  const tagline = content['footer_tagline'] ?? content['site_tagline'] ?? '';
  const customLogo = content['site_logo'] ?? '';

  // Visibility flags
  const logoDesktop = isTrueValue(content['footer_logo_desktop']);
  const logoMobile = isTrueValue(content['footer_logo_mobile']);
  const qlDesktop = isTrueValue(content['footer_quicklinks_desktop']);
  const qlMobile = isTrueValue(content['footer_quicklinks_mobile']);
  const contactDesktop = isTrueValue(content['footer_contact_desktop']);
  const contactMobile = isTrueValue(content['footer_contact_mobile']);
  const hoursDesktop = isTrueValue(content['footer_hours_desktop']);
  const hoursMobile = isTrueValue(content['footer_hours_mobile']);
  const showWhatsapp = isTrueValue(content['footer_social_whatsapp']);
  const showPhone = isTrueValue(content['footer_social_phone']);
  const showYoutube = isTrueValue(content['footer_social_youtube']);
  const showFacebook = isTrueValue(content['footer_social_facebook']);
  const youtubeUrl = content['youtube_url'] ?? '';
  const facebookUrl = content['facebook_url'] ?? '';

  // Labels from content
  const qlHeading = content['footer_quicklinks_heading'] ?? '';
  const contactHeading = content['footer_contact_heading'] ?? '';
  const hoursHeading = content['footer_hours_heading'] ?? '';
  const callLabel = content['footer_call_label'] ?? '';
  const emailLabel = content['footer_email_label'] ?? '';
  const locationLabel = content['footer_location_label'] ?? '';
  const copyright = content['footer_copyright'] ?? '';
  const credit = content['footer_credit'] ?? '';

  const visClass = (d: boolean, m: boolean) =>
    d && m ? '' : d ? 'hidden sm:block' : m ? 'sm:hidden' : 'hidden';

  return (
    <footer className="bg-gray-950 pt-8 pb-4 sm:pt-14 sm:pb-6 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-10 sm:gap-x-10 mb-6 sm:mb-10 text-center sm:text-left">
          
          {/* Logo / Brand Info */}
          <div className={`w-full sm:w-auto flex-1 min-w-50 flex flex-col items-center sm:items-start space-y-3 sm:space-y-4 ${visClass(logoDesktop, logoMobile)}`}>
            <div className="bg-white/90 p-2.5 sm:p-3 rounded-xl inline-block max-w-fit sm:pr-6">
              <Logo className="scale-75 origin-center sm:origin-left" customLogo={customLogo} />
            </div>
            <p className="text-xs leading-relaxed text-gray-400 max-w-xs">{tagline}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {showWhatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gray-900 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {showPhone && (
                <a
                  href={`tel:+${phone}`}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gray-900 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all"
                >
                  <PhoneCall className="h-4 w-4" />
                </a>
              )}
              {showYoutube && youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gray-900 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {showFacebook && facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gray-900 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className={`w-[45%] sm:w-auto flex-1 min-w-35 flex flex-col items-center sm:items-start ${visClass(qlDesktop, qlMobile)}`}>
            <h3 className="text-white font-bold text-sm mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto">
              <HeartPulse className="h-4 w-4 text-brand-green hidden sm:block" />
              {qlHeading}
            </h3>
            <ul className="space-y-2 flex flex-col items-center sm:items-start w-full sm:w-auto">
              {FOOTER_HREFS.map((href, i) => {
                const label = content[`footer_link_${i + 1}_label`] ?? '';
                if (!label) return null;
                return (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-xs hover:text-brand-green transition-colors flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-brand-green shrink-0 hidden sm:block" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className={`w-[45%] sm:w-auto flex-1 min-w-45 flex flex-col items-center sm:items-start ${visClass(contactDesktop, contactMobile)}`}>
            <h3 className="text-white font-bold text-sm mb-3 sm:mb-4">{contactHeading}</h3>
            <ul className="space-y-2.5 sm:space-y-3.5 flex flex-col items-center sm:items-start w-full sm:w-auto">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2.5">
                <PhoneCall className="h-4 w-4 text-brand-green shrink-0 mt-0.5 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide block">{callLabel}</span>
                  <a href={`tel:+${phone}`} className="text-xs font-medium text-white hover:text-brand-green transition-colors">
                    {phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2.5">
                <Mail className="h-4 w-4 text-brand-green shrink-0 mt-0.5 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide block">{emailLabel}</span>
                  <a href={`mailto:${email}`} className="text-xs font-medium text-white hover:text-brand-green transition-colors break-all">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2.5">
                <MapPin className="h-4 w-4 text-brand-green shrink-0 mt-0.5 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide block">{locationLabel}</span>
                  <span className="text-xs leading-relaxed whitespace-pre-line inline-block max-w-45">{addressShort}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Operating Hours - Centered naturally if wrapped */}
          <div className={`w-full sm:w-auto flex-2 min-w-60 flex flex-col items-center sm:items-start pt-4 sm:pt-0 ${visClass(hoursDesktop, hoursMobile)}`}>
            <h3 className="text-white font-bold text-sm mb-3 sm:mb-4">{hoursHeading}</h3>
            <div className="bg-gray-900/60 rounded-xl p-3 sm:p-4 border border-gray-800 inline-block w-auto max-w-sm sm:w-full">
              <ul className="space-y-2 text-center sm:text-left">
                <li className="text-xs text-gray-300 whitespace-nowrap">{hoursWeekday}</li>
                <li className="h-px w-full bg-gray-800" />
                <li className="text-xs text-gray-300 whitespace-nowrap">{hoursSunday}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-gray-600 text-center">
          <span>&copy; {new Date().getFullYear()} {content['site_name']}. {copyright}</span>
          <span>{credit}</span>
        </div>
      </div>
    </footer>
  );
}
