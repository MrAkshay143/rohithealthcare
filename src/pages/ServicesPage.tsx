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
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div ref={reveal()} className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
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
              <div key={svc.title} ref={reveal((i % 4) * 100)} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${svc.bg} flex items-center justify-center ${svc.hoverBg} transition-colors duration-200`}>
                    <Icon className={`h-6 w-6 ${svc.color} group-hover:text-white transition-colors duration-200`} />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{svc.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed grow">{svc.desc}</p>
              </div>
            );
          })}
        </div>
        )}

        {/* CTA */}
        <div ref={reveal()} className="mt-10 sm:mt-12 lg:mt-16 rounded-[2rem] bg-gray-900 px-6 py-8 sm:px-10 sm:py-10 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#4e66b3]/10 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10 relative z-10">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{content['services_cta_heading']}</h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-md mx-auto sm:mx-0 leading-relaxed">{content['services_cta_subtext']}</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <a href={`tel:+${phone}`}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-red-dark transition-colors shadow">
                <PhoneCall className="h-4 sm:h-5 w-4 sm:w-5" /> {content['services_cta_btn_call'] || 'Call Now'}
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1da851] transition-colors shadow">
                <MessageCircle className="h-4 sm:h-5 w-4 sm:w-5" /> {content['services_cta_btn_whatsapp'] || 'WhatsApp'}
              </a>
              <Link to="/contact"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 backdrop-blur-md transition-colors">
                {content['services_cta_btn_book'] || 'Book Appointment'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
