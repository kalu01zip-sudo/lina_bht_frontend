// hooks/useChatStream.ts
import { useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

// How fast the typewriter effect runs (ms per tick)
const TYPEWRITER_INTERVAL_MS = 30;
// How many words to reveal per tick (increase for faster typing)
const WORDS_PER_TICK = 2;

interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export function useChatStream() {
  const abortRef = useRef<AbortController | null>(null);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Typewriter: drip-feeds `text` word by word ──────────────────────────
  const startTypewriter = useCallback((text: string, callbacks: StreamCallbacks) => {
    // Split on whitespace but keep the separators so markdown spacing stays intact
    const tokens = text.split(/(\s+)/);
    let index = 0;

    typewriterRef.current = setInterval(() => {
      if (index >= tokens.length) {
        clearInterval(typewriterRef.current!);
        typewriterRef.current = null;
        callbacks.onDone();
        return;
      }

      const slice = tokens.slice(index, index + WORDS_PER_TICK).join('');
      callbacks.onChunk(slice);
      index += WORDS_PER_TICK;
    }, TYPEWRITER_INTERVAL_MS);
  }, []);

  const cancelTypewriter = useCallback(() => {
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }
  }, []);

  // ── Main entry point ─────────────────────────────────────────────────────
  const streamMessage = useCallback(
    async (message: string, callbacks: StreamCallbacks) => {
      abortRef.current?.abort();
      cancelTypewriter();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const token = await AsyncStorage.getItem('access_token');

        const response = await fetch(`${BASE_URL}/chat/message/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type') ?? '';

        if (contentType.includes('text/event-stream')) {
          // ── Real SSE path (future-proof if backend adds streaming) ─────
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No readable stream');

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data:')) continue;
              const jsonStr = trimmed.slice('data:'.length).trim();
              if (jsonStr === '[DONE]') {
                callbacks.onDone();
                return;
              }
              try {
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.chunk ?? parsed.reply ?? null;
                if (typeof chunk === 'string') callbacks.onChunk(chunk);
              } catch {}
            }
          }

          // Flush remainder
          if (buffer.trim().startsWith('data:')) {
            const jsonStr = buffer.trim().slice('data:'.length).trim();
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.chunk ?? parsed.reply ?? null;
                if (typeof chunk === 'string') callbacks.onChunk(chunk);
              } catch {}
            }
          }
          callbacks.onDone();
        } else {
          // ── Sync JSON → typewriter effect ──────────────────────────────
          const data = await response.json();
          const reply: string =
            typeof data?.reply === 'string'
              ? data.reply
              : typeof data?.chunk === 'string'
                ? data.chunk
                : JSON.stringify(data);

          startTypewriter(reply, callbacks);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('[useChatStream] error:', err);
        callbacks.onError(err?.message ?? 'Stream failed');
      }
    },
    [startTypewriter, cancelTypewriter]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    cancelTypewriter();
  }, [cancelTypewriter]);

  return { streamMessage, cancelStream };
}
