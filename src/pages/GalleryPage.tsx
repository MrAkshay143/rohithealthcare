import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { api } from "@/services/api";
import { GalleryGrid } from "@/components/GalleryGrid";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function GalleryPage() {
  const content = useContent();
  useSEO('gallery');
  const reveal = useScrollReveal();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.get<any[]>('/gallery')
       .then(setPhotos)
       .catch(() => setLoadError(true))
       .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 pb-10 sm:pb-20 min-h-screen">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=60')] bg-cover bg-center" />
        <div ref={reveal()} className="relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-3">{content['gallery_page_badge'] || 'Our Facility & Events'}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{content['gallery_page_heading'] || 'Photo Gallery'}</h1>
          <p className="text-white/75 max-w-4xl mx-auto text-sm sm:text-base">
            {content['gallery_page_subtext'] || 'A glimpse into our modern diagnostics center and community health camps.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4e66b3] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-500 font-medium tracking-tight animate-pulse">Loading gallery...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-24">
            <p className="text-red-500 font-semibold">Something went wrong loading photos. Please try again later.</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content['gallery_empty_title'] || 'No photos yet'}</h3>
            <p className="text-gray-500 text-sm">{content['gallery_empty_subtext'] || 'Check back soon for updates from our events and facility.'}</p>
          </div>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </div>
  );
}
