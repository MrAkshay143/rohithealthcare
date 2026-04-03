import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { api } from "@/services/api";
import { DoctorCard } from "@/components/DoctorCard";

export default function DoctorsPage() {
  const content = useContent();
  useSEO('doctors');
  const reveal = useScrollReveal();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
api.get<any[]>('/doctors?orderBy=order&orderDir=asc').then(setDoctors).catch(() => setLoadError(true));
  }, []);

  const phone = content['contact_phone'] || '';
  const whatsapp = content['contact_whatsapp'] || '';

  return (
    <div>
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/bg-lab.jpg')] bg-cover bg-center" />
        <div ref={reveal()} className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-2">
            {content['doctors_page_badge']}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {content['doctors_page_heading']}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-4xl mx-auto">
            {content['doctors_page_subtext']}
          </p>
        </div>
      </div>

      {/* Doctors grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-10 sm:pb-16">
        {loadError ? (
          <p className="text-center text-red-500 py-16">Something went wrong loading doctors. Please try again later.</p>
        ) : doctors.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{content['doctors_empty_text'] || 'No doctors found. Add some from the admin panel.'}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 sm:gap-6">
            {doctors.map((doc, i) => (
              <div key={doc.id} ref={reveal((i % 4) * 100)}>
                <DoctorCard doc={doc} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div ref={reveal()} className="mt-6 sm:mt-10 lg:mt-12 rounded-2xl sm:rounded-[1.5rem] bg-gray-900 px-4 py-5 sm:px-8 sm:py-8 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#4e66b3]/10 to-transparent pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8 relative z-10">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">{content['doctors_cta_heading']}</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-sm mx-auto sm:mx-0 leading-relaxed">{content['doctors_cta_subtext']}</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start lg:justify-end gap-2.5 sm:gap-4 shrink-0 sm:w-auto mt-2 sm:mt-3 lg:mt-0">
              <a href={`tel:+${phone}`} className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-brand-red px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-bold text-white hover:bg-brand-red-dark transition-colors shadow">
                <PhoneCall className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['doctors_cta_btn_call'] || 'Call Now'}
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-bold text-white hover:bg-[#1da851] transition-colors shadow">
                <MessageCircle className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['doctors_cta_btn_whatsapp'] || 'WhatsApp'}
              </a>
              <Link to="/contact" className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-semibold text-white hover:bg-white/10 backdrop-blur-md transition-colors">
                {content['doctors_cta_btn_message'] || 'Send a Message'} <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
