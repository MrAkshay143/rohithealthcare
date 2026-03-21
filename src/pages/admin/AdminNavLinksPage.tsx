import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, GripVertical, Eye, EyeOff,
  ExternalLink, Monitor, Smartphone, ChevronUp, ChevronDown,
  X, Check, Link2, Save, AlertTriangle, RefreshCw,
} from 'lucide-react'
import { api } from '@/services/api'
import { toast as globalToast } from '@/components/Toast'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavLink {
  id: number
  type: 'navbar' | 'footer'
  label: string
  url: string
  order: number
  is_visible: boolean
  open_new_tab: boolean
  desktop_visible: boolean
  mobile_visible: boolean
}

type TabType = 'navbar' | 'footer'

interface LinkForm {
  label: string
  url: string
  is_visible: boolean
  open_new_tab: boolean
  desktop_visible: boolean
  mobile_visible: boolean
}

const EMPTY_FORM: LinkForm = {
  label: '',
  url: '',
  is_visible: true,
  open_new_tab: false,
  desktop_visible: true,
  mobile_visible: true,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  icon?: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-xs text-gray-600 group-hover:text-gray-800">{label}</span>
    </label>
  )
}

// ─── Delete Confirm Inline ─────────────────────────────────────────────────

function DeleteConfirm({ onConfirm }: { onConfirm: () => void }) {
  const [asked, setAsked] = useState(false)
  if (!asked) {
    return (
      <button
        onClick={() => setAsked(true)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )
  }
  return (
    <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1 animate-in fade-in">
      <span className="text-xs text-red-600 font-medium">Delete?</span>
      <button
        onClick={onConfirm}
        className="p-0.5 rounded text-red-600 hover:bg-red-100 transition-colors"
        title="Confirm delete"
      >
        <Check className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setAsked(false)}
        className="p-0.5 rounded text-gray-400 hover:bg-gray-100 transition-colors"
        title="Cancel"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminNavLinksPage() {
  const [tab, setTab] = useState<TabType>('navbar')
  const [links, setLinks] = useState<NavLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<LinkForm>({ ...EMPTY_FORM })
  const [formErrors, setFormErrors] = useState<Partial<LinkForm>>({})
  const [dragOver, setDragOver] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // ── Data ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<NavLink[]>('/admin/nav-links')
      setLinks(data)
    } catch {
      showToast('Failed to load navigation links', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') globalToast.success(msg)
    else globalToast.error(msg)
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const navbarLinks = links.filter(l => l.type === 'navbar').sort((a, b) => a.order - b.order || a.id - b.id)
  const footerLinks = links.filter(l => l.type === 'footer').sort((a, b) => a.order - b.order || a.id - b.id)
  const sorted = tab === 'navbar' ? navbarLinks : footerLinks

  // ── Form helpers ─────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setFormErrors({})
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
  }

  const openEdit = (link: NavLink) => {
    setEditingId(link.id)
    setForm({
      label: link.label,
      url: link.url,
      is_visible: link.is_visible,
      open_new_tab: link.open_new_tab,
      desktop_visible: link.desktop_visible,
      mobile_visible: link.mobile_visible,
    })
    setFormErrors({})
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setFormErrors({})
  }

  const validate = (): boolean => {
    const errs: Partial<LinkForm> = {}
    if (!form.label.trim()) (errs as any).label = 'Label is required'
    if (!form.url.trim()) (errs as any).url = 'URL is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId !== null) {
        const updated = await api.put<NavLink>(`/nav-links/${editingId}`, form)
        setLinks(prev => prev.map(l => l.id === editingId ? updated : l))
        showToast('Link updated successfully')
      } else {
        const created = await api.post<NavLink>('/nav-links', { ...form, type: tab })
        setLinks(prev => [...prev, created])
        showToast('Link added successfully')
      }
      closeForm()
    } catch {
      showToast('Failed to save — check fields and try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Link actions ─────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/nav-links/${id}`)
      setLinks(prev => prev.filter(l => l.id !== id))
      showToast('Link deleted')
      if (editingId === id) closeForm()
    } catch {
      showToast('Failed to delete link', 'error')
    }
  }

  const toggleField = async (link: NavLink, field: keyof NavLink) => {
    try {
      const updated = await api.put<NavLink>(`/nav-links/${link.id}`, { [field]: !(link[field] as boolean) })
      setLinks(prev => prev.map(l => l.id === link.id ? updated : l))
    } catch {
      showToast('Failed to update', 'error')
    }
  }

  // ── Reorder helpers ──────────────────────────────────────────────────────

  const sendReorder = async (items: NavLink[]) => {
    const payload = items.map((l, i) => ({ id: l.id, order: i + 1 }))
    await api.put('/nav-links/reorder', { items: payload })
    setLinks(prev => {
      const other = prev.filter(l => l.type !== tab)
      const updated = items.map((l, i) => ({ ...l, order: i + 1 }))
      return [...other, ...updated]
    })
  }

  const moveItem = async (link: NavLink, dir: 'up' | 'down') => {
    const list = sorted.slice()
    const idx = list.findIndex(l => l.id === link.id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= list.length) return
    ;[list[idx], list[swapIdx]] = [list[swapIdx], list[idx]]
    try {
      await sendReorder(list)
    } catch {
      showToast('Failed to reorder', 'error')
    }
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragItem.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(idx)
  }

  const handleDrop = async (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    setDragOver(null)
    if (dragItem.current === null || dragItem.current === toIdx) {
      dragItem.current = null
      return
    }
    const list = sorted.slice()
    const [moved] = list.splice(dragItem.current, 1)
    list.splice(toIdx, 0, moved)
    dragItem.current = null
    try {
      await sendReorder(list)
    } catch {
      showToast('Failed to reorder', 'error')
    }
  }

  const handleDragLeave = () => setDragOver(null)
  const handleDragEnd = () => { dragItem.current = null; setDragOver(null) }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Navigation Manager</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Dynamically manage navbar and footer links — add, edit, reorder, or remove any link
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {(['navbar', 'footer'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); closeForm() }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'navbar' ? '🔗 Navbar' : '📋 Footer'}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              tab === t ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {t === 'navbar' ? navbarLinks.length : footerLinks.length}
            </span>
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className={`rounded-xl border px-4 py-3 text-xs text-gray-600 flex items-start gap-2.5 ${
        tab === 'navbar' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'
      }`}>
        <span className="text-lg leading-none mt-0.5">{tab === 'navbar' ? '🖥️' : '📌'}</span>
        {tab === 'navbar' ? (
          <span>
            Navbar links support <strong>Desktop</strong> and <strong>Mobile</strong> visibility toggles.
            Drag rows or use arrows to reorder. Hidden links won't appear on the site.
          </span>
        ) : (
          <span>
            Footer quick-links appear in the "Quick Links" column of the footer.
            Toggle visibility and use drag-to-reorder. Use <strong>Open in new tab</strong> for external URLs.
          </span>
        )}
      </div>

      {/* Link list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <Link2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {tab} links yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Link" to create your first one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((link, idx) => {
            const isEditing = editingId === link.id && showForm
            return (
              <div
                key={link.id}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                className={`relative group flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-default ${
                  isEditing
                    ? 'border-emerald-400 bg-emerald-50/60 shadow-sm'
                    : dragOver === idx
                    ? 'border-emerald-300 bg-emerald-50 scale-[1.01]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                } ${!link.is_visible ? 'opacity-60' : ''}`}
              >
                {/* Drag Handle */}
                <div
                  className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Order badge */}
                <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm truncate ${!link.is_visible ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {link.label}
                    </span>
                    {link.open_new_tab && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center gap-0.5 shrink-0">
                        <ExternalLink className="w-2.5 h-2.5" /> new tab
                      </span>
                    )}
                    {tab === 'navbar' && (
                      <>
                        {!link.desktop_visible && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium flex items-center gap-0.5 shrink-0">
                            <Monitor className="w-2.5 h-2.5" /> hidden
                          </span>
                        )}
                        {!link.mobile_visible && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium flex items-center gap-0.5 shrink-0">
                            <Smartphone className="w-2.5 h-2.5" /> hidden
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-400 truncate max-w-xs font-mono">{link.url}</span>
                  </div>
                </div>

                {/* Quick action: visibility */}
                <button
                  onClick={() => toggleField(link, 'is_visible')}
                  className={`p-1.5 rounded-lg transition-all shrink-0 ${
                    link.is_visible
                      ? 'text-emerald-500 hover:bg-emerald-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={link.is_visible ? 'Click to hide' : 'Click to show'}
                >
                  {link.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Up/Down */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveItem(link, 'up')}
                    disabled={idx === 0}
                    className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(link, 'down')}
                    disabled={idx === sorted.length - 1}
                    className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Edit */}
                <button
                  onClick={() => isEditing ? closeForm() : openEdit(link)}
                  className={`p-1.5 rounded-lg transition-all shrink-0 ${
                    isEditing
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={isEditing ? 'Close editor' : 'Edit link'}
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </button>

                {/* Delete */}
                <DeleteConfirm onConfirm={() => handleDelete(link.id)} />
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div ref={formRef} className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              {editingId !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="font-semibold text-sm">
                {editingId !== null ? 'Edit Link' : `Add New ${tab === 'navbar' ? 'Navbar' : 'Footer'} Link`}
              </span>
            </div>
            <button onClick={closeForm} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Label + URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  Link Label <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. Home, About Us, Services"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
                    (formErrors as any).label ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {(formErrors as any).label && (
                  <p className="text-xs text-red-500">{(formErrors as any).label}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  URL / Path <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="e.g. /about  or  https://..."
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-mono ${
                    (formErrors as any).url ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {(formErrors as any).url && (
                  <p className="text-xs text-red-500">{(formErrors as any).url}</p>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Visibility & Options</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Toggle
                  checked={form.is_visible}
                  onChange={v => setForm(f => ({ ...f, is_visible: v }))}
                  icon={form.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  label="Visible on site"
                />

                <Toggle
                  checked={form.open_new_tab}
                  onChange={v => setForm(f => ({ ...f, open_new_tab: v }))}
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  label="Open in new tab"
                />

                {tab === 'navbar' && (
                  <>
                    <Toggle
                      checked={form.desktop_visible}
                      onChange={v => setForm(f => ({ ...f, desktop_visible: v }))}
                      icon={<Monitor className="w-3.5 h-3.5" />}
                      label="Show on desktop"
                    />
                    <Toggle
                      checked={form.mobile_visible}
                      onChange={v => setForm(f => ({ ...f, mobile_visible: v }))}
                      icon={<Smartphone className="w-3.5 h-3.5" />}
                      label="Show on mobile"
                    />
                  </>
                )}
              </div>
            </div>

            {/* URL preview */}
            {form.url && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-mono truncate">{form.url}</span>
                {form.open_new_tab && <ExternalLink className="w-3 h-3 text-blue-400 shrink-0 ml-auto" />}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving…' : editingId !== null ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tips</p>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-px">•</span>
            Use internal paths like <code className="bg-gray-200 px-1 rounded">/about</code> or full URLs like <code className="bg-gray-200 px-1 rounded">https://example.com</code>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-px">•</span>
            Drag rows or use the <strong>↑↓ arrows</strong> to change the order in which links appear
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-px">•</span>
            Click the <Eye className="w-3 h-3 inline" /> eye icon to quickly show/hide a link without deleting it
          </li>
          {tab === 'navbar' && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-px">•</span>
              Per-link <Monitor className="w-3 h-3 inline" /> desktop and <Smartphone className="w-3 h-3 inline" /> mobile toggles let you control where each link is shown
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
