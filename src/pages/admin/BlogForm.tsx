import { ImageUpload } from '@/components/ImageUpload'
import { Plus, Eye, EyeOff, Type, FileText, Loader2, Youtube, LinkIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors'

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export function BlogForm({
  onSubmit,
  editBlog,
}: {
  onSubmit: (data: { title: string; content: string; imageUrl: string; videoUrl: string; draft: boolean; id?: number }) => void | Promise<void>
  editBlog?: { id: number; title: string; content: string; imageUrl?: string; videoUrl?: string; draft?: boolean } | null
}) {
  const [draft, setDraft] = useState(editBlog?.draft || false)
  const [imageUrl, setImageUrl] = useState(editBlog?.imageUrl || '')
  const [videoUrl, setVideoUrl] = useState(editBlog?.videoUrl || '')
  const [saving, setSaving] = useState(false)
  const [resetKey, setResetKey] = useState(Date.now())

  useEffect(() => {
    setDraft(editBlog?.draft || false)
    setImageUrl(editBlog?.imageUrl || '')
    setVideoUrl(editBlog?.videoUrl || '')
    setResetKey(Date.now())
  }, [editBlog])

  function handleVideoUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value
    setVideoUrl(url)
    // Auto-populate cover image from YouTube thumbnail if not already set
    if (!imageUrl) {
      const videoId = extractYoutubeId(url)
      if (videoId) {
        setImageUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    await onSubmit({
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      imageUrl,
      videoUrl,
      draft,
      ...(editBlog ? { id: editBlog.id } : {}),
    })
    setSaving(false)
    if (!editBlog) {
      form.reset()
      setDraft(false)
      setImageUrl('')
      setVideoUrl('')
      setResetKey(Date.now())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          <Type className="w-3.5 h-3.5 text-gray-400" /> Post Title
        </label>
        <input name="title" defaultValue={editBlog?.title || ''} placeholder="Enter a compelling title..." required className={INPUT} />
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          <Youtube className="w-3.5 h-3.5 text-red-400" /> YouTube Video URL
          <span className="ml-1 text-[10px] font-normal normal-case text-gray-400">(optional)</span>
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            name="videoUrl"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={INPUT + ' pl-8'}
          />
        </div>
        {videoUrl && extractYoutubeId(videoUrl) && (
          <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            Video ID detected: {extractYoutubeId(videoUrl)}
          </p>
        )}
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-gray-400" /> Content
          <span className="ml-1 text-[10px] font-normal normal-case text-gray-400">(short description)</span>
        </label>
        <textarea name="content" defaultValue={editBlog?.content || ''} placeholder="Write a short description or summary..." required rows={4} className={INPUT + ' resize-none'} />
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          Cover Image
          <span className="ml-1 text-[10px] font-normal normal-case text-gray-400">(auto-filled from YouTube if blank)</span>
        </label>
        <ImageUpload key={resetKey} name="imageUrl" defaultValue={imageUrl || editBlog?.imageUrl || ''} placeholder="Blog cover image (optional)" onChange={setImageUrl} />
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setDraft(!draft)}
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all ${
            draft
              ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm shadow-amber-100'
              : 'border-green-300 bg-green-50 text-green-700 shadow-sm shadow-green-100'
          }`}
        >
          {draft ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {draft ? 'Save as Draft' : 'Publish Immediately'}
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50 shadow-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {editBlog ? (saving ? 'Updating…' : 'Update Post') : (saving ? 'Saving…' : (draft ? 'Save Draft' : 'Publish'))}
        </button>
        {editBlog && (
          <Link to="/admin/blogs" className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
