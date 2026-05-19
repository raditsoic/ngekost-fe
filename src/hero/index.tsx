import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const properties = [
  { name: 'Kost Menteng Asri', meta: 'Jl. Menteng Raya · 400m MRT · 3 warung', score: 91, price: 'Rp 2.8jt' },
  { name: 'Kost Setiabudi View', meta: 'Jl. Setiabudi Tengah · 600m bus · minimarket', score: 84, price: 'Rp 2.2jt' },
  { name: 'Kost Kuningan Residence', meta: 'Jl. HR Rasuna Said · 200m bus · 5 warung', score: 78, price: 'Rp 1.9jt' },
];

const costBars = [
  { label: 'Rent', pct: 65 },
  { label: 'Food', pct: 42 },
  { label: 'Transport', pct: 28 },
];

const stats = [
  { num: '2,400+', label: 'Properties analyzed' },
  { num: '18', label: 'POI data points' },
  { num: '92%', label: 'Cost accuracy' },
];

const monthlySpending = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 2800 },
  { month: 'Mar', amount: 3500 },
  { month: 'Apr', amount: 2900 },
  { month: 'May', amount: 3100 },
  { month: 'Jun', amount: 2500 },
];

const categoryBreakdown = [
  { label: 'Rent', pct: 40, color: '#3d5a40' },
  { label: 'Food', pct: 25, color: '#6a9671' },
  { label: 'Transport', pct: 15, color: '#93b599' },
  { label: 'Utilities', pct: 12, color: '#c5c5b8' },
  { label: 'Other', pct: 8, color: '#e8eee8' },
];

const faqs = [
  {
    q: 'What is ngekost?',
    a: 'ngekost is a kost property analysis platform that helps you find the best boarding house by scoring properties on rent, nearby living costs, and essential amenities — all in one place.',
  },
  {
    q: 'How does the scoring work?',
    a: 'We analyze 18+ data points per property including rent price, distance to public transit, nearby food stalls, minimarkets, and projected monthly expenses. Each property gets a composite score from 0-100.',
  },
  {
    q: 'Is ngekost free to use?',
    a: 'Yes, ngekost is currently free during our beta period. You can search, compare properties, and use the financial projection tools at no cost.',
  },
  {
    q: 'What cities are covered?',
    a: 'We are starting with Jakarta (Sudirman, Menteng, Setiabudi, Kuningan) and expanding to other major Indonesian cities. More areas are added every month.',
  },
  {
    q: 'How accurate is the cost data?',
    a: 'Our data comes from verified listings, on-the-ground surveys, and real expense reports from residents. We achieve 92% accuracy on monthly cost projections.',
  },
];

const howSteps = [
  {
    num: '01',
    title: 'Enter your work or campus location',
    body: 'We map distances to MRT, TransJakarta, and key points from every property in that radius.',
  },
  {
    num: '02',
    title: 'We calculate real living costs',
    body: '18+ data points per property: warung, minimarket, laundry, and more — not just the rent price.',
  },
  {
    num: '03',
    title: 'Compare composite scores',
    body: 'Each kost gets a 0–100 score. Compare apples to apples, not photos to photos.',
  },
  {
    num: '04',
    title: 'Move with confidence',
    body: 'Monthly expense projections, not estimates. You know the numbers before signing the contract.',
  },
];

const cities = [
  { name: 'Jakarta', active: true },
  { name: 'Bandung', active: false },
  { name: 'Surabaya', active: false },
  { name: 'Yogyakarta', active: false },
  { name: '+ coming soon', active: false },
];

