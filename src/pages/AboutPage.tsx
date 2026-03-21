import { CheckCircle, ShieldCheck, Microscope, Award, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useMemo } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const HL_ICONS = [ShieldCheck, Award, Microscope, Users, Clock];
const HL_STYLES = [
  { color: "text-brand-green", bg: "bg-brand-green-light" },
  { color: "text-brand-red",   bg: "bg-brand-red-light"   },
  { color: "text-blue-600",    bg: "bg-blue-50"           },
  { color: "text-purple-600",  bg: "bg-purple-50"         },
  { color: "text-rose-500",    bg: "bg-rose-50"           },
];

export default function AboutPage() {
  const content = useContent();
  useSEO('about');

  const highlights = useMemo(() =>
    [1,2,3,4,5].map(n => ({
      icon: HL_ICONS[n-1],
      label: content[`about_hl_${n}_label`] ?? '',
      desc: content[`about_hl_${n}_desc`] ?? '',
      ...HL_STYLES[n-1],
    }))
  , [content]);

  const whyUsItems = useMemo(() =>
    (content['about_whyus_items'] || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  , [content]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-brand-green py-8 sm:py-12 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url('${content['about_hero_bg'] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80'}')` }} />
        <div className="relative max-w-3xl mx-auto">
          <ScrollReveal animation="fade-up" staggerIndex={0}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
              {content['about_page_badge']}
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" staggerIndex={1}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {content['about_page_heading']}
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" staggerIndex={2}>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-4xl mx-auto">
              {content['about_page_subtext']}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Highlights strip */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <ScrollReveal key={h.label} animation="fade-up" staggerIndex={i}>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`h-10 w-10 rounded-xl ${h.bg} flex items-center justify-center mb-2`}>
                    <Icon className={`h-5 w-5 ${h.color}`} />
                  </div>
                  <p className="font-bold text-gray-900 text-xs">{h.label}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{h.desc}</p>
                </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <ScrollReveal animation="fade-right">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">{content['about_excellence_badge'] ?? 'Committed to Excellence'}</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
              {content['about_section_heading']}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {content['about_body_1']}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              {content['about_body_2']}
            </p>
            <div className="rounded-2xl border-l-4 border-brand-green bg-brand-green-light p-5">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">{content['about_whyus_heading']}</h4>
              <ul className="space-y-2">
                {whyUsItems.map((pt: string) => (
                  <li key={pt} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckCircle className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal animation="fade-left">
          <div className="relative">
            <div className="aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={content['about_image'] || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=900'}
                alt="Medical laboratory"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <span className="text-2xl font-extrabold text-brand-green block">{content['years_experience'] || '10+'}</span>
              <span className="text-xs text-gray-500">{content['about_years_label'] || 'Years serving the community'}</span>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 py-10 sm:py-14 text-center px-4">
        <ScrollReveal animation="fade-up" staggerIndex={0}>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {content['about_cta_title']}
          </h3>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" staggerIndex={1}>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            {content['about_cta_subtitle']}
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" staggerIndex={2}>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-red hover:bg-brand-red-dark transition-colors shadow-lg"
        >
          {content['about_cta_btn'] ?? 'Get in Touch'}
        </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
