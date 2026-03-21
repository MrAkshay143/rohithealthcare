import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { api } from '@/services/api'

export function ImageUpload({
  name,
  defaultValue = '',
  placeholder = 'Image URL or upload',
  onChange,
}: {
  name: string
  defaultValue?: string
  placeholder?: string
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

  function handleUrlChange(val: string) {
    setUrl(val)
    setPreview(val)
    onChange?.(val)
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-white transition-colors"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Browse
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={() => { setUrl(''); setPreview(''); onChange?.('') }}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
