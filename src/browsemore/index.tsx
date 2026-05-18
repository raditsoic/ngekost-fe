import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kostsData from '../data/kosts.json';
import './style.css';

export const fasilitasDataJSON = {
    kamar: [
        "Kasur",
        "Lemari Baju",
        "AC",
        "Meja",
        "Kursi",
        "Kamar Mandi Dalam",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
    ],
    bersama: [
        "Ruang Tamu",
        "Dapur",
        "Kulkas",
        "Mesin Cuci",
        "Parkir Motor",
        "Parkir Mobil"
    ]
};

// Sticky Top Bar Template
export const TopBar = () => {
    return (
        <div style={{ 
            position: 'sticky', top: 0, zIndex: 100, 
            height: '64px', width: '1432px', 
            backgroundColor: '#e4e5f1', 
            display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
            <div className="otter-logo-circle" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc', position: 'static' }}></div>

            <div style={{ position: 'absolute', right: '50px', width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Plus Jakarta Sans-Medium", Helvetica', fontWeight: 500, color: '#000', fontSize: '24px' }}>D</span>
            </div>
        </div>
    );
};

// Filter Button Template
export const FilterButton = ({ label, left, onClick }: { label: string, left: string, onClick?: () => void }) => (
    <button onClick={onClick} style={{
        position: 'absolute',
        top: '112px',
        left: left,
        width: '174px',
        height: '54px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Intel One Mono-Regular", Helvetica',
        fontWeight: 400,
        color: '#000000',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 10
    }}>
        {label}
    </button>
);

const ITEMS_PER_PAGE = 10;

export const BrowseMore = (): JSX.Element => {
    const navigate = useNavigate();
    const [scale, setScale] = useState(1);
    const [data] = useState(kostsData);
    const [currentPage, setCurrentPage] = useState(1);

    const [isGenderBoxOpen, setIsGenderBoxOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState("Putra");
    const [tempGender, setTempGender] = useState("Putra");

    const [isPeriodBoxOpen, setIsPeriodBoxOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("Bulanan");
    const [tempPeriod, setTempPeriod] = useState("Bulanan");

    const [isFasilitasBoxOpen, setIsFasilitasBoxOpen] = useState(false);
    const [selectedFasilitas, setSelectedFasilitas] = useState<string[]>([]);
    const [tempFasilitas, setTempFasilitas] = useState<string[]>([]);

    const MIN_PRICE = 500000;
    const MAX_PRICE = 10000000;
    const [isPriceBoxOpen, setIsPriceBoxOpen] = useState(false);
    const [selectedMinPrice, setSelectedMinPrice] = useState(MIN_PRICE);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(MAX_PRICE);
    const [tempMinPrice, setTempMinPrice] = useState(MIN_PRICE);
    const [tempMaxPrice, setTempMaxPrice] = useState(MAX_PRICE);

    const handleOpenGenderBox = () => {
        setTempGender(selectedGender);
        setIsGenderBoxOpen(!isGenderBoxOpen);
        setIsPeriodBoxOpen(false);
        setIsFasilitasBoxOpen(false);
        setIsPriceBoxOpen(false);
    };

    const handleSaveGender = () => {
        setSelectedGender(tempGender);
        setIsGenderBoxOpen(false);
    };

    const handleClearGender = () => {
        setTempGender("");
    };

    const handleOpenPeriodBox = () => {
        setTempPeriod(selectedPeriod);
        setIsPeriodBoxOpen(!isPeriodBoxOpen);
        setIsGenderBoxOpen(false);
        setIsFasilitasBoxOpen(false);
        setIsPriceBoxOpen(false);
    };

    const handleSavePeriod = () => {
        setSelectedPeriod(tempPeriod);
        setIsPeriodBoxOpen(false);
    };

    const handleClearPeriod = () => {
        setTempPeriod("");
    };

    const handleOpenFasilitasBox = () => {
        setTempFasilitas([...selectedFasilitas]);
        setIsFasilitasBoxOpen(!isFasilitasBoxOpen);
        setIsGenderBoxOpen(false);
        setIsPeriodBoxOpen(false);
        setIsPriceBoxOpen(false);
    };

    const handleOpenPriceBox = () => {
        setTempMinPrice(selectedMinPrice);
        setTempMaxPrice(selectedMaxPrice);
        setIsPriceBoxOpen(!isPriceBoxOpen);
        setIsGenderBoxOpen(false);
        setIsPeriodBoxOpen(false);
        setIsFasilitasBoxOpen(false);
    };

    const handleSavePrice = () => {
        setSelectedMinPrice(tempMinPrice);
        setSelectedMaxPrice(tempMaxPrice);
        setIsPriceBoxOpen(false);
    };

    const handleClearPrice = () => {
        setTempMinPrice(MIN_PRICE);
        setTempMaxPrice(MAX_PRICE);
    };

    const formatPrice = (v: number) =>
        'Rp' + v.toLocaleString('id-ID');

    const handleSaveFasilitas = () => {
        setSelectedFasilitas(tempFasilitas);
        setIsFasilitasBoxOpen(false);
    };

    const handleClearFasilitas = () => {
        setTempFasilitas([]);
    };

    const toggleTempFasilitas = (fasilitas: string) => {
        if (tempFasilitas.includes(fasilitas)) {
            setTempFasilitas(tempFasilitas.filter(f => f !== fasilitas));
        } else {
            setTempFasilitas([...tempFasilitas, fasilitas]);
        }
    };

    useEffect(() => {
        const handleResize = () => setScale(window.innerWidth / 1432);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const START_TOP = 194;
    const GAP = 196;
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const pagedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const scrollHeight = Math.max(1134, START_TOP + pagedData.length * GAP + 140);

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            {/* The scaled viewport container */}
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1432, height: `${100 / scale}vh` }}>

                {/* The scrollable list */}
                <div className="browse-more" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>

                    {/* Background filler */}
                    <div className="rectangle" style={{ position: 'absolute', top: 0, left: 0, width: 1430, height: scrollHeight }}></div>

                    <TopBar />

                    <FilterButton label="ITS" left="20px" />
                    <FilterButton label={selectedGender || "Gender"} left="210px" onClick={handleOpenGenderBox} />
                    <FilterButton label={selectedPeriod || "Periode"} left="400px" onClick={handleOpenPeriodBox} />
                    <FilterButton
                        label={selectedMinPrice !== MIN_PRICE || selectedMaxPrice !== MAX_PRICE ? "Harga ●" : "Harga"}
                        left="590px"
                        onClick={handleOpenPriceBox}
                    />
                    <FilterButton label={selectedFasilitas.length > 0 ? `Fasilitas (${selectedFasilitas.length})` : "Fasilitas"} left="780px" onClick={handleOpenFasilitasBox} />

                    {isPriceBoxOpen && (
                        <div className="filter-dropdown" style={{ left: '590px' }}>
                            <div className="filter-dropdown-title">Range harga</div>

                            {/* Dual-range slider track */}
                            <div className="price-slider-wrapper">
                                <div
                                    className="price-slider-track"
                                    style={{
                                        left: `${((tempMinPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                                        right: `${((MAX_PRICE - tempMaxPrice) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                                    }}
                                />
                                <input
                                    type="range"
                                    className="price-range-input price-range-min"
                                    min={MIN_PRICE}
                                    max={MAX_PRICE}
                                    step={100000}
                                    value={tempMinPrice}
                                    onChange={e => {
                                        const val = Math.min(Number(e.target.value), tempMaxPrice - 100000);
                                        setTempMinPrice(val);
                                    }}
                                />
                                <input
                                    type="range"
                                    className="price-range-input price-range-max"
                                    min={MIN_PRICE}
                                    max={MAX_PRICE}
                                    step={100000}
                                    value={tempMaxPrice}
                                    onChange={e => {
                                        const val = Math.max(Number(e.target.value), tempMinPrice + 100000);
                                        setTempMaxPrice(val);
                                    }}
                                />
                            </div>

                            {/* Labels */}
                            <div className="price-labels">
                                <div className="price-label-group">
                                    <span className="price-label-title">Minimal</span>
                                    <div className="price-input-box">{formatPrice(tempMinPrice)}</div>
                                </div>
                                <span className="price-dash">—</span>
                                <div className="price-label-group">
                                    <span className="price-label-title">Maksimal</span>
                                    <div className="price-input-box">{formatPrice(tempMaxPrice)}</div>
                                </div>
                            </div>

                            <div className="filter-actions">
                                <button className="btn-hapus" onClick={handleClearPrice}>Hapus</button>
                                <button className="btn-simpan" style={{ backgroundColor: '#7065f0' }} onClick={handleSavePrice}>Simpan</button>
                            </div>
                        </div>
                    )}

                    {isGenderBoxOpen && (
                        <div className="filter-dropdown">
                            <div className="filter-dropdown-title">
                                Tipe kos yang kamu cari berdasarkan gender.
                            </div>

                            {["Putra", "Putri", "Campur"].map(option => (
                                <div className="filter-option" key={option} onClick={() => setTempGender(option)}>
                                    <div className={`filter-checkbox ${tempGender === option ? 'selected' : ''}`} />
                                    <div className="filter-option-label">{option}</div>
                                </div>
                            ))}

                            <div className="filter-actions">
                                <button className="btn-hapus" onClick={handleClearGender}>Hapus</button>
                                <button className="btn-simpan" onClick={handleSaveGender}>Simpan</button>
                            </div>
                        </div>
                    )}

                    {isPeriodBoxOpen && (
                        <div className="filter-dropdown" style={{ left: '400px' }}>
                            <div className="filter-dropdown-title">
                                Waktu bayar sewa
                            </div>

                            {["Mingguan", "Bulanan", "Tahunan", "Per 6 bulan", "Per 3 bulan"].map(option => (
                                <div className="filter-option" key={option} onClick={() => setTempPeriod(option)}>
                                    <div className={`filter-checkbox ${tempPeriod === option ? 'selected' : ''}`} />
                                    <div className="filter-option-label">{option}</div>
                                </div>
                            ))}

                            <div className="filter-actions">
                                <button className="btn-hapus" onClick={handleClearPeriod}>Hapus</button>
                                <button className="btn-simpan" onClick={handleSavePeriod}>Simpan</button>
                            </div>
                        </div>
                    )}

                    {pagedData.map((item, index) => {
                        // Max of 3 facilities formatted as <arr1> - <arr2> - <arr3>
                        const allFacilities = [
                          ...(item.facilities?.kamar || []),
                          ...(item.facilities?.kamarMandi || []),
                          ...(item.facilities?.umum || [])
                        ];
                        const facilitiesText = allFacilities.slice(0, 3).join(' - ');

                        return (
                            <React.Fragment key={item.id}>
                                <div
                                    onClick={() => navigate(`/kost/${item.id}`)}
                                    style={{
                                        position: 'absolute',
                                        top: `${START_TOP + index * GAP}px`,
                                        left: '20px',
                                        width: '272px',
                                        height: '158px',
                                        backgroundColor: '#e4e5f1',
                                        backgroundImage: item.images && item.images[0] ? `url(${item.images[0]})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: '50% 50%',
                                        zIndex: 10,
                                        cursor: 'pointer'
                                    }}
                                />

                                {index < data.length - 1 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: `${START_TOP + 180 + index * GAP}px`,
                                            left: '20px',
                                            width: '1392px',
                                            height: '1px',
                                            backgroundColor: '#ddd',
                                            zIndex: 10
                                        }}
                                    />
                                )}

                                <div
                                    onClick={() => navigate(`/kost/${item.id}`)}
                                    style={{
                                        position: 'absolute',
                                        top: `${START_TOP + index * GAP}px`,
                                        left: '312px',
                                        width: '660px',
                                        height: '156px',
                                        zIndex: 10,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div className="rectangle-8"></div>
                                    <div className="text-wrapper-7">{item.gender}</div>
                                    <div className="text-wrapper-8">{item.name}</div>
                                    <p className="bulan">
                                        <span className="span">{item.price}/</span>
                                        <span className="text-wrapper-9">{item.period}</span>
                                    </p>
                                    <p className="p">{facilitiesText}</p>
                                    <div className="text-wrapper-10">{item.location}</div>
                                    <div className="text-wrapper-11">{item.rating}</div>
                                    <div className="image" />
                                </div>
                            </React.Fragment>
                        );
                    })}
                    {/* Pagination Controls */}
                    <div style={{
                        position: 'absolute',
                        top: `${START_TOP + pagedData.length * GAP + 20}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 20
                    }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f1f5f9' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: 'sans-serif', fontSize: '16px', color: '#64748b' }}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: currentPage === page ? '#0f172a' : 'white',
                                    color: currentPage === page ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontFamily: 'sans-serif',
                                    fontSize: '15px',
                                    fontWeight: currentPage === page ? 700 : 400
                                }}
                            >
                                {page}
                            </button>
                        ))}
                        {totalPages > 5 && <span style={{ fontFamily: 'sans-serif', color: '#94a3b8', fontSize: '16px' }}>...</span>}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === totalPages ? '#f1f5f9' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'sans-serif', fontSize: '16px', color: '#64748b' }}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="image-2" />
                </div>

                {isFasilitasBoxOpen && (
                    <div className="fasilitas-modal-overlay">
                        <div className="fasilitas-modal">
                            <div className="fasilitas-header">
                                <h2 className="fasilitas-title">Fasilitas</h2>
                            </div>

                            <div className="fasilitas-content">
                                <div>
                                    <h3 className="fasilitas-section-title">Fasilitas kamar</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                                        {fasilitasDataJSON.kamar.map(option => (
                                            <div className="fasilitas-option" key={option} onClick={() => toggleTempFasilitas(option)}>
                                                <div className={`fasilitas-checkbox ${tempFasilitas.includes(option) ? 'selected' : ''}`} />
                                                <div className="fasilitas-option-label">{option}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="fasilitas-section-title">Fasilitas Bersama</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                                        {fasilitasDataJSON.bersama.map(option => (
                                            <div className="fasilitas-option" key={option} onClick={() => toggleTempFasilitas(option)}>
                                                <div className={`fasilitas-checkbox ${tempFasilitas.includes(option) ? 'selected' : ''}`} />
                                                <div className="fasilitas-option-label">{option}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="fasilitas-footer">
                                <button className="fasilitas-btn-hapus" onClick={handleClearFasilitas}>Hapus</button>
                                <button className="fasilitas-btn-simpan" onClick={handleSaveFasilitas}>Simpan</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
