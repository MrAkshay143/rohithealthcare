import { useEffect, useState, useCallback } from "react";
import {
  Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Save, X,
  Activity, Droplet, TestTube, Microscope, HeartPulse, Stethoscope,
  Heart, Brain, Bone, Baby, Pill, Syringe, Thermometer, Scan,
  Cross, ShieldPlus, Zap, Ear, Eye as EyeIcon,
  Dna, Radiation, Bandage, CircleDot, Sparkles, Waves,
  Flame, Wind, Dot, Gauge, Beaker,
  Briefcase,
} from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/components/Toast";

type Service = {
  id: number; title: string; description: string; icon: string;
  order: number; visible: boolean;
};

const HEALTH_ICONS: { name: string; Icon: any }[] = [
  { name: 'Activity', Icon: Activity },
  { name: 'Droplet', Icon: Droplet },
  { name: 'TestTube', Icon: TestTube },
  { name: 'Microscope', Icon: Microscope },
  { name: 'HeartPulse', Icon: HeartPulse },
  { name: 'Stethoscope', Icon: Stethoscope },
  { name: 'Heart', Icon: Heart },
  { name: 'Brain', Icon: Brain },
  { name: 'Bone', Icon: Bone },
  { name: 'Baby', Icon: Baby },
  { name: 'Pill', Icon: Pill },
  { name: 'Syringe', Icon: Syringe },
  { name: 'Thermometer', Icon: Thermometer },
  { name: 'Scan', Icon: Scan },
  { name: 'Cross', Icon: Cross },
  { name: 'ShieldPlus', Icon: ShieldPlus },
  { name: 'Zap', Icon: Zap },
  { name: 'Ear', Icon: Ear },
  { name: 'Eye', Icon: EyeIcon },
  { name: 'Dna', Icon: Dna },
  { name: 'Radiation', Icon: Radiation },
  { name: 'Bandage', Icon: Bandage },
  { name: 'CircleDot', Icon: CircleDot },
  { name: 'Sparkles', Icon: Sparkles },
  { name: 'Waves', Icon: Waves },
  { name: 'Flame', Icon: Flame },
  { name: 'Wind', Icon: Wind },
  { name: 'Gauge', Icon: Gauge },
  { name: 'Beaker', Icon: Beaker },
  { name: 'Briefcase', Icon: Briefcase },
];

function getIconComponent(name: string) {
  return HEALTH_ICONS.find(i => i.name === name)?.Icon ?? Activity;
}

const CARD_STYLES = [
  { color: "text-[#015851]", bg: "bg-[#015851]/10" },
  { color: "text-rose-600", bg: "bg-rose-50" },
  { color: "text-blue-600", bg: "bg-blue-50" },
  { color: "text-purple-600", bg: "bg-purple-50" },
  { color: "text-emerald-600", bg: "bg-emerald-50" },
  { color: "text-amber-600", bg: "bg-amber-50" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [visible, setVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const load = useCallback(() => {
    api.get<Service[]>('/services/all').then(setServices).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { document.title = 'Services | Admin'; }, []);

  function resetForm() {
    setTitle(''); setDescription(''); setIcon('Activity'); setVisible(true);
    setEditId(null); setFormOpen(false); setShowIconPicker(false);
  }

  function startEdit(svc: Service) {
    setTitle(svc.title);
    setDescription(svc.description);
    setIcon(svc.icon);
    setVisible(svc.visible);
    setEditId(svc.id);
    setFormOpen(true);
    setShowIconPicker(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/services/${editId}`, { title, description, icon, visible });
        toast.success('Service updated');
      } else {
        await api.post('/services', { title, description, icon, visible });
        toast.success('Service added');
      }
      resetForm();
      load();
    } catch {
      toast.error('Failed to save service');
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      if (editId === id) resetForm();
      load();
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function toggleVisible(svc: Service) {
    try {
      await api.put(`/services/${svc.id}`, { ...svc, visible: !svc.visible });
      load();
    } catch {}
  }

  async function moveService(id: number, dir: -1 | 1) {
    const idx = services.findIndex(s => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= services.length) return;
    const ids = services.map(s => s.id);
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    try {
      await api.post('/services/reorder', { ids });
      load();
    } catch {}
  }

  const SelectedIcon = getIconComponent(icon);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#015851] to-[#018a7e] flex items-center justify-center shrink-0 shadow-lg shadow-[#015851]/20">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Services</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage diagnostic services displayed on the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#015851]/10 text-[#015851] px-2.5 py-1.5 rounded-full font-bold">{services.filter(s => s.visible).length} active</span>
          <button
            onClick={() => { if (formOpen && !editId) { resetForm(); } else { resetForm(); setFormOpen(true); } }}
            className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#013f39] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        </div>
      </div>


      {/* Add/Edit Form */}
      {formOpen && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">
              {editId ? '✏️ Edit Service' : '+ New Service'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Clinical Pathology"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/20 focus:border-[#015851]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(v => !v)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:border-[#015851] transition-colors"
                  >
                    <SelectedIcon className="w-4 h-4 text-[#015851]" />
                    <span className="text-gray-700">{icon}</span>
                  </button>
                  {showIconPicker && (
                    <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                        {HEALTH_ICONS.map(({ name, Icon: Ic }) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => { setIcon(name); setShowIconPicker(false); }}
                            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                              icon === name ? 'bg-[#015851] text-white' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                            title={name}
                          >
                            <Ic className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of this service..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/20 focus:border-[#015851] resize-none"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} className="rounded" />
                <span className="font-medium text-gray-700">Visible on website</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#013f39] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : editId ? 'Update' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No services added yet. Click "Add Service" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((svc, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            const IconComp = getIconComponent(svc.icon);
            const isEditing = editId === svc.id;
            return (
              <div
                key={svc.id}
                className={`bg-white rounded-xl border shadow-sm p-3 sm:p-4 flex items-center gap-3 transition-all ${
                  isEditing ? 'border-[#015851] ring-2 ring-[#015851]/20' : 'border-gray-100'
                } ${!svc.visible ? 'opacity-50' : ''}`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveService(svc.id, -1)} disabled={i === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30 p-0.5">
                    <GripVertical className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button onClick={() => moveService(svc.id, 1)} disabled={i === services.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30 p-0.5">
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
                  <IconComp className={`w-5 h-5 ${style.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{svc.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{svc.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleVisible(svc)}
                    className={`p-1.5 rounded-lg transition-colors ${svc.visible ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`}
                    title={svc.visible ? 'Hide' : 'Show'}
                  >
                    {svc.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(svc)}
                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
