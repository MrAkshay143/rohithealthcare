import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, AlertTriangle } from 'lucide-react'
import { api } from '@/services/api'

export function ImageUpload({
  name,
  defaultValue = '',
  placeholder = 'Image URL or upload',
  onChange,
  folder = 'uploads',
  customFilename,
  onUploadingChange,
}: {
  name: string
  defaultValue?: string
  placeholder?: string
  onChange?: (url: string) => void
  /** Sub-folder inside storage/app/public/ e.g. "doctors", "uploads" */
  folder?: string
  /** Optional base filename (without extension). Gets slugified on the server. */
  customFilename?: string
  /** Notifies parent when an upload is in progress so it can disable submit */
  onUploadingChange?: (busy: boolean) => void
}) {
  const [url, setUrl] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [dlError, setDlError] = useState(false)
  const [preview, setPreview] = useState(defaultValue)
  const fileRef = useRef<HTMLInputElement>(null)

  const busy = uploading || downloading

  // Notify parent whenever busy state changes
  useEffect(() => {
    onUploadingChange?.(busy)
  }, [busy]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleFile(file: File) {
    setUploading(true)
    setDlError(false)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      if (customFilename) fd.append('customFilename', customFilename)
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

  async function downloadExternalUrl(rawUrl: string) {
    if (!rawUrl) return
    // Skip if already local (relative path or our own backend storage/uploads)
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) return
    if (rawUrl.includes('/backend/uploads/') || rawUrl.includes('/backend/storage/')) return

    setDownloading(true)
    setDlError(false)
    try {
      const data = await api.post<{ url: string }>('/upload/from-url', {
        url: rawUrl,
        folder,
        ...(customFilename ? { customFilename } : {}),
      })
      setUrl(data.url)
      setPreview(data.url)
      onChange?.(data.url)
    } catch {
      setDlError(true)
    } finally {
      setDownloading(false)
    }
  }

  function handleUrlChange(val: string) {
    setUrl(val)
    setPreview(val)
    setDlError(false)
    onChange?.(val)
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={() => downloadExternalUrl(url)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); downloadExternalUrl(url) } }}
            placeholder={placeholder}
            disabled={busy}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors disabled:opacity-60 pr-24"
          />
          {downloading && (
            <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 text-[#4e66b3] text-[11px] font-medium pointer-events-none">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving…
            </div>
          )}
          {dlError && !downloading && (
            <div className="absolute inset-y-0 right-3 flex items-center" title="Could not save image to server — URL kept as-is">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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
            e.target.value = ''
          }}
        />
      </div>
      {dlError && (
        <p className="text-[11px] text-amber-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          Could not save image to server — the original URL is kept. Check the URL is publicly accessible.
        </p>
      )}
      {preview && (
        <div className="relative inline-block">
          <img loading="lazy"
            src={preview}
            alt="Preview"
            className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={() => { setUrl(''); setPreview(''); setDlError(false); onChange?.('') }}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
