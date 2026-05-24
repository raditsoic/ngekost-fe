import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, type Property } from '@/src/lib/api';
import {
  Building2,
  MapPin,
  Star,
  Wifi,
  Wind,
  Car,
  Bath,
  Flame,
  Zap,
  Ruler,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface KostProperty {
  price_idr: number | null;
  gender_normalized: string;
  rating: number | null;
  availability_count: number | null;
  room_size_m2: number | null;
  electricity_included: boolean;
  has_wifi: boolean;
  has_ac: boolean;
  has_parking: boolean;
  has_private_bathroom: boolean;
  has_water_heater: boolean;
  has_images: boolean;
  location: { lat: number; lon: number };
  geocode_status: string;
  title: string;
  url: string | null;
  price_display: string | null;
  rent_type: string | null;
  facilities: string[];
  rules: string[];
  images: Record<string, string>;
  formatted_address: string;
  source_file: string;
  inserted_at: string;
  _embed_string: string;
}

export const MOCK_DATA: KostProperty[] = [
  {
    price_idr: 2500000,
    gender_normalized: 'campur',
    rating: 4.9,
    availability_count: 3,
    room_size_m2: 14,
    electricity_included: false,
    has_wifi: true,
    has_ac: true,
    has_parking: false,
    has_private_bathroom: true,
    has_water_heater: true,
    has_images: true,
    location: { lat: -7.24135, lon: 112.75277 },
    geocode_status: 'ok',
    title: 'Kost Skyla VVIP Wonokromo',
    url: null,
    price_display: 'Rp2.500.000',
    rent_type: 'bulan',
    facilities: ['AC', 'Kasur', 'Meja', 'TV', 'WiFi', 'Kulkas', 'Mesin Cuci', 'CCTV'],
    rules: ['Akses 24 Jam', 'Boleh pasutri'],
    images: { main: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop' },
    formatted_address: 'Jl. Kapasari No.132, Kapasan, Kec. Simokerto, Surabaya',
    source_file: 'kost_surabaya_murah_1.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
  {
    price_idr: 1300000,
    gender_normalized: 'putra',
    rating: 4.7,
    availability_count: 5,
    room_size_m2: 12,
    electricity_included: true,
    has_wifi: true,
    has_ac: false,
    has_parking: true,
    has_private_bathroom: false,
    has_water_heater: false,
    has_images: true,
    location: { lat: -7.29, lon: 112.77 },
    geocode_status: 'ok',
    title: 'Kost Melati Indah',
    url: null,
    price_display: 'Rp1.300.000',
    rent_type: 'bulan',
    facilities: ['Kasur', 'Lemari', 'Meja', 'Kursi', 'Kipas Angin', 'WiFi', 'Parkir Motor'],
    rules: ['Tidak boleh tamu menginap'],
    images: { main: 'https://images.unsplash.com/photo-1502672260266-1c1e524164ed?q=80&w=800&auto=format&fit=crop' },
    formatted_address: 'Keputih, Sukolilo, Surabaya',
    source_file: 'kost_surabaya_murah_2.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
  {
    price_idr: 3000000,
    gender_normalized: 'putri',
    rating: 5.0,
    availability_count: 2,
    room_size_m2: 20,
    electricity_included: true,
    has_wifi: true,
    has_ac: true,
    has_parking: true,
    has_private_bathroom: true,
    has_water_heater: true,
    has_images: true,
    location: { lat: -7.26, lon: 112.76 },
    geocode_status: 'ok',
    title: 'Kost Educity Residence',
    url: null,
    price_display: 'Rp3.000.000',
    rent_type: 'bulan',
    facilities: ['AC', 'TV', 'WiFi', 'Kulkas', 'Gym', 'Kolam Renang', 'CCTV', 'Security 24 Jam'],
    rules: ['Akses 24 Jam', 'Deposit Rp500.000'],
    images: { main: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop' },
    formatted_address: 'Pakuwon City, Surabaya',
    source_file: 'kost_surabaya_premium_1.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
  {
    price_idr: 1700000,
    gender_normalized: 'putri',
    rating: 4.8,
    availability_count: 4,
    room_size_m2: 16,
    electricity_included: false,
    has_wifi: true,
    has_ac: true,
    has_parking: true,
    has_private_bathroom: true,
    has_water_heater: true,
    has_images: true,
    location: { lat: -7.28, lon: 112.79 },
    geocode_status: 'ok',
    title: 'Kost Anggrek Putri',
    url: null,
    price_display: 'Rp1.700.000',
    rent_type: 'bulan',
    facilities: ['Kasur', 'Lemari', 'AC', 'Meja', 'WiFi', 'Parkir Motor', 'Dapur'],
    rules: ['Akses 24 Jam'],
    images: { main: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop' },
    formatted_address: 'Mulyosari, Surabaya',
    source_file: 'kost_surabaya_murah_3.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
  {
    price_idr: 2000000,
    gender_normalized: 'campur',
    rating: 4.6,
    availability_count: 1,
    room_size_m2: 15,
    electricity_included: false,
    has_wifi: true,
    has_ac: true,
    has_parking: true,
    has_private_bathroom: true,
    has_water_heater: false,
    has_images: true,
    location: { lat: -7.25, lon: 112.75 },
    geocode_status: 'ok',
    title: 'Kost Puncak Kertajaya',
    url: null,
    price_display: 'Rp2.000.000',
    rent_type: 'bulan',
    facilities: ['AC', 'Kasur', 'Lemari', 'WiFi', 'Parkir Motor', 'Dapur', 'Mesin Cuci'],
    rules: ['Boleh pasutri', 'Akses 24 Jam'],
    images: { main: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop' },
    formatted_address: 'Kertajaya, Surabaya',
    source_file: 'kost_surabaya_murah_4.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
  {
    price_idr: 800000,
    gender_normalized: 'putra',
    rating: 4.3,
    availability_count: 8,
    room_size_m2: 10,
    electricity_included: true,
    has_wifi: true,
    has_ac: false,
    has_parking: true,
    has_private_bathroom: false,
    has_water_heater: false,
    has_images: false,
    location: { lat: -7.30, lon: 112.76 },
    geocode_status: 'ok',
    title: 'Kost Graha Muda',
    url: null,
    price_display: 'Rp800.000',
    rent_type: 'bulan',
    facilities: ['Kasur', 'Lemari', 'Meja', 'Parkir Motor', 'Jemuran'],
    rules: ['Tidak boleh tamu menginap'],
    images: {},
    formatted_address: 'Keputih, Sukolilo, Surabaya',
    source_file: 'kost_surabaya_murah_5.json',
    inserted_at: '2026-05-04T11:59:16.601947+00:00',
    _embed_string: '',
  },
];

const genderOptions = ['putra', 'putri', 'campur'] as const;
const ITEMS_PER_PAGE = 8;

function formatPrice(priceIdr: number | null, priceDisplay: string | null) {
  if (priceDisplay) return priceDisplay;
  if (priceIdr) return 'Rp' + priceIdr.toLocaleString('id-ID');
  return 'Price N/A';
}

function GenderBadge({ gender }: { gender: string }) {
  const config: Record<string, { label: string; className: string }> = {
    putra: { label: 'Putra', className: 'border-[var(--chart-3)] text-foreground' },
    putri: { label: 'Putri', className: 'border-[var(--chart-3)] text-foreground' },
    campur: { label: 'Campur', className: 'border-[var(--chart-3)] text-foreground' },
  };
  const c = config[gender] || config.campur;
  return (
    <span className={`inline-block text-[10px] tracking-[0.08em] uppercase px-1.5 py-0.5 border ${c.className} font-medium`}>
      {c.label}
    </span>
  );
}

function FilterPill({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className={`rounded-none border-[var(--chart-3)] ${
            active
              ? 'bg-[var(--chart-3)] text-[var(--background)]'
              : 'bg-transparent text-foreground hover:bg-[var(--chart-3)]/5'
          }`}
        >
          {label}
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-3 rounded-none border-[var(--chart-3)]">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export const TopBar = () => null;

const genderMap: Record<string, string> = {
  male: 'putra',
  female: 'putri',
  mixed: 'campur',
};

function toKostProperty(p: Property): KostProperty {
  const allImages = [...p.building_images, ...p.room_images, ...p.bathroom_images, ...p.shared_facility_images].map(img => img.url);
  const images: Record<string, string> = {};
  allImages.forEach((url, i) => { images[i === 0 ? 'main' : `img-${i}`] = url; });

  return {
    price_idr: p.monthly_rent_idr,
    gender_normalized: genderMap[p.gender] || p.gender,
    rating: p.our_rating ?? p.rating,
    availability_count: p.availability,
    room_size_m2: null,
    electricity_included: p.facilities.some((f) => f.toLowerCase().includes('listrik')),
    has_wifi: p.facilities.some((f) => f.toLowerCase().includes('wifi')),
    has_ac: p.facilities.some((f) => f.toLowerCase().includes('ac') || f.toLowerCase().includes('air conditioner')),
    has_parking: p.facilities.some((f) => f.toLowerCase().includes('parkir')),
    has_private_bathroom: p.facilities.some((f) => f.toLowerCase().includes('mandi dalam') || f.toLowerCase().includes('k. mandi dalam')),
    has_water_heater: p.facilities.some((f) => f.toLowerCase().includes('water heater') || f.toLowerCase().includes('air panas')),
    has_images: allImages.length > 0,
    location: { lat: p.latitude ?? 0, lon: p.longitude ?? 0 },
    geocode_status: p.address ? 'ok' : 'missing',
    title: p.title,
    url: null,
    price_display: p.monthly_rent_idr ? `Rp${p.monthly_rent_idr.toLocaleString('id-ID')}` : null,
    rent_type: 'bulan',
    facilities: p.facilities,
    rules: p.rules,
    images,
    formatted_address: p.address || '',
    source_file: '',
    inserted_at: p.created_at,
    _embed_string: '',
  };
}

export const BrowseMore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restoredPage = (location.state as { page?: number } | null)?.page ?? 1;
  const [pageData, setPageData] = useState<KostProperty[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(restoredPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const [allFacilities, setAllFacilities] = useState<string[]>([]);
  const [facilityCounts, setFacilityCounts] = useState<Record<string, number>>({});

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const fetchPage = useCallback((page: number) => {
    let cancelled = false;
    setLoading(true);
    api.listProperties({ page, per_page: ITEMS_PER_PAGE })
      .then((res) => {
        if (!cancelled) {
          setPageData(res.properties.map(toKostProperty));
          setTotalCount(res.total);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load properties');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setMounted(true);
    return fetchPage(currentPage);
  }, [currentPage, fetchPage]);

  useEffect(() => {
    let cancelled = false;
    api.listProperties({ page: 1, per_page: 100 })
      .then((res) => {
        if (!cancelled) {
          const counts: Record<string, number> = {};
          const set = new Set<string>();
          res.properties.forEach((p) => {
            p.facilities.forEach((f) => {
              set.add(f);
              counts[f] = (counts[f] || 0) + 1;
            });
          });
          setAllFacilities(Array.from(set).sort());
          setFacilityCounts(counts);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const filteredData = useMemo(() => {
    return pageData.filter((item) => {
      if (selectedGender && item.gender_normalized !== selectedGender) return false;
      if (priceRange[0] > 0 && item.price_idr && item.price_idr < priceRange[0]) return false;
      if (priceRange[1] < 10000000 && item.price_idr && item.price_idr > priceRange[1]) return false;
      if (selectedFacilities.length > 0) {
        const hasAll = selectedFacilities.every((f) => item.facilities.includes(f));
        if (!hasAll) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.formatted_address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pageData, selectedGender, selectedFacilities, priceRange, searchQuery]);

  const hasActiveFilters = selectedGender || selectedFacilities.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000;

  const clearFilters = () => {
    setSelectedGender(null);
    setSelectedFacilities([]);
    setPriceRange([0, 10000000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleFacility = (f: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="relative z-10 flex h-svh flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-8 md:py-8">

          {/* Section Header — Editorial Dark Bar */}
          <div className="mb-6 border-[var(--chart-3)] border">
            <div className="bg-[var(--chart-3)] text-[var(--background)] px-4 py-2.5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] tracking-[0.12em] uppercase font-sans font-medium">
                  Listings
                </span>
                <h1 className="text-xl md:text-2xl font-serif italic leading-tight">
                  Properties
                </h1>
              </div>
              <span className="text-[11px] tracking-[0.08em] uppercase font-sans">
                {loading ? 'Loading...' : `${totalCount} results`}
              </span>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="size-6 animate-spin rounded-full border-2 border-[var(--chart-3)] border-t-transparent" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 border border-[var(--chart-3)]">
              <Building2 className="size-8 text-muted-foreground mb-3" />
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 text-xs rounded-none border-[var(--chart-3)]"
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && (<>
          {/* Search + Filters — Editorial Toolbar */}
          <div className="flex flex-col gap-3 mb-6 border-b border-[var(--chart-3)] pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search name or address..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="h-9 pl-9 text-sm rounded-none border-[var(--chart-3)] bg-background placeholder:text-muted-foreground"
                />
              </div>

              <FilterPill
                label={selectedGender ? selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1) : 'Gender'}
                active={!!selectedGender}
              >
                <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-2">Property type</p>
                <div className="flex flex-col gap-0.5">
                  {genderOptions.map((g) => (
                    <Button
                      key={g}
                      variant="ghost"
                      size="xs"
                      onClick={() => { setSelectedGender(selectedGender === g ? null : g); setCurrentPage(1); }}
                      className={`justify-start rounded-none ${
                        selectedGender === g ? 'bg-[var(--chart-3)] text-[var(--background)] font-medium' : 'text-foreground'
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Button>
                  ))}
                </div>
              </FilterPill>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className={`rounded-none border-[var(--chart-3)] ${
                      priceRange[0] > 0 || priceRange[1] < 10000000
                        ? 'bg-[var(--chart-3)] text-[var(--background)]'
                        : 'bg-transparent text-foreground hover:bg-[var(--chart-3)]/5'
                    }`}
                  >
                    Price
                    <ChevronDown className="size-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-3 rounded-none border-[var(--chart-3)]">
                  <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-3">Price range</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-border p-2">
                        <span className="text-[10px] text-muted-foreground">Minimum</span>
                        <div className="text-sm font-serif font-medium">
                          Rp{priceRange[0].toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="border border-border p-2">
                        <span className="text-[10px] text-muted-foreground">Maximum</span>
                        <div className="text-sm font-serif font-medium">
                          Rp{priceRange[1].toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    <div className="relative h-1.5 bg-border">
                      <div
                        className="absolute h-full bg-[var(--chart-3)]"
                        style={{
                          left: `${(priceRange[0] / 10000000) * 100}%`,
                          right: `${100 - (priceRange[1] / 10000000) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setPriceRange([0, 10000000])}
                        className="text-[10px] rounded-none border-[var(--chart-3)]"
                      >
                        Reset
                      </Button>
                      <Button size="xs" className="text-[10px] rounded-none bg-[var(--chart-3)] text-[var(--background)] hover:bg-[var(--chart-3)]/90">
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className={`rounded-none border-[var(--chart-3)] ${
                      selectedFacilities.length > 0
                        ? 'bg-[var(--chart-3)] text-[var(--background)]'
                        : 'bg-transparent text-foreground hover:bg-[var(--chart-3)]/5'
                    }`}
                  >
                    <SlidersHorizontal className="size-3" />
                    {selectedFacilities.length > 0 ? `Facilities (${selectedFacilities.length})` : 'Facilities'}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-left font-serif">Facilities</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col gap-0">
                    {allFacilities.map((f) => (
                      <button
                        key={f}
                        onClick={() => toggleFacility(f)}
                        className={`flex justify-between items-center px-3 py-2 text-sm border-b border-border transition-colors ${
                          selectedFacilities.includes(f)
                            ? 'bg-[var(--chart-3)] text-[var(--background)]'
                            : 'text-foreground hover:bg-[var(--chart-3)]/5'
                        }`}
                      >
                        <span>{f}</span>
                        <span className="text-[10px] opacity-60">{facilityCounts[f]}</span>
                      </button>
                    ))}
                  </div>
                  {selectedFacilities.length > 0 && (
                    <div className="mt-4 border-t border-[var(--chart-3)] pt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedFacilities([]); setCurrentPage(1); }}
                        className="w-full text-xs rounded-none"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={clearFilters}
                  className="text-[10px] text-muted-foreground hover:text-foreground rounded-none"
                >
                  <X className="size-3" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Property Listings — Editorial Ranked Grid */}
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-[var(--chart-3)]">
              <Building2 className="size-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No properties match the selected filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 text-xs rounded-none border-[var(--chart-3)]">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {filteredData.map((item, idx) => {
                const rank = startIndex + idx + 1;
                return (
                  <div
                    key={item.title}
                    onClick={() => navigate(`/property/${encodeURIComponent(item.title)}`, { state: { page: currentPage } })}
                    className={`group cursor-pointer border border-[var(--chart-3)] bg-card transition-colors hover:bg-[var(--chart-3)]/[0.02] ${
                      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                    style={{
                      transitionProperty: 'opacity, transform',
                      transitionDuration: '500ms',
                      transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                      transitionDelay: `${idx * 50}ms`,
                    }}
                  >
                    <div className="flex">
                      {/* Rank Number */}
                      <div className="flex-shrink-0 w-10 flex items-start justify-center pt-3 border-r border-[var(--chart-3)]">
                        <span className="font-serif italic text-lg text-[var(--chart-5)] leading-none">
                          {rank}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Image */}
                        <div className="relative w-full bg-muted aspect-[16/9]">
                          {item.images && Object.values(item.images)[0] ? (
                            <img
                              src={Object.values(item.images)[0]}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Building2 className="size-8 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex gap-1">
                            <GenderBadge gender={item.gender_normalized} />
                          </div>
                          {item.availability_count != null && (
                            <div className="absolute top-2 right-2 bg-background/90 text-[10px] text-foreground font-medium px-1.5 py-0.5 border border-[var(--chart-3)]">
                              {item.availability_count} rooms
                            </div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="p-3">
                          <h3 className="text-[13px] font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors font-sans">
                            {item.title}
                          </h3>

                          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="size-2.5 shrink-0" />
                            <span className="truncate">{item.formatted_address}</span>
                          </div>

                          {/* Facilities Row */}
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {item.room_size_m2 != null && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Ruler className="size-2.5" />
                                {item.room_size_m2}m²
                              </span>
                            )}
                            {item.has_wifi && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Wifi className="size-2.5" />
                              </span>
                            )}
                            {item.has_ac && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Wind className="size-2.5" />
                              </span>
                            )}
                            {item.has_private_bathroom && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Bath className="size-2.5" />
                              </span>
                            )}
                            {item.has_parking && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Car className="size-2.5" />
                              </span>
                            )}
                            {item.has_water_heater && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Flame className="size-2.5" />
                              </span>
                            )}
                            {item.electricity_included && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Zap className="size-2.5" />
                              </span>
                            )}
                          </div>

                          {/* Price + Rating */}
                          <div className="mt-2.5 flex items-end justify-between border-t border-border pt-2">
                            <div>
                              <span className="text-base font-serif font-medium text-foreground">
                                {formatPrice(item.price_idr, item.price_display)}
                              </span>
                              {item.rent_type && (
                                <span className="text-[10px] text-muted-foreground">/{item.rent_type}</span>
                              )}
                            </div>
                            {item.rating != null && (
                              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-foreground">
                                <Star className="size-3 fill-[var(--chart-3)] text-[var(--chart-3)]" />
                                <span className="font-serif italic">{item.rating.toFixed(1)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination — Editorial Style */}
          {totalPages > 1 && (
            <div className="mt-6 border-t border-[var(--chart-3)] pt-4 flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-none text-[11px] disabled:opacity-30"
              >
                Prev
              </Button>
              {(() => {
                const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 3) pages.push('ellipsis-start');
                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (currentPage < totalPages - 2) pages.push('ellipsis-end');
                  pages.push(totalPages);
                }
                return pages.map((page) =>
                  page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                    <span key={page} className="px-1 text-muted-foreground text-[11px]">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[28px] h-7 text-[11px] font-serif ${
                        currentPage === page
                          ? 'bg-[var(--chart-3)] text-[var(--background)]'
                          : 'text-foreground hover:bg-[var(--chart-3)]/5'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-none text-[11px] disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          )}
          </>)}
        </div>
      </ScrollArea>
    </div>
  );
};
