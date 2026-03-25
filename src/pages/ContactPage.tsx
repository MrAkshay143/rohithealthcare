import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactPage() {
  const content = useContent();
  useSEO('contact');
  const reveal = useScrollReveal();
  const phone = content['contact_phone'] || '';
  const phoneDisplay = content['contact_phone_display'] || '';
  const whatsapp = content['contact_whatsapp'] || '';
  const email = content['contact_email'] || '';
  const address = content['contact_address'] || '';
  const hoursWeekday = content['contact_hours_weekday'] || '';
  const hoursSunday = content['contact_hours_sunday'] || '';

  return (
    <div className="bg-gray-50 pb-10 sm:pb-16">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div ref={reveal()} className="relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-2">
            {content['contact_page_badge']}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {content['contact_page_heading']}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-4xl mx-auto">
            {content['contact_page_subtext']}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left info column (2/5) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick action buttons */}
            <div ref={reveal()} className="grid grid-cols-2 gap-3">
              <a href={`tel:+${phone}`}
                className="flex items-center gap-2.5 rounded-xl bg-brand-green px-3 py-2.5 text-white hover:bg-brand-green-dark transition-colors shadow-md shadow-brand-green/20">
                <Phone className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">{content['contact_btn_call'] || 'Call Now'}</span>
                  <span className="text-[10px] opacity-80 truncate block">{phoneDisplay}</span>
                </div>
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-white hover:bg-[#1da851] transition-colors shadow-md shadow-green-500/20">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">{content['contact_btn_whatsapp'] || 'WhatsApp'}</span>
                  <span className="text-[10px] opacity-80 truncate block">{content['contact_whatsapp_sub'] || 'Chat instantly'}</span>
                </div>
              </a>
            </div>

            {/* Info cards */}
            <div ref={reveal(100)} className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              <div className="flex items-start gap-4 p-4">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{content['contact_visit_label'] || 'Visit Our Clinic'}</p>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-brand-green-light flex items-center justify-center">
                  <Mail className="h-4 w-4 text-brand-green" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{content['contact_email_label'] || 'Email Us'}</p>
                  <a href={`mailto:${email}`} className="mt-1 block text-xs text-brand-green hover:text-brand-green-dark">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{content['contact_hours_label'] || 'Operating Hours'}</p>
                  <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                    <p>{hoursWeekday}</p>
                    <p>{hoursSunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div ref={reveal(200)} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48 sm:h-56">
              <iframe
                src={content['google_maps_embed'] || ''}
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
              />
            </div>
          </div>

          {/* Right form column (3/5) */}
          <div ref={reveal()} className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
