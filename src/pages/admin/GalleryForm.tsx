import { ImageUpload } from '@/components/ImageUpload'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const INPUT = 'flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-white transition-colors'

export function GalleryForm({
  onSubmit,
  editPhoto,
}: {
  onSubmit: (data: { title: string; imageUrl: string; id?: number }) => void
  editPhoto?: { id: number; title: string; imageUrl: string } | null
}) {
  const [imageUrl, setImageUrl] = useState(editPhoto?.imageUrl ?? '')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      title: fd.get('title') as string,
      imageUrl,
      ...(editPhoto ? { id: editPhoto.id } : {}),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="title" defaultValue={editPhoto?.title ?? ''} placeholder="Image Title" required className={INPUT + ' w-full'} />
      <ImageUpload name="imageUrl" defaultValue={editPhoto?.imageUrl ?? ''} placeholder="Image URL or upload" onChange={setImageUrl} />
      <div className="flex gap-3 pt-1">
        <button type="submit" className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#013f39] transition-colors">
          <Plus className="w-4 h-4" /> {editPhoto ? 'Update' : 'Add'}
        </button>
        {editPhoto && (
          <Link to="/admin/gallery" className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
