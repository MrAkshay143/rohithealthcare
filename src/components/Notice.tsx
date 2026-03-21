import { CheckCircle2, XCircle } from "lucide-react";

export function Notice({ success, error }: { success?: string | null; error?: string | null }) {
  if (success) return (
    <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-2.5 rounded-xl">
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{success}
    </div>
  );
  if (error) return (
    <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2.5 rounded-xl">
      <XCircle className="w-4 h-4 text-red-600 shrink-0" />{error}
    </div>
  );
  return null;
}
