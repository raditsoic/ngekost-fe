import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, type VehicleType } from '../lib/api';
import { useAuth } from '../auth/context';

const vehicleOptions: { value: VehicleType; label: string; icon: string }[] = [
  { value: 'walking', label: 'Walking', icon: '🚶' },
  { value: 'motorcycle', label: 'Motorcycle', icon: '🛵' },
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚲' },
  { value: 'public_transport', label: 'Public Transport', icon: '🚌' },
];

const budgetPresets = ['1500000', '2000000', '3000000', '5000000'];
const expensePresets = ['1000000', '1500000', '2000000', '2500000'];

type Step = 1 | 2 | 3;

export const Onboarding = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [budget, setBudget] = useState('');
  const [expenses, setExpenses] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setSubmitting(true);
    setError('');
    try {
      await api.upsertFinancials({
        monthly_income_idr: parseInt(budget) || 0,
        monthly_expenses_idr: parseInt(expenses) || undefined,
        vehicle_type: vehicle,
      });
      const me = await api.getMe();
      setUser(me);
      navigate('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      setSubmitting(false);
    }
  };

  const formatRp = (val: number) =>
    `Rp${val.toLocaleString('id-ID')}`;

  const dailyBudget = budget ? parseInt(budget) / 30 : 0;

  const incomeValue = parseInt(budget) || 0;
  const expenseValue = parseInt(expenses) || 0;
  const expenseExceedsIncome = expenseValue > 0 && incomeValue > 0 && expenseValue > incomeValue;

  const stepEyebrow: Record<Step, string> = {
    1: 'Step 1 of 3',
    2: 'Step 2 of 3',
    3: 'Step 3 of 3',
  };

  const stepHeading: Record<Step, React.ReactNode> = {
    1: (
      <>
        Monthly <span className="italic text-[#6a9671]">income</span>
      </>
    ),
    2: (
      <>
        Monthly <span className="italic text-[#6a9671]">expenses</span>
      </>
    ),
    3: (
      <>
        Vehicle <span className="italic text-[#6a9671]">type</span>
      </>
    ),
  };

  const stepDescription: Record<Step, string> = {
    1: 'Enter your total monthly income. AI will use it as the basis for calculating your budget and daily remaining balance.',
    2: 'Estimate your expected monthly expenses. This helps AI understand how much you can realistically allocate for rent.',
    3: 'Choose the vehicle you use daily. AI will use it to estimate your transportation costs.',
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, 3) as Step);
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1) as Step);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* ─── Top bar ─── */}
      <nav className="flex h-[52px] items-center border-b border-foreground bg-background px-6 md:px-10">
        <a
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground no-underline border-r border-foreground pr-5 mr-5"
        >
          <img src="/ngekost-logo.svg" alt="ngekost" className="size-7" />
          ngekost
        </a>
        <div className="flex-1" />
        <Button
          variant="ghost"
          className="rounded-none text-[13px] text-muted-foreground hover:text-foreground px-3 h-8"
          onClick={() => navigate('/chat')}
        >
          Skip for now
        </Button>
      </nav>

      {/* ─── Main grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-52px)]">
        {/* Left — editorial brand panel */}
        <div className="hidden md:flex flex-col justify-between relative overflow-hidden bg-[#1a2e1f] text-white border-r border-foreground p-10 md:p-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-[#344e41]/40 blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-[#588157]/20 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-white/40 mb-10">
              <span className="h-px w-5 bg-[#c8401a]" />
              Onboarding
            </div>

            <h1 className="font-serif text-[clamp(36px,4vw,56px)] leading-[1.05] tracking-[-0.02em]">
              Tell us about<br />
              your <span className="italic text-[#a3b18a]">budget.</span>
            </h1>

            <p className="text-[14px] text-white/45 leading-[1.75] max-w-[320px] mt-6">
              We'll use your income, expenses, and commute preferences to evaluate which kost fits your lifestyle and budget.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 border border-white/10">
            {[
              { val: '7', label: 'Data points' },
              { val: '~3 min', label: 'To complete' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`p-4 ${i < 1 ? 'border-r border-white/10' : ''}`}
              >
                <div className="font-serif text-[24px] leading-none mb-1">{s.val}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-[0.08em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center bg-card px-8 py-12 md:px-16">
          {/* Section header */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-6">
            <span className="h-px w-4 bg-[#c8401a]" />
            {stepEyebrow[step]}
          </div>

          <h2 className="font-serif text-[28px] leading-[1.1] tracking-[-0.02em] mb-1.5">
            {stepHeading[step]}
          </h2>

          <p className="text-[13px] text-muted-foreground leading-[1.7] mb-8 max-w-[360px]">
            {stepDescription[step]}
          </p>

          {error && (
            <div className="mb-5 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Step 1 — Income */}
          {step === 1 && (
            <form onSubmit={goNext} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Monthly Income (IDR)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/50">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 3000000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    min="0"
                    required
                    className="w-full rounded-none border border-foreground bg-transparent py-2.5 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20 transition-colors"
                  />
                </div>
              </div>

              {dailyBudget > 0 && (
                <div className="flex items-center gap-1.5 border border-border px-4 py-2.5">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">≈</span>
                  <span className="font-serif text-[15px] tabular-nums text-foreground">
                    {formatRp(Math.round(dailyBudget))}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">/ day</span>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Quick Select
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetPresets.map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      onClick={() => setBudget(val)}
                      className={`rounded-none h-10 text-[13px] font-medium transition-colors ${
                        budget === val
                          ? 'border-[#344e41] bg-[#344e41] text-white hover:bg-[#344e41]/90 hover:text-white'
                          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {formatRp(parseInt(val))}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!budget}
                className="mt-3 h-11 rounded-none bg-foreground text-background hover:bg-[#6a9671] border-0 text-[13px] font-medium gap-2 disabled:opacity-50"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}

          {/* Step 2 — Expenses */}
          {step === 2 && (
            <form onSubmit={goNext} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Expected Monthly Expenses (IDR)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/50">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 2000000"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    min="0"
                    className={`w-full rounded-none bg-transparent py-2.5 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 transition-colors ${
                      expenseExceedsIncome
                        ? 'border border-destructive focus:ring-1 focus:ring-destructive/30'
                        : 'border border-foreground focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20'
                    }`}
                  />
                </div>
              </div>

              {expenseExceedsIncome && (
                <p className="text-[12px] text-destructive leading-snug">
                  Expenses cannot exceed your monthly income of {formatRp(incomeValue)}.
                </p>
              )}

              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Quick Select
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {expensePresets.filter((v) => parseInt(v) <= incomeValue).map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      onClick={() => setExpenses(val)}
                      className={`rounded-none h-10 text-[13px] font-medium transition-colors ${
                        expenses === val
                          ? 'border-[#344e41] bg-[#344e41] text-white hover:bg-[#344e41]/90 hover:text-white'
                          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {formatRp(parseInt(val))}
                    </Button>
                  ))}
                </div>
              </div>

              {expenseValue > 0 && !expenseExceedsIncome && (
                <div className="flex items-center gap-1.5 border border-border px-4 py-2.5">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Savings</span>
                  <span className="font-serif text-[15px] tabular-nums text-foreground">
                    {formatRp(incomeValue - expenseValue)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">/ month</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="flex-1 h-11 rounded-none border-foreground text-[13px] font-medium gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!expenses || expenseExceedsIncome}
                  className="flex-[2] h-11 rounded-none bg-foreground text-background hover:bg-[#6a9671] border-0 text-[13px] font-medium gap-2 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3 — Vehicle */}
          {step === 3 && (
            <form onSubmit={handleFinish} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Select your vehicle
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vehicleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setVehicle(opt.value)}
                      className={`flex flex-col items-center gap-2 border py-5 transition-colors ${
                        vehicle === opt.value
                          ? 'border-[#344e41] bg-[#344e41]/[0.06]'
                          : 'border-border bg-transparent hover:border-foreground/30'
                      }`}
                    >
                      <span className="text-xl leading-none">{opt.icon}</span>
                      <span className={`text-[11px] font-medium leading-tight text-center transition-colors ${
                        vehicle === opt.value ? 'text-[#344e41]' : 'text-muted-foreground'
                      }`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={submitting}
                  className="flex-1 h-11 rounded-none border-foreground text-[13px] font-medium gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!vehicle || submitting}
                  className="flex-[2] h-11 rounded-none bg-foreground text-background hover:bg-[#6a9671] border-0 text-[13px] font-medium gap-2"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  {submitting ? 'Saving…' : 'Get Started'}
                </Button>
              </div>
            </form>
          )}

          {/* Mobile-only: link to chat */}
          <div className="mt-8 pt-6 border-t border-border text-center md:hidden">
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={() => navigate('/chat')}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
