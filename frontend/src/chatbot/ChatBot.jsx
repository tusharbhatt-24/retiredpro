import { useState, useRef, useEffect, useCallback } from 'react';

// ─── ChatBot Widget ─────────────────────────────────────────────────────────
// Universal, self-contained, DOM-aware AI chatbot widget.
// Uses Puter.js for free unlimited Claude access — no API keys, no backend.
// Includes interactive FAQ menu, AI navigation, and end-of-session star review.
// ────────────────────────────────────────────────────────────────────────────

// ── FAQ Menu Data ─────────────────────────────────────────────────────────────
const MENU_DATA = [
  {
    id: 'verification',
    icon: '🔐',
    label: 'Verification & Identity',
    subs: [
      { id: 'selfie', label: 'Selfie / Camera not working', message: 'My camera or selfie capture is not working during identity verification. How can I fix this?' },
      { id: 'otp', label: 'OTP not received', message: 'I haven\'t received my OTP on the mobile number I entered. What should I do?' },
      { id: 'digilocker', label: 'DigiLocker connection failed', message: 'I\'m having trouble connecting to DigiLocker for identity verification. Please help.' },
      { id: 'id_upload', label: 'ID document upload issue', message: 'I\'m unable to upload my government ID document. Can you guide me?' },
    ],
  },
  {
    id: 'employment',
    icon: '💼',
    label: 'Employment & Resume',
    subs: [
      { id: 'resume_scan', label: 'Resume scan stuck or failed', message: 'My resume/CV scan seems to be stuck or showed an error. What\'s the issue?' },
      { id: 'doc_upload', label: 'Document upload not working', message: 'I cannot upload my retirement letter or experience certificate. Can you help?' },
      { id: 'emp_details', label: 'Confused about employment form', message: 'I\'m confused about what to fill in the previous employment details section. Can you explain?' },
    ],
  },
  {
    id: 'video',
    icon: '🎥',
    label: 'Video Introduction',
    subs: [
      { id: 'cam_novid', label: 'Camera opens but no video', message: 'My camera opens but I can\'t see any video feed on screen during the video recording step.' },
      { id: 'rec_fail', label: 'Recording won\'t start', message: 'I click "Start Recording" but nothing happens. The recording doesn\'t begin.' },
      { id: 'no_audio', label: 'No audio in recording', message: 'I recorded my video introduction but there\'s no audio/sound in the playback.' },
    ],
  },
  {
    id: 'location',
    icon: '📍',
    label: 'Location & Availability',
    subs: [
      { id: 'city_missing', label: 'City options not showing', message: 'When I select my country, the city dropdown isn\'t showing any options.' },
      { id: 'update_loc', label: 'Can\'t update my location', message: 'I\'m having trouble updating my city and country information in the profile.' },
    ],
  },
  {
    id: 'general',
    icon: '🏠',
    label: 'General Help',
    subs: [
      { id: 'how_works', label: 'How does RetiredPro work?', message: 'Can you explain how RetiredPro works and what I can do as a retired professional?' },
      { id: 'switch_mode', label: 'How to switch Company/Professional mode?', message: 'I accidentally selected the wrong mode (Company vs Professional). How do I switch?' },
      { id: 'after_verify', label: 'What happens after verification?', message: 'What happens after I complete all 6 verification steps? When will I get verified?' },
      { id: 'profile_vis', label: 'When will companies see my profile?', message: 'After verification, how soon will companies be able to find and contact me?' },
    ],
  },
  {
    id: 'other',
    icon: '💬',
    label: 'Something else',
    subs: [],
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const CBW_STYLES = `
  .cbw-bubble {
    position: fixed; bottom: 24px; right: 24px;
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 9999; border: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .cbw-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }
  .cbw-bubble.cbw-pulse { animation: cbwPulse 1.2s ease-out 1; }
  @keyframes cbwPulse {
    0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
    70% { box-shadow: 0 0 0 18px rgba(99,102,241,0); }
    100% { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  }
  .cbw-panel {
    position: fixed; bottom: 92px; right: 24px;
    width: 420px; height: 580px;
    background: #fff; border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex; flex-direction: column;
    z-index: 9998; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    animation: cbwSlideIn 0.2s ease-out;
  }
  @keyframes cbwSlideIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .cbw-header {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
  }
  .cbw-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 13px; flex-shrink: 0;
  }
  .cbw-header-info { flex: 1; min-width: 0; }
  .cbw-bot-name { font-weight: 600; font-size: 14px; color: #0f172a; }
  .cbw-status { font-size: 11px; display: flex; align-items: center; gap: 4px; color: #64748b; }
  .cbw-status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .cbw-header-actions { display: flex; gap: 6px; align-items: center; }
  .cbw-btn-sm {
    background: none; border: 1px solid #e2e8f0; border-radius: 6px;
    padding: 4px 8px; font-size: 11px; cursor: pointer; color: #64748b;
    transition: all 0.15s; white-space: nowrap;
  }
  .cbw-btn-sm:hover { background: #f8fafc; color: #0f172a; }
  .cbw-btn-undo { border-color: #fbbf24; color: #92400e; background: #fffbeb; }
  .cbw-btn-undo:hover { background: #fef3c7; }
  .cbw-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth;
  }
  .cbw-messages::-webkit-scrollbar { width: 4px; }
  .cbw-messages::-webkit-scrollbar-track { background: transparent; }
  .cbw-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
  .cbw-msg { display: flex; flex-direction: column; max-width: 88%; }
  .cbw-msg.cbw-user { align-self: flex-end; align-items: flex-end; }
  .cbw-msg.cbw-bot { align-self: flex-start; align-items: flex-start; }
  .cbw-bubble-msg {
    padding: 10px 14px; border-radius: 16px;
    font-size: 13.5px; line-height: 1.6; word-break: break-word;
  }
  .cbw-msg.cbw-user .cbw-bubble-msg { color: #fff; border-radius: 16px 4px 16px 16px; }
  .cbw-msg.cbw-bot .cbw-bubble-msg {
    background: #fff; border: 1px solid #e5e7eb;
    color: #1e293b; border-radius: 4px 16px 16px 16px;
  }
  .cbw-code-card {
    margin-top: 8px; border-radius: 10px;
    padding: 12px 14px; font-size: 12.5px; max-width: 100%;
  }
  .cbw-code-card.cbw-pending { background: #fef3c7; border: 1px solid #fbbf24; }
  .cbw-code-card.cbw-success { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }
  .cbw-code-card.cbw-error { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
  .cbw-code-label { font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .cbw-code-preview {
    background: rgba(0,0,0,0.06); border-radius: 6px;
    padding: 8px 10px; font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px; margin: 8px 0; max-height: 100px;
    overflow-y: auto; white-space: pre-wrap; word-break: break-word;
  }
  .cbw-code-actions { display: flex; gap: 8px; margin-top: 8px; }
  .cbw-run-btn {
    padding: 5px 12px; border-radius: 6px; border: none;
    cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s;
  }
  .cbw-run-btn.cbw-confirm { background: #22c55e; color: #fff; }
  .cbw-run-btn.cbw-confirm:hover { background: #16a34a; }
  .cbw-run-btn.cbw-cancel { background: #e5e7eb; color: #374151; }
  .cbw-run-btn.cbw-cancel:hover { background: #d1d5db; }
  .cbw-typing {
    display: flex; gap: 4px; align-items: center;
    padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb;
    border-radius: 4px 16px 16px 16px; align-self: flex-start;
  }
  .cbw-typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #94a3b8; animation: cbwBounce 1.2s ease-in-out infinite;
  }
  .cbw-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .cbw-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes cbwBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }
  .cbw-input-area {
    padding: 12px 16px; border-top: 1px solid #f1f5f9;
    display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0;
  }
  .cbw-textarea {
    flex: 1; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 10px 12px; font-size: 13.5px; font-family: inherit;
    resize: none; outline: none; line-height: 1.5;
    max-height: 96px; overflow-y: auto;
    transition: border-color 0.15s; color: #0f172a;
  }
  .cbw-textarea:focus { border-color: #6366f1; }
  .cbw-textarea:disabled { background: #f8fafc; color: #94a3b8; }
  .cbw-send-btn {
    width: 38px; height: 38px; border-radius: 10px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .cbw-send-btn:hover:not(:disabled) { filter: brightness(1.1); }
  .cbw-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .cbw-msg-text code {
    background: #f1f5f9; border-radius: 4px; padding: 1px 5px;
    font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: #4f46e5;
  }

  /* ── FAQ Menu Styles ── */
  .cbw-menu-area {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .cbw-menu-greeting {
    background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
    border-radius: 12px; padding: 16px; font-size: 13.5px;
    color: #1e293b; line-height: 1.6; border: 1px solid #e8edf8;
  }
  .cbw-menu-greeting strong { color: #4f46e5; }
  .cbw-menu-section-title {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px;
  }
  .cbw-menu-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff;
    cursor: pointer; font-size: 13.5px; color: #1e293b;
    transition: all 0.15s; text-align: left; width: 100%;
  }
  .cbw-menu-item:hover { border-color: #6366f1; background: #f5f3ff; color: #4338ca; }
  .cbw-menu-item .cbw-menu-icon { font-size: 1.2rem; flex-shrink: 0; }
  .cbw-menu-item .cbw-menu-arrow { margin-left: auto; color: #cbd5e1; font-size: 12px; }
  .cbw-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: #6366f1;
    font-size: 13px; font-weight: 500; cursor: pointer; padding: 0;
    margin-bottom: 4px;
  }
  .cbw-back-btn:hover { color: #4338ca; }

  /* ── Star Rating ── */
  .cbw-rating-card {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 1.5px solid #86efac; border-radius: 14px;
    padding: 20px 16px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .cbw-rating-title { font-weight: 700; font-size: 15px; color: #065f46; }
  .cbw-rating-sub { font-size: 12.5px; color: #059669; }
  .cbw-stars { display: flex; gap: 8px; justify-content: center; cursor: pointer; }
  .cbw-star {
    font-size: 28px; cursor: pointer;
    transition: transform 0.15s, filter 0.15s;
    filter: grayscale(0.6);
    user-select: none;
  }
  .cbw-star.active { filter: none; transform: scale(1.12); }
  .cbw-star:hover { filter: none; transform: scale(1.18); }
  .cbw-rating-submit {
    padding: 8px 22px; border-radius: 8px; border: none;
    font-weight: 600; font-size: 13px; cursor: pointer;
    transition: all 0.15s;
  }
  .cbw-rating-done {
    font-size: 13px; color: #059669; font-weight: 500;
    display: flex; align-items: center; gap: 6px;
  }
  @media (max-width: 480px) {
    .cbw-panel { width: calc(100vw - 16px); right: 8px; bottom: 80px; height: 70vh; }
  }
`;

// ── Helpers ─────────────────────────────────────────────────────────────────

function renderMarkdown(text) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  const lines = html.split('\n');
  let inList = false;
  const processed = lines.map(line => {
    const isBullet = /^[\-\*]\s+/.test(line);
    if (isBullet) {
      const item = line.replace(/^[\-\*]\s+/, '');
      if (!inList) { inList = true; return `<ul style="margin:6px 0 6px 16px;padding:0"><li>${item}</li>`; }
      return `<li>${item}</li>`;
    }
    if (inList) { inList = false; return `</ul>${line}`; }
    return line;
  });
  if (inList) processed.push('</ul>');
  return processed.join('<br>').replace(/(<br>)+(<\/ul>)/g, '$2').replace(/(<ul[^>]*>)<br>/g, '$1');
}

function parseResponse(text) {
  const segments = [];
  const regex = /```(execute|css)([\s\S]*?)```/g;
  let lastIndex = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    segments.push({ type: match[1], content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', content: text.slice(lastIndex) });
  return segments;
}

function getDOMSnapshot() {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('.cbw-panel, .cbw-bubble, script, style, noscript').forEach(el => el.remove());
  const rawHTML = clone.innerHTML.trim().slice(0, 6000);
  const domStyles = getComputedStyle(document.documentElement);
  const cssVars = [...document.styleSheets]
    .flatMap(sheet => { try { return [...sheet.cssRules]; } catch { return []; } })
    .filter(rule => rule.selectorText === ':root')
    .flatMap(rule => [...rule.style])
    .filter(prop => prop.startsWith('--'))
    .map(prop => `${prop}: ${domStyles.getPropertyValue(prop).trim()}`)
    .join('\n');
  return { rawHTML, cssVars, title: document.title, url: window.location.href };
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ChatBot({
  systemPrompt,
  botName = 'AI Assistant',
  primaryColor = '#6366f1',
  codeContext = '',
  requireConfirmation = true,
  puterModel = 'claude-sonnet-4-6',
}) {
  const STORAGE_KEY = `cbw_history_${botName.replace(/\s+/g, '_')}`;

  // Panel & AI
  const [open, setOpen] = useState(false);
  const [puterReady, setPuterReady] = useState(false);
  const [pulseReady, setPulseReady] = useState(false);

  // Menu phase: 'main' | 'sub' | 'chat' | 'rating'
  const [phase, setPhase] = useState('main');
  const [selectedMain, setSelectedMain] = useState(null); // MENU_DATA item

  // Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [undoCount, setUndoCount] = useState(0);

  // Rating
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);
  const [ratingShown, setRatingShown] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const undoStack = useRef([]);
  const injectedStyles = useRef([]);

  // ── Style injection ───────────────────────────────────────────────────────
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'cbw-global-styles';
    tag.textContent = CBW_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  // ── Puter.js loader ───────────────────────────────────────────────────────
  useEffect(() => {
    if (window.puter) { setPuterReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => {
      setPuterReady(true);
      setPulseReady(true);
      setTimeout(() => setPulseReady(false), 1300);
    };
    script.onerror = () => console.error('[ChatBot] Failed to load Puter.js');
    document.head.appendChild(script);
  }, []);

  // ── LocalStorage restore ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages([
            ...parsed,
            { id: Date.now(), role: 'assistant', text: '📌 *Note:* I can see your current page, but any UI changes from the previous session are no longer active (page was refreshed).', segments: null },
          ]);
          setPhase('chat');
        }
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist messages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, STORAGE_KEY]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  // ── Show rating after AI finishes responding ──────────────────────────────
  useEffect(() => {
    if (!streaming && messages.length >= 3 && phase === 'chat' && !ratingShown) {
      const lastBot = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastBot && lastBot.text && lastBot.text.length > 20) {
        const timer = setTimeout(() => setRatingShown(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [streaming, messages, phase, ratingShown]);

  // ── Textarea auto-resize ──────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + 'px';
    }
  }, [input]);

  // ── Core helpers ──────────────────────────────────────────────────────────

  const addMessage = useCallback((role, text, segments = null) => {
    const msg = { id: Date.now() + Math.random(), role, text, segments };
    setMessages(prev => [...prev, msg]);
    return msg.id;
  }, []);

  const executeBlock = useCallback((type, code) => {
    undoStack.current.push({
      html: document.body.innerHTML,
      styles: [...injectedStyles.current].map(el => el.textContent),
    });
    if (undoStack.current.length > 20) undoStack.current.shift();
    setUndoCount(undoStack.current.length);
    try {
      if (type === 'execute') {
        // eslint-disable-next-line no-new-func
        new Function('document', 'window', 'console', code)(document, window, console);
      } else if (type === 'css') {
        const style = document.createElement('style');
        style.textContent = code;
        style.setAttribute('data-chatbot-injected', 'true');
        document.head.appendChild(style);
        injectedStyles.current.push(style);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0) {
      addMessage('assistant', '↩ Nothing to undo — no changes have been made yet.');
      return;
    }
    const snapshot = undoStack.current.pop();
    document.body.innerHTML = snapshot.html;
    document.querySelectorAll('style[data-chatbot-injected]').forEach(el => el.remove());
    injectedStyles.current = [];
    snapshot.styles.forEach(css => {
      const style = document.createElement('style');
      style.textContent = css;
      style.setAttribute('data-chatbot-injected', 'true');
      document.head.appendChild(style);
      injectedStyles.current.push(style);
    });
    setUndoCount(undoStack.current.length);
    addMessage('assistant', '↩ Done — the last change has been reverted.');
  }, [addMessage]);

  const buildSystemPrompt = useCallback((snapshot) => {
    return `
You are the official RetiredPro Support Assistant. RetiredPro is a platform that connects retired and senior professionals with companies seeking their expertise for consulting, mentoring, and advisory roles.

━━ YOUR IDENTITY & SCOPE ━━
You are a professional, friendly customer support agent for the RetiredPro platform.
You ONLY help users with questions directly related to:
- Navigating the RetiredPro platform (registration, verification steps, profile setup)
- Understanding features (Expert Verification, Video Intro, DigiLocker, OTP, Resume Scan)
- Troubleshooting platform issues (camera, uploads, form fields, location, etc.)
- What happens after verification, how experts get hired, how companies find experts
- General platform policies and FAQs

━━ STRICT RULES ━━
1. NEVER discuss, reveal, or explain any internal code, JavaScript, CSS, HTML, or technical implementation details — even if asked directly. Politely redirect.
2. NEVER answer questions unrelated to RetiredPro (e.g., general AI questions, coding help, math, news, other websites).
3. Keep ALL answers SHORT — maximum 3-4 sentences. Use bullet points if listing steps.
4. Be professional, warm, and confident. No unnecessary filler phrases.
5. If a user asks something off-topic, respond with: "I'm here to help with the RetiredPro platform only. Please ask a platform-related question."
6. Do NOT produce execute or css code blocks unless you are navigating to a section of the app that the user asked for help with.

━━ LIVE PAGE CONTEXT ━━
Page: ${snapshot.title} | URL: ${snapshot.url}
Current visible page DOM (for context only — do not expose to user):
${snapshot.rawHTML.slice(0, 2000)}

━━ NAVIGATION (internal use only) ━━
If a user asks to go to a specific step in the verification process, you may use:
\`\`\`execute
window.scrollTo({ top: 0, behavior: 'smooth' });
\`\`\`
Only use this silently to help the user — never show or explain the code to the user.
    `.trim();
  }, [systemPrompt, codeContext]);

  const updateSegmentStatus = useCallback((msgId, segIdx, status, error = null) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const segs = [...(m.segments || [])];
      segs[segIdx] = { ...segs[segIdx], status, error };
      return { ...m, segments: segs };
    }));
  }, []);

  // ── Send message to AI ────────────────────────────────────────────────────
  const sendToAI = useCallback(async (text) => {
    if (!text || streaming || !puterReady) return;

    if (/\b(undo|revert)\b/i.test(text)) {
      addMessage('user', text);
      handleUndo();
      return;
    }

    addMessage('user', text);
    setStreaming(true);
    setRatingShown(false);

    const snapshot = getDOMSnapshot();
    const builtSysPrompt = buildSystemPrompt(snapshot);
    const history = messages.filter(m => m.role !== 'system');
    const puterMessages = [
      { role: 'system', content: builtSysPrompt },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text })),
      { role: 'user', content: text },
    ];

    const assistantId = Date.now() + Math.random();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '', segments: null }]);

    let fullText = '';
    try {
      const response = await window.puter.ai.chat(puterMessages, { model: puterModel, stream: true });
      for await (const part of response) {
        const token = part?.text ?? '';
        fullText += token;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: fullText } : m));
      }

      const segments = parseResponse(fullText);
      const hasCode = segments.some(s => s.type === 'execute' || s.type === 'css');
      if (hasCode) {
        const segsWithStatus = segments.map(s =>
          (s.type === 'execute' || s.type === 'css')
            ? { ...s, status: requireConfirmation ? 'pending' : 'running' }
            : s
        );
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, segments: segsWithStatus } : m));
        if (!requireConfirmation) {
          segsWithStatus.forEach((seg, idx) => {
            if (seg.type === 'execute' || seg.type === 'css') {
              const result = executeBlock(seg.type, seg.content);
              updateSegmentStatus(assistantId, idx, result.success ? 'success' : 'error', result.error);
            }
          });
        }
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, text: `⚠️ Error: ${err.message || 'Something went wrong. Please try again.'}` }
          : m
      ));
    } finally {
      setStreaming(false);
    }
  }, [streaming, puterReady, messages, buildSystemPrompt, puterModel, addMessage, handleUndo, requireConfirmation, executeBlock, updateSegmentStatus]);

  // ── Menu handlers ─────────────────────────────────────────────────────────

  const handleMainSelect = (item) => {
    if (item.id === 'other' || item.subs.length === 0) {
      // Go straight to chat
      setPhase('chat');
      addMessage('assistant', `Sure! Tell me what you need help with and I'll do my best to assist you. 😊`);
    } else {
      setSelectedMain(item);
      setPhase('sub');
    }
  };

  const handleSubSelect = (sub) => {
    setPhase('chat');
    sendToAI(sub.message);
  };

  const handleSendInput = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendToAI(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInput(); }
  };

  const clearChat = () => {
    setMessages([]);
    setPhase('main');
    setSelectedMain(null);
    setRatingShown(false);
    setRatingDone(false);
    setSelectedStar(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleStarSubmit = () => {
    if (!selectedStar) return;
    setRatingDone(true);
    addMessage('assistant',
      selectedStar >= 4
        ? `🙏 Thank you for your **${selectedStar}-star** rating! We're glad we could help. Feel free to ask anything else anytime.`
        : `Thank you for your **${selectedStar}-star** feedback. We're sorry we didn't fully meet your expectations. We'll use this to improve! Feel free to describe the issue further.`
    );
  };

  // ── Render a single chat message ──────────────────────────────────────────
  const renderMessage = (msg) => {
    if (msg.role === 'user') {
      return (
        <div key={msg.id} className="cbw-msg cbw-user">
          <div className="cbw-bubble-msg" style={{ background: primaryColor }}>{msg.text}</div>
        </div>
      );
    }
    const segs = msg.segments || [{ type: 'text', content: msg.text }];
    return (
      <div key={msg.id} className="cbw-msg cbw-bot">
        {segs.map((seg, idx) => {
          if (seg.type === 'text') {
            return <div key={idx} className="cbw-bubble-msg cbw-msg-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(seg.content) }} />;
          }
          if (seg.type === 'execute' || seg.type === 'css') {
            const icon = seg.type === 'css' ? '🎨' : '⚙️';
            const label = seg.type === 'css' ? 'CSS Injection' : 'JS Execution';
            if (seg.status === 'pending') return (
              <div key={idx} className="cbw-code-card cbw-pending">
                <div className="cbw-code-label">{icon} {label} — Pending</div>
                <div className="cbw-code-preview">{seg.content}</div>
                <div className="cbw-code-actions">
                  <button className="cbw-run-btn cbw-confirm" onClick={() => { const r = executeBlock(seg.type, seg.content); updateSegmentStatus(msg.id, idx, r.success ? 'success' : 'error', r.error); }}>Run it ✓</button>
                  <button className="cbw-run-btn cbw-cancel" onClick={() => updateSegmentStatus(msg.id, idx, 'cancelled')}>Skip ✗</button>
                </div>
              </div>
            );
            if (seg.status === 'success') return (
              <div key={idx} className="cbw-code-card cbw-success">
                <div className="cbw-code-label">{icon} Applied</div>
                ✓ Change applied — say <strong>"undo"</strong> to revert.
              </div>
            );
            if (seg.status === 'error') return (
              <div key={idx} className="cbw-code-card cbw-error">
                <div className="cbw-code-label">✗ Failed</div>Error: {seg.error}
              </div>
            );
            if (seg.status === 'cancelled') return (
              <div key={idx} className="cbw-code-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                {icon} {label} skipped.
              </div>
            );
            return null;
          }
          return null;
        })}
      </div>
    );
  };

  // ── Render star rating card ───────────────────────────────────────────────
  const renderRatingCard = () => (
    <div className="cbw-rating-card">
      <div className="cbw-rating-title">Was this helpful? ⭐</div>
      <div className="cbw-rating-sub">Rate your experience with the RetiredPro assistant</div>
      {!ratingDone ? (
        <>
          <div className="cbw-stars">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                className={`cbw-star${n <= (hoverStar || selectedStar) ? ' active' : ''}`}
                onMouseEnter={() => setHoverStar(n)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setSelectedStar(n)}
              >⭐</span>
            ))}
          </div>
          {selectedStar > 0 && (
            <button
              className="cbw-rating-submit"
              style={{ background: primaryColor, color: '#fff' }}
              onClick={handleStarSubmit}
            >
              Submit Review
            </button>
          )}
          <button className="cbw-btn-sm" onClick={() => setRatingShown(false)}>Skip</button>
        </>
      ) : (
        <div className="cbw-rating-done">✅ Thanks for your {selectedStar}-star review!</div>
      )}
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating Bubble */}
      <button
        className={`cbw-bubble${pulseReady ? ' cbw-pulse' : ''}`}
        style={{ background: primaryColor }}
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI Chat"
      >
        {open ? (
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="cbw-panel">
          {/* Header */}
          <div className="cbw-header">
            <div className="cbw-avatar" style={{ background: primaryColor }}>{getInitials(botName)}</div>
            <div className="cbw-header-info">
              <div className="cbw-bot-name">{botName}</div>
              <div className="cbw-status">
                <span className="cbw-status-dot" style={{ background: puterReady ? '#22c55e' : '#94a3b8' }} />
                {puterReady ? 'Online · Claude AI' : 'Loading AI...'}
              </div>
            </div>
            <div className="cbw-header-actions">
              {phase === 'chat' && (
                <button className="cbw-btn-sm" onClick={() => { setPhase('main'); setSelectedMain(null); setRatingShown(false); }} title="Back to menu">☰ Menu</button>
              )}
              {undoCount > 0 && (
                <button className="cbw-btn-sm cbw-btn-undo" onClick={handleUndo} title="Undo last change">↩ Undo</button>
              )}
              <button className="cbw-btn-sm" onClick={clearChat} title="Clear conversation">🗑</button>
              <button className="cbw-btn-sm" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* ── MAIN MENU PHASE ── */}
          {phase === 'main' && (
            <div className="cbw-menu-area">
              <div className="cbw-menu-greeting">
                👋 Hi! I'm the <strong>RetiredPro Assistant</strong>.<br />
                What can I help you with today? Choose a topic below or ask me anything!
              </div>
              <div className="cbw-menu-section-title">Select a topic</div>
              {MENU_DATA.map(item => (
                <button key={item.id} className="cbw-menu-item" onClick={() => handleMainSelect(item)}>
                  <span className="cbw-menu-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="cbw-menu-arrow">›</span>
                </button>
              ))}
            </div>
          )}

          {/* ── SUB MENU PHASE ── */}
          {phase === 'sub' && selectedMain && (
            <div className="cbw-menu-area">
              <button className="cbw-back-btn" onClick={() => setPhase('main')}>‹ Back</button>
              <div className="cbw-menu-greeting">
                {selectedMain.icon} <strong>{selectedMain.label}</strong><br />
                Select the issue that best describes your problem:
              </div>
              {selectedMain.subs.map(sub => (
                <button key={sub.id} className="cbw-menu-item" onClick={() => handleSubSelect(sub)}>
                  <span>{sub.label}</span>
                  <span className="cbw-menu-arrow">›</span>
                </button>
              ))}
              <button
                className="cbw-menu-item"
                style={{ borderStyle: 'dashed', color: '#64748b' }}
                onClick={() => {
                  setPhase('chat');
                  addMessage('assistant', `Sure! Describe your ${selectedMain.label.toLowerCase()} issue and I'll help you. 👇`);
                }}
              >
                <span>💬 My issue isn't listed above</span>
                <span className="cbw-menu-arrow">›</span>
              </button>
            </div>
          )}

          {/* ── CHAT PHASE ── */}
          {phase === 'chat' && (
            <>
              <div className="cbw-messages">
                {messages.map(renderMessage)}
                {streaming && (
                  <div className="cbw-typing">
                    <div className="cbw-typing-dot" />
                    <div className="cbw-typing-dot" />
                    <div className="cbw-typing-dot" />
                  </div>
                )}
                {ratingShown && !streaming && renderRatingCard()}
                <div ref={messagesEndRef} />
              </div>
              <div className="cbw-input-area">
                <textarea
                  ref={textareaRef}
                  className="cbw-textarea"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={puterReady ? 'Type your message...' : 'Loading AI...'}
                  disabled={streaming || !puterReady}
                />
                <button
                  className="cbw-send-btn"
                  style={{ background: primaryColor }}
                  onClick={handleSendInput}
                  disabled={streaming || !puterReady || !input.trim()}
                  aria-label="Send"
                >
                  <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ─── Usage Examples ──────────────────────────────────────────────────────────
//
// import ChatBot from './chatbot/ChatBot'
// import appSource from './App.jsx?raw'
// import stylesSource from './index.css?raw'
//
// <ChatBot
//   systemPrompt="You are an assistant for RetiredPro..."
//   botName="RetiredPro Assistant"
//   primaryColor="#4f46e5"
//   puterModel="claude-sonnet-4-6"
//   requireConfirmation={true}
//   codeContext={`${appSource}\n\n${stylesSource}`}
// />
