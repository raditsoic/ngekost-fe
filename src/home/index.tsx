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
    <div className="flex min-h-screen bg-background font-sans">
      {/* Left panel — atmospheric brand moment */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#344e41]">
        {/* Gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-[#588157]/30 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-[#a3b18a]/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-[#6a9671]/15 blur-[80px]" />
        </div>

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2 text-white/90 text-[15px] font-semibold tracking-tight">
            <img src="/ngekost-logo.svg" alt="ngekost" className="size-7 brightness-0 invert" />
            ngekost
          </div>

          <div className="flex flex-col gap-6 max-w-sm">
            <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.1] tracking-tight text-white/95">
              Rent smarter.
              <br />
              Know the{' '}
              <span className="text-[#a3b18a]">real cost.</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-white/50">
              We score kost properties on rent, daily living expenses, and nearby essentials so you stop guessing and start comparing.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {[
              { num: '2,400+', label: 'Properties' },
              { num: '18', label: 'Data points' },
              { num: '92%', label: 'Accuracy' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-6 bg-white/10" />}
                <div>
                  <div className="text-lg font-bold tracking-tight text-white/80">{s.num}</div>
                  <div className="text-[11px] text-white/30">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground mb-12 lg:hidden">
            <img src="/ngekost-logo.svg" alt="ngekost" className="size-7" />
            ngekost
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isLogin
                ? 'Sign in to continue to ngekost'
                : 'Start analyzing kost properties today'}
            </p>
          </div>

          {displayError && (
            <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 rounded border-border accent-primary" />
                  Remember me
                </label>
                <a href="#" className="text-[13px] text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 rounded-lg text-sm font-semibold gap-2"
            >
              {submitting ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
              {!submitting && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center text-[13px] text-muted-foreground">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <Button type="button" variant="link" size="xs" onClick={toggleMode}>
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Button type="button" variant="link" size="xs" onClick={toggleMode}>
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
