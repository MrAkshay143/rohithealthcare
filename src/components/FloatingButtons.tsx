import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone, MessageCircle, Bot, X, Send, Loader2,
  RefreshCw, PhoneCall, ChevronDown,
} from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { isTrueValue } from "@/services/content";
import { api } from "@/services/api";

/* ─── Types ─────────────────────────────────────────────── */
interface Message { role: "user" | "assistant"; content: string; }
interface BotConfig {
  enabled: boolean;
  bot_name: string;
  welcome_message: string;
  placeholder: string;
  primary_color: string;
}

const QUICK_CHIPS = [
  "What services do you offer?",
  "What are your opening hours?",
  "How do I book an appointment?",
  "Where is the clinic located?",
];

/* ─── Component ─────────────────────────────────────────── */
export function FloatingButtons() {
  const content = useContent();
  const rawPhone = (content["floating_phone_number"] || content["contact_phone"] || "").toString().replace(/\D/g, "");
  const phoneNumber = rawPhone.length === 10 ? `+91${rawPhone}` : `+${rawPhone}`;

  const rawWa = (content["floating_whatsapp_number"] || content["contact_whatsapp"] || "").toString().replace(/\D/g, "");
  const whatsappNumber = rawWa.length === 10 ? `91${rawWa}` : rawWa;
  const showWhatsapp  = isTrueValue(content["floating_whatsapp_visible"]);
  const showPhone     = isTrueValue(content["floating_phone_visible"]);

  /* ── Chatbot state ── */
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [chatOpen, setChatOpen]   = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [unread, setUnread]       = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Load chatbot config
  useEffect(() => {
    api.get<BotConfig>("/chatbot/config")
      .then(cfg => setBotConfig(cfg))
      .catch(() => {});
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (chatOpen && messages.length === 0 && botConfig?.welcome_message) {
      setMessages([{ role: "assistant", content: botConfig.welcome_message }]);
    }
    if (chatOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen, botConfig?.welcome_message, messages.length]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setError("");
    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await api.post<{ reply: string }>("/chatbot/chat", {
        message: msg,
        history: messages.slice(-12).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
      if (!chatOpen) setUnread(n => n + 1);
    } catch {
      setError("Failed to get a response. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, chatOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const resetChat = () => {
    setMessages(botConfig?.welcome_message ? [{ role: "assistant", content: botConfig.welcome_message }] : []);
    setInput(""); setError(""); setLoading(false);
  };

  const showChatbot = botConfig?.enabled === true;
const brand = botConfig?.primary_color || "#4e66b3";

/* ─── Markdown Rendering Helpers ─── */
function renderMessage(content: string, brand: string) {
  const lines = content.split("\n");
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
    if (!trimmed) { flushList(String(idx)); return; }
    
    const bulletMatch = line.match(/^\s*([-*•])\s+(.+)$/);
    if (bulletMatch) { listItems.push(bulletMatch[2]); return; }

    const numMatch = line.match(/^\s*(\d+[\.)])\s+(.+)$/);
    if (numMatch) { listItems.push(numMatch[2]); return; }

    flushList(String(idx));
    
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      elements.push(
        <div key={idx} className={`font-bold text-gray-900 mt-2 mb-1 ${level === 1 ? "text-lg" : "text-base"}`}>
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
  flushList("end");
  return <div className="space-y-1.5">{elements}</div>;
}

function inlineRender(text: string, brand: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((tel:[^\s)]+|mailto:[^\s)]+|https?:\/\/[^\s)]+)\))/g;
  let last = 0; let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    
    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index} className="font-bold text-gray-900">{match[2]}</strong>);
    } else if (match[0].startsWith("*")) {
      parts.push(<em key={match.index} className="italic text-gray-800">{match[3]}</em>);
    } else {
      const label = match[4];
      const href  = match[5];
      const isPhone = href.startsWith("tel:");
      const isMail  = href.startsWith("mailto:");

      parts.push(
        <a key={match.index} href={href} target={isPhone || isMail ? undefined : "_blank"}
          rel={isPhone || isMail ? undefined : "noreferrer noopener"}
          className="inline font-bold underline underline-offset-4 decoration-2 transition-opacity hover:opacity-75"
          style={{ color: brand }}>
          {label}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

  if (!showWhatsapp && !showPhone && !showChatbot) return null;

  return (
    <>
      {/* ── Floating Button Stack (bottom-right) ── */}
      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 flex flex-col gap-3">

        {/* AI Chatbot button — replaces WhatsApp slot */}
        {showChatbot && (
          <button
            onClick={() => setChatOpen(o => !o)}
            aria-label={chatOpen ? "Close chat" : "Open AI Health Assistant"}
            className="relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
            style={{ backgroundColor: brand }}
          >
            {/* Pulse ring */}
            {!chatOpen && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: brand }}
              />
            )}
            {chatOpen
              ? <ChevronDown className="h-5 w-5 relative z-10" strokeWidth={2.5} />
              : <Bot className="h-5 w-5 relative z-10" strokeWidth={2} />
            }
            {/* Unread badge */}
            {!chatOpen && unread > 0 && (
              <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        )}

        {/* WhatsApp — only show if chatbot is NOT enabled */}
        {showWhatsapp && !showChatbot && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white transition-transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(37,211,102,0.6)]"
          >
            <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
          </a>
        )}

        {/* Phone call */}
        {showPhone && (
          <a
            href={`tel:${phoneNumber}`}
            aria-label="Call"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4e66b3] text-white transition-transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(78,102,179,0.55)]"
          >
            <Phone className="h-5 w-5 shrink-0" strokeWidth={2.5} />
          </a>
        )}
      </div>

      {/* ── Chat Panel ─────────────────────────────────────── */}
      {showChatbot && (
        <div
          className={`
            fixed z-50 flex flex-col overflow-hidden
            transition-all duration-300 ease-out
            ${chatOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
            }
            bottom-0 left-0 right-0 h-[92dvh] rounded-t-2xl
            sm:bottom-24 sm:right-6 sm:left-auto sm:w-[380px] sm:h-[530px] sm:rounded-2xl
            lg:bottom-24 lg:right-8 lg:w-[380px]
            bg-white shadow-2xl shadow-black/20 border border-gray-100
          `}
          role="dialog"
          aria-label="AI Health Assistant Chat"
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brand}cc 100%)` }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">{botConfig?.bot_name || "Health Assistant"}</p>
              <p className="text-white/70 text-[11px] leading-tight">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1 align-middle" />
                Online · Replies instantly
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} title="New conversation"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/70 hover:text-white">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setChatOpen(false)} aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: `${brand}20` }}>
                    <Bot className="h-3.5 w-3.5" style={{ color: brand }} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "rounded-br-md text-white"
                      : "rounded-bl-md bg-gray-50 text-gray-800 border border-gray-100"
                  }`}
                  style={msg.role === "user" ? { backgroundColor: brand } : {}}
                >
                  {msg.role === "assistant"
                    ? renderMessage(msg.content, brand)
                    : msg.content
                  }
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: `${brand}20` }}>
                  <Bot className="h-3.5 w-3.5" style={{ color: brand }} />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-gray-50 border border-gray-100 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: brand, animationDelay: `${d * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex gap-2 justify-start">
                <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-red-50 text-red-700 text-sm border border-red-100 shadow-sm">
                  {error}
                  {content["contact_phone"] && (
                    <a 
                      href={`tel:${((content["contact_phone"] || "").toString().replace(/\D/g, "").length === 10) ? '+91' : '+'}${content["contact_phone"].toString().replace(/\D/g, "")}`}
                      className="flex items-center gap-1 mt-1.5 font-semibold underline underline-offset-2"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Call us directly
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick chips */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {QUICK_CHIPS.map(chip => (
                  <button key={chip} onClick={() => sendMessage(chip)}
                    className="text-[11.5px] font-medium px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 transition-all"
              style={{ outline: "none" }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={botConfig?.placeholder || "Ask about our services..."}
                maxLength={800}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0 disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage()}
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
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">
              AI assistant · Not a substitute for professional medical advice
            </p>
          </div>
        </div>
      )}
    </>
  );
}
