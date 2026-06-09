import { useState, useRef, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getValidAccessToken, type ChatMessage, type BudgetPlanCard, type BudgetPlanDetail, type BudgetCategoryKey } from '../lib/api';
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
  X,
  ChevronRight,
  PiggyBank,
  ArrowLeftRight,
  ImageIcon,
  Loader2,
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

type LocationPin = {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  thinking?: string;
  toolCallItems?: ToolCallItem[];
  pins?: LocationPin[];
  budgetPlans?: BudgetPlanCard[];
  isStreaming?: boolean;
  imageUrls?: string[];
};

type PendingFile = {
  id: string;
  file: File;
  previewUrl: string;
  fileId?: string;
  uploading: boolean;
  error?: string;
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

function tryParseJSON(val: string): unknown {
  try { return JSON.parse(val); } catch { return null; }
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

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function LocationPinCarousel({ pins }: { pins: LocationPin[] }) {
  if (pins.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1 scrollbar-thin">
      {pins.map(pin => (
        <div key={pin.id} className="shrink-0 w-[220px] snap-start border border-foreground/15">
          <iframe
            title={pin.title}
            width="220"
            height="140"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${pin.latitude},${pin.longitude}&center=${pin.latitude},${pin.longitude}&zoom=15`}
          />
          <div className="px-2.5 py-2 border-t border-foreground/10">
            <p className="text-[11px] font-serif leading-snug text-foreground/80 line-clamp-2">{pin.title}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2">{pin.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Budget plan stepper — one at a time with prev/next ─── */
function BudgetPlanCarousel({
  cards,
  activePlanId,
  onSelect,
}: {
  cards: BudgetPlanCard[];
  activePlanId: string | undefined;
  onSelect: (planId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(cards.length - 1, i + 1));

  if (cards.length === 1) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BudgetPlanInlineCard
          card={cards[0]}
          isActive={activePlanId === cards[0].plan_id}
          onClick={() => onSelect(cards[0].plan_id)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <BudgetPlanInlineCard
        card={card}
        isActive={activePlanId === card.plan_id}
        onClick={() => onSelect(card.plan_id)}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="flex size-6 items-center justify-center border border-foreground/15 text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors disabled:opacity-25 disabled:cursor-default"
        >
          <ChevronRight className="size-3 rotate-180" />
        </button>
        <span className="text-[10px] font-mono text-foreground/40">
          {index + 1} / {cards.length}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={index === cards.length - 1}
          className="flex size-6 items-center justify-center border border-foreground/15 text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors disabled:opacity-25 disabled:cursor-default"
        >
          <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}

/* ─── Minimal inline card for budget plan (clickable) ─── */
function BudgetPlanInlineCard({
  card,
  isActive,
  onClick,
}: {
  card: BudgetPlanCard;
  isActive: boolean;
  onClick: () => void;
}) {
  const ratio = card.rent_to_income_ratio ?? 0;
  const ratioColor =
    ratio <= 30 ? 'text-emerald-600' : ratio <= 40 ? 'text-amber-600' : 'text-red-600';

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-muted-foreground/10 text-muted-foreground' },
    active: { label: 'Active', className: 'bg-emerald-600/10 text-emerald-600' },
    archived: { label: 'Archived', className: 'bg-foreground/5 text-foreground/40' },
  };
  const st = statusConfig[card.status] ?? statusConfig.draft;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full max-w-[280px] text-left border transition-colors ${
        isActive
          ? 'border-primary/40 bg-primary/[0.03]'
          : 'border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.02]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-foreground/5">
        <div className="flex items-center gap-1.5">
          <Calculator className="size-3 text-foreground/30" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-foreground/40">
            Budget Plan
          </span>
        </div>
        <span className={`text-[8px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 ${st.className}`}>
          {st.label}
        </span>
      </div>

      {/* Body — minimal */}
      <div className="px-3 py-2.5">
        <p className="text-[11px] font-serif leading-snug text-foreground/80 line-clamp-2">
          {card.label}
        </p>
        <div className="flex items-end justify-between mt-2 pt-2 border-t border-foreground/5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Monthly Cost</p>
            <p className="text-[14px] font-serif text-foreground leading-tight mt-0.5">
              Rp{(card.total_monthly_cost_idr ?? 0).toLocaleString('id-ID')}
            </p>
          </div>
          {card.rent_to_income_ratio != null && (
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-serif font-medium ${ratioColor}`}>
                {ratio.toFixed(1)}%
              </span>
              <ChevronRight className="size-3 text-foreground/20 group-hover:text-foreground/40 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Generic artifact type ─── */
type Artifact =
  | { type: 'budget_plan'; planId: string }
  // Future: | { type: 'property'; propertyId: string }
  // Future: | { type: 'comparison'; comparisonId: string }

/* ─── Generic artifact panel wrapper ─── */
function ArtifactPanel({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  switch (artifact.type) {
    case 'budget_plan':
      return <BudgetPlanDetailPanel planId={artifact.planId} onClose={onClose} />;
    default:
      return null;
  }
}

/* ─── Side-panel for full budget plan detail (fetched from API) ─── */
const CATEGORY_LABELS: Record<BudgetCategoryKey, string> = {
  rent: 'Rent',
  food: 'Food',
  transportation: 'Transport',
  utilities: 'Utilities',
  laundry: 'Laundry',
  internet: 'Internet',
};

function BudgetPlanDetailPanel({ planId, onClose }: { planId: string; onClose: () => void }) {
  const [plan, setPlan] = useState<BudgetPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.getBudgetPlan(planId)
      .then(data => {
        if (cancelled) return;
        console.log('[artifact] budget plan loaded:', data);
        setPlan(data);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[artifact] budget plan fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load budget plan');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [planId]);

  const ratio = plan?.rent_to_income_ratio ?? 0;
  const ratioColor =
    ratio <= 30 ? 'text-emerald-600' : ratio <= 40 ? 'text-amber-600' : 'text-red-600';
  const ratioBg =
    ratio <= 30 ? 'bg-emerald-600' : ratio <= 40 ? 'bg-amber-600' : 'bg-red-600';
  const ratioLabel =
    ratio <= 30 ? 'Healthy' : ratio <= 40 ? 'Tight' : 'Risky';

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-muted-foreground/10 text-muted-foreground' },
    active: { label: 'Active', className: 'bg-emerald-600/10 text-emerald-600' },
    archived: { label: 'Archived', className: 'bg-foreground/5 text-foreground/40' },
  };
  const st = statusConfig[plan?.status ?? 'draft'] ?? statusConfig.draft;

  return (
    <div className="flex h-full flex-col w-[380px]">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sidebar-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-[var(--sidebar-foreground)]/40" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sidebar-foreground)]/50">
            Budget Plan
          </span>
          {plan && (
            <span className={`text-[8px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 ${st.className}`}>
              {st.label}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 items-center justify-center border border-[var(--sidebar-border)] text-[var(--sidebar-foreground)]/40 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-foreground)] transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {loading && !plan ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Calculator className="size-6 text-[var(--sidebar-foreground)]/20 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--sidebar-foreground)]/30">Loading plan…</p>
          </div>
        ) : error ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[12px] text-red-400/80 font-medium">Failed to load budget plan</p>
            <p className="text-[10px] text-red-400/50 mt-1">{error}</p>
          </div>
        ) : plan ? (
          <div className="px-5 py-5 flex flex-col gap-5">
            {/* Property */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--sidebar-foreground)]/35 mb-1">
                Property
              </p>
              <h3 className="text-[16px] font-serif leading-snug text-[var(--sidebar-foreground)]">
                {plan.property_title}
              </h3>
              {plan.property_address && (
                <p className="text-[10px] text-[var(--sidebar-foreground)]/40 mt-1">{plan.property_address}</p>
              )}
            </div>

            {/* Key metrics — editorial grid */}
            <div className="grid grid-cols-2 gap-px bg-[var(--sidebar-border)] border border-[var(--sidebar-border)]">
              <div className="bg-[var(--sidebar)] px-4 py-3">
                <p className="text-[8px] uppercase tracking-[0.08em] text-[var(--sidebar-foreground)]/35">Monthly Cost</p>
                <p className="text-[18px] font-serif text-[var(--sidebar-foreground)] leading-tight mt-1">
                  Rp{(plan.total_monthly_cost_idr ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-[var(--sidebar)] px-4 py-3">
                <p className="text-[8px] uppercase tracking-[0.08em] text-[var(--sidebar-foreground)]/35">Rent / Income</p>
                <p className={`text-[18px] font-serif leading-tight mt-1 ${ratioColor}`}>
                  {ratio.toFixed(1)}%
                </p>
              </div>
              <div className="bg-[var(--sidebar)] px-4 py-3">
                <p className="text-[8px] uppercase tracking-[0.08em] text-[var(--sidebar-foreground)]/35">Daily Allowance</p>
                <p className="text-[18px] font-serif text-[var(--sidebar-foreground)] leading-tight mt-1">
                  Rp{(plan.total_daily_allowance_idr ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              {plan.net_monthly_savings_idr != null && (
                <div className="bg-[var(--sidebar)] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <PiggyBank className="size-3 text-[var(--sidebar-foreground)]/25" />
                    <p className="text-[8px] uppercase tracking-[0.08em] text-[var(--sidebar-foreground)]/35">Net Savings</p>
                  </div>
                  <p className={`text-[18px] font-serif leading-tight mt-1 ${plan.net_monthly_savings_idr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {plan.net_monthly_savings_idr >= 0 ? '+' : ''}Rp{plan.net_monthly_savings_idr.toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>

            {/* Affordability bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--sidebar-foreground)]/40">
                  Affordability Assessment
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-[0.06em] ${ratioColor}`}>
                  {ratioLabel}
                </span>
              </div>
              <div className="relative h-2 bg-[var(--sidebar-foreground)]/10 w-full">
                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-[var(--sidebar-foreground)]/15 z-10" />
                <div
                  className={`h-full ${ratioBg} transition-all duration-700`}
                  style={{ width: `${Math.min((ratio / 50) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[7px] text-[var(--sidebar-foreground)]/25">0%</span>
                <span className="text-[7px] text-[var(--sidebar-foreground)]/25">30%</span>
                <span className="text-[7px] text-[var(--sidebar-foreground)]/25">50%</span>
              </div>
            </div>

            {/* Category breakdown */}
            {plan.categories && plan.categories.length > 0 && (
              <div className="border border-[var(--sidebar-border)]">
                <div className="bg-[var(--sidebar-accent)] px-4 py-2 border-b border-[var(--sidebar-border)]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--sidebar-foreground)]/40">
                    Cost Breakdown
                  </span>
                </div>
                <div className="divide-y divide-[var(--sidebar-border)]">
                  {plan.categories.map(cat => {
                    const pct = plan.total_monthly_cost_idr
                      ? Math.round((cat.monthly_amount_idr / plan.total_monthly_cost_idr) * 100)
                      : 0;
                    return (
                      <div key={cat.category} className="px-4 py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[var(--sidebar-foreground)]/70">
                            {CATEGORY_LABELS[cat.category] ?? cat.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--sidebar-foreground)]/35">{pct}%</span>
                            <span className="text-[11px] font-serif text-[var(--sidebar-foreground)]">
                              Rp{cat.monthly_amount_idr.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1 bg-[var(--sidebar-foreground)]/10 w-full">
                          <div
                            className="h-full bg-[var(--sidebar-primary)]/40 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[8px] text-[var(--sidebar-foreground)]/25 mt-1">
                          {cat.daily_amount_idr.toLocaleString('id-ID')}/day · {cat.source.replace(/_/g, ' ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ratio guide */}
            <div className="border border-[var(--sidebar-border)]">
              <div className="bg-[var(--sidebar-accent)] px-4 py-2 border-b border-[var(--sidebar-border)]">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--sidebar-foreground)]/40">
                  Ratio Guide
                </span>
              </div>
              <div className="divide-y divide-[var(--sidebar-border)]">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-emerald-500" />
                    <span className="text-[11px] text-[var(--sidebar-foreground)]/70">Healthy</span>
                  </div>
                  <span className="text-[10px] text-[var(--sidebar-foreground)]/35">≤ 30%</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-amber-500" />
                    <span className="text-[11px] text-foreground/70">Tight</span>
                  </div>
                  <span className="text-[10px] text-foreground/35">30% – 40%</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-red-500" />
                    <span className="text-[11px] text-[var(--sidebar-foreground)]/70">Risky</span>
                  </div>
                  <span className="text-[10px] text-[var(--sidebar-foreground)]/35">&gt; 40%</span>
                </div>
              </div>
            </div>

            {/* Plan ID footer */}
            <div className="pt-2 border-t border-[var(--sidebar-border)]">
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="size-3 text-[var(--sidebar-foreground)]/20" />
                <span className="text-[9px] text-[var(--sidebar-foreground)]/25 font-mono truncate">
                  {plan.id}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </ScrollArea>
    </div>
  );
}

function ProcessCollapsible({ thinking, toolItems }: { thinking?: string; toolItems?: ToolCallItem[] }) {
  const [open, setOpen] = useState(false);
  const hasThinking = !!thinking;
  const hasTools = !!toolItems && toolItems.length > 0;

  if (!hasThinking && !hasTools) return null;

  const label = [
    hasThinking ? 'thinking' : '',
    hasTools ? `${toolItems!.length} tool call${toolItems!.length > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' · ');

  return (
    <div className="max-w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50 hover:text-foreground/70 transition-colors"
      >
        <Wrench className="size-3" />
        <span>{label}</span>
        <span className="text-foreground/30">{open ? '▲' : '▼'}</span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pt-1.5">
            {hasThinking && <ThinkingBlock content={thinking!} />}
            {hasTools && toolItems!.map(tc => (
              <ToolCallBlock key={tc.id} item={tc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingBlock({ content }: { content: string }) {
  return (
    <div className="border border-foreground/10">
      <div className="flex items-center gap-1.5 bg-foreground/[0.03] px-3 py-1.5 border-b border-foreground/5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50">
          Thinking
        </span>
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping bg-foreground/20" />
          <span className="relative inline-flex size-1.5 bg-foreground/30" />
        </span>
      </div>
      <div className="px-3 py-2 prose-chat text-[11px] leading-[1.65] text-foreground/50 italic">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
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
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        const toolMsgs = raw.filter(m => m.role === 'tool');
        console.log('[chat history] RAW tool messages from API:', JSON.stringify(toolMsgs, null, 2));
        const sorted = [...raw].sort((a, b) => a.sequence_no - b.sequence_no);
        console.log('[chat history] sorted messages:', sorted.map(m => ({ seq: m.sequence_no, role: m.role, msgType: (m as any).message_type, tool_name: (m as any).tool_name })));

        const toolCallMap = new Map<string, ToolCallItem[]>();
        const pinsMap = new Map<string, LocationPin[]>();
        const budgetPlanMap = new Map<string, BudgetPlanCard>();
        const thinkingMap = new Map<string, string>();

        for (const m of sorted) {
          const next = sorted.filter(p => p.role === 'assistant' && !p.message_type && p.sequence_no > m.sequence_no);
          const parent = next[0];

          if (m.role === 'tool' && m.tool_name && m.tool_name !== 'show_property_location') {
            if (parent) {
              const items = toolCallMap.get(parent.id) ?? [];
              items.push({
                id: m.id,
                name: m.tool_name,
                params: m.tool_params,
                result: m.tool_result,
                status: 'completed',
                executionTimeMs: undefined,
              });
              toolCallMap.set(parent.id, items);
            }
          }

          if (m.message_type === 'thinking' && (m as any).metadata?.content) {
            if (parent) {
              const prev = thinkingMap.get(parent.id) ?? '';
              thinkingMap.set(parent.id, prev + (prev ? '\n' : '') + (m as any).metadata.content);
            }
          }

          if (m.message_type === 'location_pin' && m.metadata?.pins) {
            if (parent) {
              const pins: LocationPin[] = m.metadata.pins.map(p => ({
                id: p.id,
                title: p.title,
                address: p.address,
                latitude: p.latitude,
                longitude: p.longitude,
              }));
              pinsMap.set(parent.id, [...(pinsMap.get(parent.id) ?? []), ...pins]);
            }
          }

          if (m.message_type === 'budget_plan' && m.metadata?.card) {
            if (parent) {
              const prev = budgetPlanMap.get(parent.id) ?? [];
              budgetPlanMap.set(parent.id, [...prev, m.metadata.card]);
            }
          }
        }

        const mapped: Message[] = sorted
          .filter((m: ChatMessage) =>
            (m.role === 'user' || m.role === 'assistant') && !m.message_type
          )
          .map((m: ChatMessage) => ({
            id: m.id,
            role: m.role === 'assistant' ? 'ai' : 'user',
            text: m.content,
            thinking: thinkingMap.get(m.id),
            toolCallItems: toolCallMap.get(m.id),
            pins: pinsMap.get(m.id),
            budgetPlans: budgetPlanMap.get(m.id),
            imageUrls: m.images?.map(img => img.url),
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPendings: PendingFile[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
    }));

    setPendingFiles(prev => [...prev, ...newPendings]);

    // Upload each file
    for (const pending of newPendings) {
      try {
        const res = await api.uploadImage(pending.file);
        setPendingFiles(prev =>
          prev.map(p =>
            p.id === pending.id
              ? { ...p, fileId: res.file_id, uploading: false }
              : p,
          ),
        );
      } catch (err) {
        setPendingFiles(prev =>
          prev.map(p =>
            p.id === pending.id
              ? { ...p, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' }
              : p,
          ),
        );
      }
    }

    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const removePendingFile = (id: string) => {
    setPendingFiles(prev => {
      const file = prev.find(p => p.id === id);
      if (file) URL.revokeObjectURL(file.previewUrl);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || inputText).trim();
    const uploadedFiles = pendingFiles.filter(p => p.fileId && !p.error);
    const hasContent = text || uploadedFiles.length > 0;
    if (!hasContent || isStreaming) return;

    const token = await getValidAccessToken();
    if (!token) return;

    const imageUrls = uploadedFiles.map(p => p.previewUrl);
    const imageIds = uploadedFiles.map(p => p.fileId!);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
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
    setPendingFiles([]);
    setIsStreaming(true);

    const toolCallItems: ToolCallItem[] = [];

    const handle = streamChat({
      message: text,
      conversationId: conversationIdRef.current || undefined,
      token,
      images: imageIds.length > 0 ? imageIds : undefined,
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
                  updated.thinking = (msg.thinking || '') + event.content;
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

              case 'location_pin': {
                const newPins = (event as Record<string, unknown>).pins as LocationPin[] ?? [];
                updated.pins = [...(msg.pins ?? []), ...newPins];
                break;
              }

              case 'budget_plan': {
                const card = (event as Record<string, unknown>).card as BudgetPlanCard | undefined;
                console.log('[chat] budget_plan event, card:', card, 'existing plans:', msg.budgetPlans?.length ?? 0);
                if (card) {
                  updated.budgetPlans = [...(msg.budgetPlans ?? []), card];
                }
                break;
              }

              default:
                if (event.content) {
                  console.log('[chat] DEFAULT catch for type:', event.type, 'content:', event.content?.slice(0, 50));
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
    <div className="flex h-screen flex-col bg-background font-sans text-foreground">

      {/* ─── Main area: chat scroll + artifact side by side ─── */}
      <div className="flex flex-1 min-h-0">

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
              <Fragment key={msg.id}>

              {/* Budget plan cards — centered before the message */}
              {msg.budgetPlans && msg.budgetPlans.length > 0 && (
                <BudgetPlanCarousel
                  cards={msg.budgetPlans}
                  activePlanId={activeArtifact?.type === 'budget_plan' ? activeArtifact.planId : undefined}
                  onSelect={(planId) => setActiveArtifact(
                    activeArtifact?.type === 'budget_plan' && activeArtifact.planId === planId
                      ? null
                      : { type: 'budget_plan', planId }
                  )}
                />
              )}

              <div
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center border border-[var(--chart-3)]/20 bg-card">
                    <img src="/ngekost-logo.svg" alt="" className="size-4" />
                  </div>
                )}

                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : ''} max-w-[85%]`}>
                  {(msg.thinking || (msg.toolCallItems && msg.toolCallItems.length > 0)) && (
                    <ProcessCollapsible thinking={msg.thinking} toolItems={msg.toolCallItems} />
                  )}

                  {msg.pins && msg.pins.length > 0 && (
                    <LocationPinCarousel pins={msg.pins} />
                  )}

                  {msg.role === 'user' ? (
                    <div className="bg-[var(--chart-3)] px-4 py-2.5 max-w-full">
                      {msg.imageUrls && msg.imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {msg.imageUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Attachment ${i + 1}`}
                              className="max-h-[120px] max-w-[200px] object-cover border border-[var(--background)]/20"
                            />
                          ))}
                        </div>
                      )}
                      {msg.text && (
                        <p className="text-sm leading-relaxed text-[var(--background)] whitespace-pre-wrap m-0">
                          {msg.text}
                        </p>
                      )}
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

              </Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* ─── Artifact side panel ─── */}
      <div
        className={`hidden md:flex shrink-0 border-l border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${activeArtifact ? 'w-[380px]' : 'w-0'}`}
      >
        {activeArtifact && (
          <ArtifactPanel
            artifact={activeArtifact}
            onClose={() => setActiveArtifact(null)}
          />
        )}
      </div>

      </div>{/* end main area */}
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
          {pendingFiles.length > 0 && (
            <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
              {pendingFiles.map(p => (
                <div key={p.id} className="relative group shrink-0">
                  <div className="size-14 border border-[var(--chart-3)]/20 overflow-hidden bg-muted">
                    <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  {p.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                      <Loader2 className="size-4 text-foreground animate-spin" />
                    </div>
                  )}
                  {p.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                      <ImageIcon className="size-4 text-red-300" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePendingFile(p.id)}
                    className="absolute -top-1.5 -right-1.5 size-4 flex items-center justify-center bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-[var(--chart-3)]/10">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none border-[var(--chart-3)]/20 bg-transparent hover:bg-[var(--chart-3)] hover:text-[var(--background)] transition-colors"
                onClick={() => fileInputRef.current?.click()}
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
                disabled={isStreaming || (!inputText.trim() && !pendingFiles.some(p => p.fileId && !p.error))}
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
