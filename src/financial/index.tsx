import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Image as ImageIcon,
  X,
  TrendingDown,
  Pencil,
  MapPin,
  Calendar,
  ExternalLink,
  Home,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, title: 'Food 1', amount: -12500, category: 'Konsumsi', date: '12 May 2026' },
  { id: 2, title: 'Essential 1', amount: -45000, category: 'Utilitas', date: '11 May 2026' },
  { id: 3, title: 'Entertainment 1', amount: -75000, category: 'Lainnya', date: '10 May 2026' },
  { id: 4, title: 'Essential 2', amount: -30000, category: 'Utilitas', date: '09 May 2026' },
  { id: 5, title: 'Transport 1', amount: -20000, category: 'Transportasi', date: '08 May 2026' },
  { id: 6, title: 'Kost Bulanan', amount: -1500000, category: 'Sewa', date: '01 May 2026' },
];

const categoryColors: Record<string, string> = {
  Konsumsi: '#34d399',
  Utilitas: '#f87171',
  Lainnya: '#e879f9',
  Transportasi: '#60a5fa',
  Sewa: '#fbbf24',
};

const categoryLabels: Record<string, string> = {
  Konsumsi: 'Food',
  Utilitas: 'Utilities',
  Lainnya: 'Other',
  Transportasi: 'Transport',
  Sewa: 'Rent',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const mockExpected = [2800000, 2800000, 2800000, 2800000, 2800000, 2800000];
const mockActual   = [3100000, 2500000, 2900000, 3200000, 2750000, 262500];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(amount));

const formatCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
};

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  let cumulative = 0;
  const segments = data.map((d) => {
    const start = cumulative;
    const pct = d.value / total;
    cumulative += pct;
    return { ...d, start, pct };
  });

  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0 -rotate-90">
        {segments.map((s) => (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${s.pct * c} ${c}`}
            strokeDashoffset={`${-s.start * c}`}
            className="transition-all duration-500"
          />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[11px]">
            <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[#64748b] truncate">{d.label}</span>
            <span className="ml-auto font-medium text-[#151515] whitespace-nowrap">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ expected, actual }: { expected: number[]; actual: number[] }) {
  const maxVal = Math.max(...expected, ...actual);

  return (
    <div className="flex items-end gap-3 h-32">
      {MONTHS.map((month, i) => {
        const expH = (expected[i] / maxVal) * 100;
        const actH = (actual[i] / maxVal) * 100;
        const over = actual[i] > expected[i];
        return (
          <div key={month} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 h-24 w-full">
              <div
                className="flex-1 rounded-t bg-[#344e41]/20 transition-all"
                style={{ height: `${expH}%` }}
                title={`Expected: ${formatCurrency(expected[i])}`}
              />
              <div
                className={`flex-1 rounded-t transition-all ${over ? 'bg-red-400' : 'bg-[#344e41]'}`}
                style={{ height: `${actH}%` }}
                title={`Actual: ${formatCurrency(actual[i])}`}
              />
            </div>
            <span className="text-[9px] text-[#94a3b8]">{month}</span>
          </div>
        );
      })}
    </div>
  );
}

export const Financial = () => {
  const navigate = useNavigate();
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState('5000000');
  const [editingIncome, setEditingIncome] = useState(false);

  const totalIncome = Number(incomeInput) || 0;
  const totalExpenses = transactions.reduce((s, t) => s + Math.abs(t.amount), 0);

  const breakdownData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      const cat = t.category;
      grouped[cat] = (grouped[cat] || 0) + Math.abs(t.amount);
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label: categoryLabels[label] || label,
        value,
        color: categoryColors[label] || '#94a3b8',
      }));
  }, [transactions]);

  return (
    <div className="relative z-10 flex h-svh flex-col bg-[#f5f5f5]">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-6 md:px-6">

          {/* Header */}
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-[#151515]">Financial</h1>
            <p className="text-sm text-[#94a3b8] mt-0.5">Track your rental expenses</p>
          </div>

          {/* Summary Card */}
          <Card className="border-0 bg-[#344e41] text-white shadow-sm overflow-hidden">
            <div className="flex divide-x divide-white/10">
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                    <ArrowUpRight className="size-2.5" />
                    Income
                  </div>
                  <button
                    onClick={() => setEditingIncome(!editingIncome)}
                    className="size-5 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
                  >
                    <Pencil className="size-2.5" />
                  </button>
                </div>
                {editingIncome ? (
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-white/50">Rp</span>
                    <input
                      type="text"
                      value={incomeInput}
                      onChange={(e) => setIncomeInput(e.target.value.replace(/\D/g, ''))}
                      onBlur={() => setEditingIncome(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingIncome(false)}
                      autoFocus
                      className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-white/30"
                      placeholder="5000000"
                    />
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm font-semibold">{formatCurrency(totalIncome)}</p>
                )}
              </div>
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                  <ArrowDownRight className="size-2.5" />
                  Expenses
                </div>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </Card>

          {/* Rented Property */}
          <Card className="mt-3 border border-[#cbd5e1]/50 bg-white shadow-none">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-[#151515]">Current Rental</h3>
              <Button variant="ghost" size="xs" className="gap-1 text-[10px] text-[#344e41]">
                Browse Properties
              </Button>
            </div>
            <div className="px-4 pb-4">
              <div
                onClick={() => navigate(`/property/${encodeURIComponent('Kost Skyla VVIP Wonokromo')}`)}
                className="flex gap-3 rounded-lg border border-[#cbd5e1]/50 p-3 cursor-pointer transition-colors hover:border-[#344e41]/20 hover:bg-[#344e41]/[0.02]"
              >
                <div className="size-14 shrink-0 rounded-lg bg-[#e4e5f1] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop"
                    alt="Kost Skyla VVIP Wonokromo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#151515] truncate">Kost Skyla VVIP Wonokromo</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#94a3b8]">
                    <MapPin className="size-2.5 shrink-0" />
                    <span className="truncate">Jl. Kapasari No.132, Surabaya</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs font-bold text-[#344e41]">Rp2.500.000<span className="font-normal text-[#94a3b8]">/bulan</span></span>
                    <span className="flex items-center gap-1 text-[10px] text-[#64748b]">
                      <Calendar className="size-2.5" />
                      Due 1 Jun
                    </span>
                  </div>
                </div>
                <ExternalLink className="size-3.5 text-[#cbd5e1] shrink-0 mt-0.5" />
              </div>
            </div>
          </Card>

          {/* Add Transaction */}
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 text-xs bg-[#344e41] hover:bg-[#3a5c40]"
            >
              <Plus className="size-3.5" />
              Add Transaction
            </Button>
          </div>

          {/* Grid: History + Donut */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* History */}
            <Card className="border border-[#cbd5e1]/50 bg-white shadow-none">
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-[#151515]">History</h3>
              </div>
              <div className="px-4 pb-2">
                <div className="flex flex-col gap-2">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5">
                      <div className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: categoryColors[t.category] || '#94a3b8' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#151515] truncate">{t.title}</p>
                        <p className="text-[10px] text-[#94a3b8]">{t.date}</p>
                      </div>
                      <span className={`text-xs font-semibold ${t.amount < 0 ? 'text-[#151515]' : 'text-[#344e41]'}`}>
                        {t.amount < 0 ? '-' : '+'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="bg-[#cbd5e1]/50" />
              <div className="px-4 py-2.5">
                <Button variant="ghost" size="sm" className="w-full text-[11px] text-[#64748b]">
                  Browse All Transactions
                </Button>
              </div>
            </Card>

            {/* Expenses Breakdown Donut */}
            <Card className="border border-[#cbd5e1]/50 bg-white shadow-none">
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-[#151515]">Expenses Breakdown</h3>
              </div>
              <div className="px-4 pb-4">
                <DonutChart data={breakdownData} />
              </div>
            </Card>
          </div>

          {/* Monthly Expected vs Actual Bar Chart */}
          <Card className="mt-3 border border-[#cbd5e1]/50 bg-white shadow-none">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#151515]">Monthly Expected vs Actual</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-[#344e41]/20" /> Expected</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-[#344e41]" /> Actual</span>
              </div>
            </div>
            <div className="px-4 pb-4">
              <BarChart expected={mockExpected} actual={mockActual} />
            </div>
          </Card>

          <div className="h-6" />
        </div>
      </ScrollArea>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="mx-4 w-full max-w-[400px] border-0 shadow-lg">
            <div className="flex items-center justify-between px-5 pt-5 pb-1">
              <h3 className="text-base font-semibold text-[#151515]">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="size-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:bg-muted transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <p className="px-5 pb-4 text-xs text-[#94a3b8]">Upload a receipt or fill in manually.</p>

            {/* OCR Upload */}
            <div className="px-5 pb-4">
              <button className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#cbd5e1] bg-[#f5f5f5] py-5 transition-colors hover:border-[#344e41]/30">
                <ImageIcon className="size-5 text-[#94a3b8]" />
                <span className="text-xs font-medium text-[#64748b]">Choose Photo</span>
              </button>
            </div>

            <div className="px-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#cbd5e1]" />
                <span className="text-[10px] font-semibold text-[#94a3b8]">OR</span>
                <div className="h-px flex-1 bg-[#cbd5e1]" />
              </div>
            </div>

            {/* Manual Form */}
            <div className="px-5 pb-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#64748b]">Amount (Rp)</label>
                <Input
                  type="number"
                  placeholder="e.g. 45000"
                  className="h-9 text-sm border-[#cbd5e1] bg-[#f5f5f5]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#64748b]">Category</label>
                <select className="h-9 rounded-lg border border-[#cbd5e1] bg-[#f5f5f5] px-3 text-sm text-[#151515] focus:outline-none focus:ring-1 focus:ring-[#344e41]">
                  <option value="" disabled>Select Category</option>
                  <option value="Konsumsi">Konsumsi</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Utilitas">Utilitas</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#64748b]">Date</label>
                <Input
                  type="date"
                  className="h-9 text-sm border-[#cbd5e1] bg-[#f5f5f5]"
                />
              </div>
              <Button className="mt-1 h-10 bg-[#344e41] hover:bg-[#3a5c40] text-sm font-semibold">
                Add Record
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
