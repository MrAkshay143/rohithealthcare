import { Activity, Droplet, TestTube, Microscope, HeartPulse, Stethoscope, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PhoneCall, MessageCircle, ArrowRight } from "lucide-react";
import {
  Heart, Brain, Bone, Baby, Pill, Syringe, Thermometer, Scan,
  Cross, ShieldPlus, Zap, Ear, Eye as EyeIcon,
  Dna, Radiation, Bandage, CircleDot, Sparkles, Waves,
  Flame, Wind, Gauge, Beaker, Briefcase,
} from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMemo, useEffect, useState } from "react";
import { api } from "@/services/api";

const ICON_MAP: Record<string, any> = {
  Activity, Droplet, TestTube, Microscope, HeartPulse, Stethoscope,
  Heart, Brain, Bone, Baby, Pill, Syringe, Thermometer, Scan,
  Cross, ShieldPlus, Zap, Ear, Eye: EyeIcon, Dna, Radiation,
  Bandage, CircleDot, Sparkles, Waves, Flame, Wind, Gauge, Beaker, Briefcase,
};

const SVC_STYLES = [
  { color: "text-[#4e66b3]",  bg: "bg-[#4e66b3]/10",  hoverBg: "group-hover:bg-[#4e66b3]" },
  { color: "text-rose-600",   bg: "bg-rose-50",       hoverBg: "group-hover:bg-rose-600" },
  { color: "text-blue-600",   bg: "bg-blue-50",       hoverBg: "group-hover:bg-blue-600" },
  { color: "text-purple-600", bg: "bg-purple-50",     hoverBg: "group-hover:bg-purple-600" },
  { color: "text-emerald-600",bg: "bg-emerald-50",    hoverBg: "group-hover:bg-emerald-600" },
  { color: "text-amber-600",  bg: "bg-amber-50",      hoverBg: "group-hover:bg-amber-600" },
];

type ServiceData = { id: number; title: string; description: string; icon: string };

export default function ServicesPage() {
  const content = useContent();
  useSEO('services');
  const reveal = useScrollReveal();
  const phone = content['contact_phone'] || '';
  const whatsapp = content['contact_whatsapp'] || '';
  const [apiServices, setApiServices] = useState<ServiceData[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api.get<ServiceData[]>('/services').then(setApiServices).catch(() => setLoadError(true));
  }, []);

  const services = useMemo(() =>
    apiServices.map((svc, i) => ({
      ...SVC_STYLES[i % SVC_STYLES.length],
      icon: ICON_MAP[svc.icon] || Activity,
      title: svc.title,
      desc: svc.description,
    }))
  , [apiServices]);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/bg-diagnostic.jpg')] bg-cover bg-center" />
        <div ref={reveal()} className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-2">
            {content['services_page_badge']}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {content['services_page_heading']}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-4xl mx-auto">
            {content['services_page_subtext']}
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {loadError ? (
          <p className="text-center text-red-500 py-16">Something went wrong loading services. Please try again later.</p>
        ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={svc.title} ref={reveal((i % 4) * 100)} className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500 opacity-50" />
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${svc.bg} flex items-center justify-center ${svc.hoverBg} transition-colors duration-200 shadow-sm`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${svc.color} group-hover:text-white transition-colors duration-200`} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#4e66b3]/10 transition-colors duration-200">
                    <ChevronRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-gray-300 group-hover:text-[#4e66b3] transition-colors duration-200" />
                  </div>
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1.5 text-[15px] sm:text-[17px] tracking-tight">{svc.title}</h3>
                <p className="text-[13px] sm:text-sm text-gray-500 leading-[1.6] grow">{svc.desc}</p>
              </div>
            );
          })}
        </div>
        )}

        {/* CTA */}
        <div ref={reveal()} className="mt-6 sm:mt-10 lg:mt-12 rounded-2xl sm:rounded-[1.5rem] bg-gray-900 px-4 py-5 sm:px-8 sm:py-8 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#4e66b3]/10 to-transparent pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8 relative z-10">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">{content['services_cta_heading']}</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-sm mx-auto sm:mx-0 leading-relaxed">{content['services_cta_subtext']}</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start lg:justify-end gap-2.5 sm:gap-4 shrink-0 sm:w-auto mt-2 sm:mt-3 lg:mt-0">
              <a href={`tel:+${phone}`}
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-brand-red px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-bold text-white hover:bg-brand-red-dark transition-colors shadow">
                <PhoneCall className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['services_cta_btn_call'] || 'Call Now'}
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-bold text-white hover:bg-[#1da851] transition-colors shadow">
                <MessageCircle className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['services_cta_btn_whatsapp'] || 'WhatsApp'}
              </a>
              <Link to="/contact"
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-semibold text-white hover:bg-white/10 backdrop-blur-md transition-colors">
                {content['services_cta_btn_book'] || 'Book Appointment'} <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
