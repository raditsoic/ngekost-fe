import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const vehicleOptions = [
  { value: 'Jalan Kaki', label: 'Walking', icon: '🚶' },
  { value: 'Motor Matic', label: 'Scooter', icon: '🛵' },
  { value: 'Motor Manual', label: 'Manual Bike', icon: '🏍️' },
  { value: 'Mobil', label: 'Car', icon: '🚗' },
  { value: 'Sepeda', label: 'Bicycle', icon: '🚲' },
  { value: 'Transportasi Umum', label: 'Public Transport', icon: '🚌' },
];

const budgetPresets = ['1500000', '2000000', '3000000', '5000000'];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [budget, setBudget] = useState('');
  const [vehicle, setVehicle] = useState('');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/chat');
  };

  const formatRp = (val: number) =>
    `Rp${val.toLocaleString('id-ID')}`;

  const dailyBudget = budget ? parseInt(budget) / 30 : 0;

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-[#f5f5f5]">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-14 flex items-center justify-center gap-2">
            <img src="/ngekost-logo.svg" alt="ngekost" className="size-7" />
            <span className="text-lg font-bold text-[#344e41]">ngekost</span>
          </div>

          {/* Step indicator */}
          <div className="mb-10 flex items-center justify-center gap-2">
            <div className={`size-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[#344e41]' : 'bg-[#cbd5e1]'}`} />
            <div className={`h-0.5 w-20 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-[#344e41]' : 'bg-[#cbd5e1]'}`} />
            <div className={`size-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[#344e41]' : 'bg-[#cbd5e1]'}`} />
          </div>

          {/* Step 1 — Budget */}
          {step === 1 && (
            <div key="step1" className="animate-in fade-in slide-in-from-bottom-3 duration-400 flex flex-col items-center text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#344e41]/10 text-xl">
                💰
              </div>
              <h1 className="mb-1.5 text-2xl font-bold text-[#151515]">
                Monthly Budget
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-[#94a3b8]">
                Enter your total monthly budget. AI will use it as the basis for calculating expenses and your daily remaining budget.
              </p>

              <form
                onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                className="flex w-full flex-col gap-4"
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94a3b8]">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 3000000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    min="0"
                    required
                    className="w-full rounded-2xl border border-[#cbd5e1] bg-white py-3.5 pl-11 pr-4 text-[15px] font-semibold text-[#151515] outline-none transition-all placeholder:text-[#94a3b8]/60 focus:border-[#344e41] focus:ring-2 focus:ring-[#344e41]/10"
                  />
                </div>

                {dailyBudget > 0 && (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#344e41]/10 bg-[#344e41]/[0.04] px-4 py-2 animate-in fade-in duration-200">
                    <span className="text-xs text-[#94a3b8]">≈</span>
                    <span className="text-sm font-semibold tabular-nums text-[#344e41]">
                      {formatRp(Math.round(dailyBudget))}
                    </span>
                    <span className="text-xs text-[#94a3b8]">/ day</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {budgetPresets.map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setBudget(val)}
                      className={`rounded-full font-semibold transition-all duration-200 ${
                        budget === val
                          ? 'border-[#344e41] bg-[#344e41] text-white hover:bg-[#344e41]/90 hover:text-white'
                          : 'text-[#94a3b8] hover:border-[#344e41]/40 hover:text-[#344e41]'
                      }`}
                    >
                      {formatRp(parseInt(val))}
                    </Button>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="mt-2 h-12 rounded-2xl text-sm font-semibold gap-2"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => navigate('/chat')}
                  className="pt-1 text-[#94a3b8] hover:text-[#344e41]"
                >
                  Skip for now
                </Button>
              </form>
            </div>
          )}

          {/* Step 2 — Vehicle */}
          {step === 2 && (
            <div key="step2" className="animate-in fade-in slide-in-from-bottom-3 duration-400 flex flex-col items-center text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#344e41]/10 text-xl">
                🧭
              </div>
              <h1 className="mb-1.5 text-2xl font-bold text-[#151515]">
                Vehicle Type
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-[#94a3b8]">
                Choose the vehicle you use daily. AI will use it to estimate your transportation costs.
              </p>

              <form onSubmit={handleFinish} className="flex w-full flex-col gap-4">
                <div className="grid grid-cols-3 gap-2">
                  {vehicleOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant="outline"
                      onClick={() => setVehicle(opt.value)}
                      className={`flex-col gap-1.5 rounded-2xl py-4 transition-all duration-200 h-auto ${
                        vehicle === opt.value
                          ? 'border-[#344e41] bg-[#344e41]/[0.06]'
                          : 'bg-white hover:border-[#344e41]/30'
                      }`}
                    >
                      <span className="text-xl leading-none">{opt.icon}</span>
                      <span className={`text-[11px] font-semibold leading-tight text-center transition-colors ${
                        vehicle === opt.value ? 'text-[#344e41]' : 'text-[#94a3b8]'
                      }`}>
                        {opt.label}
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-2xl text-sm font-semibold gap-1.5"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!vehicle}
                    className="flex-2 h-12 rounded-2xl text-sm font-semibold gap-2"
                  >
                    Start
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
