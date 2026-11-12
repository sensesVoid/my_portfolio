interface Env {
  AI: Ai;
  CHAT_HISTORY: KVNamespace;
  PORTFOLIO_CONTEXT: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/api/chat/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Chat endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const { messages, sessionId } = await request.json() as { messages: Array<{role: string, content: string}>, sessionId?: string };
        
        let history: Array<{role: string, content: string}> = [];
        if (sessionId) {
          const stored = await env.CHAT_HISTORY.get(`chat:${sessionId}`);
          if (stored) history = JSON.parse(stored);
        }
        
        const systemPrompt = `You are Gerald's AI assistant on his portfolio site. 
        Context: ${env.PORTFOLIO_CONTEXT}
        
        Answer questions about Gerald's experience, services, projects (SQAC, Pyralis, Wizky), and consulting offerings. 
        Be helpful, concise, and professional. If unsure, suggest booking a discovery call.`;
        
        const allMessages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-10),
          ...messages
        ];
        
        // Stream response
        const stream = new ReadableStream({
          async start(controller) {
            let fullResponse = '';
            try {
              const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
                messages: allMessages,
                stream: true,
                max_tokens: 512,
                temperature: 0.7,
              });
              
              for await (const chunk of response as any) {
                const text = chunk.response || chunk;
                if (text) {
                  fullResponse += text;
                  controller.enqueue(new TextEncoder().encode(text));
                }
              }
              
              const newHistory = [...history, ...messages.slice(-2), { role: 'assistant', content: fullResponse }].slice(-20);
              if (sessionId) {
                await env.CHAT_HISTORY.put(`chat:${sessionId}`, JSON.stringify(newHistory), { expirationTtl: 86400 * 7 });
              }
            } catch (e) {
              controller.enqueue(new TextEncoder().encode('Sorry, something went wrong. Try again or book a call.'));
            } finally {
              controller.close();
            }
          }
        });
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            ...CORS_HEADERS,
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Bad request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  },
};