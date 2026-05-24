import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Image as ImageIcon,
  X,
  Pencil,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

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

const CATEGORY_COLORS: Record<string, string> = {
  Konsumsi: '#a3b18a',
  Utilitas: '#6aa073',
  Lainnya: '#93b599',
  Transportasi: '#588157',
  Sewa: '#344e41',
};

const CHART_COLORS = {
  expected: '#344e41',
  actual: '#a3b18a',
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

const monthlyData = MONTHS.map((month, i) => ({
  month,
  expected: mockExpected[i],
  actual: mockActual[i],
}));

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(amount));

const formatCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
};

function formatTooltipCurrency(value: number, name: string) {
  return [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)];
}

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

export const Financial = () => {
  const navigate = useNavigate();
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState('5000000');
  const [editingIncome, setEditingIncome] = useState(false);

  const totalIncome = Number(incomeInput) || 0;
  const totalExpenses = transactions.reduce((s, t) => s + Math.abs(t.amount), 0);

  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      const cat = t.category;
      grouped[cat] = (grouped[cat] || 0) + Math.abs(t.amount);
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, value]) => ({
        name: categoryLabels[cat] || cat,
        value,
        color: CATEGORY_COLORS[cat] || '#93b599',
      }));
  }, [transactions]);

  return (
    <div className="relative z-10 flex h-svh flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[860px] px-4 py-6 md:px-8 md:py-8">

          {/* Page Header */}
          <div className="mb-6 border-[var(--chart-3)] border">
            <div className="bg-[var(--chart-3)] text-[var(--background)] px-4 py-2.5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] tracking-[0.12em] uppercase font-sans font-medium opacity-70">
                  Overview
                </span>
                <h1 className="text-xl md:text-2xl font-serif italic leading-tight">
                  Financial
                </h1>
              </div>
              <span className="text-[11px] tracking-[0.08em] uppercase font-sans opacity-60">
                {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Income / Expenses Summary */}
          <div className="grid grid-cols-2 border border-[var(--chart-3)] mb-6">
            <div className="px-5 py-4 border-r border-[var(--chart-3)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--background)] bg-[var(--chart-3)] px-1.5 py-0.5 font-medium">
                  Income
                </span>
                <button
                  onClick={() => setEditingIncome(!editingIncome)}
                  className="size-5 flex items-center justify-center text-[var(--chart-5)] hover:text-[var(--chart-2)] transition-colors"
                >
                  <Pencil className="size-2.5" />
                </button>
              </div>
              {editingIncome ? (
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xs text-muted-foreground">Rp</span>
                  <input
                    type="text"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setEditingIncome(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingIncome(false)}
                    autoFocus
                    className="w-full bg-transparent text-lg font-serif font-medium outline-none text-[var(--chart-3)] placeholder:text-muted-foreground/50"
                    placeholder="5000000"
                  />
                </div>
              ) : (
                <p className="text-lg font-serif font-medium text-[var(--chart-3)]">{formatCurrency(totalIncome)}</p>
              )}
            </div>
            <div className="px-5 py-4">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--background)] bg-[var(--chart-3)] px-1.5 py-0.5 font-medium">
                Expenses
              </span>
              <p className="text-lg font-serif font-medium text-[var(--chart-3)] mt-1">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>

          {/* Current Rental */}
          <div className="mb-6">
            <SectionHeader label="Current Rental" subtitle="Active lease" />
            <div className="border border-[var(--chart-3)] border-t-0">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-[10px] tracking-[0.08em] uppercase text-muted-foreground">Property</span>
                <Button variant="ghost" size="xs" className="gap-1 text-[10px] tracking-[0.06em] uppercase text-[var(--chart-2)] hover:text-[var(--chart-3)] rounded-none">
                  Browse
                </Button>
              </div>
              <div
                onClick={() => navigate(`/property/${encodeURIComponent('Kost Skyla VVIP Wonokromo')}`)}
                className="flex gap-3 p-4 cursor-pointer transition-colors hover:bg-[var(--chart-3)]/[0.03]"
              >
                <div className="size-14 shrink-0 bg-[var(--chart-1)]/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop"
                    alt="Kost Skyla VVIP Wonokromo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Kost Skyla VVIP Wonokromo</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="size-2.5 shrink-0" />
                    <span className="truncate">Jl. Kapasari No.132, Surabaya</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs font-serif font-medium text-[var(--chart-3)]">
                      Rp2.500.000
                      <span className="font-sans font-normal text-muted-foreground">/bulan</span>
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--chart-5)]">
                      <Calendar className="size-2.5" />
                      Due 1 Jun
                    </span>
                  </div>
                </div>
                <ExternalLink className="size-3.5 text-[var(--chart-5)] shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* History + Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-6">
            {/* Transaction History */}
            <div className="border border-[var(--chart-3)]">
              <SectionHeader label="History" subtitle="Recent" />
              <div className="divide-y divide-border">
                {transactions.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-serif italic text-[var(--chart-5)] text-[11px] w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <div className="size-2.5 shrink-0" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#93b599' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">{t.date}</p>
                    </div>
                    <span className={`text-[11px] font-serif font-medium whitespace-nowrap ${t.amount < 0 ? 'text-[var(--chart-3)]' : 'text-[var(--chart-2)]'}`}>
                      {t.amount < 0 ? '-' : '+'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--chart-3)] px-4 py-2">
                <Button variant="ghost" size="sm" className="w-full text-[10px] tracking-[0.06em] uppercase text-[var(--chart-2)] hover:text-[var(--chart-3)] rounded-none">
                  View All Transactions
                </Button>
              </div>
            </div>

            {/* Expenses Breakdown — Recharts Pie */}
            <div className="border border-[var(--chart-3)] border-l-0 md:border-l-0">
              <SectionHeader label="Breakdown" subtitle="By category" />
              <div className="p-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        border: '1px solid #344e41',
                        borderRadius: 0,
                        fontSize: 11,
                        fontFamily: 'Plus Jakarta Sans',
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string, entry) => {
                        const item = pieData.find((d) => d.name === value);
                        const pct = item ? Math.round((item.value / totalExpenses) * 100) : '';
                        return (
                          <span className="text-[11px]" style={{ color: item?.color || '#94a3b8' }}>
                            {value} <span className="text-muted-foreground">{pct}%</span>
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="border-t border-[var(--chart-3)] px-4 py-2">
                <span className="text-[10px] text-muted-foreground">
                  Total: <span className="font-serif text-[var(--chart-3)]">{formatCurrency(totalExpenses)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Expected vs Actual — Recharts AreaChart */}
          <div className="mb-6">
            <SectionHeader label="Monthly" subtitle="Expected vs Actual" />
            <div className="border border-[var(--chart-3)] border-t-0 p-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCompact}
                    tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{
                      border: '1px solid #344e41',
                      borderRadius: 0,
                      fontSize: 11,
                      fontFamily: 'Plus Jakarta Sans',
                    }}
                  />
                  <ReferenceLine
                    y={mockExpected[0]}
                    stroke={CHART_COLORS.expected}
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="expected"
                    stroke={CHART_COLORS.expected}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill={CHART_COLORS.expected}
                    fillOpacity={0.04}
                    dot={false}
                    name="expected"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke={CHART_COLORS.actual}
                    strokeWidth={2}
                    fill={CHART_COLORS.actual}
                    fillOpacity={0.08}
                    dot={{ r: 3, fill: CHART_COLORS.actual, strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: CHART_COLORS.actual, strokeWidth: 2, stroke: '#ffffff' }}
                    name="actual"
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="line"
                    wrapperStyle={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', paddingBottom: 8 }}
                    formatter={(value: string) => (
                      <span className="text-[10px] tracking-[0.04em] uppercase" style={{ color: '#94a3b8' }}>
                        {value}
                      </span>
                    )}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Add Transaction Button */}
          <div className="flex justify-end pb-8">
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 text-[10px] tracking-[0.06em] uppercase rounded-none bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-2)]"
            >
              <Plus className="size-3.5" />
              Add Transaction
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--chart-3)]/20 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-[420px] border border-[var(--chart-3)] bg-background">
            <div className="bg-[var(--chart-3)] text-[var(--background)] px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] tracking-[0.12em] uppercase font-medium opacity-60">New Entry</span>
                <h3 className="text-base font-serif italic">Add Transaction</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="size-6 flex items-center justify-center text-[var(--background)]/40 hover:text-[var(--background)] transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 pb-4">
              <button className="flex w-full flex-col items-center gap-2 border-2 border-dashed border-[var(--chart-1)]/40 py-5 transition-colors hover:border-[var(--chart-3)]/40">
                <ImageIcon className="size-5 text-[var(--chart-2)]" />
                <span className="text-[10px] tracking-[0.06em] uppercase font-medium text-[var(--chart-2)]">Upload Receipt</span>
              </button>
            </div>

            <div className="px-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--chart-1)]/30" />
                <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--chart-5)] font-medium">Or manual entry</span>
                <div className="h-px flex-1 bg-[var(--chart-1)]/30" />
              </div>
            </div>

            <div className="px-5 pb-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.08em] uppercase text-[var(--chart-2)] font-medium">Amount (Rp)</label>
                <Input
                  type="number"
                  placeholder="e.g. 45000"
                  className="h-9 text-sm rounded-none border-[var(--chart-3)] bg-background"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.08em] uppercase text-[var(--chart-2)] font-medium">Category</label>
                <select className="h-9 border border-[var(--chart-3)] bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--chart-2)]">
                  <option value="" disabled>Select Category</option>
                  <option value="Konsumsi">Konsumsi</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Utilitas">Utilitas</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.08em] uppercase text-[var(--chart-2)] font-medium">Date</label>
                <Input
                  type="date"
                  className="h-9 text-sm rounded-none border-[var(--chart-3)] bg-background"
                />
              </div>
              <Button className="mt-1 h-10 bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-2)] text-[11px] rounded-none font-semibold tracking-[0.04em] uppercase">
                Add Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
