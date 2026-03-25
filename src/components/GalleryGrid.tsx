import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Photo = { id: number; imageUrl: string; title: string };

export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const reveal = useScrollReveal();

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() =>
    setSelected(n => (n !== null ? (n > 0 ? n - 1 : photos.length - 1) : null)), [photos.length]);
  const next = useCallback(() =>
    setSelected(n => (n !== null ? (n < photos.length - 1 ? n + 1 : 0) : null)), [photos.length]);

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            ref={reveal((i % 4) * 100)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            onClick={() => setSelected(i)}
          >
            <img loading="lazy"
              src={photo.imageUrl}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Persistent bottom title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/75 via-black/35 to-transparent pt-8 pb-3 px-3 pointer-events-none">
              <p className="text-white font-semibold text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow">{photo.title}</p>
            </div>
            {/* Hover zoom hint */}
            <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ZoomIn className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white hover:bg-white/15 p-2.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white hover:bg-white/15 p-2.5 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white hover:bg-white/15 p-2.5 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div
            className="relative max-w-5xl w-full mx-auto flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img loading="lazy"
              src={photos[selected].imageUrl}
              alt={photos[selected].title}
              className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-sm sm:text-base">{photos[selected].title}</p>
              <p className="text-white/40 text-xs mt-1">{selected + 1} / {photos.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
