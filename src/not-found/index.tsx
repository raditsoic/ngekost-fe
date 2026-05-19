import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-6 font-sans text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contour-404" x="0" y="0" width="280" height="280" patternUnits="userSpaceOnUse">
              <ellipse cx="140" cy="140" rx="120" ry="90" fill="none" stroke="#6a9671" strokeWidth="0.5" opacity="0.15" />
              <ellipse cx="140" cy="140" rx="85" ry="60" fill="none" stroke="#6a9671" strokeWidth="0.5" opacity="0.12" />
              <ellipse cx="140" cy="140" rx="50" ry="35" fill="none" stroke="#6a9671" strokeWidth="0.5" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contour-404)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl border border-border/50 bg-primary/[0.06]">
          <img src="/ngekost-logo.svg" alt="ngekost" className="size-10" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="m-0 text-[clamp(64px,10vw,120px)] font-black leading-none tracking-[-0.04em] text-foreground">
            404
          </h1>
          <p className="m-0 text-[15px] leading-[1.75] text-muted-foreground max-w-[380px]">
            This page doesn't exist. Maybe the property moved, or the URL took a wrong turn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-lg px-6 py-[11px] text-[14px] font-medium gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button
            className="rounded-lg px-6 py-[11px] text-[14px] font-semibold gap-2 shadow-lg shadow-primary/15"
            onClick={() => navigate('/')}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};
