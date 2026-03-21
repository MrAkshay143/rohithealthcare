import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Users, Search, UserPlus, Stethoscope, GraduationCap, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { api } from "@/services/api";
import { DoctorForm } from "./DoctorForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { toast } from "@/components/Toast";

export default function AdminDoctorsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const editId = searchParams.get("edit") ? parseInt(searchParams.get("edit")!) : null;
  const editDoctor = editId ? doctors.find((d) => d.id === editId) : null;

  const filtered = useMemo(() => {
    if (!search.trim()) return doctors;
    const q = search.toLowerCase();
    return doctors.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.specialty?.toLowerCase().includes(q) ||
      d.qualifications?.toLowerCase().includes(q)
    );
  }, [doctors, search]);

  const loadDoctors = useCallback(() => {
    api.get<any[]>('/doctors').then(setDoctors).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Doctors | Admin'; }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (editId) setFormOpen(true);
  }, [editId]);

  // ── Reorder helpers ──
  async function sendReorder(list: any[]) {
    const ids = list.map((d: any) => d.id);
    try {
      await api.post('/doctors/reorder', { ids });
      setDoctors(list);
    } catch { toast.error('Failed to reorder'); }
  }

  function handleDragStart(e: React.DragEvent, idx: number) {
    dragItem.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(idx);
  }
  async function handleDrop(e: React.DragEvent, toIdx: number) {
    e.preventDefault();
    setDragOver(null);
    if (dragItem.current === null || dragItem.current === toIdx) { dragItem.current = null; return; }
    const list = doctors.slice();
    const [moved] = list.splice(dragItem.current, 1);
    list.splice(toIdx, 0, moved);
    dragItem.current = null;
    await sendReorder(list);
  }
  function handleDragLeave() { setDragOver(null); }
  function handleDragEnd() { dragItem.current = null; setDragOver(null); }

  async function moveDoctor(idx: number, dir: 'up' | 'down') {
    const list = doctors.slice();
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    await sendReorder(list);
  }

  async function handleAdd(data: any) {
    try {
      await api.post('/doctors', data);
      toast.success('Doctor added successfully');
      setFormOpen(false);
      loadDoctors();
    } catch { toast.error('Failed to add doctor'); }
  }

  async function handleUpdate(data: any) {
    try {
      await api.put(`/doctors/${data.id}`, data);
      toast.success('Doctor updated successfully');
      navigate('/admin/doctors');
      loadDoctors();
    } catch { toast.error('Failed to update doctor'); }
  }

  async function handleDelete(fields: Record<string, string | number>) {
    try {
      await api.delete(`/doctors/${fields.id}`);
      toast.success('Doctor removed');
      loadDoctors();
    } catch { toast.error('Failed to delete doctor'); }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Doctors</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your clinic's doctor profiles displayed on the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold">{doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'}</span>
          <button
            onClick={() => { setFormOpen(!formOpen); if (editId) navigate('/admin/doctors'); }}
            className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#013f39] transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Collapsible Form */}
      {(formOpen || editDoctor) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => { setFormOpen(!formOpen); if (editId) navigate('/admin/doctors'); }}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${editDoctor ? 'bg-amber-50' : 'bg-green-50'}`}>
                {editDoctor ? <Pencil className="w-3.5 h-3.5 text-amber-500" /> : <UserPlus className="w-3.5 h-3.5 text-green-500" />}
              </div>
              <span className="text-sm font-bold text-gray-800">
                {editDoctor ? `Editing: ${editDoctor.name}` : 'Add New Doctor'}
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>
          <div className="px-5 py-4">
            <DoctorForm onSubmit={editDoctor ? handleUpdate : handleAdd} editDoctor={editDoctor} key={editId ?? 'new'} />
          </div>
        </div>
      )}

      {/* Search */}
      {doctors.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name, specialty, or qualifications..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-white transition-colors"
          />
          {search && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
              {filtered.length} found
            </span>
          )}
        </div>
      )}

      {/* Doctors List — Card Grid */}
      {filtered.length === 0 && doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No doctors added yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Add your first doctor profile. Their information will be displayed on the Doctors page of your website.</p>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#013f39] transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add First Doctor
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No doctors match "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, idx) => (
            <div
              key={doc.id}
              draggable={!search.trim()}
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              className={`group bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${editId === doc.id ? 'border-[#015851] ring-2 ring-[#015851]/20' : dragOver === idx ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-100'}`}
            >
              {/* Card Header with Avatar */}
              <div className="p-4 flex items-start gap-3">
                {!search.trim() && (
                  <div className="flex flex-col items-center gap-0.5 shrink-0 -ml-1 cursor-grab active:cursor-grabbing">
                    <button onClick={() => moveDoctor(idx, 'up')} disabled={idx === 0} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-30 transition-colors"><ChevronUp className="w-3 h-3" /></button>
                    <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                    <button onClick={() => moveDoctor(idx, 'down')} disabled={idx === filtered.length - 1} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-30 transition-colors"><ChevronDown className="w-3 h-3" /></button>
                  </div>
                )}
                {doc.imageUrl ? (
                  <img src={doc.imageUrl} alt={doc.name} className="h-14 w-14 rounded-xl object-cover shrink-0 border border-gray-100" />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-linear-to-br from-[#015851] to-[#018a7e] flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {doc.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#015851] font-medium mt-0.5">
                    <Stethoscope className="w-3 h-3 shrink-0" />
                    <span className="truncate">{doc.specialty || 'No specialty'}</span>
                  </div>
                  {doc.qualifications && (
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      <span className="truncate">{doc.qualifications}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Card Actions */}
              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 flex items-center justify-end gap-1">
                <Link to={`/admin/doctors?edit=${doc.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#015851] px-2.5 py-1.5 rounded-lg hover:bg-[#015851]/10 transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                <ConfirmDeleteButton
                  onDelete={handleDelete}
                  hiddenFields={{ id: doc.id }}
                  confirmText={`Delete Dr. ${doc.name}? This cannot be undone.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
