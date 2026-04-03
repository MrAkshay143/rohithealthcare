import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Camera, GripVertical, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { GalleryForm } from "./GalleryForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { toast } from "@/components/Toast";

export default function AdminGalleryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<any[]>([]);
  const [reordering, setReordering] = useState(false);

  // Drag state
  const dragId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const editId = searchParams.get("edit") ? parseInt(searchParams.get("edit")!) : null;
  const editPhoto = editId ? photos.find((p) => p.id === editId) : null;

  const loadPhotos = useCallback(() => {
    api.get<any[]>('/gallery').then(setPhotos).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Gallery | Admin'; }, []);
  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  async function handleAdd(data: any) {
    try {
      await api.post('/gallery', data);
      toast.success('Photo added');
      loadPhotos();
    } catch { toast.error('Failed to add photo'); }
  }

  async function handleUpdate(data: any) {
    try {
      await api.put(`/gallery/${data.id}`, data);
      toast.success('Photo updated');
      navigate('/admin/gallery');
      loadPhotos();
    } catch { toast.error('Failed to update photo'); }
  }

  async function handleDelete(fields: Record<string, string | number>) {
    try {
      await api.delete(`/gallery/${fields.id}`);
      toast.success('Photo deleted');
      loadPhotos();
    } catch { toast.error('Failed to delete photo'); }
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent, id: number) {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragId.current) setDragOverId(id);
  }

  function handleDrop(e: React.DragEvent, targetId: number) {
    e.preventDefault();
    const fromId = dragId.current;
    dragId.current = null;
    setDragOverId(null);
    if (!fromId || fromId === targetId) return;

    const from = photos.findIndex(p => p.id === fromId);
    const to   = photos.findIndex(p => p.id === targetId);
    if (from < 0 || to < 0) return;

    // Optimistic reorder
    const reordered = [...photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setPhotos(reordered);

    persistReorder(reordered);
  }

  function handleDragEnd() {
    dragId.current = null;
    setDragOverId(null);
  }

  async function persistReorder(ordered: any[]) {
    setReordering(true);
    try {
      await api.post('/gallery/reorder', { ids: ordered.map(p => p.id) });
    } catch {
      toast.error('Failed to save order');
      loadPhotos(); // revert
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Gallery</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage clinic photo gallery. Drag photos to reorder.</p>
        </div>
        <div className="flex items-center gap-2">
          {reordering && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#4e66b3] font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving order…
            </span>
          )}
          <span className="text-xs bg-violet-50 text-violet-600 px-3 py-1.5 rounded-full font-bold">{photos.length} photos</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          {editPhoto ? '✏️ Editing: ' + editPhoto.title : '+ Add Photo'}
        </h2>
        <GalleryForm onSubmit={editPhoto ? handleUpdate : handleAdd} editPhoto={editPhoto} key={editId || 'new'} />
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">No photos yet. Add the first one above.</p>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <GripVertical className="w-3.5 h-3.5" /> Drag photos to change the display order
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo.id)}
                onDragOver={(e) => handleDragOver(e, photo.id)}
                onDrop={(e) => handleDrop(e, photo.id)}
                onDragEnd={handleDragEnd}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm group select-none transition-all duration-150
                  ${editId === photo.id ? 'border-[#4e66b3] ring-2 ring-[#4e66b3]/20' : 'border-gray-100'}
                  ${dragOverId === photo.id ? 'ring-2 ring-violet-400 scale-[1.03] shadow-md' : ''}
                  cursor-grab active:cursor-grabbing`}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    loading="lazy"
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 pointer-events-none"
                  />
                  {/* Drag handle badge */}
                  <div className="absolute top-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="p-2 flex items-center justify-between gap-1">
                  <p className="text-xs font-medium truncate text-gray-700">{photo.title}</p>
                  <div className="flex gap-0.5 shrink-0">
                    <Link
                      to={`/admin/gallery?edit=${photo.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-300 hover:text-[#4e66b3] hover:bg-[#4e66b3]/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <ConfirmDeleteButton
                      onDelete={handleDelete}
                      hiddenFields={{ id: photo.id }}
                      confirmText={`Delete "${photo.title}"? This cannot be undone.`}
                      small
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
