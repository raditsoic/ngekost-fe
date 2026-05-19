import { useState, useRef, useEffect, useCallback } from 'react';
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
  MapPin,
  Calculator,
  TrendingUp,
  Building2,
  Ruler,
  Wifi,
  Wind,
  Bath,
  Car,
  Flame,
  Zap,
  Star,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    putra: { label: 'Male', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    putri: { label: 'Female', className: 'bg-pink-50 text-pink-700 border-pink-200' },
    campur: { label: 'Mixed', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };
  const c = config[gender] || config.campur;
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-medium border ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function FacilityTag({ name }: { name: string }) {
  const Icon = facilityIcons[name];
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#344e41]/5 px-1.5 py-0.5 text-[10px] text-[#344e41] font-medium">
      {Icon && <Icon className="size-2.5" />}
      {name}
    </span>
  );
}

export type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  toolCalls?: string;
  searchStatus?: string[];
  isStreaming?: boolean;
};

const quickActions = [
  { icon: MapPin, label: 'Find nearest property', prompt: 'Find the nearest property from my location' },
  { icon: Calculator, label: 'Calculate monthly costs', prompt: 'Calculate my estimated monthly expenses' },
  { icon: TrendingUp, label: 'Compare properties', prompt: 'Compare 3 best properties in Sudirman area' },
];

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

  // Load existing messages when opening a conversation, or reset for new chat
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

    let toolCallCount = 0;
    const searchStatuses: string[] = [];

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

              case 'tool_call':
                toolCallCount++;
                updated.toolCalls = `${toolCallCount} tool call${toolCallCount > 1 ? 's' : ''}`;
                if (event.tool) {
                  const status = `Using ${event.tool}`;
                  if (!searchStatuses.includes(status)) {
                    searchStatuses.push(status);
                    updated.searchStatus = [...searchStatuses];
                  }
                }
                break;

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
          prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg,
          ),
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
    <div className="relative z-10 flex h-screen flex-col bg-[#f5f5f5]">

      {/* ─── Content ─── */}
      <ScrollArea className="flex-1">
        {isEmpty ? (
          /* Welcome state */
          <div className="flex min-h-[calc(100vh-200px)] flex-col items-center px-6 pt-6 pb-4">
            <div className="text-center">
              <h2 className="text-[25px] font-normal text-[#151515] leading-tight">
                What's Up <span className="font-bold">{firstName || 'there'}</span>.
              </h2>
              <p className="text-[22px] text-[#151515] leading-tight mt-0.5">
                How can i help you this evening?
              </p>
            </div>

            {/* Quick actions */}
            <div className="mt-5 flex flex-wrap justify-center gap-1.5">
              {quickActions.map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  size="xs"
                  onClick={() => handleSend(a.prompt)}
                  className="rounded-full text-[#344e41] hover:border-[#344e41]/40 hover:bg-[#344e41]/5"
                >
                  <a.icon className="size-3" />
                  {a.label}
                </Button>
              ))}
            </div>

            {/* Listings */}
            <div className="mt-5 w-full max-w-lg">
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94a3b8] px-0.5">Recommendations</span>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {MOCK_DATA.slice(0, 2).map((item, i) => (
                  <Card
                    key={item.title}
                    onClick={() => navigate(`/kost/${i}`)}
                    className="group cursor-pointer overflow-hidden border border-[#cbd5e1]/50 bg-white shadow-none transition-all hover:shadow-sm hover:border-[#344e41]/20"
                  >
                    <div className="relative w-full bg-[#e4e5f1] -mt-4">
                      <AspectRatio ratio={4 / 3}>
                        {item.images && Object.values(item.images)[0] ? (
                          <img src={Object.values(item.images)[0]} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Building2 className="size-6 text-[#cbd5e1]" />
                          </div>
                        )}
                      </AspectRatio>
                      <div className="absolute top-1.5 left-1.5">
                        <GenderBadge gender={item.gender_normalized} />
                      </div>
                    </div>
                    <div className="px-2.5 pt-2 pb-2.5">
                      <h3 className="text-[11px] font-semibold text-[#151515] leading-tight truncate group-hover:text-[#344e41] transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#94a3b8]">
                        <MapPin className="size-2 shrink-0" />
                        <span className="truncate">{item.formatted_address}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        {item.has_wifi && <Wifi className="size-2.5 text-[#64748b]" />}
                        {item.has_ac && <Wind className="size-2.5 text-[#64748b]" />}
                        {item.has_private_bathroom && <Bath className="size-2.5 text-[#64748b]" />}
                        {item.has_parking && <Car className="size-2.5 text-[#64748b]" />}
                      </div>
                      <div className="mt-1.5 flex items-end justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-[#344e41]">
                            {formatPrice(item.price_idr, item.price_display)}
                          </span>
                          {item.rent_type && <span className="text-[9px] text-[#94a3b8]">/{item.rent_type}</span>}
                        </div>
                        {item.rating != null && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#151515]">
                            <Star className="size-2.5 fill-amber-400 text-amber-400" />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="mx-auto max-w-[680px] px-5 md:px-8 py-6 flex flex-col gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#344e41]/10">
                    <img src="/ngekost-logo.svg" alt="" className="size-4" />
                  </div>
                )}

                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : ''} max-w-[85%]`}>
                  {msg.toolCalls && (
                    <div className="flex items-center gap-1.5 rounded-full bg-[#344e41]/6 px-3 py-1">
                      <Wrench className="size-3 text-[#344e41]" />
                      <span className="text-[11px] font-medium text-[#344e41]">{msg.toolCalls}</span>
                    </div>
                  )}

                  {msg.searchStatus && msg.searchStatus.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                      {msg.searchStatus.map((status, i) => (
                        <span key={i} className="text-[12px] text-[#94a3b8] flex items-center gap-1.5">
                          {status}
                          {msg.isStreaming && i === msg.searchStatus!.length - 1 && (
                            <span className="relative flex size-1">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#344e41]/40" />
                              <span className="relative inline-flex size-1 rounded-full bg-[#344e41]/60" />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.role === 'user' ? (
                    <div className="rounded-2xl rounded-br-sm bg-[#344e41] px-4 py-2.5">
                      <p className="text-sm leading-relaxed text-white whitespace-pre-wrap m-0">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    <>
                      {(msg.text || msg.isStreaming) && (
                        <div className="prose-chat text-sm leading-[1.8] text-[#151515]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                          {msg.isStreaming && (
                            <span className="inline-block w-0.5 h-3.5 bg-[#344e41]/50 ml-0.5 align-middle animate-pulse" />
                          )}
                        </div>
                      )}

                      {msg.isStreaming && !msg.text && (
                        <div className="flex items-center gap-1 py-1 px-1">
                          <span className="size-1.5 rounded-full bg-[#94a3b8]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="size-1.5 rounded-full bg-[#94a3b8]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="size-1.5 rounded-full bg-[#94a3b8]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
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
        <div className="mx-auto max-w-[480px] rounded-[15px] border border-[#cbd5e1] bg-white">
          <Textarea
            ref={inputRef}
            placeholder="Chat with AI..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isStreaming}
            rows={1}
            className="min-h-0 border-0 px-4 pt-3 pb-1 text-[14px] text-[#151515] placeholder:text-[#94a3b8] focus-visible:ring-0 resize-none"
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-0.5">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full border-[#cbd5e1] bg-[#f5f5f5] hover:bg-[#eee]"
              >
                <Plus className="size-3.5 text-[#94a3b8]" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full border-[#cbd5e1] bg-[#f5f5f5] hover:bg-[#eee]"
              >
                <Settings2 className="size-3.5 text-[#94a3b8]" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full border-[#cbd5e1] bg-[#f5f5f5] hover:bg-[#eee]"
              >
                <Mic className="size-3.5 text-[#94a3b8]" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                onClick={() => handleSend()}
                disabled={isStreaming || !inputText.trim()}
                className="rounded-full bg-[#344e41] hover:bg-[#3a5c40]"
              >
                <ArrowUp className="size-3.5 text-white" />
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#94a3b8]/60">
          ngekost AI may make mistakes — verify important information before making decisions.
        </p>
      </div>
    </div>
  );
};
