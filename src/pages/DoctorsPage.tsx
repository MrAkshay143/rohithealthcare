import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { api } from "@/services/api";
import { DoctorCard } from "@/components/DoctorCard";

export default function DoctorsPage() {
  const content = useContent();
  useSEO('doctors');
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/doctors?orderBy=order&orderDir=asc').then(setDoctors).catch(() => {});
  }, []);

  const phone = content['contact_phone'] ?? '';
  const whatsapp = content['contact_whatsapp'] ?? '';

  return (
    <div>
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-8 sm:py-12 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 pb-16">
        {doctors.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{content['doctors_empty_text'] ?? 'No doctors found. Add some from the admin panel.'}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 sm:gap-6">
            {doctors.map((doc, i) => (
              <DoctorCard key={doc.id} doc={doc} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gray-900 p-7 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            {content['doctors_cta_heading']}
          </h2>
          <p className="text-gray-400 mb-5 text-sm max-w-xl mx-auto">
            {content['doctors_cta_subtext']}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:+${phone}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark transition-colors"
            >
              <PhoneCall className="h-4 w-4" /> {content['doctors_cta_btn_call'] ?? 'Call Now'}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> {content['doctors_cta_btn_whatsapp'] ?? 'WhatsApp'}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {content['doctors_cta_btn_message'] ?? 'Send a Message'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
