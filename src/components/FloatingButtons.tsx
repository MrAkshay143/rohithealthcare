import { Phone, MessageCircle } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { isTrueValue } from "@/services/content";

export function FloatingButtons() {
  const content = useContent();
  const phoneNumber = `+${content['floating_phone_number'] || content['contact_phone'] || ''}`;
  const whatsappNumber = content['floating_whatsapp_number'] || content['contact_whatsapp'] || '';
  const showWhatsapp = isTrueValue(content['floating_whatsapp_visible']);
  const showPhone = isTrueValue(content['floating_phone_visible']);

  if (!showWhatsapp && !showPhone) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 flex flex-col gap-4">
      {showWhatsapp && (
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group relative flex items-center justify-end w-12 sm:w-28 h-12 rounded-full sm:bg-[#25D366]/20 transition-transform hover:-translate-y-1 pointer-events-auto sm:shadow-[0_4px_12px_rgba(37,211,102,0.15)]"
      >
        <div className="absolute right-0 h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_15px_rgba(37,211,102,0.6)]">
          <MessageCircle className="h-5 w-5 text-white shrink-0" strokeWidth={2.5} />
        </div>
      </a>
      )}

      {showPhone && (
      <a
        href={`tel:${phoneNumber}`}
        aria-label="Call"
        className="group relative flex items-center justify-end w-12 sm:w-28 h-12 rounded-full sm:bg-[#10b981]/20 transition-transform hover:-translate-y-1 pointer-events-auto sm:shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
      >
        <div className="absolute right-0 h-12 w-12 rounded-full bg-[#10b981] flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.6)]">
          <Phone className="h-5 w-5 text-white shrink-0" strokeWidth={2.5} />
        </div>
      </a>
      )}
    </div>
  );
}
