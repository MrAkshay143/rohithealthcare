import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Save, Settings2, LayoutTemplate, MessageSquare,
  Phone, Info, Users, Briefcase, FileText, CheckCircle2,
  Globe, TrendingUp, Monitor, Smartphone, Upload, Check,
  Navigation, PanelBottom, MousePointerClick, BookOpen, Camera,
  Stethoscope, AlertCircle, RotateCcw, AlertTriangle
} from "lucide-react";
import { api } from "@/services/api";
import { CONTENT_DEFAULTS, isToggleField } from "@/services/content";
import { toast as globalToast } from "@/components/Toast";

/* -- Types --------------------------------------------------- */
type PageKey = 'General' | 'Home' | 'About' | 'Services' | 'Doctors' | 'Contact' | 'Blogs' | 'Gallery' | 'NotFound';

/* -- Config --------------------------------------------------- */
const PAGE_CONFIG: Record<PageKey, { label: string; sections: string[] }> = {
  General:  { label: 'General',     sections: ['General', 'Navbar', 'Footer', 'Floating Buttons'] },
  Home:     { label: 'Home Page',   sections: ['Hero Section', 'Stats Strip', 'Home Services', 'Home Why Us', 'Home Team', 'Home Blog', 'CTA Section'] },
  About:    { label: 'About Page',  sections: ['About Page', 'About Highlights', 'About Why Us'] },
  Services: { label: 'Services',    sections: ['Services Page', 'Services CTA'] },
  Doctors:  { label: 'Doctors',     sections: ['Doctors Page', 'Doctor Card'] },
  Contact:  { label: 'Contact',     sections: ['Contact Info', 'Contact Page', 'Contact Form'] },
  Blogs:    { label: 'Blogs',       sections: ['Blogs Page'] },
  Gallery:  { label: 'Gallery',     sections: ['Gallery Page'] },
  NotFound: { label: '404 Page',    sections: ['404 Page'] },
};
const PAGE_ORDER: PageKey[] = ['General', 'Home', 'About', 'Services', 'Doctors', 'Contact', 'Blogs', 'Gallery', 'NotFound'];

function getPageIcon(key: PageKey) {
  const map: Record<PageKey, any> = {
    General: Globe, Home: LayoutTemplate, About: Info, Services: Briefcase,
    Doctors: Users, Contact: Phone, Blogs: BookOpen, Gallery: Camera, NotFound: AlertTriangle,
  };
  return map[key] || FileText;
}
function getSectionIcon(name: string) {
  if (name === 'General') return Settings2;
  if (name === 'Navbar') return Navigation;
  if (name === 'Footer') return PanelBottom;
  if (name === 'Floating Buttons') return MousePointerClick;
  if (name.includes('Hero')) return LayoutTemplate;
  if (name.includes('Stats')) return TrendingUp;
  if (name.includes('Service') || name.includes('Card')) return Briefcase;
  if (name.includes('CTA')) return MessageSquare;
  if (name.includes('Contact') || name.includes('Form')) return Phone;
  if (name.includes('About') || name.includes('Highlight') || name.includes('Why')) return Info;
  if (name.includes('Doctor')) return Stethoscope;
  if (name.includes('Team')) return Users;
  if (name.includes('Blog')) return BookOpen;
  if (name.includes('Gallery')) return Camera;
  if (name.includes('404')) return AlertCircle;
  return FileText;
}

const isPillField = (key: string, label: string) =>
  CONTENT_DEFAULTS[key]?.type === 'pills' || key.toLowerCase().includes('pill') || label.toLowerCase().includes('comma-separated');
const isImageField = (key: string) => CONTENT_DEFAULTS[key]?.type === 'image';