export const Hero = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const maxSpend = Math.max(...monthlySpending.map((m) => m.amount));

  return (
    <div className="bg-background font-sans text-foreground">
      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 flex h-[52px] items-center border-b border-foreground bg-background px-6 md:px-10">
        <a href="#" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground no-underline border-r border-foreground pr-5 mr-5">
          <img src="/ngekost-logo.svg" alt="ngekost" className="size-7" />
          ngekost
        </a>
        <div className="flex-1" />
        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            className="h-[52px] rounded-none border-r border-foreground px-5 text-[13px] text-muted-foreground hover:bg-muted"
            onClick={() => navigate('/auth/login')}
          >
            Sign in
          </Button>
          <Button
            className="h-[52px] rounded-none bg-foreground text-background hover:bg-primary px-6 text-[13px] font-medium gap-2 border-0"
            onClick={() => navigate('/auth/register')}
          >
            Search kost →
          </Button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="border-b border-foreground grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-90px)]">
        {/* Left */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-foreground p-10 md:p-12">
          <div>
            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-8">
              <span className="h-px w-5 bg-[#c8401a]" />
              Find the right kost
            </div>
            <h1 className="font-serif text-[clamp(52px,5.5vw,80px)] leading-[1.0] tracking-[-0.02em] py-8">
              Rent<br />smarter<span className="italic text-primary">.</span>
            </h1>
          </div>
          <div>
            <p className="text-[15px] leading-[1.7] text-muted-foreground max-w-[360px] mb-8">
              We score every kost on rent, daily living costs, and nearby essentials — not just photos and phone numbers.
            </p>
            <div className="flex gap-3 items-center">
              <Button
                className="bg-foreground text-background hover:bg-primary border border-foreground rounded-none px-6 py-3 text-[13px] font-medium gap-2"
                onClick={() => navigate('/auth/register')}
              >
                Analyze property →
              </Button>
              <Button
                variant="outline"
                className="border-foreground rounded-none px-6 py-3 text-[13px] hover:bg-muted"
                onClick={() => navigate('/auth/login')}
              >
                See an example
              </Button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col">
          {/* Stats bar */}
          <div className="grid grid-cols-3 border-b border-foreground">
            {stats.map((s, i) => (
              <div key={s.label} className={`p-5 ${i < 2 ? 'border-r border-foreground' : ''}`}>
                <div className="font-serif text-[28px] leading-none mb-1">{s.num}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-[0.06em]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Property list */}
          <div className="flex-1 p-8 flex flex-col justify-center bg-card">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-4">
              <span className="size-1.5 rounded-full bg-[#c8401a]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              Top picks near Sudirman
            </div>

            <div className="flex flex-col">
              {properties.map((p, i) => (
                <div
                  key={p.name}
                  className={`border border-foreground/20 border-b-0 flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary/[0.04] last:border-b ${i === 0 ? 'border-l-[3px] border-l-primary' : ''}`}
                >
                  <div className={`font-serif text-[22px] w-6 text-center italic shrink-0 ${i === 0 ? 'text-primary' : 'text-border'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{p.meta}</div>
                  </div>
                  <div className="font-serif text-[20px] text-primary min-w-[36px] text-right">{p.score}</div>
                  <div className="text-[12px] font-medium min-w-[52px] text-right pl-3 border-l border-foreground/20">{p.price}</div>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="mt-5 border border-foreground/20 p-4 bg-muted/30">
              <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-3">
                Estimated monthly expenses
              </div>
              {costBars.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5 mb-2 last:mb-0">
                  <span className="text-[11px] text-muted-foreground w-[60px] shrink-0">{b.label}</span>
                  <div className="flex-1 h-[3px] bg-border">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: mounted ? `${b.pct}%` : '0%',
                        transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) 800ms`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-7 text-right shrink-0">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <div className="flex items-center justify-between border-b border-foreground bg-foreground px-8 py-3 md:px-10">
        <span className="text-[11px] tracking-[0.1em] uppercase text-background/50">How it works</span>
        <span className="font-serif text-[13px] italic text-background/80">Four steps, one right decision</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-b border-border">
        {howSteps.map((step, i) => (
          <div
            key={step.num}
            className={`p-8 md:p-10 border-border/40 ${i < howSteps.length - 1 ? 'sm:border-r' : ''} ${i % 2 === 0 ? 'border-b sm:border-b' : 'border-b sm:border-b md:border-b-0'}`}
          >
            <div className="font-serif text-[48px] leading-none italic text-border mb-5">{step.num}</div>
            <div className="text-[15px] font-medium mb-2.5 leading-[1.3]">{step.title}</div>
            <div className="text-[13px] text-muted-foreground leading-[1.65]">{step.body}</div>
          </div>
        ))}
      </div>

      {/* ─── Financial Insights ─── */}
      <div className="flex items-center justify-between border-b border-foreground bg-foreground px-8 py-3 md:px-10">
        <span className="text-[11px] tracking-[0.1em] uppercase text-background/50">Financial Insights</span>
        <span className="font-serif text-[13px] italic text-background/80">Know the numbers before you move</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-foreground">
        {/* Left — copy + metrics */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-foreground p-10 md:p-12">
          <div className="flex items-center gap-2.5 text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-5">
            <span className="h-px w-4 bg-[#c8401a]" />
            Cost projection
          </div>
          <h2 className="font-serif text-[clamp(28px,2.8vw,40px)] leading-[1.1] tracking-[-0.02em] mb-5">
            Don't get caught off guard{' '}
            <span className="italic text-primary">at month's end.</span>
          </h2>
          <p className="text-[14px] leading-[1.75] text-muted-foreground mb-8 flex-1">
            Rent isn't the only expense. We project your total monthly cost — rent, food,
            transport, utilities — so there are no surprises after you move in.
          </p>

          <div className="grid grid-cols-2 border border-foreground">
            {[
              { val: 'Rp 3.0jt', label: 'Avg. / month' },
              { val: '40%', label: 'Rent share' },
              { val: 'Rp 420k', label: 'Potential savings' },
              { val: '92%', label: 'Data accuracy' },
            ].map((m, i) => (
              <div
                key={m.label}
                className={`p-5 ${i % 2 === 0 ? 'border-r border-foreground' : ''} ${i < 2 ? 'border-b border-foreground' : ''}`}
              >
                <div className="font-serif text-[28px] leading-none mb-1.5">{m.val}</div>
                <div className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — chart + breakdown */}
        <div className="p-10 md:p-12">
          <div className="mb-5 text-[12px] tracking-[0.08em] uppercase text-muted-foreground">
            Monthly spending trend (Rp thousands)
          </div>

          <div className="flex items-end gap-2 h-[160px] mb-3">
            {monthlySpending.map((m, i) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center h-full justify-end gap-1.5">
                <div
                  className="w-full bg-[#3d5a40] transition-colors group-hover:bg-foreground"
                  style={{
                    height: mounted ? `${(m.amount / maxSpend) * 100}%` : '0%',
                    transition: `height 1s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms`,
                    minHeight: mounted ? '4px' : '0px',
                  }}
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.05em]">
                  {m.month}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-foreground/30 pt-2 mb-8">
            <span className="text-[10px] text-muted-foreground/40">0</span>
            <span className="text-[10px] text-muted-foreground/40">1.0</span>
            <span className="text-[10px] text-muted-foreground/40">2.0</span>
            <span className="text-[10px] text-muted-foreground/40">3.0</span>
            <span className="text-[10px] text-muted-foreground/40">3.5</span>
            <span className="text-[10px] text-muted-foreground/40">4.0</span>
          </div>

          {/* Expense breakdown */}
          <div>
            {categoryBreakdown.map((c, i) => (
              <div
                key={c.label}
                className={`flex items-center gap-3 py-2.5 border-foreground/30 ${i === 0 ? 'border-t border-b' : 'border-b'}`}
              >
                <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[13px] flex-1">{c.label}</span>
                <div className="w-[100px] h-[2px] bg-foreground/20">
                  <div
                    className="h-full bg-[#3d5a40]"
                    style={{
                      width: mounted ? `${c.pct}%` : '0%',
                      transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${600 + i * 80}ms`,
                    }}
                  />
                </div>
                <span className="text-[12px] font-medium min-w-[30px] text-right tabular-nums">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="flex items-center justify-between border-b border-foreground bg-foreground px-8 py-3 md:px-10">
        <span className="text-[11px] tracking-[0.1em] uppercase text-background/50">FAQ</span>
        <span className="font-serif text-[13px] italic text-background/80">Things people often ask</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-b border-border">
        <div className="border-b md:border-b-0 md:border-r border-border p-10 md:p-12">
          <h2 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em]">
            Got<br />questions<span className="italic block text-primary">Fair enough.</span>
          </h2>
          <p className="text-[13px] text-muted-foreground leading-[1.7] mt-4">
            ngekost is for anyone tired of guessing living costs before moving into a kost.
          </p>
        </div>

        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
              <AccordionTrigger className="px-10 py-5 text-[14px] font-medium text-foreground hover:no-underline hover:bg-muted/30 transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-10 text-[13px] leading-[1.75] text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ─── CTA Band ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
        <div className="bg-foreground text-background p-12 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-foreground">
          <div>
            <h2 className="font-serif text-[clamp(32px,3vw,48px)] leading-[1.05] tracking-[-0.02em]">
              Ready to find<br />your <span className="italic text-background/45">next kost?</span>
            </h2>
            <p className="text-[14px] text-background/50 leading-[1.7] max-w-[300px] mt-4">
              Join thousands of renters making smarter decisions every day.
            </p>
          </div>
          <div className="flex gap-2.5 mt-10">
            <Button
              className="bg-background text-foreground hover:bg-muted rounded-none px-7 py-3 text-[13px] font-medium gap-2 border-0"
              onClick={() => navigate('/auth/register')}
            >
              Get started free →
            </Button>
            <Button
              variant="outline"
              className="border-background/25 text-background/70 hover:border-background/60 hover:text-background rounded-none px-7 py-3 text-[13px] bg-transparent"
              onClick={() => navigate('/auth/login')}
            >
              Sign in
            </Button>
          </div>
        </div>

        <div className="p-12 md:p-16 flex flex-col justify-center gap-7">
          <div className="border-l-[3px] border-primary pl-5">
            <p className="font-serif text-[18px] leading-[1.4] italic mb-3">
              "I saved Rp 400k per month after moving to a kost recommended by ngekost."
            </p>
            <p className="text-[12px] text-muted-foreground tracking-[0.06em] uppercase">
              <span className="text-foreground font-medium">Rizky A.</span> — Corporate employee, Sudirman
            </p>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-3">
              Available cities
            </div>
            <div className="flex gap-2 flex-wrap">
              {cities.map((c) => (
                <span
                  key={c.name}
                  className={`px-3.5 py-1.5 border text-[12px] ${c.active ? 'border-primary text-primary bg-primary/[0.06]' : 'border-border text-muted-foreground'}`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t border-foreground px-6 md:px-10 py-5 flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">&copy; 2026 ngekost. All rights reserved.</p>
        <div className="hidden sm:flex gap-6">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-[12px] text-muted-foreground no-underline hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
        </div>
      </footer>

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
