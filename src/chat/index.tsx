import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getValidAccessToken, type ChatMessage } from '../lib/api';
import { streamChat } from '../lib/ws';
import { useAuth } from '../auth/context';
import type { StreamEvent, StreamHandle } from '../lib/ws';
import { MOCK_DATA } from '../browsemore';
import {
  ArrowUp,
  Plus,
  Mic,
  Settings2,
  Wrench,
  Check,
  Search,
  MapPin,
  Calculator,
  TrendingUp,
  Building2,
  Wifi,
  Wind,
  Bath,
  Car,
  Flame,
  Star,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const facilityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  AC: Wind,
  'Parkir Motor': Car,
  'Parkir Mobil': Car,
  'K. Mandi Dalam': Bath,
  'Water Heater': Flame,
  'Air panas': Flame,
};

function formatPrice(priceIdr: number | null, priceDisplay: string | null) {
  if (priceDisplay) return priceDisplay;
  if (priceIdr) return 'Rp' + priceIdr.toLocaleString('id-ID');
  return 'Price not available';
}

function GenderBadge({ gender }: { gender: string }) {
  const config: Record<string, { label: string; className: string }> = {
    putra: { label: 'Male', className: 'bg-[var(--chart-3)] text-[var(--background)]' },
    putri: { label: 'Female', className: 'bg-primary text-[var(--background)]' },
    campur: { label: 'Mixed', className: 'bg-muted-foreground text-[var(--background)]' },
  };
  const c = config[gender] || config.campur;
  return (
    <span className={`text-[9px] px-1.5 py-0.5 font-medium tracking-[0.04em] uppercase ${c.className}`}>
      {c.label}
    </span>
  );
}

type ToolCallItem = {
  id: string;
  name: string;
  params?: unknown;
  result?: unknown;
  status: 'running' | 'completed' | 'error';
  error?: string;
  executionTimeMs?: number;
};

export type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  toolCallItems?: ToolCallItem[];
  isStreaming?: boolean;
};

const quickActions = [
  { icon: MapPin, label: 'Find nearest property', prompt: 'Find the nearest property from my location' },
  { icon: Calculator, label: 'Calculate monthly costs', prompt: 'Calculate my estimated monthly expenses' },
  { icon: TrendingUp, label: 'Compare properties', prompt: 'Compare 3 best properties in Sudirman area' },
];

const toolIcons: Record<string, React.ElementType> = {
  search_properties: Search,
  search_property: Search,
  search: Search,
  calculate_cost: Calculator,
  calculate: Calculator,
  analyze_location: MapPin,
  get_location: MapPin,
  compare_properties: TrendingUp,
  compare: TrendingUp,
  get_poi: Building2,
  find_poi: Building2,
  financial_projection: Calculator,
};

function formatToolName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatParamValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatResultPreview(result: unknown): string {
  if (result === null || result === undefined) return '';
  if (typeof result === 'string') return result.length > 120 ? result.slice(0, 120) + '...' : result;
  if (typeof result === 'object' && result !== null) {
    if (Array.isArray(result)) return `${result.length} results`;
    const obj = result as Record<string, unknown>;
    if (obj.summary) return String(obj.summary);
    if (obj.message) return String(obj.message);
    const keys = Object.keys(obj);
    if (keys.length <= 3) return keys.map(k => `${k}: ${formatParamValue(obj[k])}`).join(' · ');
    return `${keys.length} fields`;
  }
  return String(result);
}