/* -- Icon Checkbox (Desktop / Mobile) ------------------------ */
function IconCheckbox({ checked, onChange, icon }: { checked: boolean; onChange: (v: boolean) => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-1 group"
      title={checked ? 'Visible' : 'Hidden'}
    >
      <span className={`transition-colors duration-150 ${checked ? 'text-brand-green' : 'text-gray-400 group-hover:text-gray-500'}`}>
        {icon}
      </span>
      <span className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
        checked
          ? 'bg-brand-green border-brand-green'
          : 'bg-white border-gray-300 group-hover:border-gray-400'
      }`}>
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

/* -- Pill Preview --------------------------------------------- */
function PillsPreview({ value }: { value: string }) {
  const pills = value.split(',').map(p => p.trim()).filter(Boolean);
  if (!pills.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {pills.map((pill, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[11px] font-semibold px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3 h-3 shrink-0" />{pill}
        </span>
      ))}
    </div>
  );
}

/* -- Image Field with URL + Upload ---------------------------- */
function ImageField({ fieldKey, currentValue, onUploaded }: { fieldKey: string; currentValue: string; onUploaded: (key: string, url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<{ url: string }>('/upload', formData);
      const url = res.url;
      // Update the text input
      const textInput = document.getElementById(fieldKey) as HTMLInputElement;
      if (textInput) textInput.value = url;
      setPreviewUrl(url);
      onUploaded(fieldKey, url);
    } catch {
      // Upload failed silently
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          id={fieldKey} name={fieldKey} type="text" defaultValue={currentValue}
          onChange={e => setPreviewUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
          placeholder="https://example.com/image.jpg"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-900 hover:bg-brand-green text-white rounded-lg transition-all disabled:opacity-50 shrink-0"
        >
          {uploading
            ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Upload className="w-3 h-3" />}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {previewUrl && (
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-h-24">
          <img loading="lazy" src={previewUrl} alt="Preview" className="w-full h-24 object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

/* -- Main Page ------------------------------------------------ */
export default function AdminContentPage() {
  const [dbMap, setDbMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activePage, setActivePage] = useState<PageKey>('General');
  const [activeSection, setActiveSection] = useState<string>('');
  const [pillValues, setPillValues] = useState<Record<string, string>>({});
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({});
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resetBtnRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const items = await api.get<Array<{ key: string; value: string }>>('/content/list');
      const map: Record<string, string> = {};
      items.forEach(item => { map[item.key] = item.value; });
      setDbMap(map);
      setToggleValues({});
      setUploadedImages({});
    } catch { /* use defaults */ }
    setLoading(false);
  }, []);

  useEffect(() => { document.title = 'Site Content | Admin'; }, []);

  useEffect(() => { loadContent(); }, [loadContent]);

  useEffect(() => {
    if (!showResetDialog) return;
    function handler(e: MouseEvent) {
      if (resetBtnRef.current && !resetBtnRef.current.contains(e.target as Node)) {
        setShowResetDialog(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showResetDialog]);

  const groups = useMemo(() => {
    const acc: Record<string, Array<{ key: string; label: string; currentValue: string; isTextarea: boolean; isToggle: boolean; isImage: boolean; isPills: boolean }>> = {};
    for (const [key, meta] of Object.entries(CONTENT_DEFAULTS)) {
      if (!acc[meta.group]) acc[meta.group] = [];
      const currentValue = dbMap[key] || meta.value;
      const toggle = isToggleField(key);
      acc[meta.group].push({
        key, label: meta.label, currentValue,
        isTextarea: !toggle && (currentValue.length > 80 || currentValue.includes('\n')),
        isToggle: toggle,
        isImage: isImageField(key),
        isPills: isPillField(key, meta.label),
      });
    }
    return acc;
  }, [dbMap]);

  // Reset scroll + active section when page tab changes
  useEffect(() => {
    setActiveSection(PAGE_CONFIG[activePage].sections[0] || '');
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    // Auto-scroll page tabs to show active tab
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector('[data-active-tab="true"]') as HTMLElement | null;
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activePage]);

  // Auto-scroll TOC to show active section
  useEffect(() => {
    if (tocRef.current) {
      const activeBtn = tocRef.current.querySelector('[data-active-section="true"]') as HTMLElement | null;
      if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    observerRef.current?.disconnect();
    if (!scrollRef.current) return;
    observerRef.current = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        const sec = visible[0].target.getAttribute('data-section');
        if (sec) setActiveSection(sec);
      }
    }, { root: scrollRef.current, threshold: 0.15, rootMargin: '-5% 0px -70% 0px' });

    PAGE_CONFIG[activePage].sections.forEach(name => {
      const el = sectionRefs.current[name];
      if (el) observerRef.current!.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [activePage, groups]);

  const scrollToSection = useCallback((name: string) => {
    const el = sectionRefs.current[name];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    }
    setActiveSection(name);
  }, []);

  // Handle toggle changes in local state
  const handleToggleChange = useCallback((key: string, val: boolean) => {
    setToggleValues(prev => ({ ...prev, [key]: val }));
  }, []);

  // Handle image upload callback
  const handleImageUploaded = useCallback((key: string, url: string) => {
    setUploadedImages(prev => ({ ...prev, [key]: url }));
  }, []);

  // -- Save ALL changed fields at once -------------------------
  async function handleSaveAll() {
    setSaving(true);
    try {
      const changedItems: Array<{ key: string; value: string }> = [];

      // Collect from all form inputs across all visible sections
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        for (const [key, meta] of Object.entries(CONTENT_DEFAULTS)) {
          if (isToggleField(key)) continue; // handled separately
          if (isImageField(key)) continue; // handled separately
          const formVal = formData.get(key) as string | null;
          if (formVal === null) continue;
          const currentDb = dbMap[key] || meta.value;
          if (formVal !== currentDb) {
            changedItems.push({ key, value: formVal });
          }
        }
      }

      // Collect toggle changes
      for (const [key, val] of Object.entries(toggleValues)) {
        const currentDb = dbMap[key] || CONTENT_DEFAULTS[key]?.value;
        const newVal = String(val);
        if (newVal !== currentDb) {
          changedItems.push({ key, value: newVal });
        }
      }

      // Collect uploaded image changes
      for (const [key, url] of Object.entries(uploadedImages)) {
        const currentDb = dbMap[key] || CONTENT_DEFAULTS[key]?.value;
        if (url !== currentDb) {
          changedItems.push({ key, value: url });
        }
      }

      // Also check image URL text inputs that were manually typed
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        for (const [key] of Object.entries(CONTENT_DEFAULTS)) {
          if (!isImageField(key)) continue;
          if (uploadedImages[key]) continue; // already handled
          const formVal = formData.get(key) as string | null;
          if (formVal === null) continue;
          const currentDb = dbMap[key] || CONTENT_DEFAULTS[key].value;
          if (formVal !== currentDb) {
            changedItems.push({ key, value: formVal });
          }
        }
      }

      if (changedItems.length === 0) {
        globalToast.success('No changes to save.');
        setSaving(false);
        return;
      }

      await api.post('/content/bulk', { items: changedItems });
      globalToast.success(`${changedItems.length} field${changedItems.length !== 1 ? 's' : ''} saved successfully.`);
      await loadContent();
      window.dispatchEvent(new CustomEvent('content-updated'));
    } catch {
      globalToast.error('Failed to save. Please try again.');
    }
    setSaving(false);
  }

  // -- Reset ALL content to defaults ---------------------------
  async function handleResetAll() {
    setShowResetDialog(false);
    setResetting(true);
    try {
      await api.post('/content/reset', {});
      globalToast.success('All content has been reset to defaults.');
      setToggleValues({});
      setPillValues({});
      setUploadedImages({});
      await loadContent();
      window.dispatchEvent(new CustomEvent('content-updated'));
    } catch {
      globalToast.error('Failed to reset. Please try again.');
    }
    setResetting(false);
  }

  const currentSections = PAGE_CONFIG[activePage].sections.filter(s => groups[s]?.length > 0);

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)] min-h-150">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4 mb-4 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900">Site Content</h1>
            <p className="text-xs text-gray-500 hidden sm:block mt-0.5">Manage all text content across the website.</p>
          </div>
          <div className="flex items-center gap-2 relative ml-auto" ref={resetBtnRef}>
            <button
              type="button"
              onClick={() => setShowResetDialog(v => !v)}
              disabled={resetting || saving}
              className="inline-flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {resetting
                ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                : <RotateCcw className="w-3.5 h-3.5" />}
              {resetting ? 'Resetting...' : 'Reset All'}
            </button>
            {showResetDialog && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl border border-red-100 shadow-xl shadow-red-500/10 z-50 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Reset All Content?</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">This will revert all fields to their default values. This cannot be undone.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetDialog(false)}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || resetting}
              className="inline-flex items-center gap-1.5 bg-[#4e66b3] hover:bg-[#3a4f99] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {saving
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Top Page Tabs */}
        <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 custom-scrollbar mb-4">
          {PAGE_ORDER.map(pageKey => {
            const cfg = PAGE_CONFIG[pageKey];
            const PageIcon = getPageIcon(pageKey);
            const isActive = activePage === pageKey;
            return (
              <button
                key={pageKey}
                data-active-tab={isActive ? 'true' : undefined}
                onClick={() => setActivePage(pageKey)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-green text-white shadow-md shadow-brand-green/25'
                    : 'bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <PageIcon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{cfg.label}</span>
                {isActive && (
                  <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {currentSections.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body - Left TOC + Right content */}
        <div className="flex gap-4 flex-1 min-h-0">

          {/* Left Section TOC (desktop only) */}
          <div ref={tocRef} className="hidden lg:flex w-52 shrink-0 flex-col gap-0.5 custom-scrollbar overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
              {PAGE_CONFIG[activePage].label}
            </p>
            {currentSections.map(name => {
              const SectionIcon = getSectionIcon(name);
              const isActive = activeSection === name;
              const count = groups[name]?.length || 0;
              return (
                <button
                  key={name}
                  data-active-section={isActive ? 'true' : undefined}
                  onClick={() => scrollToSection(name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-brand-green/10 text-brand-green border border-brand-green/25'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-1 h-4 rounded-full shrink-0 transition-all ${isActive ? 'bg-brand-green' : 'bg-gray-200 group-hover:bg-gray-300'}`} />
                    <SectionIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-green' : 'text-gray-400'}`} />
                    <span className="truncate">{name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${isActive ? 'bg-brand-green/15 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right scrollable content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-0.5">

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
              </div>
            )}

            {/* Mobile section quick-jump */}
            {!loading && currentSections.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden custom-scrollbar">
                {currentSections.map(name => {
                  const isActive = activeSection === name;
                  return (
                    <button
                      key={name}
                      onClick={() => scrollToSection(name)}
                      className={`shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-all ${
                        isActive ? 'bg-brand-green text-white' : 'bg-white border border-gray-100 text-gray-500'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Single form wrapping all sections */}
            <form ref={formRef} onSubmit={e => { e.preventDefault(); handleSaveAll(); }}>
              {!loading && currentSections.map(sectionName => {
                const items = groups[sectionName] || [];
                const SectionIcon = getSectionIcon(sectionName);
                return (
                  <div
                    key={sectionName}
                    ref={el => { sectionRefs.current[sectionName] = el; }}
                    data-section={sectionName}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4"
                  >
                    {/* Section header */}
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50/70 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-brand-green/10 rounded-lg">
                          <SectionIcon className="w-3.5 h-3.5 text-brand-green" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{sectionName}</h3>
                          <p className="text-[10px] text-gray-400">{items.length} field{items.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="p-3 sm:p-4 grid gap-2.5">
                      {(() => {
                        const rendered = new Set<string>();

                        // Build reverse map: for each toggle, find the first non-toggle field sharing its base prefix
                        const inlinedToggles = new Set<string>();
                        const toggleAssoc = new Map<string, { desktopKey?: string; mobileKey?: string; visibleKey?: string }>();
                        const nonToggleItems = items.filter(i => !i.isToggle);
                        const toggleItems = items.filter(i => i.isToggle);

                        for (const tItem of toggleItems) {
                          const base = tItem.key.replace(/_(visible|desktop|mobile)$/, '');
                          const suffix = tItem.key.match(/_(visible|desktop|mobile)$/)?.[1];
                          if (!suffix) continue;
                          const parentField = nonToggleItems.find(f => f.key.startsWith(base + '_') || f.key === base);
                          if (!parentField) continue;
                          if (inlinedToggles.has(tItem.key)) continue;

                          const existing = toggleAssoc.get(parentField.key) || {};
                          if (suffix === 'desktop') existing.desktopKey = tItem.key;
                          else if (suffix === 'mobile') existing.mobileKey = tItem.key;
                          else if (suffix === 'visible') existing.visibleKey = tItem.key;
                          toggleAssoc.set(parentField.key, existing);
                          inlinedToggles.add(tItem.key);
                        }

                        return items.map(item => {
                          if (rendered.has(item.key)) return null;
                          if (inlinedToggles.has(item.key)) { rendered.add(item.key); return null; }

                          // Standalone toggle (no parent text field)
                          if (item.isToggle) {
                            rendered.add(item.key);
                            const base = item.key.replace(/_(visible|desktop|mobile)$/, '');
                            const dKey = base + '_desktop', mKey = base + '_mobile';
                            const hasDM = items.some(i => i.key === dKey) && items.some(i => i.key === mKey);
                            if (hasDM && (item.key === dKey || item.key === mKey)) {
                              // Paired - render both together
                              rendered.add(dKey); rendered.add(mKey);
                              const dItem = items.find(i => i.key === dKey)!, mItem = items.find(i => i.key === mKey)!;
                              const dVal = toggleValues[dKey] !== undefined ? toggleValues[dKey] : dItem ? dItem.currentValue !== 'false' : true;
                              const mVal = toggleValues[mKey] !== undefined ? toggleValues[mKey] : mItem ? mItem.currentValue !== 'false' : true;
                              const pairLabel = dItem.label.replace(/\s*-\s*Desktop$/i, '').replace(/Show\s*/i, '');
                              return (
                                <div key={base} className="bg-gray-50/70 border border-gray-100 hover:border-brand-green/25 hover:bg-white p-3 rounded-xl transition-all flex items-center gap-2">
                                  <label className="text-[12px] font-semibold text-gray-700">{pairLabel}</label>
                                  <IconCheckbox checked={dVal} onChange={v => handleToggleChange(dKey, v)}
                                    icon={<Monitor className="w-3.5 h-3.5" />} />
                                  <IconCheckbox checked={mVal} onChange={v => handleToggleChange(mKey, v)}
                                    icon={<Smartphone className="w-3.5 h-3.5" />} />
                                  <span className="ml-auto text-[9px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 hidden sm:inline-block shrink-0">
                                    {base}
                                  </span>
                                </div>
                              );
                            }
                            // Single toggle - show as desktop+mobile auto
                            const checked = toggleValues[item.key] !== undefined ? toggleValues[item.key] : item.currentValue !== 'false';
                            const autoDK = base + '_desktop', autoMK = base + '_mobile';
                            const autoDVal = toggleValues[autoDK] !== undefined ? toggleValues[autoDK] : (dbMap[autoDK] || (checked ? 'true' : 'false')) !== 'false';
                            const autoMVal = toggleValues[autoMK] !== undefined ? toggleValues[autoMK] : (dbMap[autoMK] || (checked ? 'true' : 'false')) !== 'false';
                            const cleanLabel = item.label.replace(/Show\s*/i, '').replace(/\s*Visible$/i, '');
                            return (
                              <div key={item.key} className="bg-gray-50/70 border border-gray-100 hover:border-brand-green/25 hover:bg-white p-3 rounded-xl transition-all flex items-center gap-2">
                                <label className="text-[12px] font-semibold text-gray-700">{cleanLabel}</label>
                                <IconCheckbox checked={autoDVal} onChange={v => { handleToggleChange(autoDK, v); handleToggleChange(item.key, v || autoMVal); }}
                                  icon={<Monitor className="w-3.5 h-3.5" />} />
                                <IconCheckbox checked={autoMVal} onChange={v => { handleToggleChange(autoMK, v); handleToggleChange(item.key, v || autoDVal); }}
                                  icon={<Smartphone className="w-3.5 h-3.5" />} />
                                <span className="ml-auto text-[9px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 hidden sm:inline-block shrink-0">
                                  {item.key}
                                </span>
                              </div>
                            );
                          }

                          rendered.add(item.key);
                          const isPill = item.isPills;
                          const assoc = toggleAssoc.get(item.key);

                          // Resolve inline toggle values
                          let inlineDVal: boolean | undefined, inlineMVal: boolean | undefined, inlineVis: boolean | undefined;
                          if (assoc?.desktopKey) {
                            const di = items.find(i => i.key === assoc.desktopKey);
                            inlineDVal = toggleValues[assoc.desktopKey] !== undefined ? toggleValues[assoc.desktopKey] : di ? di.currentValue !== 'false' : true;
                          }
                          if (assoc?.mobileKey) {
                            const mi = items.find(i => i.key === assoc.mobileKey);
                            inlineMVal = toggleValues[assoc.mobileKey] !== undefined ? toggleValues[assoc.mobileKey] : mi ? mi.currentValue !== 'false' : true;
                          }
                          if (assoc?.visibleKey) {
                            const vi = items.find(i => i.key === assoc.visibleKey);
                            inlineVis = toggleValues[assoc.visibleKey] !== undefined ? toggleValues[assoc.visibleKey] : vi ? vi.currentValue !== 'false' : true;
                          }

                          // Auto desktop/mobile for fields with no explicit toggle or only _visible
                          const autoDK = `${item.key}_desktop`, autoMK = `${item.key}_mobile`;
                          const skipVis = sectionName === 'General' || sectionName === 'Contact Info';
                          const needsAuto = !skipVis && !assoc?.desktopKey && !assoc?.mobileKey;
                          let autoDVal: boolean | undefined, autoMVal: boolean | undefined;
                          if (needsAuto) {
                            // If there's a visibleKey, use its value as default for auto desktop/mobile when no DB value exists
                            const visFallback = assoc?.visibleKey ? (inlineVis ? 'true' : 'false') : 'true';
                            autoDVal = toggleValues[autoDK] !== undefined ? toggleValues[autoDK] : (dbMap[autoDK] || visFallback) !== 'false';
                            autoMVal = toggleValues[autoMK] !== undefined ? toggleValues[autoMK] : (dbMap[autoMK] || visFallback) !== 'false';
                          }

                          // Sync handler: when toggling auto checkboxes, also update _visible key if present
                          const syncVisible = (dVal: boolean, mVal: boolean) => {
                            if (assoc?.visibleKey) handleToggleChange(assoc.visibleKey, dVal || mVal);
                          };

                          return (
                            <div key={item.key} className="bg-gray-50/70 border border-gray-100 hover:border-brand-green/25 hover:bg-white p-3 rounded-xl transition-all">
                              <div className="flex items-center gap-2 mb-1.5">
                                <label htmlFor={item.key} className="text-[12px] font-semibold text-gray-700 leading-snug">
                                  {item.label}
                                </label>
                                {!skipVis && assoc?.desktopKey ? (
                                  <IconCheckbox checked={inlineDVal!} onChange={v => handleToggleChange(assoc.desktopKey!, v)}
                                    icon={<Monitor className="w-3.5 h-3.5" />} />
                                ) : !skipVis && needsAuto ? (
                                  <IconCheckbox checked={autoDVal!} onChange={v => { handleToggleChange(autoDK, v); syncVisible(v, autoMVal!); }}
                                    icon={<Monitor className="w-3.5 h-3.5" />} />
                                ) : null}
                                {!skipVis && assoc?.mobileKey ? (
                                  <IconCheckbox checked={inlineMVal!} onChange={v => handleToggleChange(assoc.mobileKey!, v)}
                                    icon={<Smartphone className="w-3.5 h-3.5" />} />
                                ) : !skipVis && needsAuto ? (
                                  <IconCheckbox checked={autoMVal!} onChange={v => { handleToggleChange(autoMK, v); syncVisible(autoDVal!, v); }}
                                    icon={<Smartphone className="w-3.5 h-3.5" />} />
                                ) : null}
                                <span className="ml-auto text-[9px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 hidden sm:inline-block shrink-0">
                                  {item.key}
                                </span>
                              </div>
                              {item.isImage ? (
                                <ImageField fieldKey={item.key} currentValue={item.currentValue} onUploaded={handleImageUploaded} />
                              ) : item.isTextarea ? (
                                <textarea id={item.key} name={item.key} defaultValue={item.currentValue} rows={3}
                                  className="w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-y"
                                  placeholder={`Enter ${item.label.toLowerCase()}...`} />
                              ) : (
                                <>
                                  <input id={item.key} name={item.key} type="text" defaultValue={item.currentValue}
                                    onChange={isPill ? e => setPillValues(v => ({ ...v, [item.key]: e.target.value })) : undefined}
                                    className="w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                                    placeholder={isPill ? 'Item 1, Item 2, Item 3' : `Enter ${item.label.toLowerCase()}...`} />
                                  {isPill && (
                                    <>
                                      <p className="text-[10px] text-gray-400 mt-1">Separate each item with a comma</p>
                                      <PillsPreview value={pillValues[item.key] || item.currentValue} />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })}
            </form>
            <div className="h-4" />
          </div>
        </div>



        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.3); border-radius: 20px; }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.5); }
          @keyframes toast-slide-in {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes toast-progress { from { width: 100%; } to { width: 0%; } }
          .toast-enter { animation: toast-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .toast-progress { animation: toast-progress 3.5s linear forwards; }
        `}</style>
      </div>
    </>
  );
}

