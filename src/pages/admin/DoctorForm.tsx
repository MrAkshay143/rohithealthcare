import { ImageUpload } from '@/components/ImageUpload'
import { Plus, User, Stethoscope, GraduationCap, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-white transition-colors'

export function DoctorForm({
  onSubmit,
  editDoctor,
}: {
  onSubmit: (data: { name: string; specialty: string; qualifications: string; imageUrl: string | null; id?: number }) => void
  editDoctor?: { id: number; name: string; specialty: string; qualifications: string; imageUrl?: string | null } | null
}) {
  const [imageUrl, setImageUrl] = useState(editDoctor?.imageUrl ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await onSubmit({
      name: fd.get('name') as string,
      specialty: fd.get('specialty') as string,
      qualifications: fd.get('qualifications') as string,
      imageUrl: imageUrl || null,
      ...(editDoctor ? { id: editDoctor.id } : {}),
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
          </label>
          <input name="name" defaultValue={editDoctor?.name ?? ''} placeholder="Dr. Full Name" required className={INPUT} />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-gray-400" /> Specialty
          </label>
          <input name="specialty" defaultValue={editDoctor?.specialty ?? ''} placeholder="e.g. Cardiologist" required className={INPUT} />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Qualifications
          </label>
          <input name="qualifications" defaultValue={editDoctor?.qualifications ?? ''} placeholder="MBBS, MD, etc." required className={INPUT} />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          Doctor Photo
        </label>
        <ImageUpload name="imageUrl" defaultValue={editDoctor?.imageUrl ?? ''} placeholder="Doctor photo (optional)" onChange={setImageUrl} />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#013f39] transition-colors disabled:opacity-50 shadow-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {editDoctor ? (saving ? 'Updating…' : 'Update Doctor') : (saving ? 'Adding…' : 'Add Doctor')}
        </button>
        {editDoctor && (
          <Link to="/admin/doctors" className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
