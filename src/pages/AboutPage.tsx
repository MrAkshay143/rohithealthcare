import { CheckCircle, ShieldCheck, Microscope, Award, Users, Clock, ArrowRight, MapPin, PhoneCall } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMemo } from "react";

const HL_ICONS = [ShieldCheck, Award, Microscope, Users, Clock];
const HL_COLORS = [
  { text: "text-[#4e66b3]", bg: "bg-[#4e66b3]" },
  { text: "text-brand-red", bg: "bg-brand-red"  },
  { text: "text-blue-600",  bg: "bg-blue-600"   },
  { text: "text-violet-600",bg: "bg-violet-600" },
  { text: "text-rose-500",  bg: "bg-rose-500"   },
];

export default function AboutPage() {
  const content = useContent();
  useSEO('about');
  const reveal = useScrollReveal();

  const highlights = useMemo(() =>
    [1,2,3,4,5].map(n => ({
      icon: HL_ICONS[n-1],
      label: content[`about_hl_${n}_label`] || '',
      desc: content[`about_hl_${n}_desc`] || '',
      ...HL_COLORS[n-1],
    }))
  , [content]);

  const whyUsItems = useMemo(() =>
    (content['about_whyus_items'] || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  , [content]);

  // Auto-scroll highlights strip - continuous scroll
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let raf: number;
    const speed = 0.5;
    const step = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft += speed;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div ref={reveal()} className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            {content['about_page_badge']}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {content['about_page_heading']}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            {content['about_page_subtext']}
          </p>
        </div>
      </div>


      {/* ── HIGHLIGHTS — auto-scroll strip (mobile/tab) ─────── */}
      <div className="bg-white border-b border-gray-100">
        {/* Mobile & tablet: auto-scrolling, hidden scrollbar */}
        <div ref={stripRef} className="lg:hidden overflow-x-auto scrollbar-hide">
          <div className="flex divide-x divide-gray-100" style={{ width: 'max-content' }}>
            {[...highlights, ...highlights].map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className={`group flex items-center gap-2.5 px-4 py-3.5 shrink-0`}>
                  <div className={`h-8 w-8 rounded-lg ${h.bg} flex items-center justify-center shrink-0`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[11px] leading-snug whitespace-nowrap">{h.label}</p>
                    <p className="text-[10px] text-gray-400 leading-snug whitespace-nowrap">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Desktop: static grid */}
        <div className="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 divide-x divide-gray-100">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={h.label} ref={reveal(i * 50)} className="group flex items-center gap-3 px-5 py-4 hover:bg-gray-50/80 transition-colors duration-200">
                  <div className={`h-9 w-9 rounded-xl ${h.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs leading-snug">{h.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-7 lg:py-10">
        <div className="grid lg:grid-cols-[5fr_6fr] gap-3 sm:gap-6 lg:gap-10 items-start">

          {/* LEFT — building image */}
          <div ref={reveal()} className="order-1 lg:sticky lg:top-24">
            {/* Mobile/Tablet: image — no bg, edges fade on left, right, bottom */}
            <div className="lg:hidden w-full pb-3 sm:pb-4"
                 style={{ 
                   WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                   maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
                 }}>
              <div style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}>
                <img
                  loading="lazy"
                  src="/uploads/clinic_building_transparent.png"
                  alt="Rohit Health Care Clinic Building"
                  className="w-full h-auto block object-contain object-bottom"
                  style={{ maxHeight: '250px' }}
                />
              </div>
            </div>

            {/* Desktop: no bg container, edges fade on left, right, bottom */}
            <div className="hidden lg:flex relative flex-col items-center justify-end pb-0"
              style={{ minHeight: '380px' }}>
              <div className="w-full flex-1 flex items-end justify-center"
                 style={{ 
                   WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                   maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
                 }}>
                <div className="w-full h-full flex items-end justify-center" style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                }}>
                  <img
                    loading="lazy"
                    src="/uploads/clinic_building_transparent.png"
                    alt="Rohit Health Care Clinic Building"
                    className="w-full block max-w-sm sm:max-w-md lg:max-w-lg mx-auto object-contain object-bottom"
                    style={{ maxHeight: '400px', height: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Stat pills — compact row (desktop only) */}
            <div className="hidden lg:flex gap-2 mt-3 relative z-10">
              <div className="flex items-center gap-2 flex-1 bg-[#4e66b3] rounded-xl px-3 py-2.5">
                <span className="text-lg font-extrabold text-white leading-none">{content['years_experience'] || '5+'}</span>
                <span className="text-[10px] text-white/70 font-medium leading-tight">{content['about_years_label'] || 'Years Serving'}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                <span className="text-lg font-extrabold text-gray-900 leading-none">NABL</span>
                <span className="text-[10px] text-gray-500 font-medium leading-tight">Accredited</span>
              </div>
              <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                <span className="text-lg font-extrabold text-gray-900 leading-none">Apollo</span>
                <span className="text-[10px] text-gray-500 font-medium leading-tight">Associated</span>
              </div>
            </div>
          </div>

          {/* RIGHT — text content */}
          <div ref={reveal(120)} className="order-2 lg:order-2">
            {/* Badge — compact on mobile */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4e66b3]/8 border border-[#4e66b3]/15 px-2.5 py-1 mb-3 lg:px-3.5 lg:py-1.5 lg:mb-6">
              <span className="h-1 w-1 rounded-full bg-[#4e66b3] animate-pulse lg:h-1.5 lg:w-1.5" />
              <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-[#4e66b3]">{content['about_excellence_badge'] || 'Committed to Excellence'}</span>
            </div>

            {/* Heading — responsive sizes */}
            <h2 className="text-lg sm:text-xl lg:text-[2.1rem] font-extrabold text-gray-900 leading-[1.2] mb-3 sm:mb-4 lg:mb-5 tracking-tight">
              {content['about_section_heading']}
            </h2>

            {/* Body text — ultra-compact */}
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-snug mb-1">
              {content['about_body_1']}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-snug mb-2 sm:mb-3 lg:mb-4">
              {content['about_body_2']}
            </p>

            {/* Divider — ultra-compact */}
            <div className="w-6 sm:w-8 lg:w-10 h-0.5 sm:h-0.75 lg:h-1 bg-[#4e66b3] rounded-full mb-2 sm:mb-2.5 lg:mb-4" />

            {/* Why Us heading — ultra-compact */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 mb-2 lg:mb-3">
              <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-[#4e66b3]/10 flex items-center justify-center">
                <ShieldCheck className="h-3 sm:h-3.5 lg:h-4 w-3 sm:w-3.5 lg:w-4 text-[#4e66b3]" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm sm:text-base lg:text-base">{content['about_whyus_heading']}</h4>
            </div>

            {/* Checklist — ultra-compact spacing */}
            <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2 mb-2 sm:mb-3 lg:mb-6">
              {whyUsItems.map((pt: string, i: number) => (
                <li key={pt} ref={reveal(i * 40)} className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 group">
                  <div className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 rounded-full bg-[#4e66b3] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-2.5 sm:h-3 lg:h-3 w-2.5 sm:w-3 lg:w-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-xs sm:text-sm lg:text-sm font-medium leading-snug">{pt}</span>
                </li>
              ))}
            </ul>

            {/* Action row — compact */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-[#4e66b3] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-sm font-bold text-white hover:bg-[#3a4f99] transition-all shadow-lg shadow-[#4e66b3]/25 hover:scale-[1.02] active:scale-95"
              >
                <PhoneCall className="h-3 sm:h-4 w-3 sm:w-4" /> Contact Us
              </Link>
              <a
                href={content['google_maps_url'] || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl border-2 border-gray-200 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-sm font-bold text-gray-700 hover:border-[#4e66b3]/30 hover:text-[#4e66b3] transition-all"
              >
                <MapPin className="h-3 sm:h-4 w-3 sm:w-4" /> Find Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Two-tone background split */}
        <div className="absolute inset-0 bg-[#3a4f99]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#4e66b3]/30 clip-diagonal pointer-events-none" />
        <div className="pointer-events-none absolute -top-16 right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div ref={reveal()} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{content['about_page_badge']}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {content['about_cta_title']}
              </h3>
              <p className="text-white/50 mt-2 text-sm max-w-md">
                {content['about_cta_subtitle']}
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 lg:py-3.5 rounded-xl sm:rounded-2xl text-sm font-bold text-[#4e66b3] bg-white hover:bg-gray-50 transition-all shadow-2xl hover:scale-[1.03] active:scale-95"
            >
              {content['about_cta_btn'] || 'Get in Touch'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
