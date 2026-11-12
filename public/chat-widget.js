(function() {
  const toggle = document.getElementById('chat-toggle');
  const window = document.getElementById('chat-window');
  const close = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  
  let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
  let isStreaming = false;
  
  toggle.addEventListener('click', () => {
    const open = window.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', !open);
    if (!open) input.focus();
  });
  
  close.addEventListener('click', () => {
    window.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  });
  
  function appendMessage(role, content, streaming = false) {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-3';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        role === 'assistant' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-border text-brand-text'
      }">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
            role === 'assistant' 
              ? 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              : 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          }" />
        </svg>
      </div>
      <div class="prose prose-invert max-w-none text-sm ${role === 'user' ? 'text-brand-text' : 'text-brand-muted'}">${content}</div>
    `;
    if (streaming) div.id = 'streaming-message';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
  
  function updateStreamingMessage(content) {
    let msg = document.getElementById('streaming-message');
    if (!msg) {
      msg = appendMessage('assistant', '', true);
    }
    msg.querySelector('.prose').innerHTML = content;
    messages.scrollTop = messages.scrollHeight;
  }
  
  async function sendMessage(text) {
    if (isStreaming) return;
    isStreaming = true;
    
    appendMessage('user', text);
    input.value = '';
    input.disabled = true;
    toggle.disabled = true;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: text }], 
          sessionId 
        })
      });
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value, { stream: true });
          updateStreamingMessage(fullResponse);
        }
      }
    } catch (e) {
      updateStreamingMessage('Sorry, something went wrong. Try again or <a href="/contact" class="link">book a call</a>.');
    } finally {
      const streamingMsg = document.getElementById('streaming-message');
      if (streamingMsg) streamingMsg.removeAttribute('id');
      isStreaming = false;
      input.disabled = false;
      toggle.disabled = false;
      input.focus();
    }
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text && !isStreaming) sendMessage(text);
  });
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !window.classList.contains('hidden')) {
      window.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();