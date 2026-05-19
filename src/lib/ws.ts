const WS_BASE = (() => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  return base.replace(/^http/, 'ws');
})();

export interface ContextData {
  end_user_name?: string;
  end_user_phone?: string;
}

export interface StreamEvent {
  type: string;
  content?: string | null;
  tool?: string | null;
  params?: unknown;
  result?: unknown;
  conversation_id?: string;
  [key: string]: unknown;
}

export interface StreamHandle {
  close: () => void;
}

export interface StreamChatOptions {
  message: string;
  conversationId?: string;
  token?: string;
  apiKey?: string;
  images?: string[];
  contextData?: ContextData;
  onEvent: (event: StreamEvent) => void;
  onDone: (data?: StreamEvent) => void;
  onError: (error: string) => void;
}

const CONNECT_TIMEOUT_MS = 15_000;
const LOG = '[ws]';

export function streamChat({
  message,
  conversationId,
  token,
  apiKey,
  images,
  contextData,
  onEvent,
  onDone,
  onError,
}: StreamChatOptions): StreamHandle {
  let buffer = '';
  let settled = false;
  let aborted = false;
  let eventCount = 0;

  const url = `${WS_BASE}/ws/stream`;
  console.log(LOG, 'connecting to', url);
  console.log(LOG, 'options:', { message, conversationId, hasToken: !!token, hasApiKey: !!apiKey, images, contextData });

  let connectTimer = setTimeout(() => {
    console.error(LOG, 'connection timed out after', CONNECT_TIMEOUT_MS, 'ms');
    settle(() => {
      ws.close();
      onError('Koneksi timeout — server tidak merespons');
    });
  }, CONNECT_TIMEOUT_MS);

  const ws = new WebSocket(url);

  function settle(fn: () => void) {
    if (settled) return;
    settled = true;
    clearTimeout(connectTimer);
    fn();
  }

  function dispatchEvent(data: StreamEvent) {
    eventCount++;
    console.log(LOG, `event #${eventCount} (type: ${data.type}):`, data);

    if (data.type === 'done') {
      console.log(LOG, 'done event received, total events:', eventCount);
      settle(() => onDone(data));
      ws.close();
      return;
    }

    onEvent(data);
  }

  function tryParseLine(line: string) {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const json = trimmed.startsWith('data: ') ? trimmed.slice(6) : trimmed;
      const data = JSON.parse(json) as StreamEvent;
      dispatchEvent(data);
    } catch (err) {
      console.warn(LOG, 'failed to parse:', trimmed, err);
    }
  }

  ws.onopen = () => {
    clearTimeout(connectTimer);
    console.log(LOG, 'connection opened (readyState:', ws.readyState, ')');

    const payload: Record<string, unknown> = {
      message,
      conversation_id: conversationId || '',
    };
    if (token) payload.token = token;
    if (apiKey) payload.api_key = apiKey;
    if (images?.length) payload.images = images;
    if (contextData) payload.context_data = contextData;

    const serialized = JSON.stringify(payload);
    console.log(LOG, 'sending payload:', serialized.slice(0, 200) + (serialized.length > 200 ? '...' : ''));
    ws.send(serialized);
  };

  ws.onmessage = (event) => {
    const raw = String(event.data);
    console.log(LOG, 'raw message received (length:', raw.length, '):', raw.slice(0, 300) + (raw.length > 300 ? '...' : ''));

    // Fast path: most messages are a single complete JSON object
    try {
      const data = JSON.parse(raw) as StreamEvent;
      dispatchEvent(data);
      return;
    } catch {}

    // Slow path: buffer and extract line-delimited or concatenated events
    buffer += raw;
    const parts = buffer.split('\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      tryParseLine(part);
    }
  };

  ws.onclose = (event) => {
    console.log(LOG, 'connection closed — code:', event.code, 'reason:', event.reason || '(empty)', 'wasClean:', event.wasClean, 'events received:', eventCount, 'settled:', settled);
    if (aborted) return;

    // Flush any remaining buffered data
    if (buffer.trim()) {
      console.log(LOG, 'flushing remaining buffer on close:', buffer.slice(0, 200));
      // Try as single JSON first
      try {
        const data = JSON.parse(buffer.trim()) as StreamEvent;
        dispatchEvent(data);
      } catch {
        // Try line by line
        for (const line of buffer.split('\n')) {
          tryParseLine(line);
        }
      }
      buffer = '';
    }

    settle(() => onError(event.reason || 'Koneksi terputus'));
  };

  ws.onerror = (event) => {
    console.error(LOG, 'websocket error:', event);
    if (aborted) return;
    settle(() => onError('Koneksi gagal — periksa jaringan Anda'));
  };

  return {
    close: () => {
      console.log(LOG, 'client closing connection (aborted:', aborted, ', settled:', settled, ')');
      aborted = true;
      settled = true;
      clearTimeout(connectTimer);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    },
  };
}
