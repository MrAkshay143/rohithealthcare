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
import { useMemo, useEffect, useState } from "react";
import { api } from "@/services/api";

const ICON_MAP: Record<string, any> = {
  Activity, Droplet, TestTube, Microscope, HeartPulse, Stethoscope,
  Heart, Brain, Bone, Baby, Pill, Syringe, Thermometer, Scan,
  Cross, ShieldPlus, Zap, Ear, Eye: EyeIcon, Dna, Radiation,
  Bandage, CircleDot, Sparkles, Waves, Flame, Wind, Gauge, Beaker, Briefcase,
};

const SVC_STYLES = [
  { color: "text-[#015851]",  bg: "bg-[#015851]/10",  hoverBg: "group-hover:bg-[#015851]" },
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
  const phone = content['contact_phone'] ?? '';
  const whatsapp = content['contact_whatsapp'] ?? '';
  const [apiServices, setApiServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    api.get<ServiceData[]>('/services').then(setApiServices).catch(() => {});
  }, []);

  const services = useMemo(() =>
    apiServices.map((svc, i) => ({
      ...SVC_STYLES[i % SVC_STYLES.length],
      icon: ICON_MAP[svc.icon] ?? Activity,
      title: svc.title,
      desc: svc.description,
    }))
  , [apiServices]);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-8 sm:py-12 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div key={svc.title} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full cursor-pointer">
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

        {/* CTA */}
        <div className="mt-8 sm:mt-14 rounded-2xl bg-gray-900 p-5 sm:p-8 text-center">
          <h2 className="text-lg sm:text-2xl font-extrabold text-white mb-1.5 sm:mb-2">
            {content['services_cta_heading']}
          </h2>
          <p className="text-gray-400 mb-4 sm:mb-5 text-xs sm:text-sm max-w-xl mx-auto">
            {content['services_cta_subtext']}
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <a
              href={`tel:+${phone}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-brand-red-dark transition-colors"
            >
              <PhoneCall className="h-4 w-4" /> {content['services_cta_btn_call'] ?? 'Call Now'}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> {content['services_cta_btn_whatsapp'] ?? 'WhatsApp'}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {content['services_cta_btn_book'] ?? 'Book Appointment'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
