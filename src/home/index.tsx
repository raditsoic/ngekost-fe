import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth/context';

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error, clearError } = useAuth();

  const isLogin = location.pathname === '/auth/login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const displayError = formError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!isLogin && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/chat');
      } else {
        await register(email, password, displayName);
        navigate('/onboarding');
      }
    } catch {
      // error is set in the auth context
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    navigate(isLogin ? '/auth/register' : '/auth/login');
    setFormError(null);
    clearError();
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
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="hidden sm:inline">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <Button
            variant="ghost"
            className="rounded-none text-[13px] text-muted-foreground hover:text-foreground px-3 h-8"
            onClick={toggleMode}
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </Button>
        </div>
      </nav>

      {/* ─── Main grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-52px)]">
        {/* Left — editorial brand panel */}
        <div className="hidden md:flex flex-col justify-between relative overflow-hidden bg-[#1a2e1f] text-white border-r border-foreground p-10 md:p-12">
          {/* Gradient mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-[#344e41]/40 blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-[#588157]/20 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-[#6a9671]/10 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-white/40 mb-10">
              <span className="h-px w-5 bg-[#c8401a]" />
              {isLogin ? 'Welcome back' : 'Join ngekost'}
            </div>

            <h1 className="font-serif text-[clamp(36px,4vw,56px)] leading-[1.05] tracking-[-0.02em]">
              {isLogin ? (
                <>
                  Sign in to<br />
                  your <span className="italic text-[#a3b18a]">dashboard.</span>
                </>
              ) : (
                <>
                  Start analyzing<br />
                  <span className="italic text-[#a3b18a]">kost properties.</span>
                </>
              )}
            </h1>

            <p className="text-[14px] text-white/45 leading-[1.75] max-w-[320px] mt-6">
              {isLogin
                ? 'Access your saved properties, financial projections, and AI-powered kost comparisons.'
                : 'Create an account to unlock property scoring, cost projections, and neighborhood insights.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 border border-white/10">
            {[
              { val: '2,400+', label: 'Properties' },
              { val: '18', label: 'Data points' },
              { val: '92%', label: 'Accuracy' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`p-4 ${i < 2 ? 'border-r border-white/10' : ''}`}
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
          {/* Mobile header */}
          <div className="md:hidden mb-10">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-6">
              <span className="h-px w-5 bg-[#c8401a]" />
              {isLogin ? 'Welcome back' : 'Create account'}
            </div>
            <h1 className="font-serif text-[32px] leading-[1.05] tracking-[-0.02em]">
              {isLogin ? (
                <>
                  Sign in to<br />
                  your <span className="italic text-[#6a9671]">dashboard.</span>
                </>
              ) : (
                <>
                  Start analyzing<br />
                  <span className="italic text-[#6a9671]">kost properties.</span>
                </>
              )}
            </h1>
          </div>

          {/* Section label */}
          <div className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground mb-6">
            <span className="h-px w-4 bg-[#c8401a]" />
            {isLogin ? 'Credentials' : 'Account details'}
          </div>

          {displayError && (
            <div className="mb-5 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full rounded-none border border-foreground bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-none border border-foreground bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-none border border-foreground bg-transparent px-4 py-2.5 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-none border border-foreground bg-transparent px-4 py-2.5 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-[#6a9671] focus:ring-1 focus:ring-[#6a9671]/20 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-muted-foreground">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-3 rounded-none border-foreground accent-[#6a9671]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-[12px] text-[#6a9671] hover:underline underline-offset-2">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-3 h-11 rounded-none bg-[#344e41] text-white hover:bg-[#6a9671] border-0 text-[13px] font-medium gap-2"
            >
              {submitting ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
              {!submitting && <ArrowRight className="size-4" />}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-8 pt-6 border-t border-border text-center text-[13px] text-muted-foreground">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={toggleMode}
                  className="text-[#6a9671]"
                >
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={toggleMode}
                  className="text-[#6a9671]"
                >
                  Sign in
                </Button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
