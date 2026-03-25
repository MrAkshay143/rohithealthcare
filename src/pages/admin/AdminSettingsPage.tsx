import { useEffect, useState, useCallback, FormEvent, useRef } from "react";
import {
  Shield, Globe, Mail, Key, Save, Server,
  Lock, Send, MapPin, Loader2,
  Search, Tag, FileText, BarChart2, RotateCcw, AlertTriangle,
  Building2, Image as ImageIcon, Bot, Eye, EyeOff, ToggleLeft, ToggleRight, Zap, MessageSquare
} from "lucide-react";
import { api } from "@/services/api";
import { SEO_PAGES, getSeoKey } from "@/services/content";
import type { SeoPageKey } from "@/services/content";
import { LogoUpload } from "@/components/LogoUpload";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "@/components/Toast";

type SettingsTab = 'general' | 'email' | 'seo' | 'chatbot';

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors';

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
  const [generalForm, setGeneralForm] = useState({ site_name: '', site_domain: '', allowed_domains: '', google_maps_embed: '', google_maps_url: '' });
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSaving, setLogoSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Email form
  const [emailForm, setEmailForm] = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', smtp_from: '' });

  // SEO form - per-page title/description/keywords + global og_image & analytics
  const [seoForm, setSeoForm] = useState<Record<string, string>>({});
  const [seoPage, setSeoPage] = useState<SeoPageKey>('home');

  // Chatbot form
  const [chatbotForm, setChatbotForm] = useState({
    chatbot_enabled: 'false',
    chatbot_provider: 'groq',
    chatbot_api_key: '',
    chatbot_model: '',
    chatbot_endpoint_url: '',
    chatbot_bot_name: 'Health Assistant',
    chatbot_welcome_msg: 'Hello! 👋 How can I help you today? Ask me anything about our services, hours, or how to get in touch.',
    chatbot_placeholder: 'Ask about our services...',
    chatbot_color: '#4e66b3',
    chatbot_suggested_questions: 'What services do you offer?\nWhat are your opening hours?\nHow do I book an appointment?\nWhere is the clinic located?\nWhich doctors are available?',
    chatbot_system_prompt: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingAi, setTestingAi] = useState(false);

  async function handleTestAiConnection() {
    setTestingAi(true);
    try {
      const res = await api.post<any>('/settings/test-chatbot', {
        provider: chatbotForm.chatbot_provider,
        api_key: chatbotForm.chatbot_api_key,
        model: chatbotForm.chatbot_model,
        endpoint_url: chatbotForm.chatbot_endpoint_url,
      });
      // The api client returns JSON directly, not wrapped in .data
      if (res && res.success) {
        toast.success(`Success! Bot replied: "${res.reply}"`);
      } else {
        toast.error('Failed: ' + (res?.error || 'Unknown error'));
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to connect to AI Provider');
    }
    setTestingAi(false);
  }

  const loadSettings = useCallback(() => {
    api.get<Array<{ key: string; value: string }>>('/settings').then((items) => {
      const map: Record<string, string> = {};
      items.forEach(item => { map[item.key] = item.value; });
      setSavedSettings(map);
      setGeneralForm({ 
        site_name: map['site_name'] || '', 
        site_domain: map['site_domain'] || '', 
        allowed_domains: map['allowed_domains'] || '', 
        google_maps_embed: map['google_maps_embed'] || '',
        google_maps_url: map['google_maps_url'] || ''
      });
      setEmailForm({ smtp_host: map['smtp_host'] || '', smtp_port: map['smtp_port'] || '', smtp_user: map['smtp_user'] || '', smtp_pass: map['smtp_pass'] || '', smtp_from: map['smtp_from'] || '' });
      // Build per-page SEO form from settings
      const seo: Record<string, string> = { seo_og_image: map['seo_og_image'] || '', google_analytics_id: map['google_analytics_id'] || '' };
      for (const p of SEO_PAGES) {
        seo[getSeoKey(p.key, 'title')] = map[getSeoKey(p.key, 'title')] || '';
        seo[getSeoKey(p.key, 'description')] = map[getSeoKey(p.key, 'description')] || '';
        seo[getSeoKey(p.key, 'keywords')] = map[getSeoKey(p.key, 'keywords')] || '';
      }
      setSeoForm(seo);
      setLogoUrl(map['site_logo'] || '');
      setChatbotForm({
        chatbot_enabled:              map['chatbot_enabled']              || 'false',
        chatbot_provider:             map['chatbot_provider']             || 'openrouter',
        chatbot_api_key:              map['chatbot_api_key']              || '',
        chatbot_model:                map['chatbot_model']                || 'stepfun/step-3.5-flash:free',
        chatbot_endpoint_url:         map['chatbot_endpoint_url']         || '',
        chatbot_bot_name:             map['chatbot_bot_name']             || 'Health Assistant',
        chatbot_welcome_msg:          map['chatbot_welcome_msg']          || 'Hello! 👋 How can I help you today? Ask me anything about our services, hours, or how to get in touch.',
        chatbot_placeholder:          map['chatbot_placeholder']          || 'Ask about our services...',
        chatbot_color:                map['chatbot_color']                || '#4e66b3',
        chatbot_suggested_questions:  map['chatbot_suggested_questions']  || 'What services do you offer?\nWhat are your opening hours?\nHow do I book an appointment?\nWhere is the clinic located?',
        chatbot_system_prompt:        map['chatbot_system_prompt']        || '',
      })
    }).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Settings | Admin'; }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

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
      setGeneralForm({ 
        site_name: savedSettings['site_name'] || '', 
        site_domain: savedSettings['site_domain'] || '', 
        allowed_domains: savedSettings['allowed_domains'] || '', 
        google_maps_embed: savedSettings['google_maps_embed'] || '',
        google_maps_url: savedSettings['google_maps_url'] || '' 
      });
    } else if (activeTab === 'email') {
      setEmailForm({ smtp_host: savedSettings['smtp_host'] || '', smtp_port: savedSettings['smtp_port'] || '', smtp_user: savedSettings['smtp_user'] || '', smtp_pass: savedSettings['smtp_pass'] || '', smtp_from: savedSettings['smtp_from'] || '' });
    } else if (activeTab === 'seo') {
      const seo: Record<string, string> = { seo_og_image: savedSettings['seo_og_image'] || '', google_analytics_id: savedSettings['google_analytics_id'] || '' };
      for (const p of SEO_PAGES) {
        seo[getSeoKey(p.key, 'title')] = savedSettings[getSeoKey(p.key, 'title')] || '';
        seo[getSeoKey(p.key, 'description')] = savedSettings[getSeoKey(p.key, 'description')] || '';
        seo[getSeoKey(p.key, 'keywords')] = savedSettings[getSeoKey(p.key, 'keywords')] || '';
      }
      setSeoForm(seo);
    } else if (activeTab === 'chatbot') {
      setChatbotForm({
        chatbot_enabled:              savedSettings['chatbot_enabled']              || 'false',
        chatbot_provider:             savedSettings['chatbot_provider']             || 'openrouter',
        chatbot_api_key:              savedSettings['chatbot_api_key']             || '',
        chatbot_model:                savedSettings['chatbot_model']                || 'stepfun/step-3.5-flash:free',
        chatbot_endpoint_url:         savedSettings['chatbot_endpoint_url']         || '',
        chatbot_bot_name:             savedSettings['chatbot_bot_name']             || 'Health Assistant',
        chatbot_welcome_msg:          savedSettings['chatbot_welcome_msg']          || 'Hello! 👋 How can I help you today?',
        chatbot_placeholder:          savedSettings['chatbot_placeholder']          || 'Ask about our services...',
        chatbot_color:                savedSettings['chatbot_color']                || '#4e66b3',
        chatbot_suggested_questions:  savedSettings['chatbot_suggested_questions'] || 'What services do you offer?\nWhat are your opening hours?',
        chatbot_system_prompt:        savedSettings['chatbot_system_prompt']        || '',
      });
    }
  }

  async function handleSave() {
    if (activeTab === 'general') { await saveSettingsMap(generalForm, 'General settings saved'); }
    else if (activeTab === 'email') { await saveSettingsMap(emailForm, 'Email settings saved'); }
    else if (activeTab === 'seo') { await saveSettingsMap(seoForm, 'SEO settings saved'); }
    else if (activeTab === 'chatbot') { await saveSettingsMap(chatbotForm, 'Chatbot settings saved'); }
  }

  const TABS: { key: SettingsTab; label: string; icon: typeof Shield }[] = [
    { key: 'general', label: 'General', icon: Shield },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'seo', label: 'SEO', icon: Search },
    { key: 'chatbot', label: 'AI Chatbot', icon: Bot },
  ];

  const isSaving = saving;

  return (
    <div>
      {/* Header with top-right Save/Reset */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#4e66b3] to-[#6878d4] flex items-center justify-center shrink-0 shadow-lg shadow-[#4e66b3]/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage site identity, security, email, and SEO.</p>
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
            className="inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saving...' : 'Save'}
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
                  ? 'bg-white text-[#4e66b3] shadow-sm border border-gray-100 border-b-white -mb-px z-10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#4e66b3]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* -- General Tab -- */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Site Identity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#4e66b3]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#4e66b3]" />
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
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Allowed Domains (CORS)
                  </label>
                  <input type="text" value={generalForm.allowed_domains} onChange={e => setGeneralForm(f => ({ ...f, allowed_domains: e.target.value }))} placeholder="rohithealthcare.com,rohithealthcare.in,localhost:5173" className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Comma-separated list of domains allowed to access the API</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Google Maps Embed URL
                  </label>
                  <input type="text" value={generalForm.google_maps_embed} onChange={e => setGeneralForm(f => ({ ...f, google_maps_embed: e.target.value }))} placeholder="https://www.google.com/maps/embed?pb=..." className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Embed URL (from "Embed a map")</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Google Maps Sharing URL
                  </label>
                  <input type="text" value={generalForm.google_maps_url} onChange={e => setGeneralForm(f => ({ ...f, google_maps_url: e.target.value }))} placeholder="https://maps.app.goo.gl/..." className={INPUT} />
                  <p className="text-[11px] text-gray-400 mt-1">Short link (from "Share" &gt; "Send a link")</p>
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
              <LogoUpload name="logo_url" defaultValue={savedSettings['site_logo'] || ''} onChange={url => setLogoUrl(url)} />
              <button type="submit" disabled={logoSaving} className="mt-4 inline-flex items-center gap-2 bg-[#4e66b3] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50">
                {logoSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {logoSaving ? 'Saving...' : 'Save Logo'}
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
              <button type="submit" disabled={pwSaving} className="mt-4 inline-flex items-center gap-2 bg-[#4e66b3] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a4f99] transition-colors disabled:opacity-50">
                {pwSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                {pwSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -- Email Tab -- */}
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
                <input type="password" value={emailForm.smtp_pass} onChange={e => setEmailForm(f => ({ ...f, smtp_pass: e.target.value }))} placeholder="ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½" className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">App password or email password</p>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> From Name
                </label>
                <input type="text" value={emailForm.smtp_from} onChange={e => setEmailForm(f => ({ ...f, smtp_from: e.target.value }))} placeholder={generalForm.site_name || 'Your Clinic Name'} className={INPUT} />
                <p className="text-[11px] text-gray-400 mt-1">Display name in sent emails - defaults to site name if blank</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- SEO Tab -- */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Search Engine Optimization</h2>
              <p className="text-[11px] text-gray-400">Per-page SEO - control title, description & keywords for each page.</p>
            </div>
          </div>

          {/* Page sub-tabs */}
          <div className="px-5 sm:px-6 pt-4 flex flex-wrap gap-1.5">
            {SEO_PAGES.map(p => (
              <button key={p.key} onClick={() => setSeoPage(p.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${seoPage === p.key ? 'bg-[#4e66b3] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setSeoPage('global' as SeoPageKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${seoPage === ('global' as SeoPageKey) ? 'bg-[#4e66b3] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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
                    value={seoForm[getSeoKey(seoPage, 'title')] || ''}
                    onChange={e => setSeoForm(f => ({ ...f, [getSeoKey(seoPage, 'title')]: e.target.value }))}
                    placeholder={`${SEO_PAGES.find(p => p.key === seoPage)?.label} | ${generalForm.site_name || 'Your Site Name'}`}
                    className={INPUT}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Browser tab title &amp; search result headline</p>
                    <span className={`text-[11px] font-mono ${(seoForm[getSeoKey(seoPage, 'title')]?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      {seoForm[getSeoKey(seoPage, 'title')]?.length || 0}/60
                    </span>
                  </div>
                </div>

                {/* Page Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> Meta Description
                  </label>
                  <textarea
                    value={seoForm[getSeoKey(seoPage, 'description')] || ''}
                    onChange={e => setSeoForm(f => ({ ...f, [getSeoKey(seoPage, 'description')]: e.target.value }))}
                    placeholder={`Description for ${SEO_PAGES.find(p => p.key === seoPage)?.label} page...`}
                    rows={3} className={INPUT + ' resize-none'}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Shown below the title in search results</p>
                    <span className={`text-[11px] font-mono ${(seoForm[getSeoKey(seoPage, 'description')]?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      {seoForm[getSeoKey(seoPage, 'description')]?.length || 0}/160
                    </span>
                  </div>
                </div>

                {/* Page Keywords */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Meta Keywords
                  </label>
                  <input type="text"
                    value={seoForm[getSeoKey(seoPage, 'keywords')] || ''}
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
                  <ImageUpload
                    name="seo_og_image"
                    defaultValue={seoForm.seo_og_image || ''}
                    placeholder="https://yoursite.com/og-image.jpg"
                    onChange={url => setSeoForm(f => ({ ...f, seo_og_image: url }))}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Shown when shared on WhatsApp, Facebook, Twitter (1200×630px recommended)</p>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    <BarChart2 className="w-3.5 h-3.5 text-gray-400" /> Google Analytics ID
                  </label>
                  <input type="text"
                    value={seoForm.google_analytics_id || ''}
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

      {/* ── AI Chatbot Tab ── */}
      {activeTab === 'chatbot' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">AI Chatbot</h2>
              <p className="text-[11px] text-gray-400">Floating chat widget powered by AI — uses your site content to answer patient queries.</p>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-6">

            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-bold text-gray-800">Enable AI Chatbot</p>
                <p className="text-xs text-gray-500 mt-0.5">Show the floating chat widget on all public pages</p>
              </div>
              <button
                type="button"
                onClick={() => setChatbotForm(f => ({ ...f, chatbot_enabled: f.chatbot_enabled === 'true' ? 'false' : 'true' }))}
                className="flex items-center gap-2 transition-colors"
              >
                {chatbotForm.chatbot_enabled === 'true'
                  ? <ToggleRight className="w-8 h-8 text-[#4e66b3]" />
                  : <ToggleLeft className="w-8 h-8 text-gray-400" />
                }
                <span className={`text-xs font-bold ${chatbotForm.chatbot_enabled === 'true' ? 'text-[#4e66b3]' : 'text-gray-400'}`}>
                  {chatbotForm.chatbot_enabled === 'true' ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Provider & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Server className="w-3.5 h-3.5 text-gray-400" /> AI Provider
                </label>
                <select
                  value={chatbotForm.chatbot_provider}
                  onChange={e => setChatbotForm(f => ({ ...f, chatbot_provider: e.target.value }))}
                  className={INPUT}
                >
                  <option value="groq">Groq (Free — llama/Gemma models)</option>
                  <option value="openai">OpenAI (GPT-4o-mini etc.)</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter (Any openrouter.ai model)</option>
                  <option value="huggingface">HuggingFace Inference API</option>
                  <option value="custom">Custom / Self-hosted (OpenAI-compatible)</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  {chatbotForm.chatbot_provider === 'groq' && 'Free tier \u00b7 console.groq.com'}
                  {chatbotForm.chatbot_provider === 'openai' && 'platform.openai.com'}
                  {chatbotForm.chatbot_provider === 'gemini' && 'aistudio.google.com'}
                  {chatbotForm.chatbot_provider === 'openrouter' && 'openrouter.ai \u00b7 Access hundreds of models (many free)'}
                  {chatbotForm.chatbot_provider === 'huggingface' && 'huggingface.co/settings/tokens \u00b7 supports any text-generation model'}
                  {chatbotForm.chatbot_provider === 'custom' && 'Any /v1/chat/completions endpoint (Ollama, LM Studio, Together AI, Mistral...)'}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-gray-400" /> Model Name
                </label>
                {chatbotForm.chatbot_provider === 'openrouter' ? (
                  <>
                    <select
                      value={[
                        'stepfun/step-3.5-flash:free',
                        'meta-llama/llama-3.3-70b-instruct:free',
                        'nvidia/nemotron-3-super-120b-a12b:free',
                        'nousresearch/hermes-3-llama-3.1-405b:free',
                        'google/gemma-3n-e4b-it:free',
                        'qwen/qwen3-4b:free',
                        'openrouter/free',
                      ].includes(chatbotForm.chatbot_model) ? chatbotForm.chatbot_model : '__custom__'}
                      onChange={e => {
                        if (e.target.value !== '__custom__') setChatbotForm(f => ({ ...f, chatbot_model: e.target.value }));
                        else setChatbotForm(f => ({ ...f, chatbot_model: '' }));
                      }}
                      className={INPUT + ' mb-1.5'}
                    >
                      <option value="stepfun/step-3.5-flash:free">⚡ stepfun/step-3.5-flash:free (Recommended — Reasoning)</option>
                      <option value="meta-llama/llama-3.3-70b-instruct:free">🦙 meta-llama/llama-3.3-70b-instruct:free</option>
                      <option value="nvidia/nemotron-3-super-120b-a12b:free">🟢 nvidia/nemotron-3-super-120b-a12b:free</option>
                      <option value="nousresearch/hermes-3-llama-3.1-405b:free">🔬 nousresearch/hermes-3-llama-3.1-405b:free</option>
                      <option value="google/gemma-3n-e4b-it:free">🌐 google/gemma-3n-e4b-it:free</option>
                      <option value="qwen/qwen3-4b:free">🇨🇳 qwen/qwen3-4b:free</option>
                      <option value="openrouter/free">🔀 openrouter/free (Auto-select best free)</option>
                      <option value="__custom__">✏️ Custom model ID…</option>
                    </select>
                    <input type="text"
                      value={chatbotForm.chatbot_model}
                      onChange={e => setChatbotForm(f => ({ ...f, chatbot_model: e.target.value }))}
                      placeholder="e.g. stepfun/step-3.5-flash:free"
                      className={INPUT}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Browse all free models at <a href="https://openrouter.ai/models?q=free" target="_blank" rel="noreferrer" className="underline text-[#4e66b3]">openrouter.ai/models</a></p>
                  </>
                ) : (
                  <>
                    <input type="text"
                      value={chatbotForm.chatbot_model}
                      onChange={e => setChatbotForm(f => ({ ...f, chatbot_model: e.target.value }))}
                      placeholder={
                        chatbotForm.chatbot_provider === 'groq' ? 'llama-3.1-8b-instant' :
                        chatbotForm.chatbot_provider === 'openai' ? 'gpt-4o-mini' :
                        chatbotForm.chatbot_provider === 'gemini' ? 'gemini-1.5-flash' :
                        chatbotForm.chatbot_provider === 'huggingface' ? 'mistralai/Mixtral-8x7B-Instruct-v0.1' :
                        'your-model-name'
                      }
                      className={INPUT}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      {chatbotForm.chatbot_provider === 'huggingface' ? 'Use org/model-name format from huggingface.co' : 'Leave blank to use provider default'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Custom Endpoint URL — for huggingface/custom */}
            {(chatbotForm.chatbot_provider === 'custom' || chatbotForm.chatbot_provider === 'huggingface') && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  {chatbotForm.chatbot_provider === 'huggingface' ? 'HuggingFace Endpoint URL (optional)' : 'Custom API Endpoint URL'}
                </label>
                <input type="url"
                  value={chatbotForm.chatbot_endpoint_url || ''}
                  onChange={e => setChatbotForm(f => ({ ...f, chatbot_endpoint_url: e.target.value }))}
                  placeholder={
                    chatbotForm.chatbot_provider === 'huggingface'
                      ? 'Leave blank for standard Inference API (auto-fills from model name)'
                      : 'https://your-server.com/v1/chat/completions'
                  }
                  className={INPUT}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {chatbotForm.chatbot_provider === 'huggingface'
                    ? 'Use a Dedicated Endpoint URL for private/fine-tuned models. Public models can leave this blank.'
                    : 'Must be OpenAI-compatible. Confirmed working with Ollama, Together AI, Anyscale, Mistral AI, LM Studio.'
                  }
                </p>
              </div>
            )}

            {/* API Key */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-gray-400" />
                  {chatbotForm.chatbot_provider === 'huggingface' ? 'HuggingFace Access Token (hf_...)' : 'API Key'}
                </label>
                <button
                  type="button"
                  onClick={handleTestAiConnection}
                  disabled={testingAi || !chatbotForm.chatbot_api_key}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-md bg-[#4e66b3]/10 text-[#4e66b3] hover:bg-[#4e66b3]/20 transition-colors disabled:opacity-50"
                >
                  {testingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  {testingAi ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={chatbotForm.chatbot_api_key}
                  onChange={e => setChatbotForm(f => ({ ...f, chatbot_api_key: e.target.value }))}
                  placeholder={chatbotForm.chatbot_provider === 'huggingface' ? 'hf_...' : 'Paste your API key here...'}
                  className={INPUT + ' pr-10'}
                />
                <button type="button" onClick={() => setShowApiKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Stored securely server-side. Never exposed to the browser.</p>
            </div>

            {/* Bot Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 text-gray-400" /> Bot Display Name
                </label>
                <input type="text"
                  value={chatbotForm.chatbot_bot_name}
                  onChange={e => setChatbotForm(f => ({ ...f, chatbot_bot_name: e.target.value }))}
                  placeholder="Health Assistant"
                  className={INPUT}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> Chat Accent Color
                </label>
                <div className="flex gap-2 items-center">
                  <input type="color"
                    value={chatbotForm.chatbot_color}
                    onChange={e => setChatbotForm(f => ({ ...f, chatbot_color: e.target.value }))}
                    className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <input type="text"
                    value={chatbotForm.chatbot_color}
                    onChange={e => setChatbotForm(f => ({ ...f, chatbot_color: e.target.value }))}
                    className={INPUT}
                    placeholder="#4e66b3"
                  />
                </div>
              </div>
            </div>

            {/* Welcome & Placeholder */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <Send className="w-3.5 h-3.5 text-gray-400" /> Welcome Message
              </label>
              <textarea
                rows={2}
                value={chatbotForm.chatbot_welcome_msg}
                onChange={e => setChatbotForm(f => ({ ...f, chatbot_welcome_msg: e.target.value }))}
                className={INPUT + ' resize-none'}
                placeholder="Hello! How can I help you today?"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-gray-400" /> Input Placeholder Text
              </label>
              <input type="text"
                value={chatbotForm.chatbot_placeholder}
                onChange={e => setChatbotForm(f => ({ ...f, chatbot_placeholder: e.target.value }))}
                placeholder="Ask about our services..."
                className={INPUT}
              />
            </div>

            {/* Suggested Questions */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Suggested Questions
                <span className="normal-case font-normal text-gray-400 ml-1">(shown as quick chips to users)</span>
              </label>
              <textarea
                rows={5}
                value={chatbotForm.chatbot_suggested_questions}
                onChange={e => setChatbotForm(f => ({ ...f, chatbot_suggested_questions: e.target.value }))}
                className={INPUT + ' resize-y'}
                placeholder={"What services do you offer?\nWhat are your opening hours?\nHow do I book an appointment?"}
              />
              <p className="text-[11px] text-gray-400 mt-1">One question per line. These appear as tap-to-ask chips when users first open the chatbot.</p>
            </div>

            {/* Custom System Prompt */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-gray-400" /> Custom System Prompt
                <span className="normal-case font-normal text-gray-400 ml-1">(Advanced)</span>
              </label>
              <textarea
                rows={7}
                value={chatbotForm.chatbot_system_prompt}
                onChange={e => setChatbotForm(f => ({ ...f, chatbot_system_prompt: e.target.value }))}
                className={INPUT + ' resize-y font-mono text-xs leading-relaxed'}
                placeholder="Leave blank to use the built-in healthcare assistant prompt."
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Services, doctors, clinic hours, contact info and website pages are automatically injected into context. Only define role/tone/rules here.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

