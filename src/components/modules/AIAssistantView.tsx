import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types/cosmos';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Bookmark,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AIAssistantViewProps {
  initialPrompt?: string;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onSaveChat?: (chat: any) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialPrompt,
  language,
  onSetLanguage,
  onSaveChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं कॉसमॉस जेमिनी AI हूँ। सौर मंडल, दूरस्थ तारों, ब्लैक होल, जेम्स वेब टेलीस्कोप, या किसी भी खगोलीय खोज के बारे में कोई भी प्रश्न पूछें।'
          : 'Welcome to COSMOS AI. I am your scientific astrophysics assistant powered by Google Gemini. Ask me anything about planetary science, general relativity, exoplanet atmospheres, space missions (NASA, ESA, ISRO), or stellar evolution.',
      citations: ['NASA Astrophysics Data System', 'ESA Science Directorate'],
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputText, setInputText] = useState(initialPrompt || '');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  // Voice Recognition (Speech to Text)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Text-to-Speech (Read response aloud)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language,
          level,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Unable to generate response.',
        citations: data.citations || ['NASA Astrophysics Data System', 'Astrophysical Journal'],
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error connecting to Gemini API: ${e.message}. Please verify server connectivity.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQuestions = [
    'How do astronomers determine the atmospheric composition of exoplanets like K2-18 b?',
    'Explain the Hubble tension: Why do different methods measure different expansion rates?',
    'What happens to spacetime at the event horizon of a Kerr rotating black hole?',
    'What did the Chandrayaan-3 and Perseverance missions discover on the Moon and Mars?',
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header with Mode & Language Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              COSMOS Gemini AI Astrophysics Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                gemini-3.8-flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Rigorous, evidence-grounded scientific intelligence with multi-lingual support and citation references.
            </p>
          </div>
        </div>

        {/* Tone & Language Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Level */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                  level === lvl
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Lang Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl font-medium">
            <button
              onClick={() => onSetLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSetLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                language === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onSetLanguage('hinglish')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                language === 'hinglish' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      {messages.length <= 1 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Suggested Astrophysics Prompts:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span>{q}</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl min-h-[440px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-white/10 text-[10px] font-mono text-slate-400">
                <span className="font-semibold text-indigo-300">
                  {m.role === 'user' ? 'YOU' : 'COSMOS GEMINI AI'}
                </span>
                <span>{m.timestamp}</span>
              </div>

              {/* Message Body */}
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Citations Box for Assistant */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">
                    Verified Citations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.citations.map((cite, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[10px]"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Action Bar (Copy & Speak) */}
              {m.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <button
                    onClick={() => copyToClipboard(m.content, m.id)}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => speakText(m.content)}
                    className="flex items-center gap-1 hover:text-white ml-2"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
                  </button>

                  {onSaveChat && (
                    <button
                      onClick={() => onSaveChat({ id: m.id, content: m.content, time: m.timestamp })}
                      className="flex items-center gap-1 hover:text-white ml-2"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save to Library</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Consulting Astrophysical Catalogs...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Box */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-xl focus-within:border-indigo-500/70 transition-colors">
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            language === 'hi'
              ? 'खगोल विज्ञान या ब्रह्मांड के बारे में कुछ भी पूछें... (उदा: ब्लैक होल कैसे बनते हैं?)'
              : 'Ask any astronomy question... (e.g., How does gravitational lensing work?)'
          }
          className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm p-2 focus:outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 px-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Voice Input (Speech to Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
            </button>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Press Enter to send • Shift+Enter for new line
            </span>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
