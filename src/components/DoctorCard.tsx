import { Stethoscope } from "lucide-react";
import { useContent } from "@/hooks/useContent";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  qualifications: string;
  imageUrl: string | null;
};

export function DoctorCard({ doc }: { doc: Doctor; index?: number }) {
  const content = useContent();
  const initials = doc.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 h-full overflow-hidden">
      {/* Top Section - Image or Initials */}
      <div className="shrink-0 flex justify-center pt-5 pb-4 bg-linear-to-b from-gray-50/50 to-white relative">
        {doc.imageUrl ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
            <img
              src={doc.imageUrl}
              alt={doc.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-50 flex items-center justify-center shadow-sm ring-1 ring-gray-100 text-[#015851]">
            <span className="text-xl sm:text-2xl font-bold tracking-wide">{initials}</span>
          </div>
        )}
      </div>

      {/* Bottom Section - Text Details */}
      <div className="flex-1 flex flex-col px-4 pb-5 min-w-0 text-center">
        {/* Name - Single Line */}
        <h3 className="text-[15px] sm:text-base font-bold text-gray-900 mb-1 truncate w-full" title={doc.name}>
          {doc.name}
        </h3>
        
        {/* Degree / Qualifications - Critical Fix: Single Line */}
        <p className="text-[13px] sm:text-sm font-semibold text-[#015851] truncate w-full mb-1" title={doc.qualifications}>
          {doc.qualifications || content['doctor_default_qual'] || 'MBBS'}
        </p>

        {/* Designation / Specialty - Single Line */}
        <p className="text-[11px] sm:text-xs font-medium text-gray-500 truncate w-full flex items-center justify-center gap-1" title={doc.specialty}>
          <Stethoscope className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="truncate">{doc.specialty}</span>
        </p>

        {/* Availability indicator */}
        <div className="mt-auto pt-4 flex w-full justify-center">
          <div className="border-t border-gray-50 w-full flex items-center justify-center gap-2 pt-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-wide font-semibold text-emerald-600 uppercase">
              {content['doctor_availability'] ?? 'Available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
