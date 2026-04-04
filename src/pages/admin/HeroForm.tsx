import { ImageUpload } from '@/components/ImageUpload'
import { Images, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

export function HeroForm({
  onSubmit,
  editSlide,
}: {
  onSubmit: (data: { imageUrl: string; alt: string; order: number; id?: number }) => void | Promise<void>
  editSlide?: { id: number; imageUrl: string; alt: string; order: number } | null
}) {
  const [imageUrl, setImageUrl] = useState(editSlide?.imageUrl || '')
  const [imageUploading, setImageUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (imageUploading) return
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await onSubmit({
      imageUrl,
      alt: (fd.get('alt') as string) || 'Hero slide',
      order: parseInt((fd.get('order') as string) || '0'),
      ...(editSlide ? { id: editSlide.id } : {}),
    })
    setSaving(false)
    // Clear form after adding (not when editing)
    if (!editSlide) {
      setImageUrl('')
      formRef.current?.reset()
    }
  }

  const disabled = saving || imageUploading

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <ImageUpload
        name="imageUrl"
        defaultValue={editSlide?.imageUrl || ''}
        placeholder="Slide image URL or upload"
        folder="uploads"
        onChange={setImageUrl}
        onUploadingChange={setImageUploading}
      />
      <div className="flex gap-3 flex-wrap sm:flex-nowrap">
        <input
          name="alt"
          defaultValue={editSlide?.alt || ''}
          placeholder="Alt text / description"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors"
        />
        <input
          name="order"
          type="number"
          defaultValue={editSlide?.order ?? 0}
          placeholder="Order"
          className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors shrink-0"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50"
        >
          {imageUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
          ) : saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {editSlide ? 'Updating…' : 'Adding…'}</>
          ) : (
            <><Images className="w-4 h-4" /> {editSlide ? 'Update Slide' : 'Add Slide'}</>
          )}
        </button>
        {editSlide && (
          <Link to="/admin/hero" className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
