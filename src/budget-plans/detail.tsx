import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  PiggyBank,
  MapPin,
  Pencil,
  Check,
  X,
  Loader2,
  Trash2,
  Play,
  Archive,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, type BudgetPlanDetail, type BudgetCategoryKey } from '../lib/api';

/* ── Helpers ── */

const CATEGORY_LABELS: Record<BudgetCategoryKey, string> = {
  rent: 'Rent',
  food: 'Food',
  transportation: 'Transport',
  utilities: 'Utilities',
  laundry: 'Laundry',
  internet: 'Internet',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted-foreground/10 text-muted-foreground' },
  active: { label: 'Active', className: 'bg-emerald-600/10 text-emerald-600' },
  archived: { label: 'Archived', className: 'bg-foreground/5 text-foreground/40' },
};

function SectionHeader({ label, subtitle }: { label: string; subtitle?: string }) {
  return (
    <div className="border-[var(--chart-3)] border">
      <div className="bg-[var(--chart-3)] text-[var(--background)] px-4 py-2 flex items-baseline justify-between">
        <span className="text-[10px] tracking-[0.12em] uppercase font-sans font-medium">
          {label}
        </span>
        {subtitle && (
          <span className="text-[10px] font-serif italic opacity-70">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

/* ── Category Row (with inline edit) ── */

function CategoryRow({
  cat,
  totalCost,
  canEdit,
  onSave,
}: {
  cat: BudgetPlanDetail['categories'][number];
  totalCost: number;
  canEdit: boolean;
  onSave: (category: BudgetCategoryKey, amount: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(cat.monthly_amount_idr));
  const [saving, setSaving] = useState(false);

  const pct = totalCost ? Math.round((cat.monthly_amount_idr / totalCost) * 100) : 0;

  const startEdit = () => {
    setDraft(String(cat.monthly_amount_idr));
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(String(cat.monthly_amount_idr));
  };

  const save = async () => {
    const val = Number(draft);
    if (!val || val < 0) { cancel(); return; }
    if (val === cat.monthly_amount_idr) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(cat.category, val);
      setEditing(false);
    } catch {
      // Keep edit open on failure so user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-foreground/70">
          {CATEGORY_LABELS[cat.category] ?? cat.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground/35">{pct}%</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-foreground/35">Rp</span>
              <Input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') save();
                  if (e.key === 'Escape') cancel();
                }}
                onBlur={save}
                autoFocus
                disabled={saving}
                className="h-6 w-28 text-[11px] rounded-none border-[var(--chart-3)] bg-background px-2 py-0 font-serif"
              />
              {saving ? (
                <Loader2 className="size-3 animate-spin text-foreground/40" />
              ) : (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); save(); }}
                  className="flex size-5 items-center justify-center text-emerald-600 hover:bg-emerald-600/10 transition-colors"
                >
                  <Check className="size-3" />
                </button>
              )}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); cancel(); }}
                className="flex size-5 items-center justify-center text-foreground/30 hover:bg-foreground/5 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-serif text-foreground">
                Rp{cat.monthly_amount_idr.toLocaleString('id-ID')}
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="flex size-5 items-center justify-center text-foreground/20 hover:text-foreground/50 transition-colors"
                >
                  <Pencil className="size-2.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-1.5 h-1 bg-foreground/10 w-full">
        <div
          className="h-full bg-[var(--chart-3)]/40 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[8px] text-foreground/25 mt-1">
        {cat.daily_amount_idr.toLocaleString('id-ID')}/day · {cat.source.replace(/_/g, ' ')}
      </p>
    </div>
  );
}

/* ── Delete Confirmation Dialog ── */

function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[360px] border border-[var(--chart-3)] bg-background">
        <div className="bg-[var(--chart-3)] text-[var(--background)] px-5 py-3">
          <span className="text-[9px] tracking-[0.12em] uppercase font-medium opacity-60">Confirm</span>
          <h3 className="text-base font-serif italic">Delete Plan</h3>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this budget plan? This action cannot be undone.
          </p>
        </div>
        <div className="flex border-t border-[var(--chart-3)]">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[10px] tracking-[0.06em] uppercase font-medium text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <div className="w-px bg-[var(--chart-3)]" />
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[10px] tracking-[0.06em] uppercase font-medium text-red-600 hover:bg-red-600/5 transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Detail Page ── */

