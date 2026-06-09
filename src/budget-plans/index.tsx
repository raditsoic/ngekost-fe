import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  MapPin,
  Loader2,
  ChevronRight,
  PiggyBank,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api, type BudgetPlanListItem } from '../lib/api';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted-foreground/10 text-muted-foreground' },
  active: { label: 'Active', className: 'bg-emerald-600/10 text-emerald-600' },
  archived: { label: 'Archived', className: 'bg-foreground/5 text-foreground/40' },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(amount));
}

function BudgetPlanCard({ plan }: { plan: BudgetPlanListItem }) {
  const navigate = useNavigate();
  const ratio = plan.rent_to_income_ratio ?? 0;
  const ratioColor =
    ratio <= 30 ? 'text-emerald-600' : ratio <= 40 ? 'text-amber-600' : 'text-red-600';
  const st = statusConfig[plan.status] ?? statusConfig.draft;

  return (
    <button
      type="button"
      onClick={() => navigate(`/me/budget-plans/${plan.id}`)}
      className="group w-full text-left border border-[var(--chart-3)] transition-colors hover:bg-[var(--chart-3)]/[0.02] cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--chart-3)]/10 bg-[var(--chart-3)]/[0.03]">
        <div className="flex items-center gap-1.5">
          <Calculator className="size-3 text-[var(--chart-3)]/40" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-foreground/40">
            Budget Plan
          </span>
        </div>
        <span className={`text-[8px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 ${st.className}`}>
          {st.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-[12px] font-serif leading-snug text-foreground/80 line-clamp-2">
          {plan.label}
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5 shrink-0" />
          <span className="truncate">{plan.property_address}</span>
        </div>

        {/* Metrics row */}
        <div className="mt-3 pt-3 border-t border-[var(--chart-3)]/10 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Monthly Cost</p>
            <p className="text-[13px] font-serif text-foreground leading-tight mt-0.5">
              Rp{(plan.total_monthly_cost_idr ?? 0).toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Rent/Income</p>
            <p className={`text-[13px] font-serif font-medium leading-tight mt-0.5 ${ratioColor}`}>
              {ratio.toFixed(1)}%
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <PiggyBank className="size-2.5 text-foreground/20" />
              <p className="text-[8px] uppercase tracking-[0.08em] text-foreground/35">Net Savings</p>
            </div>
            <p className={`text-[13px] font-serif leading-tight mt-0.5 ${
              (plan.net_monthly_savings_idr ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {(plan.net_monthly_savings_idr ?? 0) >= 0 ? '+' : ''}{formatCurrency(plan.net_monthly_savings_idr ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[var(--chart-3)]/10">
        <span className="text-[9px] text-muted-foreground">
          {new Date(plan.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <ChevronRight className="size-3 text-foreground/15 group-hover:text-foreground/40 transition-colors" />
      </div>
    </button>
  );
}

export const BudgetPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<BudgetPlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await api.listBudgetPlans();
      setPlans(res.data ?? []);
    } catch (err) {
      console.error('[budget-plans] fetch failed:', err);
      setError('Failed to load budget plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) {
    return (
      <div className="relative z-10 flex h-svh items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-[var(--chart-3)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-10 flex h-svh flex-col items-center justify-center gap-3 bg-background">
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); fetchPlans(); }}
          className="px-3 py-1.5 text-[10px] tracking-[0.06em] uppercase font-medium bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-2)] transition-colors"
        >
          Retry
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
            <div className="bg-[var(--chart-3)] text-[var(--background)] px-4 py-2.5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] tracking-[0.12em] uppercase font-sans font-medium opacity-70">
                  Planning
                </span>
                <h1 className="text-xl md:text-2xl font-serif italic leading-tight">
                  Budget Plans
                </h1>
              </div>
              <span className="text-[11px] tracking-[0.08em] uppercase font-sans opacity-60">
                {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
              </span>
            </div>
          </div>

          {/* Plans Grid */}
          {plans.length === 0 ? (
            <div className="border border-[var(--chart-3)] px-4 py-16 text-center">
              <Calculator className="size-6 mx-auto text-[var(--chart-3)]/30 mb-3" />
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                No budget plans yet
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Start a chat to create your first plan
              </p>
              <button
                onClick={() => navigate('/chat/new')}
                className="mt-4 px-4 py-2 text-[10px] tracking-[0.06em] uppercase font-medium bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-2)] transition-colors"
              >
                Start Chat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {plans.map((plan) => (
                <BudgetPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
