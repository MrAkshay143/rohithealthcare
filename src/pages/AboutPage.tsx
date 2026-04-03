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
        <div className="absolute inset-0 opacity-10 bg-[url('/images/bg-diagnostic.jpg')] bg-cover bg-center" />
        <div ref={reveal()} className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-2">
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-7 lg:py-10">
        <div className="grid lg:grid-cols-[5fr_6fr] gap-2.5 sm:gap-6 lg:gap-10 items-start">

          {/* LEFT — building image */}
          <div ref={reveal()} className="order-1 lg:sticky lg:top-24">
            {/* Mobile/Tablet: image — no bg, edges fade on left, right, bottom */}
            <div className="lg:hidden w-full flex justify-center pb-4 sm:pb-6 relative">
              <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-[#4e66b3]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 right-10 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl pointer-events-none" />
              <img
                loading="lazy"
                src="/uploads/clinic_building_transparent.png"
                alt={`${content['site_name'] || 'Clinic'} Building`}
                className="w-full max-w-xs sm:max-w-sm h-auto block object-contain object-bottom relative z-10 drop-shadow-xl"
                style={{ maxHeight: '320px' }}
              />
            </div>

            {/* Desktop: no bg container, edges fade on left, right, bottom */}
            <div className="hidden lg:flex relative flex-col items-center justify-end pb-0"
              style={{ minHeight: '400px' }}>
              <div className="absolute inset-[3px] rounded-[1.8rem] bg-gray-50 flex flex-col justify-end items-center overflow-hidden">
                <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-[#4e66b3]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 right-10 w-48 h-48 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
              </div>
              <div className="relative w-full overflow-hidden flex items-end justify-center" style={{ minHeight: '400px', height: '100%' }}>
                <img
                  loading="lazy"
                  src="/uploads/clinic_building_transparent.png"
                  alt={`${content['site_name'] || 'Clinic'} Building`}
                  className="w-full block max-w-sm sm:max-w-md lg:max-w-lg mx-auto object-contain object-bottom"
                  style={{ maxHeight: '480px', height: '100%' }}
                />
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
            <h2 className="text-[1.35rem] sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-[1.2] mb-3 sm:mb-4 lg:mb-6 tracking-tight">
              {content['about_section_heading']}
            </h2>

            {/* Body text — breathable but tight enough */}
            <p className="text-gray-600 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed mb-3 sm:mb-4">
              {content['about_body_1']}
            </p>
            <p className="text-gray-500 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed mb-5 sm:mb-6 lg:mb-8">
              {content['about_body_2']}
            </p>

            {/* Divider */}
            <div className="w-10 sm:w-12 lg:w-16 h-1 sm:h-1.5 bg-[#3a4f99] rounded-full mb-5 sm:mb-6 lg:mb-8" />

            {/* Why Us heading */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5 mb-3 sm:mb-4 lg:mb-5">
              <div className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-[#3a4f99]/10 flex items-center justify-center">
                <ShieldCheck className="h-3.5 sm:h-4 lg:h-5 w-3.5 sm:w-4 lg:w-5 text-[#3a4f99]" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-base sm:text-lg lg:text-lg tracking-tight">{content['about_whyus_heading']}</h4>
            </div>

            {/* Checklist — tighter spacing */}
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-8 lg:mb-10">
              {whyUsItems.map((pt: string, i: number) => (
                <li key={pt} ref={reveal(i * 40)} className="flex items-start gap-3 sm:gap-4 lg:gap-4 group">
                  <div className="mt-1 h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 rounded-full bg-[#3a4f99] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-2.5 sm:h-3 lg:h-3 w-2.5 sm:w-3 lg:w-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base lg:text-base font-medium leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            {/* Action row — tightened */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#3a4f99] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-white hover:bg-[#2e407d] transition-all shadow-lg shadow-[#3a4f99]/20 hover:scale-[1.02] active:scale-95"
              >
                <PhoneCall className="h-4 w-4 text-white/90" /> Contact Us
              </Link>
              <a
                href={content['google_maps_url'] || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-gray-700 hover:border-[#3a4f99]/30 hover:text-[#3a4f99] transition-all hover:bg-gray-50"
              >
                <MapPin className="h-4 w-4 text-gray-400 group-hover:text-[#3a4f99]" /> Find Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Two-tone background split */}
        <div className="absolute inset-0 bg-[#3a4f99]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black/10 clip-diagonal pointer-events-none" />
        <div className="pointer-events-none absolute -top-16 right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div ref={reveal()} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
          <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center lg:justify-between gap-5 sm:gap-6 lg:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2">{content['about_page_badge']}</p>
              <h3 className="text-[1.35rem] sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {content['about_cta_title']}
              </h3>
              <p className="text-white/50 mt-1.5 sm:mt-2 text-[13px] sm:text-sm max-w-md mx-auto sm:mx-0">
                {content['about_cta_subtitle']}
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm font-bold text-[#3a4f99] bg-white hover:bg-gray-50 transition-all shadow-lg hover:scale-[1.02] active:scale-95 mt-2 sm:mt-4 lg:mt-0"
            >
              {content['about_cta_btn'] || 'Get in Touch'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