function ToolCallBlock({ item }: { item: ToolCallItem }) {
  const Icon = toolIcons[item.name] || Wrench;
  const params = item.params as Record<string, unknown> | undefined;
  const paramEntries = params ? Object.entries(params) : [];

  return (
    <div className="border border-foreground/15">
      <div className="flex items-center justify-between bg-foreground/[0.03] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3 text-foreground/50" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/70">
            {formatToolName(item.name)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.executionTimeMs != null && (
            <span className="text-[9px] font-mono text-muted-foreground">
              {item.executionTimeMs >= 1000
                ? `${(item.executionTimeMs / 1000).toFixed(1)}s`
                : `${Math.round(item.executionTimeMs)}ms`}
            </span>
          )}
          {item.status === 'running' ? (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[#c8401a]/40" />
              <span className="relative inline-flex size-1.5 bg-[#c8401a]" />
            </span>
          ) : item.status === 'error' ? (
            <span className="size-1.5 bg-red-500" />
          ) : (
            <Check className="size-2.5 text-emerald-600" />
          )}
        </div>
      </div>

      {paramEntries.length > 0 && (
        <div className="px-3 py-1 border-t border-foreground/5">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {paramEntries.map(([k, v]) => (
              <span key={k} className="text-[11px] text-muted-foreground">
                <span className="text-foreground/50">{k}:</span>{' '}
                <span className="font-mono text-foreground/70">{formatParamValue(v)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {item.result != null && (
        <div className="px-3 py-1 border-t border-foreground/5">
          <span className="text-[11px] text-muted-foreground">
            <span className="text-foreground/40">→</span>{' '}
            <span className="text-foreground/70">{formatResultPreview(item.result)}</span>
          </span>
        </div>
      )}

      {item.error && (
        <div className="px-3 py-1 border-t border-red-500/10 bg-red-500/[0.03]">
          <span className="text-[11px] text-red-600/80">{item.error}</span>
        </div>
      )}
    </div>
  );
}

const greetings = [
  (name: string, tod: string) => ({ pre: `What's up, `, name, suf: '.', sub: `How can we help this ${tod}?` }),
  (name: string, tod: string) => ({ pre: `Hey `, name, suf: ',', sub: 'Looking for a place tonight?' }),
  (name: string, tod: string) => ({ pre: `Good to see you, `, name, suf: '.', sub: 'Need help finding the right kost?' }),
  (name: string, tod: string) => ({ pre: '', name, suf: `, let's find your spot.`, sub: 'What are you looking for?' }),
  (name: string, tod: string) => ({ pre: `Welcome back, `, name, suf: '.', sub: 'Any kost on your mind?' }),
  (name: string, tod: string) => ({ pre: `Alright, `, name, suf: '.', sub: 'Where should we start looking?' }),
];

function getGreeting(name: string) {
  const h = new Date().getHours();
  const tod = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return greetings[Math.floor(Math.random() * greetings.length)](name || 'there', tod);
}

export const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationIdRef = useRef<string>('');
  const wsHandleRef = useRef<StreamHandle | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const firstName = user?.display_name?.split(' ')[0] || '';
  const greeting = useMemo(() => getGreeting(firstName), [firstName]);

  useEffect(() => {
    if (!id) {
      setMessages([]);
      conversationIdRef.current = '';
      return;
    }
    conversationIdRef.current = id;
    setMessages([]);

    api.listMessages(id, { limit: 200 })
      .then(res => {
        const raw = Array.isArray(res) ? res : res.data ?? [];
        const mapped: Message[] = raw
          .filter((m: ChatMessage) => m.role === 'user' || m.role === 'assistant')
          .map((m: ChatMessage) => ({
            id: m.id,
            role: m.role === 'assistant' ? 'ai' : 'user',
            text: m.content,
          }));
        setMessages(mapped);
      })
      .catch(() => setMessages([]));
  }, [id]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      wsHandleRef.current?.close();
    };
  }, []);

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || inputText).trim();
    if (!text || isStreaming) return;

    const token = await getValidAccessToken();
    if (!token) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
    };

    const aiMsgId = crypto.randomUUID();
    const aiMsg: Message = {
      id: aiMsgId,
      role: 'ai',
      text: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText('');
    setIsStreaming(true);

    const toolCallItems: ToolCallItem[] = [];

    const handle = streamChat({
      message: text,
      conversationId: conversationIdRef.current || undefined,
      token,
      onEvent: (event: StreamEvent) => {
        if (event.conversation_id) {
          conversationIdRef.current = event.conversation_id;
        }

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== aiMsgId) return msg;

            const updated = { ...msg };

            switch (event.type) {
              case 'answer':
                updated.text = event.content || '';
                break;

              case 'answer_token':
                updated.text = msg.text + (event.content || '');
                break;

              case 'thinking':
                if (event.content) {
                  updated.text = msg.text + (msg.text ? '\n' : '') + event.content;
                }
                break;

              case 'tool_call': {
                const tc: ToolCallItem = {
                  id: crypto.randomUUID(),
                  name: event.tool || 'unknown',
                  params: event.params,
                  result: event.result,
                  status: event.result != null ? 'completed' : 'running',
                  error: (event as Record<string, unknown>).error as string | undefined,
                  executionTimeMs: (event as Record<string, unknown>).execution_time_ms as number | undefined,
                };
                toolCallItems.push(tc);
                updated.toolCallItems = [...toolCallItems];
                break;
              }

              case 'tool_result': {
                const target = [...toolCallItems]
                  .reverse()
                  .find(tc => tc.name === event.tool && tc.status === 'running');
                if (target) {
                  target.result = event.result;
                  target.status = (event as Record<string, unknown>).error ? 'error' : 'completed';
                  target.error = (event as Record<string, unknown>).error as string | undefined;
                  target.executionTimeMs = (event as Record<string, unknown>).execution_time_ms as number | undefined;
                }
                updated.toolCallItems = [...toolCallItems];
                break;
              }

              case 'session_start':
              case 'answer_start':
              case 'answer_done':
              case 'session_end':
                break;

              default:
                if (event.content) {
                  updated.text = msg.text + (event.content || '');
                }
            }

            return updated;
          }),
        );
      },

      onDone: (data) => {
        if (data?.conversation_id) {
          conversationIdRef.current = data.conversation_id;
        }

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== aiMsgId) return msg;
            const updated = { ...msg, isStreaming: false };
            if (updated.toolCallItems) {
              updated.toolCallItems = updated.toolCallItems.map(tc =>
                tc.status === 'running' ? { ...tc, status: 'completed' as const } : tc,
              );
            }
            return updated;
          }),
        );
        setIsStreaming(false);
        wsHandleRef.current = null;
        inputRef.current?.focus();
      },

      onError: (error) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsgId
              ? { ...msg, text: msg.text || `Error: ${error}`, isStreaming: false }
              : msg,
          ),
        );
        setIsStreaming(false);
        wsHandleRef.current = null;
      },
    });

    wsHandleRef.current = handle;
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative z-10 flex h-screen flex-col bg-background font-sans text-foreground">

      {/* ─── Content ─── */}
      <ScrollArea className="flex-1">
        {isEmpty ? (
          /* ─── Welcome State ─── */
          <div className="flex min-h-[calc(100vh-200px)] flex-col items-center px-6 pt-10 pb-4">
            {/* Editorial heading */}
            <div className="text-center">
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.02em] text-foreground">
                {greeting.pre}<span className="italic text-primary">{greeting.name}</span>{greeting.suf}
              </h2>
              <p className="font-serif text-[clamp(18px,2.2vw,24px)] text-muted-foreground leading-[1.2] mt-1">
                {greeting.sub}
              </p>
            </div>

            {/* Quick actions — square editorial buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {quickActions.map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  size="xs"
                  onClick={() => handleSend(a.prompt)}
                  className="rounded-none border-[var(--chart-3)]/30 text-foreground hover:bg-[var(--chart-3)] hover:text-[var(--background)] transition-colors text-[12px] font-medium tracking-[0.02em]"
                >
                  <a.icon className="size-3" />
                  {a.label}
                </Button>
              ))}
            </div>

            {/* Recommendations — editorial list */}
            <div className="mt-8 w-full max-w-lg">
              <div className="flex items-center justify-between border-t border-[var(--chart-3)] pt-2 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Recommendations
                </span>
                <span className="size-1.5 bg-[#c8401a]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              </div>
              <div className="grid grid-cols-2 gap-0 border border-[var(--chart-3)]/20">
                {MOCK_DATA.slice(0, 2).map((item, i) => (
                  <div
                    key={item.title}
                    onClick={() => navigate(`/kost/${i}`)}
                    className={`group cursor-pointer bg-card transition-colors hover:bg-primary/[0.04] ${i === 0 ? 'border-r border-[var(--chart-3)]/20' : ''}`}
                  >
                    <div className="relative w-full bg-muted">
                      <AspectRatio ratio={4 / 3}>
                        {item.images && Object.values(item.images)[0] ? (
                          <img src={Object.values(item.images)[0]} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center border-b border-[var(--chart-3)]/10">
                            <Building2 className="size-5 text-border" />
                          </div>
                        )}
                      </AspectRatio>
                      <div className="absolute top-1 left-1">
                        <GenderBadge gender={item.gender_normalized} />
                      </div>
                    </div>
                    <div className="px-3 pt-2 pb-3 border-t border-[var(--chart-3)]/10">
                      <h3 className="text-[12px] font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="size-2 shrink-0" />
                        <span className="truncate">{item.formatted_address}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {item.has_wifi && <Wifi className="size-2.5 text-muted-foreground" />}
                        {item.has_ac && <Wind className="size-2.5 text-muted-foreground" />}
                        {item.has_private_bathroom && <Bath className="size-2.5 text-muted-foreground" />}
                        {item.has_parking && <Car className="size-2.5 text-muted-foreground" />}
                      </div>
                      <div className="mt-2 pt-2 border-t border-[var(--chart-3)]/10 flex items-end justify-between">
                        <div>
                          <span className="font-serif text-[14px] text-primary">
                            {formatPrice(item.price_idr, item.price_display)}
                          </span>
                          {item.rent_type && (
                            <span className="text-[9px] text-muted-foreground">/{item.rent_type}</span>
                          )}
                        </div>
                        {item.rating != null && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-foreground">
                            <Star className="size-2.5 fill-amber-400 text-amber-400" />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ─── Messages ─── */
          <div className="mx-auto max-w-[680px] px-5 md:px-8 py-6 flex flex-col gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center border border-[var(--chart-3)]/20 bg-card">
                    <img src="/ngekost-logo.svg" alt="" className="size-4" />
                  </div>
                )}

                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : ''} max-w-[85%]`}>
                  {msg.toolCallItems && msg.toolCallItems.length > 0 && (
                    <div className="flex flex-col gap-1 max-w-full">
                      {msg.toolCallItems.map(tc => (
                        <ToolCallBlock key={tc.id} item={tc} />
                      ))}
                    </div>
                  )}

                  {msg.role === 'user' ? (
                    <div className="bg-[var(--chart-3)] px-4 py-2.5">
                      <p className="text-sm leading-relaxed text-[var(--background)] whitespace-pre-wrap m-0">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    <>
                      {(msg.text || msg.isStreaming) && (
                        <div className="prose-chat text-sm leading-[1.8] text-foreground">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                          {msg.isStreaming && (
                            <span className="inline-block w-0.5 h-4 bg-[var(--chart-3)]ml-0.5 align-middle animate-pulse" />
                          )}
                        </div>
                      )}

                      {msg.isStreaming && !msg.text && (
                        <div className="flex items-center gap-2 py-1 px-1">
                          <span className="size-1 bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="size-1 bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="size-1 bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* ─── Input Bar ─── */}
      <div className="shrink-0 px-4 pb-6 pt-2">
        <div className="mx-auto max-w-[520px] border border-[var(--chart-3)] bg-card">
          <Textarea
            ref={inputRef}
            placeholder="Ask about kost, costs, locations..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isStreaming}
            rows={1}
            className="min-h-0 border-0 px-4 pt-3 pb-2 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 resize-none bg-transparent"
          />
          <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-[var(--chart-3)]/10">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none border-[var(--chart-3)]/20 bg-transparent hover:bg-[var(--chart-3)] hover:text-[var(--background)] transition-colors"
              >
                <Plus className="size-3.5 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none border-[var(--chart-3)]/20 bg-transparent hover:bg-[var(--chart-3)] hover:text-[var(--background)] transition-colors"
              >
                <Settings2 className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none border-[var(--chart-3)]/20 bg-transparent hover:bg-[var(--chart-3)] hover:text-[var(--background)] transition-colors"
              >
                <Mic className="size-3.5 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                onClick={() => handleSend()}
                disabled={isStreaming || !inputText.trim()}
                className="rounded-none bg-[var(--chart-3)] text-[var(--background)] hover:bg-primary transition-colors border-0"
              >
                <ArrowUp className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/50 tracking-[0.02em]">
          ngekost AI may make mistakes — verify important information before making decisions.
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
