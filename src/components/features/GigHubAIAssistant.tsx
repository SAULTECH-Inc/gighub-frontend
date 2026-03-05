import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, Briefcase, Search } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface JobResult {
  id?: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  url?: string;
}

interface CandidateResult {
  id?: string;
  name: string;
  title?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  url?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  resultsUrl?: string;
  jobResults?: JobResult[];
  candidateResults?: CandidateResult[];
  isError?: boolean;
}

type UserType = 'employer' | 'applicant' | null;

// ─── Session storage key ──────────────────────────────────────────────────────
const SESSION_KEY = 'gighub_ai_chat';
const AI_BASE_URL = import.meta.env.VITE_API_AI_SERVICE_BASE_URL || '';

// ─── Result Cards ─────────────────────────────────────────────────────────────
const JobCard = ({ job }: { job: JobResult }) => (
  <a
    href={job.url || `/jobs/${job.id}/details`}
    target={job.url?.startsWith('http') ? '_blank' : undefined}
    rel="noopener noreferrer"
    className="block p-3 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-all group"
  >
    <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-700">{job.title}</p>
    {job.company && <p className="text-xs text-gray-600 mt-0.5">{job.company}</p>}
    <div className="flex flex-wrap gap-1.5 mt-2">
      {job.location && (
        <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
          📍 {job.location}
        </span>
      )}
      {job.type && (
        <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
          {job.type}
        </span>
      )}
      {job.salary && (
        <span className="text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-200 text-green-700">
          💰 {job.salary}
        </span>
      )}
    </div>
  </a>
);

const CandidateCard = ({ candidate }: { candidate: CandidateResult }) => (
  <a
    href={candidate.url || `/applicant/public-profile-view/${candidate.id}`}
    target={candidate.url?.startsWith('http') ? '_blank' : undefined}
    rel="noopener noreferrer"
    className="block p-3 bg-purple-50 rounded-xl border border-purple-100 hover:border-purple-300 hover:bg-purple-100 transition-all group"
  >
    <p className="font-semibold text-sm text-gray-800 group-hover:text-purple-700">{candidate.name}</p>
    {candidate.title && <p className="text-xs text-gray-600 mt-0.5">{candidate.title}</p>}
    {candidate.experience && (
      <p className="text-xs text-gray-500 mt-0.5">📅 {candidate.experience}</p>
    )}
    {candidate.skills?.length ? (
      <div className="flex flex-wrap gap-1 mt-2">
        {candidate.skills.slice(0, 4).map((skill, i) => (
          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="text-xs text-gray-400">+{candidate.skills.length - 4} more</span>
        )}
      </div>
    ) : null}
  </a>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const GigHubAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    role: 'assistant',
    content: "Hi! I'm your **GigHub AI assistant**. I can help you find jobs or discover top talent. What would you like to do today?",
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.messages || [initialMessage];
      }
    } catch {/* ignore */ }
    return [initialMessage];
  });

  // ── Restore session data ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userType) setUserType(parsed.userType);
        if (parsed.conversationId) setConversationId(parsed.conversationId);
      }
    } catch {/* ignore */ }
  }, []);

  // ── Persist to session storage ────────────────────────────────────────────
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ messages, userType, conversationId }));
    } catch {/* ignore */ }
  }, [messages, userType, conversationId]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleUserTypeSelection = useCallback((type: 'employer' | 'applicant') => {
    setUserType(type);
    const msg = type === 'employer'
      ? "Great! Tell me what kind of talent you're looking for.\n\nFor example: *\"I need a React Native developer with 5+ years of experience, remote-friendly\"*"
      : "Awesome! What kind of job are you looking for?\n\nFor example: *\"I'm looking for a senior backend role, remote in Europe, at least $80k/year\"*";

    setMessages(prev => [...prev, { role: 'assistant', content: msg, timestamp: new Date() }]);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !userType || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${AI_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          user_type: userType,
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || data.message || 'Here are your results:',
        timestamp: new Date(),
        resultsUrl: data.results_url,
        jobResults: data.jobs || data.job_results,
        candidateResults: data.candidates || data.candidate_results,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${errMsg}. Please try again.`,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, userType, isLoading, conversationId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    setUserType(null);
    setConversationId(null);
    setInput('');
    sessionStorage.removeItem(SESSION_KEY);
  };

  const charCount = input.length;
  const MAX_CHARS = 500;

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open GigHub AI Assistant"
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 z-[999999]"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="GigHub AI Assistant"
          className="fixed bottom-6 right-6 w-[92%] md:w-[400px] h-[calc(100vh-100px)] max-h-[640px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-[999999]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">GigHub AI</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="New conversation"
                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close (Esc)"
                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Type Selection */}
          {!userType && messages.length === 1 && (
            <div className="px-4 py-3 bg-gradient-to-b from-gray-50 to-white border-b flex-shrink-0">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">I'm here to help you</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUserTypeSelection('employer')}
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  Hire Talent
                </button>
                <button
                  onClick={() => handleUserTypeSelection('applicant')}
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Find Jobs
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                      ? 'bg-blue-600'
                      : msg.isError
                        ? 'bg-red-400'
                        : 'bg-gradient-to-br from-purple-600 to-blue-600'
                    }`}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot className="w-3.5 h-3.5 text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.isError
                          ? 'bg-red-50 text-red-700 rounded-bl-none border border-red-200'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                      }`}>
                      {msg.content}
                    </div>

                    {/* Job Results */}
                    {msg.jobResults?.length ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-gray-500 ml-1">Found {msg.jobResults.length} job{msg.jobResults.length !== 1 ? 's' : ''}:</p>
                        {msg.jobResults.map((job, i) => <JobCard key={i} job={job} />)}
                      </div>
                    ) : null}

                    {/* Candidate Results */}
                    {msg.candidateResults?.length ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-gray-500 ml-1">Found {msg.candidateResults.length} candidate{msg.candidateResults.length !== 1 ? 's' : ''}:</p>
                        {msg.candidateResults.map((c, i) => <CandidateCard key={i} candidate={c} />)}
                      </div>
                    ) : null}

                    {/* View All Results link */}
                    {msg.resultsUrl && (
                      <a
                        href={msg.resultsUrl}
                        className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        View all results →
                      </a>
                    )}

                    <p className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[88%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            {userType && (
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${userType === 'employer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {userType === 'employer' ? '🏢 Hiring' : '💼 Job Seeker'}
                </span>
                <button onClick={resetChat} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  ← New chat
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  placeholder={userType ? "Describe what you're looking for..." : "Select an option above to start"}
                  disabled={!userType || isLoading}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm leading-relaxed"
                />
                {userType && (
                  <span className={`absolute bottom-2 right-2 text-[10px] ${charCount > MAX_CHARS * 0.9 ? 'text-orange-500' : 'text-gray-300'}`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                )}
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || !userType || isLoading}
                aria-label="Send message"
                className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Powered by GigHub AI · <kbd className="font-sans bg-gray-100 px-1 rounded">Enter</kbd> to send · <kbd className="font-sans bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GigHubAIAssistant;