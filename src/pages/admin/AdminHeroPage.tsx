import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Trash2, Pencil, Images } from "lucide-react";
import { api } from "@/services/api";
import { HeroForm } from "./HeroForm";
import { toast } from "@/components/Toast";

export default function AdminHeroPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const editId = searchParams.get("edit") ? parseInt(searchParams.get("edit")!) : null;
  const editSlide = editId ? slides.find((s) => s.id === editId) : null;

  const loadSlides = useCallback(() => {
    api.get<any[]>('/hero-slides').then(setSlides).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Hero Slides | Admin'; }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  async function handleAdd(data: any) {
    try {
      await api.post('/hero-slides', data);
      toast.success('Slide added');
      loadSlides();
    } catch { toast.error('Failed to add slide'); }
  }

  async function handleUpdate(data: any) {
    try {
      await api.put(`/hero-slides/${data.id}`, data);
      toast.success('Slide updated');
      navigate('/admin/hero');
      loadSlides();
    } catch { toast.error('Failed to update slide'); }
  }

  async function handleDeleteSlide(id: number) {
    setDeleting(id);
    try {
      await api.delete(`/hero-slides/${id}`);
      toast.success('Slide deleted');
      loadSlides();
    } catch { toast.error('Failed to delete slide'); }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          <Images className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Hero Slides</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Images shown in the homepage hero section. They auto-rotate every 4.5 seconds.
          </p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold">
          {slides.length} slides
        </span>
      </div>



      {/* Add / Edit Slide */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          {editSlide ? '✏️ Editing Slide #' + (slides.indexOf(editSlide) + 1) : '+ Add Slide'}
        </h2>
        <HeroForm onSubmit={editSlide ? handleUpdate : handleAdd} editSlide={editSlide} key={editId ?? 'new'} />
      </div>

      {/* Slides grid */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <Images className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">No slides yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add image URLs above. If no slides are added, a default image will be shown.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide, i) => (
            <div key={slide.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${editId === slide.id ? 'border-[#015851] ring-2 ring-[#015851]/20' : 'border-gray-100'}`}>
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  #{i + 1}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{slide.alt || 'No alt text'}</p>
                  <p className="text-[11px] text-gray-400 truncate font-mono">{slide.imageUrl.slice(0, 45)}…</p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  <Link to={`/admin/hero?edit=${slide.id}`} className="p-1.5 text-gray-300 hover:text-[#015851] hover:bg-[#015851]/10 rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    disabled={deleting === slide.id}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>Tip:</strong> Use landscape images (16:9 ratio) for best results. Good sources: Unsplash, Pexels. Images auto-transition with a smooth fade effect.
      </div>
    </div>
  );
}
