import { ImageUpload } from '@/components/ImageUpload'
import { Plus, User, Stethoscope, GraduationCap, Loader2, MoveHorizontal, MoveVertical } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors'

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN ?? ''

function resolvePreviewUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BACKEND_ORIGIN}${url}`
}

/** Parse "X% Y%" → [x, y] with fallback */
function parsePos(pos?: string | null): [number, number] {
  if (!pos) return [50, 30]
  const parts = pos.trim().split(/\s+/)
  const px = parseFloat(parts[0] ?? '50')
  const py = parseFloat(parts[1] ?? '30')
  return [isNaN(px) ? 50 : px, isNaN(py) ? 30 : py]
}

export function DoctorForm({
  onSubmit,
  editDoctor,
}: {
  onSubmit: (data: {
    name: string
    specialty: string
    qualifications: string
    imageUrl: string | null
    imagePosition: string
    id?: number
  }) => void | Promise<void>
  editDoctor?: {
    id: number
    name: string
    specialty: string
    qualifications: string
    imageUrl?: string | null
    imagePosition?: string | null
  } | null
}) {
  const [name, setName] = useState(editDoctor?.name ?? '')
  const [specialty, setSpecialty] = useState(editDoctor?.specialty ?? '')
  const [qualifications, setQualifications] = useState(editDoctor?.qualifications ?? '')
  const [imageUrl, setImageUrl] = useState(editDoctor?.imageUrl ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resetKey, setResetKey] = useState(Date.now())

  const initPos = parsePos(editDoctor?.imagePosition)
  const [posX, setPosX] = useState(initPos[0])
  const [posY, setPosY] = useState(initPos[1])
  const imagePosition = `${posX}% ${posY}%`

  const previewUrl = resolvePreviewUrl(imageUrl)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (imageUploading) return
    setSaving(true)
    const form = e.currentTarget
    await onSubmit({
      name,
      specialty,
      qualifications,
      imageUrl: imageUrl || null,
      imagePosition,
      ...(editDoctor ? { id: editDoctor.id } : {}),
    })
    setSaving(false)
    if (!editDoctor) {
      form.reset()
      setName('')
      setSpecialty('')
      setQualifications('')
      setImageUrl('')
      setPosX(50)
      setPosY(30)
      setResetKey(Date.now())
    }
  }

  const disabled = saving || imageUploading

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Row 1: Name / Specialty / Qualifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Full Name"
            required
            className={INPUT}
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-gray-400" /> Specialty
          </label>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. General Physician"
            required
            className={INPUT}
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Qualifications
          </label>
          <input
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="MBBS, MD, etc."
            required
            className={INPUT}
          />
        </div>
      </div>

      {/* Row 2: Photo Upload + Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Upload + position sliders */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Doctor Photo
          </label>
          <ImageUpload
            key={resetKey}
            name="imageUrl"
            defaultValue={editDoctor?.imageUrl ?? ''}
            placeholder="Photo URL or browse to upload"
            folder="doctors"
            customFilename={name || undefined}
            onChange={setImageUrl}
            onUploadingChange={setImageUploading}
          />

          {/* Position controls - only shown when an image is set */}
          {imageUrl && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2.5">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Adjust image crop / position
              </p>
              <div className="flex items-center gap-3">
                <MoveHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="range" min={0} max={100} value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="flex-1 h-1.5 accent-[#4e66b3] cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 w-8 text-right tabular-nums">{posX}%</span>
              </div>
              <div className="flex items-center gap-3">
                <MoveVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="range" min={0} max={100} value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="flex-1 h-1.5 accent-[#4e66b3] cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 w-8 text-right tabular-nums">{posY}%</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Drag sliders to frame the face correctly in the circular crop.
              </p>
            </div>
          )}
        </div>

        {/* Right: Live preview card */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Card preview
          </p>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-50 border border-gray-100 rounded-2xl shadow-sm bg-white overflow-hidden">
              {/* Photo area */}
              <div className="pt-5 pb-4 flex justify-center bg-linear-to-b from-gray-50/60 to-white">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-100">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={name || 'Doctor'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: imagePosition }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    /* Modern gradient avatar with initials */
                    <div className="w-full h-full bg-linear-to-br from-[#4e66b3] via-[#5c76c9] to-[#7c3aed] flex items-center justify-center">
                      <span className="text-white text-xl font-black tracking-tight leading-none select-none">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Text area */}
              <div className="px-3 pb-4 text-center">
                <p className="text-[13px] font-bold text-gray-900 truncate">{name || 'Doctor Name'}</p>
                <p className="text-[11px] font-semibold text-[#4e66b3] truncate mt-0.5">{qualifications || 'Qualifications'}</p>
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 mt-0.5 truncate">
                  <Stethoscope className="w-3 h-3 shrink-0" />
                  {specialty || 'Specialty'}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-center gap-1.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wide">Available</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2 max-w-50">
              Live preview — exactly how it appears on the website
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50 shadow-sm"
        >
          {imageUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading image…</>
          ) : saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {editDoctor ? 'Updating…' : 'Adding…'}</>
          ) : (
            <><Plus className="w-4 h-4" /> {editDoctor ? 'Update Doctor' : 'Add Doctor'}</>
          )}
        </button>
        {editDoctor && (
          <Link
            to="/admin/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
