import { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Wifi,
  Wind,
  Car,
  Bath,
  Flame,
  Zap,
  Ruler,
  Building2,
  ShieldCheck,
  CopyPlus,
  Check,
  X,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_DATA, type KostProperty } from '../browsemore';

function formatPrice(priceIdr: number | null, priceDisplay: string | null) {
  if (priceDisplay) return priceDisplay;
  if (priceIdr) return 'Rp' + priceIdr.toLocaleString('id-ID');
  return 'Price N/A';
}

function GenderBadge({ gender }: { gender: string }) {
  const config: Record<string, { label: string }> = {
    putra: { label: 'Putra' },
    putri: { label: 'Putri' },
    campur: { label: 'Campur' },
  };
  const c = config[gender] || config.campur;
  return (
    <span className="inline-block text-[10px] tracking-[0.08em] uppercase px-1.5 py-0.5 border border-[var(--chart-3)] font-medium">
      {c.label}
    </span>
  );
}

function SpecChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | boolean }) {
  return (
    <div className="flex items-center gap-2.5 border border-border px-3 py-2.5">
      <Icon className="size-4 text-foreground" />
      <div className="flex flex-col">
        <span className="text-[9px] tracking-[0.08em] uppercase text-muted-foreground leading-none">{label}</span>
        <span className="text-xs font-medium text-foreground leading-tight mt-0.5">
          {typeof value === 'boolean' ? (value ? <Check className="size-3.5 text-primary" /> : <X className="size-3.5 text-muted-foreground" />) : value}
        </span>
      </div>
    </div>
  );
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

export const KostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPage = (location.state as { page?: number } | null)?.page;

  const kost = useMemo<KostProperty | undefined>(() => {
    if (!id) return MOCK_DATA[0];
    const decoded = decodeURIComponent(id);
    return MOCK_DATA.find((k) => k.title === decoded) || MOCK_DATA[0];
  }, [id]);

  if (!kost) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto size-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Property not found.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/properties')}
            className="mt-3 text-xs rounded-none border-[var(--chart-3)]"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const imageUrls = Object.values(kost.images);
  const mainImage = imageUrls[0] || null;

  const roomFacilities = kost.facilities.filter((f) =>
    ['Kasur', 'Lemari', 'Lemari / Storage', 'Meja', 'Kursi', 'TV', 'Cermin', 'Bantal', 'Jendela'].includes(f)
  );
  const bathroomFacilities = kost.facilities.filter((f) =>
    ['K. Mandi Dalam', 'K. Mandi Luar', 'Kloset Duduk', 'Kloset Jongkok', 'Shower', 'Wastafel', 'Air panas'].includes(f)
  );
  const sharedFacilities = kost.facilities.filter(
    (f) => !roomFacilities.includes(f) && !bathroomFacilities.includes(f)
  );

  return (
    <div className="relative z-10 flex h-svh flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[860px] px-4 py-5 md:px-8 md:py-6">

          {/* Back */}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/properties', { state: { page: returnPage } })}
            className="mb-4 text-muted-foreground hover:text-foreground rounded-none"
          >
            <ArrowLeft className="size-3.5" />
            <span className="text-[10px] tracking-[0.08em] uppercase">Back</span>
          </Button>

          {/* Image Gallery — Editorial grid, no rounded corners */}
          <div className="mb-6 flex gap-px overflow-hidden border border-[var(--chart-3)]">
            <div className="relative flex-[2] bg-muted">
              {mainImage ? (
                <img src={mainImage} alt={kost.title} className="h-full w-full object-cover aspect-[4/3]" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center">
                  <ImageIcon className="size-10 text-muted-foreground/40" />
                </div>
              )}
            </div>
            {imageUrls.length > 1 && (
              <div className="hidden flex-1 flex-col gap-px sm:flex">
                {imageUrls.slice(1, 3).map((src, i) => (
                  <div key={i} className="relative flex-1 overflow-hidden bg-muted">
                    <img src={src} alt={`${kost.title} ${i + 2}`} className="h-full w-full object-cover" />
                    {i === 1 && imageUrls.length > 3 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--chart-3)]/60">
                        <span className="text-lg font-serif font-bold text-background">+{imageUrls.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title + Compare — 2-column editorial split */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6 border-b border-[var(--chart-3)] pb-5">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-serif italic text-foreground leading-tight">
                {kost.title}
              </h1>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{kost.formatted_address}</span>
              </div>

              {/* Rating + Gender + Availability */}
              <div className="mt-2.5 flex items-center gap-2.5">
                {kost.rating != null && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                    <Star className="size-3.5 fill-[var(--chart-3)] text-[var(--chart-3)]" />
                    <span className="font-serif italic">{kost.rating.toFixed(1)}</span>
                  </span>
                )}
                {kost.rating != null && <span className="text-border">|</span>}
                <GenderBadge gender={kost.gender_normalized} />
                {kost.availability_count != null && (
                  <>
                    <span className="text-border">|</span>
                    <span className="text-[10px] tracking-[0.06em] uppercase text-muted-foreground">
                      {kost.availability_count} rooms
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              {/* Price */}
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-serif font-medium text-[var(--chart-3)]">
                  {formatPrice(kost.price_idr, kost.price_display)}
                </span>
                {kost.rent_type && (
                  <span className="text-xs text-muted-foreground">/{kost.rent_type}</span>
                )}
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() => navigate(`/compare/${encodeURIComponent(kost.title)}/${encodeURIComponent(MOCK_DATA.find(k => k.title !== kost.title)?.title || kost.title)}`)}
                className="gap-1 text-[10px] tracking-[0.06em] uppercase rounded-none border-[var(--chart-3)]"
              >
                <CopyPlus className="size-3" />
                Compare
              </Button>
            </div>
          </div>

          {/* Room Specifications */}
          <div className="mb-6">
            <SectionHeader label="Specifications" subtitle="Room details" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-border">
              {kost.room_size_m2 != null && <SpecChip icon={Ruler} label="Size" value={`${kost.room_size_m2} m²`} />}
              <SpecChip icon={Wind} label="AC" value={kost.has_ac} />
              <SpecChip icon={Wifi} label="WiFi" value={kost.has_wifi} />
              <SpecChip icon={Bath} label="Private Bath" value={kost.has_private_bathroom} />
              <SpecChip icon={Flame} label="Water Heater" value={kost.has_water_heater} />
              <SpecChip icon={Car} label="Parking" value={kost.has_parking} />
              <SpecChip icon={Zap} label="Electricity" value={kost.electricity_included ? 'Included' : 'Not included'} />
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <SectionHeader label="Facilities" subtitle="What's included" />

            {roomFacilities.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 py-2 bg-muted/30 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium">Room</span>
                  <span className="text-[10px] text-muted-foreground">{roomFacilities.length} items</span>
                </div>
                <div className="flex flex-wrap gap-px p-3">
                  {roomFacilities.map((f) => (
                    <span key={f} className="border border-border px-2 py-1 text-[11px] text-foreground font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bathroomFacilities.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 py-2 bg-muted/30 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium">Bathroom</span>
                  <span className="text-[10px] text-muted-foreground">{bathroomFacilities.length} items</span>
                </div>
                <div className="flex flex-wrap gap-px p-3">
                  {bathroomFacilities.map((f) => (
                    <span key={f} className="border border-border px-2 py-1 text-[11px] text-foreground font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sharedFacilities.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-muted/30 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium">Shared</span>
                  <span className="text-[10px] text-muted-foreground">{sharedFacilities.length} items</span>
                </div>
                <div className="flex flex-wrap gap-px p-3">
                  {sharedFacilities.map((f) => (
                    <span key={f} className="border border-border px-2 py-1 text-[11px] text-foreground font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rules */}
          {kost.rules.length > 0 && (
            <div className="mb-6">
              <SectionHeader label="Rules" subtitle="House policy" />
              <div className="divide-y divide-border">
                {kost.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                    <span className="font-serif italic text-[var(--chart-5)] text-sm leading-none mt-0.5 w-5 text-right">
                      {i + 1}
                    </span>
                    <ShieldCheck className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="pb-8">
            <SectionHeader label="Location" subtitle="Coordinates" />
            <div className="border border-[var(--chart-3)]">
              <div className="flex aspect-[16/7] items-center justify-center bg-muted">
                {kost.location ? (
                  <div className="text-center">
                    <MapPin className="mx-auto size-5 text-muted-foreground mb-1" />
                    <p className="text-xs font-serif text-muted-foreground">
                      {kost.location.lat.toFixed(4)}, {kost.location.lon.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <MapPin className="size-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-[var(--chart-3)]">
                <p className="text-xs text-foreground">{kost.formatted_address}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
