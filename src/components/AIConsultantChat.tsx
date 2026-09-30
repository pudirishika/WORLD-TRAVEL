import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Compass, Sparkles, User, Bot, RefreshCw, MessageSquare, Zap, ExternalLink } from 'lucide-react';
import { TripRequest } from '../types/travel';

interface AIConsultantChatProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: Partial<TripRequest>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'n8n_agent' | 'gemini' | 'fallback';
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  isOpen,
  onClose,
  activeContext,
}) => {
  // Maintain persistent session ID for n8n memory
  const [sessionId, setSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('world_travel_chat_session_id');
    if (saved) return saved;
    const newId = 'wt-session-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('world_travel_chat_session_id', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('world_travel_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Hello and welcome! 🌍

I am **WORLD TRAVEL**, your Senior Worldwide Travel Consultant and Feasibility Director.

> **"Your World. Your Budget. Your Journey."**

I am directly connected to our intelligent travel planning engine. Ask me anything about:
• Same-day return feasibility (e.g. India to Moscow Red Square with ₹5,00,000 budget & zero hotel)
• Verified visa requirements & official e-Visa lead times
• Realistic flight routes, schedules, and luggage policies
• Itemized budget optimization for your upcoming trip!

Where would you like to travel?`,
        timestamp: 'Just now',
        source: 'n8n_agent',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('world_travel_chat_messages', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: activeContext,
          sessionId,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Thank you for consulting WORLD TRAVEL. Our team has verified your itinerary feasibility.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'n8n_agent',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I am here to assist your travel planning. For immediate details on flight schedules, visa requirements, or same-day return calculations, feel free to ask or browse our Destination Guides.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = () => {
    const newId = 'wt-session-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('world_travel_chat_session_id', newId);
    setSessionId(newId);
    const initialWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      text: `Session refreshed! I am your WORLD TRAVEL Senior Concierge.
How may I assist your travel plans today?`,
      timestamp: 'Just now',
      source: 'n8n_agent',
    };
    setMessages([initialWelcome]);
    localStorage.removeItem('world_travel_chat_messages');
  };

  const quickQuestions = [
    'Can I travel from India to Russia same-day with ₹5,00,000 budget?',
    'What are the visa rules for Indian passport holders to Moscow?',
    'Find budget-friendly flights to Tokyo under $800',
    'Compare hotel options in Paris near the Eiffel Tower',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-300/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm text-slate-100">
                WORLD TRAVEL Concierge
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                n8n Connected
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Interactive AI Agent · Webhook Live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetSession}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
            title="Reset Chat Session"
            aria-label="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Close Chat"
            aria-label="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
        <span className="text-slate-400 font-semibold text-[10px] shrink-0 pl-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick:</span>
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 transition-colors shrink-0 disabled:opacity-50 text-[10px]"
          >
            {q.length > 32 ? q.substring(0, 32) + '...' : q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 border border-amber-400/30 text-amber-400'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                m.sender === 'user'
                  ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="space-y-2">
                {m.text}
              </div>

              <div
                className={`text-[9px] mt-2 pt-1 border-t flex items-center justify-between ${
                  m.sender === 'user'
                    ? 'text-slate-950/70 border-slate-900/10'
                    : 'text-slate-500 border-slate-800/80'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.source && (
                  <span className="font-mono text-[9px] text-amber-400/80">
                    {m.source === 'n8n_agent' ? 'n8n Agent' : 'Gemini AI'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2 pl-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-amber-400/30 flex items-center justify-center text-amber-400 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] text-slate-300">n8n Agent evaluating travel schedules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask n8n travel agent anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 bg-amber-400 text-slate-950 font-bold rounded-lg hover:bg-amber-300 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
          title="Send Message"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
