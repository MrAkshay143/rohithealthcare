import { useEffect, useState, useCallback, useRef } from "react";
import {
  MessageSquare, Phone, MapPin, Clock, Globe, Monitor, Smartphone,
  Mail, Search, Send, Trash2, Eye,
  TrendingUp, Users, CheckCircle, AlertCircle, BarChart3,
  ArrowLeft, ChevronRight, MailCheck, MailX, User, Zap, Timer, AlertTriangle,
} from "lucide-react";
import { api } from "@/services/api";

type Message = {
  id: number; enquiry_id: number; sender: 'customer' | 'admin';
  message: string; sentViaEmail: boolean; createdAt: string;
};

type Enquiry = {
  id: number; name: string; phone: string; email?: string; message: string;
  city?: string; region?: string; country?: string;
  browser?: string; device?: string; ip?: string;
  status: 'new' | 'read' | 'replied';
  adminReply?: string; createdAt: string;
  messages_count?: number;
  messages?: Message[];
};

type Stats = {
  total: number; new: number; read: number; replied: number;
  daily: { date: string; count: number }[];
  topCities: { city: string; count: number }[];
  responseRate: number;
  avgResponse: number | null;
};

const STATUS_CFG = {
  new:     { label: 'New',     dot: 'bg-blue-500',  badge: 'bg-blue-50 text-blue-700 ring-blue-600/20', rowRing: 'ring-2 ring-blue-100' },
  read:    { label: 'Read',    dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 ring-amber-600/20', rowRing: '' },
  replied: { label: 'Replied', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', rowRing: '' },
};

function locationString(e: Enquiry) {
  const parts = [e.city, e.region, e.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { dateStyle: 'medium' });
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConvo, setLoadingConvo] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(() => window.innerWidth >= 1024);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    api.get<Enquiry[]>('/enquiries').then(setEnquiries).catch(() => {});
    api.get<Stats>('/enquiries/stats').then(setStats).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { document.title = 'Enquiries | Admin'; }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filtered = enquiries.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.phone.includes(q) || (e.email ?? '').toLowerCase().includes(q) || e.message.toLowerCase().includes(q);
    }
    return true;
  });

  async function selectEnquiry(e: Enquiry) {
    setSelectedId(e.id);
    setLoadingConvo(true);
    setReplyText('');
    try {
      const full = await api.get<Enquiry>(`/enquiries/${e.id}`);
      setSelectedEnquiry(full);
      setMessages(full.messages ?? []);
      // Update list status locally
      if (e.status === 'new') {
        setEnquiries(prev => prev.map(x => x.id === e.id ? { ...x, status: 'read' } : x));
        if (stats) setStats({ ...stats, new: Math.max(0, stats.new - 1), read: stats.read + 1 });
      }
    } catch {}
    setLoadingConvo(false);
  }

  async function handleSendMessage() {
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
      const msg = await api.post<Message>(`/enquiries/${selectedId}/messages`, {
        message: replyText,
        sendEmail: sendEmail && !!selectedEnquiry?.email,
      });
      setMessages(prev => [...prev, msg]);
      setReplyText('');
      setEnquiries(prev => prev.map(x => x.id === selectedId ? { ...x, status: 'replied', adminReply: replyText } : x));
      if (stats) {
        const wasReplied = enquiries.find(e => e.id === selectedId)?.status === 'replied';
        if (!wasReplied) setStats({ ...stats, replied: stats.replied + 1, read: Math.max(0, stats.read - 1) });
      }
    } catch {}
    setSending(false);
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(prev => prev.filter(x => x.id !== id));
      if (selectedId === id) { setSelectedId(null); setSelectedEnquiry(null); setMessages([]); }
      setDeleteConfirmId(null);
      load();
    } catch {}
  }

  const maxDaily = stats?.daily ? Math.max(...stats.daily.map(d => d.count), 1) : 1;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            Enquiries
            {stats && stats.new > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-500 text-[10px] font-black text-white animate-pulse">
                {stats.new}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer messages, conversations & follow-ups.</p>
        </div>
        <button
          onClick={() => setShowStats(v => !v)}
          className="text-xs font-semibold text-gray-500 hover:text-[#015851] flex items-center gap-1 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      {/* Stats Section */}
      {showStats && stats && (
        <div className="mb-4 space-y-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: 'Total', value: stats.total, Icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'New', value: stats.new, Icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Read', value: stats.read, Icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Replied', value: stats.replied, Icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Reply Rate', value: `${stats.responseRate}%`, Icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
              { label: 'Avg Response', value: stats.avgResponse != null ? `${Math.round(stats.avgResponse)}h` : '-', Icon: Timer, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map(({ label, value, Icon, color, bg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          {(stats.daily.length > 0 || stats.topCities.length > 0) && (
            <div className="grid lg:grid-cols-2 gap-3">
              {stats.daily.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-500" /> Last 7 Days
                  </h3>
                  <div className="flex items-end gap-1.5 h-20">
                    {stats.daily.map((d) => (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-gray-600">{d.count}</span>
                        <div
                          className="w-full bg-indigo-500 rounded-t min-h-0.75 transition-all"
                          style={{ height: `${(d.count / maxDaily) * 100}%` }}
                        />
                        <span className="text-[8px] text-gray-400">
                          {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {stats.topCities.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Top Locations
                  </h3>
                  <div className="space-y-1.5">
                    {stats.topCities.map((c, i) => {
                      const maxC = stats.topCities[0]?.count || 1;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-gray-600 w-20 truncate">{c.city}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(c.count / maxC) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 w-5 text-right">{c.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content - Split Panel */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3">
        {/* LEFT PANEL - Enquiry List */}
        <div className={`${selectedId ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-95 xl:w-105 lg:shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          {/* Filter + Search Bar */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="flex bg-gray-50 rounded-lg p-0.5 text-[11px] font-semibold">
              {(['all', 'new', 'read', 'replied'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-md capitalize transition-all ${
                    filter === f ? 'bg-white text-[#015851] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {f === 'all' ? `All` : f}
                  <span className="ml-0.5 text-[9px] opacity-60">
                    ({f === 'all' ? enquiries.length : enquiries.filter(e => e.status === f).length})
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, phone, email..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#015851]/20 focus:border-[#015851]"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  {enquiries.length === 0 ? 'No enquiries yet' : 'No matches found'}
                </p>
              </div>
            ) : (
              filtered.map(e => {
                const sc = STATUS_CFG[e.status];
                const isActive = selectedId === e.id;
                const loc = locationString(e);
                return (
                  <button
                    key={e.id}
                    onClick={() => selectEnquiry(e)}
                    className={`w-full text-left px-3 py-3 border-b border-gray-50 transition-all hover:bg-gray-50 ${
                      isActive ? 'bg-[#015851]/5 border-l-2 border-l-[#015851]' : ''
                    } ${e.status === 'new' ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        e.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        e.status === 'replied' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {e.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-sm font-bold truncate ${e.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>
                            {e.name}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(e.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{e.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ring-inset ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                          {loc && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5" />{loc}
                            </span>
                          )}
                          {e.email && <Mail className="w-2.5 h-2.5 text-gray-300" />}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Conversation */}
        <div className={`${selectedId ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-100`}>
          {!selectedId ? (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Select an enquiry</p>
                <p className="text-xs text-gray-300 mt-1">Choose from the list to view conversation</p>
              </div>
            </div>
          ) : loadingConvo ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-[#015851] border-t-transparent rounded-full" />
            </div>
          ) : selectedEnquiry && (
            <>
              {/* Conversation Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  {/* Back button (mobile) */}
                  <button
                    onClick={() => { setSelectedId(null); setSelectedEnquiry(null); }}
                    className="lg:hidden shrink-0 w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    selectedEnquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    selectedEnquiry.status === 'replied' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedEnquiry.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-gray-900 truncate">{selectedEnquiry.name}</h2>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ring-inset ${STATUS_CFG[selectedEnquiry.status].badge}`}>
                        {STATUS_CFG[selectedEnquiry.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-400 flex-wrap">
                      <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center gap-1 hover:text-[#015851] transition-colors">
                        <Phone className="w-3 h-3" />{selectedEnquiry.phone}
                      </a>
                      {selectedEnquiry.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />{selectedEnquiry.email}
                        </span>
                      )}
                      {locationString(selectedEnquiry) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{locationString(selectedEnquiry)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, '').slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </a>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4 text-blue-600" />
                    </a>
                    <button
                      onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Client metadata */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedEnquiry.device && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                      {selectedEnquiry.device === 'Mobile' ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                      {selectedEnquiry.device}
                    </span>
                  )}
                  {selectedEnquiry.browser && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                      <Globe className="w-2.5 h-2.5" />{selectedEnquiry.browser}
                    </span>
                  )}
                  {selectedEnquiry.ip && (
                    <span className="text-[10px] bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-md font-medium">
                      IP: {selectedEnquiry.ip}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-md font-medium">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              {/* Messages / Conversation */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400">No messages in this conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[70%] ${
                        msg.sender === 'admin'
                          ? 'bg-[#015851] text-white rounded-2xl rounded-br-md'
                          : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm'
                      } px-4 py-2.5`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${
                          msg.sender === 'admin' ? 'text-white/50' : 'text-gray-400'
                        }`}>
                          <span className="text-[10px]">
                            {new Date(msg.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          {msg.sender === 'admin' && (
                            msg.sentViaEmail
                              ? <MailCheck className="w-3 h-3 text-emerald-300" />
                              : <MailX className="w-3 h-3 opacity-40" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Compose Bar */}
              <div className="px-3 py-3 border-t border-gray-100 bg-white">
                {!selectedEnquiry.email ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    <MailX className="w-4 h-4 shrink-0" />
                    <span>Reply unavailable - this customer didn't provide an email address. Use <strong className="text-gray-600">WhatsApp</strong> or <strong className="text-gray-600">Call</strong> instead.</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setSendEmail(v => !v)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                          sendEmail
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Mail className="w-3 h-3" />
                        {sendEmail ? 'Email will be sent' : 'Email off'}
                      </button>
                      <span className="text-[10px] text-gray-400">→ {selectedEnquiry.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={replyText}
                        onChange={ev => setReplyText(ev.target.value)}
                        onKeyDown={ev => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); handleSendMessage(); } }}
                        rows={2}
                        placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015851]/25 focus:border-[#015851] bg-gray-50 resize-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !replyText.trim()}
                        className="self-end w-10 h-10 rounded-xl bg-[#015851] text-white flex items-center justify-center hover:bg-[#013f39] transition-colors disabled:opacity-40 shrink-0"
                      >
                        {sending
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Delete Enquiry?</p>
                <p className="text-[11px] text-gray-500">This will remove all messages and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

