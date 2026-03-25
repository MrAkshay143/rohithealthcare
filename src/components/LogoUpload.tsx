import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { api } from '@/services/api'

export function LogoUpload({
  name,
  defaultValue = '',
  onChange,
}: {
  name: string
  defaultValue?: string
  onChange?: (url: string) => void
}) {
  const [url, setUrl] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(defaultValue)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await api.post<{ url: string }>('/upload', fd)
      setUrl(data.url)
      setPreview(data.url)
      onChange?.(data.url)
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img loading="lazy" src={preview} alt="Logo" className="h-14 w-auto bg-white rounded-lg border border-gray-200 p-1" onError={() => setPreview('')} />
            <button type="button" onClick={() => { setUrl(''); setPreview(''); onChange?.('') }}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="h-14 w-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            <Upload className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload PNG Logo
          </button>
          <p className="text-[11px] text-gray-400">Recommended: transparent PNG, max 5MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/svg+xml" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>
    </div>
  )
}
