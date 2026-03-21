import { useState, useRef, useEffect } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'

export function ConfirmDeleteButton({
  onDelete,
  hiddenFields,
  label = 'Delete',
  confirmText = 'Are you sure you want to delete this? This action cannot be undone.',
  small = false,
}: {
  onDelete: (fields: Record<string, string | number>) => void | Promise<void>
  hiddenFields: Record<string, string | number>
  label?: string
  confirmText?: string
  small?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [open])

  const btnClass = small
    ? 'p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
    : 'p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(hiddenFields)
    } finally {
      setDeleting(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnClass} title={label}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          onClose={() => setOpen(false)}
          className="fixed inset-0 z-50 m-auto w-[90vw] max-w-sm rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl backdrop:bg-black/40"
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{confirmText}</p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
