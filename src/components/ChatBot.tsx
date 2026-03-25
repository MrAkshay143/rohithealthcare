import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, RefreshCw, PhoneCall, ChevronDown } from 'lucide-react';
import { api } from '@/services/api';
import { useContent } from '@/hooks/useContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts?: number;
}

interface BotConfig {
  enabled: boolean;
  bot_name: string;
  welcome_message: string;
  placeholder: string;
  primary_color: string;
  suggested_questions: string[];
}

const DEFAULT_CONFIG: BotConfig = {
  enabled: false,
  bot_name: 'Health Assistant',
  welcome_message: 'Hello! 👋 How can I help you today? Ask me anything about our services, hours, or how to get in touch.',
  placeholder: 'Ask about our services...',
  primary_color: '#4e66b3',
  suggested_questions: [
    'What services do you offer?',
    'What are your opening hours?',
    'How do I book an appointment?',
    'Where is the clinic located?',
  ],
};

const DEFAULT_CHIPS = [
  'What services do you offer?',
  'What are your opening hours?',
  'How do I book an appointment?',
  'Where is the clinic located?',
];

/**
 * Renders assistant message with markdown-like formatting:
 * - **bold**
 * - [text](url) links — phone tel:, mailto:, https
 * - Bullet/numbered lists
 * - Line breaks
 */
