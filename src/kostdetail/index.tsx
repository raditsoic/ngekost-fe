import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { MOCK_DATA, type KostProperty } from '../browsemore';

function formatPrice(priceIdr: number | null, priceDisplay: string | null) {
  if (priceDisplay) return priceDisplay;
  if (priceIdr) return 'Rp' + priceIdr.toLocaleString('id-ID');
  return 'Price not available';
}

function GenderBadge({ gender }: { gender: string }) {
  const config: Record<string, { label: string; className: string }> = {
    putra: { label: 'Male', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    putri: { label: 'Female', className: 'bg-pink-50 text-pink-700 border-pink-200' },
    campur: { label: 'Mixed', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };
  const c = config[gender] || config.campur;
  return (
    <Badge variant="outline" className={`text-xs px-2 py-0.5 h-6 font-medium border ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function SpecChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#cbd5e1]/60 bg-white px-3 py-2">
      <Icon className="size-4 text-[#344e41]" />
      <div className="flex flex-col">
        <span className="text-[10px] text-[#94a3b8] leading-none">{label}</span>
        <span className="text-xs font-medium text-[#151515] leading-tight mt-0.5">
          {typeof value === 'boolean' ? (value ? <Check className="size-3.5 text-[#344e41]" /> : <X className="size-3.5 text-[#94a3b8]" />) : value}
        </span>
      </div>
    </div>
  );
}

export const KostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const kost = useMemo<KostProperty | undefined>(() => {
    if (!id) return MOCK_DATA[0];
    const decoded = decodeURIComponent(id);
    return MOCK_DATA.find((k) => k.title === decoded) || MOCK_DATA[0];
  }, [id]);

  if (!kost) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto size-8 text-[#cbd5e1] mb-3" />
          <p className="text-sm text-[#94a3b8]">Property not found.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/properties')} className="mt-3 text-xs">
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
    <div className="relative z-10 flex h-svh flex-col bg-[#f5f5f5]">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-5 md:px-6">

          {/* Back */}
          <Button variant="ghost" size="xs" onClick={() => navigate(-1)} className="mb-4 text-[#94a3b8] hover:text-[#344e41]">
            <ArrowLeft className="size-3.5" />
            Back
          </Button>

          {/* Image Gallery */}
          <div className="mb-5 flex gap-2 overflow-hidden rounded-xl">
            {/* Main image */}
            <div className="relative flex-[2] bg-[#e4e5f1]">
              <AspectRatio ratio={4 / 3}>
                {mainImage ? (
                  <img src={mainImage} alt={kost.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="size-10 text-[#cbd5e1]" />
                  </div>
                )}
              </AspectRatio>
            </div>
            {/* Side images */}
            {imageUrls.length > 1 && (
              <div className="hidden flex-1 flex-col gap-2 sm:flex">
                {imageUrls.slice(1, 3).map((src, i) => (
                  <div key={i} className="relative flex-1 bg-[#e4e5f1] rounded-lg overflow-hidden">
                    <img src={src} alt={`${kost.title} ${i + 2}`} className="h-full w-full object-cover" />
                    {i === 1 && imageUrls.length > 3 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-lg font-bold text-white">+{imageUrls.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title + Compare */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-[#151515] leading-tight">{kost.title}</h1>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{kost.formatted_address}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate(`/compare/${encodeURIComponent(kost.title)}/${encodeURIComponent(MOCK_DATA.find(k => k.title !== kost.title)?.title || kost.title)}`)}
              className="shrink-0 gap-1 text-[10px]"
            >
              <CopyPlus className="size-3" />
              Compare
            </Button>
          </div>

          {/* Rating + Gender */}
          <div className="mt-2.5 flex items-center gap-2">
            {kost.rating != null && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#151515]">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {kost.rating.toFixed(1)}
              </span>
            )}
            {kost.rating != null && <span className="text-[#cbd5e1]">·</span>}
            <GenderBadge gender={kost.gender_normalized} />
            {kost.availability_count != null && (
              <>
                <span className="text-[#cbd5e1]">·</span>
                <span className="text-xs text-[#64748b]">{kost.availability_count} rooms available</span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="mt-3">
            <span className="text-xl font-bold text-[#344e41]">
              {formatPrice(kost.price_idr, kost.price_display)}
            </span>
            {kost.rent_type && (
              <span className="text-sm text-[#94a3b8]">/{kost.rent_type}</span>
            )}
          </div>

          <Separator className="my-5 bg-[#cbd5e1]/50" />

          {/* Room Specs */}
          <section>
            <h2 className="text-sm font-semibold text-[#151515] mb-3">Room Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {kost.room_size_m2 != null && <SpecChip icon={Ruler} label="Size" value={`${kost.room_size_m2} m²`} />}
              <SpecChip icon={Wind} label="AC" value={kost.has_ac} />
              <SpecChip icon={Wifi} label="WiFi" value={kost.has_wifi} />
              <SpecChip icon={Bath} label="Private Bath" value={kost.has_private_bathroom} />
              <SpecChip icon={Flame} label="Water Heater" value={kost.has_water_heater} />
              <SpecChip icon={Car} label="Parking" value={kost.has_parking} />
              <SpecChip icon={Zap} label="Electricity" value={kost.electricity_included ? 'Included' : 'Not included'} />
            </div>
          </section>

          <Separator className="my-5 bg-[#cbd5e1]/50" />

          {/* Facilities */}
          <section>
            <h2 className="text-sm font-semibold text-[#151515] mb-3">Facilities</h2>

            {roomFacilities.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Room</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {roomFacilities.map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-[#344e41]/5 px-2 py-1 text-[11px] text-[#344e41] font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bathroomFacilities.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Bathroom</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {bathroomFacilities.map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-[#344e41]/5 px-2 py-1 text-[11px] text-[#344e41] font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sharedFacilities.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Shared</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {sharedFacilities.map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-[#344e41]/5 px-2 py-1 text-[11px] text-[#344e41] font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Rules */}
          {kost.rules.length > 0 && (
            <>
              <Separator className="my-5 bg-[#cbd5e1]/50" />
              <section>
                <h2 className="text-sm font-semibold text-[#151515] mb-3">Rules</h2>
                <ul className="flex flex-col gap-1.5">
                  {kost.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                      <ShieldCheck className="size-3.5 mt-0.5 shrink-0 text-[#94a3b8]" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <Separator className="my-5 bg-[#cbd5e1]/50" />

          {/* Location */}
          <section className="pb-8">
            <h2 className="text-sm font-semibold text-[#151515] mb-3">Location</h2>
            <Card className="overflow-hidden border border-[#cbd5e1]/50 shadow-none">
              <AspectRatio ratio={16 / 7}>
                <div className="flex h-full w-full items-center justify-center bg-[#e4e5f1]">
                  {kost.location ? (
                    <div className="text-center">
                      <MapPin className="mx-auto size-5 text-[#94a3b8] mb-1" />
                      <p className="text-[10px] text-[#94a3b8]">
                        {kost.location.lat.toFixed(4)}, {kost.location.lon.toFixed(4)}
                      </p>
                    </div>
                  ) : (
                    <MapPin className="size-5 text-[#cbd5e1]" />
                  )}
                </div>
              </AspectRatio>
            </Card>
            <p className="mt-2 text-xs text-[#64748b]">{kost.formatted_address}</p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};
