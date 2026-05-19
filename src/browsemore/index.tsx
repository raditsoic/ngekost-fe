import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
const ITEMS_PER_PAGE = 6;

const facilityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  AC: Wind,
  'Parkir Motor': Car,
  'Parkir Mobil': Car,
  'K. Mandi Dalam': Bath,
  'Water Heater': Flame,
  'Air panas': Flame,
};

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
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-medium border ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function FacilityTag({ name }: { name: string }) {
  const Icon = facilityIcons[name];
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#344e41]/5 px-1.5 py-0.5 text-[10px] text-[#344e41] font-medium">
      {Icon && <Icon className="size-2.5" />}
      {name}
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
          className={`rounded-lg ${
            active
              ? 'border-[#344e41]/30 bg-[#344e41]/5 text-[#344e41]'
              : 'text-[#64748b] hover:border-[#344e41]/20 hover:text-[#344e41]'
          }`}
        >
          {label}
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-3">
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
  const [data, setData] = useState<KostProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.listProperties({ page: 1, per_page: 100 })
      .then((res) => {
        if (!cancelled) {
          setData(res.properties.map(toKostProperty));
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
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
  }, [data, selectedGender, selectedFacilities, priceRange, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allFacilities = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => item.facilities.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [data]);

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

  const facilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => item.facilities.forEach((f) => { counts[f] = (counts[f] || 0) + 1; }));
    return counts;
  }, [data]);

  return (
    <div className="relative z-10 flex h-svh flex-col bg-[#f5f5f5]">
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[960px] px-4 py-6 md:px-6">

          {/* Header */}
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-[#151515]">
              Properties
            </h1>
            <p className="text-sm text-[#94a3b8] mt-0.5">
              {loading ? 'Loading...' : `${filteredData.length} properties available`}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="size-6 animate-spin rounded-full border-2 border-[#344e41] border-t-transparent" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Building2 className="size-8 text-[#cbd5e1] mb-3" />
              <p className="text-sm text-red-500">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="mt-2 text-xs">
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && (<>
          {/* Search + Filters */}
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8]" />
                <Input
                  placeholder="Search property name or address..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="h-9 pl-9 text-sm border-[#cbd5e1] bg-white placeholder:text-[#94a3b8]"
                />
              </div>

              <FilterPill
                label={selectedGender ? selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1) : 'Gender'}
                active={!!selectedGender}
              >
                <p className="text-xs font-medium text-[#151515] mb-2">Property type</p>
                <div className="flex flex-col gap-1">
                  {genderOptions.map((g) => (
                    <Button
                      key={g}
                      variant="ghost"
                      size="xs"
                      onClick={() => { setSelectedGender(selectedGender === g ? null : g); setCurrentPage(1); }}
                      className={`justify-start rounded-md ${
                        selectedGender === g ? 'bg-[#344e41]/10 text-[#344e41] font-medium' : 'text-[#64748b]'
                      }`}
                    >
                      <Building2 className="size-3" />
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
                    className={`rounded-lg ${
                      priceRange[0] > 0 || priceRange[1] < 10000000
                        ? 'border-[#344e41]/30 bg-[#344e41]/5 text-[#344e41]'
                        : 'text-[#64748b] hover:border-[#344e41]/20 hover:text-[#344e41]'
                    }`}
                  >
                    Price
                    <ChevronDown className="size-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-3">
                  <p className="text-xs font-medium text-[#151515] mb-3">Price range</p>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-[#94a3b8]">Minimum</span>
                      <div className="text-sm font-medium text-[#151515]">
                        Rp{priceRange[0].toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="relative h-1.5 rounded-full bg-[#cbd5e1]">
                      <div
                        className="absolute h-full rounded-full bg-[#344e41]"
                        style={{
                          left: `${(priceRange[0] / 10000000) * 100}%`,
                          right: `${100 - (priceRange[1] / 10000000) * 100}%`,
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94a3b8]">Maximum</span>
                      <div className="text-sm font-medium text-[#151515]">
                        Rp{priceRange[1].toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setPriceRange([0, 10000000])}
                        className="text-[10px]"
                      >
                        Reset
                      </Button>
                      <Button size="xs" className="text-[10px] bg-[#344e41] hover:bg-[#3a5c40]">
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
                    className={`rounded-lg ${
                      selectedFacilities.length > 0
                        ? 'border-[#344e41]/30 bg-[#344e41]/5 text-[#344e41]'
                        : 'text-[#64748b] hover:border-[#344e41]/20 hover:text-[#344e41]'
                    }`}
                  >
                    <SlidersHorizontal className="size-3" />
                    {selectedFacilities.length > 0 ? `Facilities (${selectedFacilities.length})` : 'Facilities'}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-left">Facilities</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col gap-1">
                    {allFacilities.map((f) => (
                      <Button
                        key={f}
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFacility(f)}
                        className={`justify-between rounded-lg px-3 py-2 text-sm ${
                          selectedFacilities.includes(f)
                            ? 'bg-[#344e41]/10 text-[#344e41] font-medium'
                            : 'text-[#64748b]'
                        }`}
                      >
                        <span>{f}</span>
                        <span className="text-[10px] text-[#94a3b8]">{facilityCounts[f]}</span>
                      </Button>
                    ))}
                  </div>
                  {selectedFacilities.length > 0 && (
                    <div className="mt-4 border-t pt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedFacilities([]); setCurrentPage(1); }}
                        className="w-full text-xs"
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
                  className="ml-1 text-[10px] text-[#64748b] hover:text-[#344e41]"
                >
                  <X className="size-3" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Property Cards Grid */}
          {pagedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Building2 className="size-8 text-[#cbd5e1] mb-3" />
              <p className="text-sm text-[#94a3b8]">No properties match the selected filters.</p>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2 text-xs">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pagedData.map((item) => (
                <Card
                  key={item.title}
                  onClick={() => navigate(`/property/${encodeURIComponent(item.title)}`)}
                  className="group cursor-pointer overflow-hidden border border-[#cbd5e1]/50 bg-white shadow-none transition-all hover:shadow-sm hover:border-[#344e41]/20"
                >
                  {/* Image */}
                  <div className="relative w-full bg-[#e4e5f1] -mt-4">
                    <AspectRatio ratio={4 / 3}>
                      {item.images && Object.values(item.images)[0] ? (
                        <img
                          src={Object.values(item.images)[0]}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Building2 className="size-8 text-[#cbd5e1]" />
                        </div>
                      )}
                    </AspectRatio>
                    <div className="absolute top-2 left-2">
                      <GenderBadge gender={item.gender_normalized} />
                    </div>
                    {item.availability_count != null && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-[10px] text-[#344e41] font-medium shadow-sm border-0 h-5 px-1.5">
                          {item.availability_count} rooms
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-3 pt-2.5 pb-3">
                    <h3 className="text-[13px] font-semibold text-[#151515] leading-tight truncate group-hover:text-[#344e41] transition-colors">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#94a3b8]">
                      <MapPin className="size-2.5 shrink-0" />
                      <span className="truncate">{item.formatted_address}</span>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {item.room_size_m2 != null && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Ruler className="size-2.5" />
                          {item.room_size_m2}m²
                        </span>
                      )}
                      {item.has_wifi && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Wifi className="size-2.5" />
                        </span>
                      )}
                      {item.has_ac && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Wind className="size-2.5" />
                        </span>
                      )}
                      {item.has_private_bathroom && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Bath className="size-2.5" />
                        </span>
                      )}
                      {item.has_parking && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Car className="size-2.5" />
                        </span>
                      )}
                      {item.has_water_heater && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Flame className="size-2.5" />
                        </span>
                      )}
                      {item.electricity_included && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#64748b]">
                          <Zap className="size-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Facilities preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.facilities.slice(0, 3).map((f) => (
                        <FacilityTag key={f} name={f} />
                      ))}
                      {item.facilities.length > 3 && (
                        <span className="text-[10px] text-[#94a3b8] self-center">
                          +{item.facilities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Price + Rating */}
                    <div className="mt-2.5 flex items-end justify-between">
                      <div>
                        <span className="text-sm font-bold text-[#344e41]">
                          {formatPrice(item.price_idr, item.price_display)}
                        </span>
                        {item.rent_type && (
                          <span className="text-[10px] text-[#94a3b8]">/{item.rent_type}</span>
                        )}
                      </div>
                      {item.rating != null && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#151515]">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {item.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                  />
                </PaginationItem>
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
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page as number)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  );
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          </>)}
        </div>
      </ScrollArea>
    </div>
  );
};