function renderMessage(content: string, brand: string) {
  // Process line by line
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${key}`} className="mt-1 mb-1 space-y-1.5 pl-3">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
            <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-40" />
            <span className="flex-1">{inlineRender(item, brand)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(String(idx));
      return;
    }
    
    // Bullet list: - or * or • (must be at start of line)
    const bulletMatch = line.match(/^\s*([-*•])\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      return;
    }

    // Numbered list: 1. or 1)
    const numMatch = line.match(/^\s*(\d+[\.)])\s+(.+)$/);
    if (numMatch) {
      listItems.push(numMatch[2]);
      return;
    }

    flushList(String(idx));
    
    // Header check: ### Title
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      elements.push(
        <div key={idx} className={`font-bold text-gray-900 mt-2 mb-1 ${level === 1 ? 'text-lg' : 'text-base'}`}>
          {inlineRender(headerMatch[2], brand)}
        </div>
      );
      return;
    }

    // Map embed: [MAP:address]
    const mapMatch = line.match(/\[MAP:(.+?)\]/);
    if (mapMatch) {
      const address = mapMatch[1];
      flushList(String(idx));
      elements.push(
        <div key={`map-${idx}`} className="my-2 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-opacity hover:opacity-95">
          <iframe
            width="100%"
            height="180"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      );
      return;
    }

    elements.push(
      <div key={idx} className="text-sm leading-relaxed text-gray-700">
        {inlineRender(line, brand)}
      </div>
    );
  });
  flushList('end');

  return <div className="space-y-1.5">{elements}</div>;
}

function inlineRender(text: string, brand: string): React.ReactNode[] {
  // Patterns: 
  // 1. **bold**
  // 2. *italic*
  // 3. [text](url)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((tel:[^\s)]+|mailto:[^\s)]+|https?:\/\/[^\s)]+)\))/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    
    if (match[0].startsWith('**')) {
      // Bold: **text**
      parts.push(<strong key={match.index} className="font-bold text-gray-900">{match[2]}</strong>);
    } else if (match[0].startsWith('*')) {
      // Italic: *text* (match[3] because of the regex capture groups)
      parts.push(<em key={match.index} className="italic text-gray-800">{match[3]}</em>);
    } else {
      // Link: [text](url) (match[4]=label, match[5]=url)
      // wait, group index might be different now
      // Group 1: full match
      // Group 2: bold content
      // Group 3: italic content
      // Group 4: link label
      // Group 5: link URL
      const label = (match[4] || "").replace(/\*\*|\*/g, ""); // Strip markdown from title
      const href  = match[5];
      const isPhone = href.startsWith('tel:');
      const isMail  = href.startsWith('mailto:');

      // Shorten label if it's just a long URL
      let displayLabel = label;
      if (label.startsWith("http") && label.length > 25) {
        try { displayLabel = new URL(label).hostname + "..."; } catch { displayLabel = label.slice(0, 25) + "..."; }
      }

      parts.push(
        <a
          key={match.index}
          href={href}
          target={isPhone || isMail ? undefined : '_blank'}
          rel={isPhone || isMail ? undefined : 'noreferrer noopener'}
          className="inline font-bold underline underline-offset-4 decoration-2 transition-opacity hover:opacity-75"
          style={{ color: brand }}
        >
          {displayLabel}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatBot() {
  const content = useContent();
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load chatbot config once
  useEffect(() => {
    api.get<BotConfig>('/chatbot/config')
      .then(cfg => {
        setConfig({ ...DEFAULT_CONFIG, ...cfg });
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
  }, []);

  // Initialize welcome message when opened for first time
  useEffect(() => {
    if (open && messages.length === 0 && config.welcome_message) {
      setMessages([{ role: 'assistant', content: config.welcome_message, ts: Date.now() }]);
    }
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, config.welcome_message, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput('');
    setError('');
    const history = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0);
    const newMessages: Message[] = [...messages, { role: 'user', content: msg, ts: Date.now() }];
    setMessages(newMessages);
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const res = await api.post<{ reply: string }>('/chatbot/chat', {
        message: msg,
        history: history.slice(-12).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply, ts: Date.now() }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setError('Failed to get a response. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);



  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([{ role: 'assistant', content: config.welcome_message, ts: Date.now() }]);
    setInput('');
    setError('');
    setLoading(false);
  };

  if (!configLoaded || !config.enabled) return null;

  const phone = content['contact_phone'] || '';
  const brand = config.primary_color;
  const chips = config.suggested_questions?.length ? config.suggested_questions : DEFAULT_CHIPS;

  return (
    <>
      {/* ── Floating Launcher Button ─────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-28 right-4 sm:bottom-32 sm:right-6 z-50 flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        style={{ backgroundColor: brand }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: brand }}
        />
        {open ? (
          <ChevronDown className="h-6 w-6 text-white relative z-10" strokeWidth={2.5} />
        ) : (
          <MessageCircle className="h-6 w-6 text-white relative z-10" strokeWidth={2} />
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* ── Chat Panel ──────────────────────────────────────── */}
      <div
        className={`
          fixed z-50 flex flex-col overflow-hidden
          transition-all duration-300 ease-out
          ${open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
          bottom-0 left-0 right-0 h-[92dvh] rounded-t-2xl
          sm:bottom-20 sm:right-6 sm:left-auto sm:w-[390px] sm:h-[540px] sm:rounded-2xl
          lg:bottom-24 lg:right-8 lg:w-[390px] lg:h-[550px]
          bg-white shadow-2xl shadow-black/20 border border-gray-100
        `}
        role="dialog"
        aria-label="Chat with Health Assistant"
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brand}cc 100%)` }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 shrink-0">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">{config.bot_name}</p>
            <p className="text-white/70 text-[11px] leading-tight">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1 align-middle" />
              Online · Typically replies instantly
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              title="Reset conversation"
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/70 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: `${brand}20` }}
                >
                  <Bot className="h-3.5 w-3.5" style={{ color: brand }} />
                </div>
              )}
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-br-md text-white text-sm leading-relaxed'
                    : 'rounded-bl-md bg-gray-50 text-gray-800 border border-gray-100'
                }`}
                style={msg.role === 'user' ? { backgroundColor: brand } : {}}
              >
                {msg.role === 'assistant'
                  ? renderMessage(msg.content, brand)
                  : msg.content
                }
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: `${brand}20` }}
              >
                <Bot className="h-3.5 w-3.5" style={{ color: brand }} />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-gray-50 border border-gray-100 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(d => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: brand, animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex gap-2 justify-start">
              <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-red-50 text-red-700 text-sm border border-red-100 shadow-sm">
                {error}
                {phone && (
                  <a
                    href={`tel:+${phone}`}
                    className="flex items-center gap-1 mt-1.5 font-semibold underline underline-offset-2"
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> Call us directly
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quick chips — only after welcome message & no further messages */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {chips.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-[11.5px] font-medium px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm truncate max-w-full"
                  style={{ borderColor: `${brand}44` }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[color:var(--brand)] focus-within:ring-2 transition-all"
            style={{ '--brand': brand } as React.CSSProperties}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={config.placeholder}
              maxLength={800}
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{ backgroundColor: brand }}
              aria-label="Send"
            >
              {loading
                ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                : <Send className="h-3.5 w-3.5 text-white" />
              }
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-1.5">
            Powered by AI · Not a substitute for professional medical advice
          </p>
        </div>
      </div>
    </>
  );
}
