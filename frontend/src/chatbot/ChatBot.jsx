import { useState, useRef, useEffect, useCallback } from 'react';

// ─── ChatBot Widget ─────────────────────────────────────────────────────────
// Universal, self-contained, DOM-aware AI chatbot widget.
// Uses Puter.js for free unlimited Claude access — no API keys, no backend.
// Drop into any React/Vite project and it works immediately.
// ────────────────────────────────────────────────────────────────────────────

const CBW_STYLES = `
  .cbw-bubble {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
    border: none;
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
    position: fixed;
    bottom: 92px;
    right: 24px;
    width: 420px;
    height: 560px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    z-index: 9998;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    animation: cbwSlideIn 0.2s ease-out;
  }
  @keyframes cbwSlideIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .cbw-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }
  .cbw-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
  }
  .cbw-header-info { flex: 1; min-width: 0; }
  .cbw-bot-name { font-weight: 600; font-size: 14px; color: #0f172a; }
  .cbw-status { font-size: 11px; display: flex; align-items: center; gap: 4px; color: #64748b; }
  .cbw-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    display: inline-block; flex-shrink: 0;
  }
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
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
  }
  .cbw-messages::-webkit-scrollbar { width: 4px; }
  .cbw-messages::-webkit-scrollbar-track { background: transparent; }
  .cbw-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
  .cbw-msg { display: flex; flex-direction: column; max-width: 88%; }
  .cbw-msg.cbw-user { align-self: flex-end; align-items: flex-end; }
  .cbw-msg.cbw-bot { align-self: flex-start; align-items: flex-start; }
  .cbw-bubble-msg {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 13.5px;
    line-height: 1.6;
    word-break: break-word;
  }
  .cbw-msg.cbw-user .cbw-bubble-msg {
    color: #fff;
    border-radius: 16px 4px 16px 16px;
  }
  .cbw-msg.cbw-bot .cbw-bubble-msg {
    background: #fff;
    border: 1px solid #e5e7eb;
    color: #1e293b;
    border-radius: 4px 16px 16px 16px;
  }
  .cbw-code-card {
    margin-top: 8px;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 12.5px;
    max-width: 100%;
  }
  .cbw-code-card.cbw-pending { background: #fef3c7; border: 1px solid #fbbf24; }
  .cbw-code-card.cbw-success { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }
  .cbw-code-card.cbw-error { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
  .cbw-code-label { font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .cbw-code-preview {
    background: rgba(0,0,0,0.06);
    border-radius: 6px;
    padding: 8px 10px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    margin: 8px 0;
    max-height: 100px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .cbw-code-actions { display: flex; gap: 8px; margin-top: 8px; }
  .cbw-run-btn {
    padding: 5px 12px; border-radius: 6px; border: none; cursor: pointer;
    font-size: 12px; font-weight: 600; transition: all 0.15s;
  }
  .cbw-run-btn.cbw-confirm { background: #22c55e; color: #fff; }
  .cbw-run-btn.cbw-confirm:hover { background: #16a34a; }
  .cbw-run-btn.cbw-cancel { background: #e5e7eb; color: #374151; }
  .cbw-run-btn.cbw-cancel:hover { background: #d1d5db; }
  .cbw-typing {
    display: flex; gap: 4px; align-items: center;
    padding: 12px 16px;
    background: #fff; border: 1px solid #e5e7eb;
    border-radius: 4px 16px 16px 16px;
    align-self: flex-start;
  }
  .cbw-typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #94a3b8;
    animation: cbwBounce 1.2s ease-in-out infinite;
  }
  .cbw-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .cbw-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes cbwBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }
  .cbw-input-area {
    padding: 12px 16px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-shrink: 0;
  }
  .cbw-textarea {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 13.5px;
    font-family: inherit;
    resize: none;
    outline: none;
    line-height: 1.5;
    max-height: 96px;
    overflow-y: auto;
    transition: border-color 0.15s;
    color: #0f172a;
  }
  .cbw-textarea:focus { border-color: #6366f1; }
  .cbw-textarea:disabled { background: #f8fafc; color: #94a3b8; }
  .cbw-send-btn {
    width: 38px; height: 38px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .cbw-send-btn:hover:not(:disabled) { filter: brightness(1.1); }
  .cbw-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .cbw-msg-text code {
    background: #f1f5f9;
    border-radius: 4px;
    padding: 1px 5px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #4f46e5;
  }
  .cbw-welcome {
    text-align: center;
    padding: 24px 16px;
    color: #64748b;
    font-size: 13px;
  }
  .cbw-welcome-icon { font-size: 2.5rem; margin-bottom: 8px; }
  .cbw-welcome-title { font-weight: 600; color: #0f172a; margin-bottom: 4px; font-size: 14px; }
  @media (max-width: 480px) {
    .cbw-panel { width: calc(100vw - 16px); right: 8px; bottom: 80px; height: 70vh; }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderMarkdown(text) {
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bullet lists (lines starting with - or *)
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
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: match[1], content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return segments;
}

function getDOMSnapshot() {
  const clone = document.body.cloneNode(true);
  // Remove chatbot panel itself to avoid recursive snapshots
  clone.querySelectorAll('.cbw-panel, .cbw-bubble, script, style, noscript').forEach(el => el.remove());
  const rawHTML = clone.innerHTML.trim().slice(0, 6000);

  const domStyles = getComputedStyle(document.documentElement);
  const cssVars = [...document.styleSheets]
    .flatMap(sheet => {
      try { return [...sheet.cssRules]; } catch { return []; }
    })
    .filter(rule => rule.selectorText === ':root')
    .flatMap(rule => [...rule.style])
    .filter(prop => prop.startsWith('--'))
    .map(prop => `${prop}: ${domStyles.getPropertyValue(prop).trim()}`)
    .join('\n');

  return {
    rawHTML,
    cssVars,
    title: document.title,
    url: window.location.href,
  };
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

  const [open, setOpen] = useState(false);
  const [puterReady, setPuterReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [pulseReady, setPulseReady] = useState(false);
  const [undoCount, setUndoCount] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const undoStack = useRef([]);
  const injectedStyles = useRef([]);

  // ── Style injection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'cbw-global-styles';
    tag.textContent = CBW_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  // ── Puter.js loader ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.puter) {
      setPuterReady(true);
      return;
    }
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

  // ── Restore history from localStorage ──────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages([
          ...parsed,
          {
            id: Date.now(),
            role: 'assistant',
            text: '📌 *Note:* I can see your current page, but any UI changes from the previous session are no longer active (page was refreshed).',
            segments: null,
          },
        ]);
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist messages to localStorage ───────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, STORAGE_KEY]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  // ── Textarea auto-resize ────────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + 'px';
    }
  }, [input]);

  // ── Core helpers ────────────────────────────────────────────────────────────

  const addMessage = useCallback((role, text, segments = null) => {
    const msg = { id: Date.now() + Math.random(), role, text, segments };
    setMessages(prev => [...prev, msg]);
    return msg.id;
  }, []);

  const executeBlock = useCallback((type, code) => {
    // Save undo snapshot
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
${systemPrompt}

━━ LIVE PAGE STATE ━━
Page title: ${snapshot.title}
Current URL: ${snapshot.url}

CSS custom properties:
${snapshot.cssVars || 'None detected'}

DOM snapshot (sanitized, truncated to 6000 chars):
${snapshot.rawHTML}

━━ SOURCE CODE CONTEXT ━━
${codeContext || 'Not provided by developer.'}

━━ YOUR CAPABILITIES ━━
You are an AI assistant embedded in this app. You can:
  1. Answer questions about the app, its content, and features
  2. READ the live DOM above to understand the current UI state
  3. MODIFY the live page UI by including special code blocks in your response

To modify the page, use these exact code fence formats:

\`\`\`execute
// JavaScript that runs directly in the browser
// You have: document, window, console
// Examples:
// document.querySelector('h1').style.color = '#4f46e5'
\`\`\`

\`\`\`css
/* CSS injected via a <style> tag into <head> */
body { font-family: 'Inter', sans-serif !important; }
\`\`\`

RULES:
- ALWAYS explain what you will change BEFORE the code block
- Use specific, targeted selectors
- After a change, remind the user they can say "undo" to revert it
- Never produce a code block without a plain-text explanation above it
- When the user says "undo" or "revert", do NOT output code — just say you're reverting
    `.trim();
  }, [systemPrompt, codeContext]);

  // ── Update a single message's segments (for run/cancel) ────────────────────
  const updateSegmentStatus = useCallback((msgId, segIdx, status, error = null) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const segs = [...(m.segments || [])];
      segs[segIdx] = { ...segs[segIdx], status, error };
      return { ...m, segments: segs };
    }));
  }, []);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || !puterReady) return;
    setInput('');

    // Undo shortcut — handle client-side
    if (/\b(undo|revert)\b/i.test(text)) {
      addMessage('user', text);
      handleUndo();
      return;
    }

    addMessage('user', text);
    setStreaming(true);

    const snapshot = getDOMSnapshot();
    const builtSysPrompt = buildSystemPrompt(snapshot);

    // Build conversation for Puter
    const history = messages.filter(m => m.role !== 'system');
    const puterMessages = [
      { role: 'system', content: builtSysPrompt },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text })),
      { role: 'user', content: text },
    ];

    // Create placeholder assistant message
    const assistantId = Date.now() + Math.random();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '', segments: null }]);

    let fullText = '';
    try {
      const response = await window.puter.ai.chat(puterMessages, {
        model: puterModel,
        stream: true,
      });

      for await (const part of response) {
        const token = part?.text ?? '';
        fullText += token;
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, text: fullText } : m
        ));
      }

      // Parse code blocks
      const segments = parseResponse(fullText);
      const hasCode = segments.some(s => s.type === 'execute' || s.type === 'css');

      if (hasCode) {
        const segsWithStatus = segments.map(s =>
          (s.type === 'execute' || s.type === 'css')
            ? { ...s, status: requireConfirmation ? 'pending' : 'running' }
            : s
        );

        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, segments: segsWithStatus } : m
        ));

        // Auto-run if no confirmation needed
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
  }, [input, streaming, puterReady, messages, buildSystemPrompt, puterModel, addMessage, handleUndo, requireConfirmation, executeBlock, updateSegmentStatus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // ── Render a single message ─────────────────────────────────────────────────
  const renderMessage = (msg) => {
    if (msg.role === 'user') {
      return (
        <div key={msg.id} className="cbw-msg cbw-user">
          <div className="cbw-bubble-msg" style={{ background: primaryColor }}>
            {msg.text}
          </div>
        </div>
      );
    }

    // Bot message
    const segs = msg.segments || [{ type: 'text', content: msg.text }];

    return (
      <div key={msg.id} className="cbw-msg cbw-bot">
        {segs.map((seg, idx) => {
          if (seg.type === 'text') {
            return (
              <div
                key={idx}
                className="cbw-bubble-msg cbw-msg-text"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(seg.content) }}
              />
            );
          }

          if (seg.type === 'execute' || seg.type === 'css') {
            const icon = seg.type === 'css' ? '🎨' : '⚙️';
            const label = seg.type === 'css' ? 'CSS Injection' : 'JS Execution';

            if (seg.status === 'pending') {
              return (
                <div key={idx} className="cbw-code-card cbw-pending">
                  <div className="cbw-code-label">{icon} {label} — Pending</div>
                  <div className="cbw-code-preview">{seg.content}</div>
                  <div className="cbw-code-actions">
                    <button
                      className="cbw-run-btn cbw-confirm"
                      onClick={() => {
                        const result = executeBlock(seg.type, seg.content);
                        updateSegmentStatus(msg.id, idx, result.success ? 'success' : 'error', result.error);
                      }}
                    >
                      Run it ✓
                    </button>
                    <button
                      className="cbw-run-btn cbw-cancel"
                      onClick={() => updateSegmentStatus(msg.id, idx, 'cancelled')}
                    >
                      Skip ✗
                    </button>
                  </div>
                </div>
              );
            }

            if (seg.status === 'success') {
              return (
                <div key={idx} className="cbw-code-card cbw-success">
                  <div className="cbw-code-label">{icon} {label} Applied</div>
                  ✓ Change applied — say <strong>"undo"</strong> to revert it.
                </div>
              );
            }

            if (seg.status === 'error') {
              return (
                <div key={idx} className="cbw-code-card cbw-error">
                  <div className="cbw-code-label">✗ {label} Failed</div>
                  Error: {seg.error}
                </div>
              );
            }

            if (seg.status === 'cancelled') {
              return (
                <div key={idx} className="cbw-code-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  {icon} {label} skipped.
                </div>
              );
            }

            // Fallback (e.g. status=running)
            return null;
          }

          return null;
        })}
      </div>
    );
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────
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
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="cbw-panel">
          {/* Header */}
          <div className="cbw-header">
            <div className="cbw-avatar" style={{ background: primaryColor }}>
              {getInitials(botName)}
            </div>
            <div className="cbw-header-info">
              <div className="cbw-bot-name">{botName}</div>
              <div className="cbw-status">
                <span className="cbw-status-dot" style={{ background: puterReady ? '#22c55e' : '#94a3b8' }} />
                {puterReady ? 'Online · Claude' : 'Loading AI...'}
              </div>
            </div>
            <div className="cbw-header-actions">
              {undoCount > 0 && (
                <button className="cbw-btn-sm cbw-btn-undo" onClick={handleUndo} title="Undo last change">
                  ↩ Undo
                </button>
              )}
              <button className="cbw-btn-sm" onClick={clearChat} title="Clear conversation">🗑</button>
              <button className="cbw-btn-sm" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="cbw-messages">
            {messages.length === 0 && (
              <div className="cbw-welcome">
                <div className="cbw-welcome-icon">✨</div>
                <div className="cbw-welcome-title">{botName}</div>
                <div>Ask me anything about this page.<br/>I can also modify the UI on request.</div>
              </div>
            )}
            {messages.map(renderMessage)}
            {streaming && (
              <div className="cbw-typing">
                <div className="cbw-typing-dot" />
                <div className="cbw-typing-dot" />
                <div className="cbw-typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="cbw-input-area">
            <textarea
              ref={textareaRef}
              className="cbw-textarea"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={puterReady ? 'Ask me anything...' : 'Loading AI...'}
              disabled={streaming || !puterReady}
            />
            <button
              className="cbw-send-btn"
              style={{ background: primaryColor }}
              onClick={sendMessage}
              disabled={streaming || !puterReady || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Usage Examples ──────────────────────────────────────────────────────────
//
// ─── RetiredPro ──────────────────────────────────────────────────────────────
// In App.jsx:
//
// import ChatBot from './chatbot/ChatBot'
// import appSource from './App.jsx?raw'
// import stylesSource from './index.css?raw'
//
// <ChatBot
//   systemPrompt="You are an assistant for RetiredPro — a platform that helps retired
//     professionals find part-time consulting work. You can answer questions AND make
//     live changes to the UI when asked. Always explain changes before making them."
//   botName="RetiredPro Assistant"
//   primaryColor="#4f46e5"
//   puterModel="claude-sonnet-4-6"
//   requireConfirmation={true}
//   codeContext={`${appSource}\n\n${stylesSource}`}
// />
//
// ─── Any future project ──────────────────────────────────────────────────────
// <ChatBot
//   systemPrompt="You are a support agent for [App Name]."
//   botName="Support Bot"
//   primaryColor="#16a34a"
//   puterModel="claude-haiku-4-5"
//   requireConfirmation={false}
//   codeContext={mySourceFiles}
// />
//
// No API keys. No .env. No backend. Works anywhere. Free via Puter.js.