export const BudgetPlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<BudgetPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchPlan = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.getBudgetPlan(id);
      setPlan(data);
      setError(null);
    } catch (err) {
      console.error('[budget-plan-detail] fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load budget plan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchPlan();
  }, [fetchPlan]);

  // ── Actions ──

  const handleActivate = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.activateBudgetPlan(id);
      await fetchPlan();
    } catch (err) {
      console.error('[budget-plan-detail] activate failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.archiveBudgetPlan(id);
      await fetchPlan();
    } catch (err) {
      console.error('[budget-plan-detail] archive failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.deleteBudgetPlan(id);
      navigate('/me/budget-plans');
    } catch (err) {
      console.error('[budget-plan-detail] delete failed:', err);
      setActionLoading(false);
    }
  };

  const handleCategorySave = async (category: BudgetCategoryKey, amount: number) => {
    if (!id || !plan) return;
    // Send all categories with the updated one merged in
    const categories = plan.categories.map(c =>
      c.category === category ? { category: c.category, monthly_amount_idr: amount } : { category: c.category, monthly_amount_idr: c.monthly_amount_idr }
    );
    const updated = await api.updateBudgetPlanCategories(id, categories);
    setPlan(updated);
  };

  // ── Derived values ──

  const ratio = plan?.rent_to_income_ratio ?? 0;
  const ratioColor =
    ratio <= 30 ? 'text-emerald-600' : ratio <= 40 ? 'text-amber-600' : 'text-red-600';
  const ratioBg =
    ratio <= 30 ? 'bg-emerald-600' : ratio <= 40 ? 'bg-amber-600' : 'bg-red-600';
  const ratioLabel =
    ratio <= 30 ? 'Healthy' : ratio <= 40 ? 'Tight' : 'Risky';

  const st = statusConfig[plan?.status ?? 'draft'] ?? statusConfig.draft;
  const canEdit = plan?.status === 'draft';

  // ── Render ──

  if (loading) {
    return (
      <div className="relative z-10 flex h-svh items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-[var(--chart-3)]" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="relative z-10 flex h-svh flex-col items-center justify-center gap-3 bg-background">
        <p className="text-sm text-muted-foreground">{error ?? 'Budget plan not found'}</p>
        <button
          onClick={() => navigate('/me/budget-plans')}
          className="px-3 py-1.5 text-[10px] tracking-[0.06em] uppercase font-medium bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-2)] transition-colors"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex h-svh flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[860px] px-4 py-6 md:px-8 md:py-8">

          {/* Page Header */}
          <div className="mb-6 border-[var(--chart-3)] border">
            <div className="bg-[var(--chart-3)] text-[var(--background)] px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/me/budget-plans')}
                    className="flex size-7 items-center justify-center hover:bg-[var(--background)]/10 transition-colors"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <div>
                    <span className="text-[10px] tracking-[0.12em] uppercase font-sans font-medium opacity-60">
                      Detail
                    </span>
                    <h1 className="text-lg md:text-xl font-serif italic leading-tight line-clamp-1">
                      {plan.label}
                    </h1>
                  </div>
                </div>
                <span className={`text-[8px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 ${st.className}`}>
                  {st.label}
                </span>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-2 mt-2 ml-10">
                {plan.status === 'draft' && (
                  <Button
                    size="xs"
                    onClick={handleActivate}
                    disabled={actionLoading}
                    className="gap-1 text-[9px] tracking-[0.06em] uppercase rounded-none bg-emerald-600 text-white hover:bg-emerald-700 border-0"
                  >
                    {actionLoading ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                    Activate
                  </Button>
                )}
                {plan.status === 'active' && (
                  <Button
                    size="xs"
                    onClick={handleArchive}
                    disabled={actionLoading}
                    className="gap-1 text-[9px] tracking-[0.06em] uppercase rounded-none bg-[var(--background)] text-[var(--chart-3)] hover:bg-[var(--background)]/80 border-0"
                  >
                    {actionLoading ? <Loader2 className="size-3 animate-spin" /> : <Archive className="size-3" />}
                    Archive
                  </Button>
                )}
                <Button
                  size="xs"
                  onClick={() => setShowDelete(true)}
                  disabled={actionLoading}
                  className="gap-1 text-[9px] tracking-[0.06em] uppercase rounded-none bg-transparent text-red-400 hover:bg-red-400/10 border border-red-400/30"
                >
                  <Trash2 className="size-3" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="mb-6 border border-[var(--chart-3)] border-t-0 -mt-px px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-foreground/35 mb-1">Property</p>
            <h3 className="text-[18px] font-serif leading-snug text-foreground">
              {plan.property_title}
            </h3>
            {plan.property_address && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span>{plan.property_address}</span>
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="mb-6">
            <SectionHeader label="Metrics" subtitle="Key figures" />
            <div className="grid grid-cols-2 gap-px bg-[var(--chart-3)]/10 border border-[var(--chart-3)] border-t-0">
              <div className="bg-background px-5 py-3.5">
                <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Monthly Cost</p>
                <p className="text-[20px] font-serif text-foreground leading-tight mt-1">
                  Rp{(plan.total_monthly_cost_idr ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-background px-5 py-3.5">
                <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Rent / Income</p>
                <p className={`text-[20px] font-serif leading-tight mt-1 ${ratioColor}`}>
                  {ratio.toFixed(1)}%
                </p>
              </div>
              <div className="bg-background px-5 py-3.5">
                <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Daily Allowance</p>
                <p className="text-[20px] font-serif text-foreground leading-tight mt-1">
                  Rp{(plan.total_daily_allowance_idr ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              {plan.net_monthly_savings_idr != null && (
                <div className="bg-background px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <PiggyBank className="size-3 text-foreground/25" />
                    <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Net Savings</p>
                  </div>
                  <p className={`text-[20px] font-serif leading-tight mt-1 ${
                    plan.net_monthly_savings_idr >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {plan.net_monthly_savings_idr >= 0 ? '+' : ''}Rp{plan.net_monthly_savings_idr.toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Affordability Bar */}
          <div className="mb-6 border border-[var(--chart-3)] px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-foreground/40">
                Affordability Assessment
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-[0.06em] ${ratioColor}`}>
                {ratioLabel}
              </span>
            </div>
            <div className="relative h-2 bg-foreground/10 w-full">
              <div className="absolute top-0 bottom-0 left-[60%] w-px bg-foreground/15 z-10" />
              <div
                className={`h-full ${ratioBg} transition-all duration-700`}
                style={{ width: `${Math.min((ratio / 50) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-foreground/25">0%</span>
              <span className="text-[7px] text-foreground/25">30%</span>
              <span className="text-[7px] text-foreground/25">50%</span>
            </div>
          </div>

          {/* Category Breakdown */}
          {plan.categories && plan.categories.length > 0 && (
            <div className="mb-6">
              <SectionHeader label="Cost Breakdown" subtitle={canEdit ? 'Click to edit' : 'Categories'} />
              <div className="border border-[var(--chart-3)] border-t-0 divide-y divide-[var(--chart-3)]/10">
                {plan.categories.map(cat => (
                  <CategoryRow
                    key={cat.category}
                    cat={cat}
                    totalCost={plan.total_monthly_cost_idr}
                    canEdit={canEdit}
                    onSave={handleCategorySave}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ratio Guide */}
          <div className="mb-6">
            <SectionHeader label="Ratio Guide" subtitle="Reference" />
            <div className="border border-[var(--chart-3)] border-t-0 divide-y divide-[var(--chart-3)]/10">
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-emerald-500" />
                  <span className="text-[11px] text-foreground/70">Healthy</span>
                </div>
                <span className="text-[10px] text-foreground/35">≤ 30%</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-amber-500" />
                  <span className="text-[11px] text-foreground/70">Tight</span>
                </div>
                <span className="text-[10px] text-foreground/35">30% – 40%</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-red-500" />
                  <span className="text-[11px] text-foreground/70">Risky</span>
                </div>
                <span className="text-[10px] text-foreground/35">&gt; 40%</span>
              </div>
            </div>
          </div>

          {/* Plan ID footer */}
          <div className="pt-2 border-t border-[var(--chart-3)]/10">
            <div className="flex items-center gap-1.5">
              <Calculator className="size-3 text-foreground/20" />
              <span className="text-[9px] text-foreground/25 font-mono truncate">
                {plan.id}
              </span>
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
};
