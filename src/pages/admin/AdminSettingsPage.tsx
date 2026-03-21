import { useEffect, useState, useCallback, FormEvent, useRef } from "react";
import {
  Shield, Globe, Mail, Key, Save, Database, Server, Monitor,
  Lock, Send, MapPin, Loader2, CheckCircle2, RefreshCw,
  Search, Tag, FileText, BarChart2, RotateCcw, AlertTriangle,
  Building2, Image as ImageIcon,
} from "lucide-react";
import { api } from "@/services/api";
import { SEO_PAGES, getSeoKey } from "@/services/content";
import type { SeoPageKey } from "@/services/content";
import { LogoUpload } from "@/components/LogoUpload";
import { toast } from "@/components/Toast";

type SettingsTab = 'general' | 'email' | 'seo' | 'database';

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-white transition-colors';

function ResetDialog({ open, onConfirm, onCancel }: {
  open: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute right-0 top-11 z-50 bg-white rounded-xl border border-gray-200 shadow-2xl p-3 w-52">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <p className="text-xs font-bold text-gray-800">Discard changes?</p>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">Fields will reset to last saved values.</p>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-2 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onConfirm}
          className="flex-1 px-2 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [savedSettings, setSavedSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const resetAreaRef = useRef<HTMLDivElement>(null);

  // General form
  const [generalForm, setGeneralForm] = useState({ site_name: '', site_domain: '', google_maps_embed: '' });
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSaving, setLogoSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Email form
  const [emailForm, setEmailForm] = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', smtp_from: '' });

  // SEO form — per-page title/description/keywords + global og_image & analytics
  const [seoForm, setSeoForm] = useState<Record<string, string>>({});
  const [seoPage, setSeoPage] = useState<SeoPageKey>('home');

  // Database
  const [savedDbConfig, setSavedDbConfig] = useState<Record<string, string>>({});
  const [dbForm, setDbForm] = useState({ DB_CONNECTION: 'mysql', DB_HOST: '127.0.0.1', DB_PORT: '3306', DB_DATABASE: '', DB_USERNAME: 'root', DB_PASSWORD: '' });
  const [dbSaving, setDbSaving] = useState(false);

  const loadSettings = useCallback(() => {
    api.get<Array<{ key: string; value: string }>>('/settings').then((items) => {
      const map: Record<string, string> = {};
      items.forEach(item => { map[item.key] = item.value; });
      setSavedSettings(map);
      setGeneralForm({ site_name: map['site_name'] ?? '', site_domain: map['site_domain'] ?? '', google_maps_embed: map['google_maps_embed'] ?? '' });
      setEmailForm({ smtp_host: map['smtp_host'] ?? '', smtp_port: map['smtp_port'] ?? '', smtp_user: map['smtp_user'] ?? '', smtp_pass: map['smtp_pass'] ?? '', smtp_from: map['smtp_from'] ?? '' });
      // Build per-page SEO form from settings
      const seo: Record<string, string> = { seo_og_image: map['seo_og_image'] ?? '', google_analytics_id: map['google_analytics_id'] ?? '' };
      for (const p of SEO_PAGES) {
        seo[getSeoKey(p.key, 'title')] = map[getSeoKey(p.key, 'title')] ?? '';
        seo[getSeoKey(p.key, 'description')] = map[getSeoKey(p.key, 'description')] ?? '';
        seo[getSeoKey(p.key, 'keywords')] = map[getSeoKey(p.key, 'keywords')] ?? '';
      }
      setSeoForm(seo);
      setLogoUrl(map['site_logo'] ?? '');
    }).catch(() => {});
  }, []);

  const loadDbConfig = useCallback(() => {
    api.get<Record<string, string>>('/settings/database').then((cfg) => {
      setSavedDbConfig(cfg);
      setDbForm({ DB_CONNECTION: cfg.DB_CONNECTION || 'mysql', DB_HOST: cfg.DB_HOST || '127.0.0.1', DB_PORT: cfg.DB_PORT || '3306', DB_DATABASE: cfg.DB_DATABASE || '', DB_USERNAME: cfg.DB_USERNAME || 'root', DB_PASSWORD: '' });
    }).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Settings | Admin'; }, []);

  useEffect(() => { loadSettings(); loadDbConfig(); }, [loadSettings, loadDbConfig]);

  // Close reset dialog on outside click
  useEffect(() => {
    if (!resetDialogOpen) return;
    const handle = (e: MouseEvent) => {
      if (resetAreaRef.current && !resetAreaRef.current.contains(e.target as Node)) setResetDialogOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [resetDialogOpen]);

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwSaving(true);
    const fd = new FormData(e.currentTarget);
    const cur = fd.get('currentPassword') as string;
    const next = fd.get('newPassword') as string;
    const confirm = fd.get('confirmPassword') as string;
    if (next !== confirm) { toast.error('Passwords do not match'); setPwSaving(false); return; }
    if (next.length < 6) { toast.error('Password must be at least 6 characters'); setPwSaving(false); return; }
    try {
      await api.post('/auth/change-password', { currentPassword: cur, newPassword: next });
      toast.success('Password changed successfully');
      (e.target as HTMLFormElement).reset();
    } catch { toast.error('Current password is incorrect'); }
    setPwSaving(false);
  }

  async function handleSaveLogo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLogoSaving(true);
    try {
      await api.post('/settings/logo', { logo_url: logoUrl });
      toast.success('Logo updated');
      setSavedSettings(prev => ({ ...prev, site_logo: logoUrl }));
    } catch { toast.error('Failed to save logo'); }
    setLogoSaving(false);
  }

  async function saveSettingsMap(map: Record<string, string>, successMsg: string) {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(map)) {
        await api.post('/settings', { key, value });
      }
      setSavedSettings(prev => ({ ...prev, ...map }));
      toast.success(successMsg);
    } catch { toast.error('Failed to save settings'); }
    setSaving(false);
  }

  function handleReset() {
    setResetDialogOpen(false);
    if (activeTab === 'general') {
      setGeneralForm({ site_name: savedSettings['site_name'] ?? '', site_domain: savedSettings['site_domain'] ?? '', google_maps_embed: savedSettings['google_maps_embed'] ?? '' });
    } else if (activeTab === 'email') {
      setEmailForm({ smtp_host: savedSettings['smtp_host'] ?? '', smtp_port: savedSettings['smtp_port'] ?? '', smtp_user: savedSettings['smtp_user'] ?? '', smtp_pass: savedSettings['smtp_pass'] ?? '', smtp_from: savedSettings['smtp_from'] ?? '' });
    } else if (activeTab === 'seo') {
      const seo: Record<string, string> = { seo_og_image: savedSettings['seo_og_image'] ?? '', google_analytics_id: savedSettings['google_analytics_id'] ?? '' };
      for (const p of SEO_PAGES) {
        seo[getSeoKey(p.key, 'title')] = savedSettings[getSeoKey(p.key, 'title')] ?? '';
        seo[getSeoKey(p.key, 'description')] = savedSettings[getSeoKey(p.key, 'description')] ?? '';
        seo[getSeoKey(p.key, 'keywords')] = savedSettings[getSeoKey(p.key, 'keywords')] ?? '';
      }
      setSeoForm(seo);
    } else if (activeTab === 'database') {
      setDbForm({ DB_CONNECTION: savedDbConfig.DB_CONNECTION || 'mysql', DB_HOST: savedDbConfig.DB_HOST || '127.0.0.1', DB_PORT: savedDbConfig.DB_PORT || '3306', DB_DATABASE: savedDbConfig.DB_DATABASE || '', DB_USERNAME: savedDbConfig.DB_USERNAME || 'root', DB_PASSWORD: '' });
    }
  }

  async function handleSave() {
    if (activeTab === 'general') { await saveSettingsMap(generalForm, 'General settings saved'); }
    else if (activeTab === 'email') { await saveSettingsMap(emailForm, 'Email settings saved'); }
    else if (activeTab === 'seo') { await saveSettingsMap(seoForm, 'SEO settings saved'); }
    else if (activeTab === 'database') {
      setDbSaving(true);
      try {
        await api.post('/settings/database', dbForm);
        setSavedDbConfig(dbForm);
        toast.success('Database configuration saved. Restart the server for changes to take effect.');
      } catch { toast.error('Failed to update database configuration.'); }
      setDbSaving(false);
    }
  }

  const TABS: { key: SettingsTab; label: string; icon: typeof Shield }[] = [
    { key: 'general', label: 'General', icon: Shield },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'seo', label: 'SEO', icon: Search },
    { key: 'database', label: 'Database', icon: Database },
  ];

  const isSaving = saving || dbSaving;

  return (
    <div>
      {/* Header with top-right Save/Reset */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#015851] to-[#018a7e] flex items-center justify-center shrink-0 shadow-lg shadow-[#015851]/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage site identity, security, email, SEO, and database.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 relative" ref={resetAreaRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setResetDialogOpen(v => !v)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <ResetDialog open={resetDialogOpen} onConfirm={handleReset} onCancel={() => setResetDialogOpen(false)} />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 bg-[#015851] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#013f39] transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-100">
        {TABS.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setResetDialogOpen(false); }}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 rounded-t-xl ${
                isActive
                  ? 'bg-white text-[#015851] shadow-sm border border-gray-100 border-b-white -mb-px z-10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#015851]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── General Tab ── */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Site Identity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#015851]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#015851]" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Site Identity</h2>
                <p className="text-[11px] text-gray-400">Your clinic name, website URL, and Google Maps embed.</p>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 max-w-2xl">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> Site Name
                  </label>
                  <input type="text" value={generalForm.site_name} onChange={e => setGeneralForm(f => ({ ...f, site_name: e.target.value }))} placeholder="e.g. Rohit Health Care" className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Used in page titles, headers, and outgoing emails</p>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Website URL
                  </label>
                  <input type="text" value={generalForm.site_domain} onChange={e => setGeneralForm(f => ({ ...f, site_domain: e.target.value }))} placeholder="https://yoursite.com" className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Your primary website address</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Google Maps Embed URL
                  </label>
                  <input type="text" value={generalForm.google_maps_embed} onChange={e => setGeneralForm(f => ({ ...f, google_maps_embed: e.target.value }))} placeholder="https://www.google.com/maps/embed?pb=..." className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Embed URL for the contact page map</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Site Logo</h2>
                <p className="text-[11px] text-gray-400">Recommended: PNG with transparent background.</p>
              </div>
            </div>
            <form onSubmit={handleSaveLogo} className="px-5 sm:px-6 py-5">
              <LogoUpload name="logo_url" defaultValue={savedSettings['site_logo'] ?? ''} onChange={url => setLogoUrl(url)} />
              <button type="submit" disabled={logoSaving} className="mt-4 inline-flex items-center gap-2 bg-[#015851] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#013f39] transition-colors disabled:opacity-50">
                {logoSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {logoSaving ? 'Saving…' : 'Save Logo'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Change Admin Password</h2>
                <p className="text-[11px] text-gray-400">Update your login credentials. Use a strong, unique password.</p>
              </div>
            </div>
            <form onSubmit={handleChangePassword} className="px-5 sm:px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Current Password</label>
                  <input name="currentPassword" type="password" required className={INPUT} placeholder="Current password" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">New Password</label>
                  <input name="newPassword" type="password" required minLength={6} className={INPUT} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <input name="confirmPassword" type="password" required minLength={6} className={INPUT} placeholder="Re-enter new" />
                </div>
              </div>
              <button type="submit" disabled={pwSaving} className="mt-4 inline-flex items-center gap-2 bg-[#015851] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#013f39] transition-colors disabled:opacity-50">
                {pwSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Email Tab ── */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">SMTP / Email Configuration</h2>
              <p className="text-[11px] text-gray-400">Configure outgoing mail for contact forms and notifications.</p>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 max-w-2xl">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Server className="w-3.5 h-3.5 text-gray-400" /> SMTP Host
                </label>
                <input type="text" value={emailForm.smtp_host} onChange={e => setEmailForm(f => ({ ...f, smtp_host: e.target.value }))} placeholder="smtp.gmail.com" className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">Mail server hostname</p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Send className="w-3.5 h-3.5 text-gray-400" /> SMTP Port
                </label>
                <input type="text" value={emailForm.smtp_port} onChange={e => setEmailForm(f => ({ ...f, smtp_port: e.target.value }))} placeholder="587" className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">Usually 587 (TLS) or 465 (SSL)</p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> SMTP Username
                </label>
                <input type="text" value={emailForm.smtp_user} onChange={e => setEmailForm(f => ({ ...f, smtp_user: e.target.value }))} placeholder="noreply@example.com" className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">Email address for authentication</p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-gray-400" /> SMTP Password
                </label>
                <input type="password" value={emailForm.smtp_pass} onChange={e => setEmailForm(f => ({ ...f, smtp_pass: e.target.value }))} placeholder="••••••••" className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">App password or email password</p>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> From Name
                </label>
                <input type="text" value={emailForm.smtp_from} onChange={e => setEmailForm(f => ({ ...f, smtp_from: e.target.value }))} placeholder={generalForm.site_name || 'Your Clinic Name'} className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">Display name in sent emails — defaults to site name if blank</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEO Tab ── */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Search Engine Optimization</h2>
              <p className="text-[11px] text-gray-400">Per-page SEO — control title, description & keywords for each page.</p>
            </div>
          </div>

          {/* Page sub-tabs */}
          <div className="px-5 sm:px-6 pt-4 flex flex-wrap gap-1.5">
            {SEO_PAGES.map(p => (
              <button key={p.key} onClick={() => setSeoPage(p.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${seoPage === p.key ? 'bg-[#015851] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setSeoPage('global' as SeoPageKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${seoPage === ('global' as SeoPageKey) ? 'bg-[#015851] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              Global
            </button>
          </div>

          <div className="px-5 sm:px-6 py-5">
            {seoPage !== ('global' as SeoPageKey) ? (
              <div className="grid grid-cols-1 gap-y-4 max-w-2xl">
                {/* Page Title */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Meta Title
                  </label>
                  <input type="text"
                    value={seoForm[getSeoKey(seoPage, 'title')] ?? ''}
                    onChange={e => setSeoForm(f => ({ ...f, [getSeoKey(seoPage, 'title')]: e.target.value }))}
                    placeholder={`${SEO_PAGES.find(p => p.key === seoPage)?.label} | ${generalForm.site_name || 'Your Site Name'}`}
                    className={INPUT}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Browser tab title &amp; search result headline</p>
                    <span className={`text-[11px] font-mono ${(seoForm[getSeoKey(seoPage, 'title')]?.length ?? 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      {seoForm[getSeoKey(seoPage, 'title')]?.length ?? 0}/60
                    </span>
                  </div>
                </div>

                {/* Page Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> Meta Description
                  </label>
                  <textarea
                    value={seoForm[getSeoKey(seoPage, 'description')] ?? ''}
                    onChange={e => setSeoForm(f => ({ ...f, [getSeoKey(seoPage, 'description')]: e.target.value }))}
                    placeholder={`Description for ${SEO_PAGES.find(p => p.key === seoPage)?.label} page...`}
                    rows={3} className={INPUT + ' resize-none'}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Shown below the title in search results</p>
                    <span className={`text-[11px] font-mono ${(seoForm[getSeoKey(seoPage, 'description')]?.length ?? 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      {seoForm[getSeoKey(seoPage, 'description')]?.length ?? 0}/160
                    </span>
                  </div>
                </div>

                {/* Page Keywords */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Meta Keywords
                  </label>
                  <input type="text"
                    value={seoForm[getSeoKey(seoPage, 'keywords')] ?? ''}
                    onChange={e => setSeoForm(f => ({ ...f, [getSeoKey(seoPage, 'keywords')]: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className={INPUT}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Comma-separated keywords (optional)</p>
                </div>

                {/* Live Search Preview */}
                {(seoForm[getSeoKey(seoPage, 'title')] || seoForm[getSeoKey(seoPage, 'description')]) && (
                  <div className="mt-2 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Search Result Preview</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-lg">
                      <p className="text-[11px] text-green-700 truncate">{generalForm.site_domain || 'https://yoursite.com'} › {seoPage === 'home' ? '' : seoPage}</p>
                      <p className="text-base font-medium text-blue-700 truncate mt-0.5">
                        {seoForm[getSeoKey(seoPage, 'title')] || `${SEO_PAGES.find(p => p.key === seoPage)?.label} | ${generalForm.site_name || 'Site'}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{seoForm[getSeoKey(seoPage, 'description')] || 'Your meta description will appear here...'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Global SEO settings */
              <div className="grid grid-cols-1 gap-y-4 max-w-2xl">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Social Share Image (OG Image)
                  </label>
                  <input type="text"
                    value={seoForm.seo_og_image ?? ''}
                    onChange={e => setSeoForm(f => ({ ...f, seo_og_image: e.target.value }))}
                    placeholder="https://yoursite.com/og-image.jpg"
                    className={INPUT}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Shown when shared on WhatsApp, Facebook, Twitter (1200×630px recommended)</p>
                  {seoForm.seo_og_image && (
                    <img src={seoForm.seo_og_image} alt="OG Preview" className="mt-2 h-20 w-auto rounded-lg border border-gray-200 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <BarChart2 className="w-3.5 h-3.5 text-gray-400" /> Google Analytics ID
                  </label>
                  <input type="text"
                    value={seoForm.google_analytics_id ?? ''}
                    onChange={e => setSeoForm(f => ({ ...f, google_analytics_id: e.target.value }))}
                    placeholder="G-XXXXXXXXXX"
                    className={INPUT}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Your GA4 Measurement ID (starts with G-)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Database Tab ── */}
      {activeTab === 'database' && (
        <div className="space-y-5">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <RefreshCw className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Server Restart Required</p>
              <p className="text-xs text-amber-600 mt-0.5">Database changes only take effect after restarting the backend server.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Database Connection</h2>
                <p className="text-[11px] text-gray-400">Configure your MySQL / PostgreSQL / SQLite connection parameters.</p>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 max-w-2xl">
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Server className="w-3.5 h-3.5 text-gray-400" /> Connection Driver
                  </label>
                  <select value={dbForm.DB_CONNECTION} onChange={e => setDbForm(f => ({ ...f, DB_CONNECTION: e.target.value }))} className={INPUT}>
                    <option value="mysql">MySQL / MariaDB</option>
                    <option value="sqlite">SQLite</option>
                    <option value="pgsql">PostgreSQL</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Monitor className="w-3.5 h-3.5 text-gray-400" /> Host
                  </label>
                  <input type="text" value={dbForm.DB_HOST} onChange={e => setDbForm(f => ({ ...f, DB_HOST: e.target.value }))} placeholder="127.0.0.1" className={INPUT} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Server className="w-3.5 h-3.5 text-gray-400" /> Port
                  </label>
                  <input type="text" value={dbForm.DB_PORT} onChange={e => setDbForm(f => ({ ...f, DB_PORT: e.target.value }))} placeholder="3306" className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5 text-gray-400" /> Database Name
                  </label>
                  <input type="text" value={dbForm.DB_DATABASE} onChange={e => setDbForm(f => ({ ...f, DB_DATABASE: e.target.value }))} placeholder="your_database" className={INPUT} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-gray-400" /> Username
                  </label>
                  <input type="text" value={dbForm.DB_USERNAME} onChange={e => setDbForm(f => ({ ...f, DB_USERNAME: e.target.value }))} placeholder="root" className={INPUT} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-gray-400" /> Password
                  </label>
                  <input type="password" value={dbForm.DB_PASSWORD} onChange={e => setDbForm(f => ({ ...f, DB_PASSWORD: e.target.value }))} placeholder="••••••••" className={INPUT} />
                </div>
              </div>
              {savedDbConfig.DB_HOST && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Connected to {savedDbConfig.DB_HOST}:{savedDbConfig.DB_PORT}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
