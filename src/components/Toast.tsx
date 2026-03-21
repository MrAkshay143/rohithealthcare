import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastItem = { id: number; type: "success" | "error"; message: string };

let _addToast: ((type: "success" | "error", message: string) => void) | null = null;

/** Call from anywhere: toast.success("Saved!") or toast.error("Failed") */
export const toast = {
  success: (msg: string) => _addToast?.("success", msg),
  error: (msg: string) => _addToast?.("error", msg),
};

const DURATION = 3200;

function playSound(type: "success" | "error") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.08;

    if (type === "success") {
      osc.frequency.value = 880;
      osc.type = "sine";
      osc.start();
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.frequency.value = 330;
      osc.type = "triangle";
      osc.start();
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {}
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    _addToast = (type, message) => {
      const id = ++counter.current;
      playSound(type);
      setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), DURATION);
    };
    return () => { _addToast = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 pl-3.5 pr-2 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-slide-in-right min-w-56 max-w-80 ${
            t.type === "success"
              ? "bg-white border border-emerald-200 text-emerald-800"
              : "bg-white border border-red-200 text-red-800"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span className="flex-1 text-[13px]">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="p-0.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
