import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const vehicleOptions = [
    { value: 'Jalan Kaki', label: 'Jalan Kaki' },
    { value: 'Motor Matic', label: 'Motor Matic' },
    { value: 'Motor Manual', label: 'Motor Manual' },
    { value: 'Mobil', label: 'Mobil' },
    { value: 'Sepeda', label: 'Sepeda' },
    { value: 'Transportasi Umum', label: 'Transportasi Umum' },
];

export const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [budget, setBudget] = useState('');
    const [vehicle, setVehicle] = useState('');

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/catalogue');
    };

    return (
        <div className="onboarding-layout">
            {/* Standard Topbar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, height: '64px', width: '100%', backgroundColor: '#e4e5f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
            </div>

            <div className="onboarding-wrapper">
                <div className="onboarding-card">
                    {/* Progress Indicator */}
                    <div className="progress-bar-container">
                        <div className="progress-step">
                            <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}></div>
                            <span>Budget</span>
                        </div>
                        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className="progress-step">
                            <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}></div>
                            <span>Kendaraan</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="onboarding-step">
                            <div className="onboarding-step-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <h1>Budget Bulanan</h1>
                            <p className="onboarding-subtitle">
                                Masukkan total anggaran bulananmu. AI akan menggunakan angka ini sebagai basis perhitungan pengeluaran dan sisa budget harianmu.
                            </p>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="input-currency-wrapper">
                                    <span className="currency-prefix">Rp</span>
                                    <input
                                        type="number"
                                        placeholder="Contoh: 3000000"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="budget-suggestions">
                                    {['1500000', '2000000', '3000000', '5000000'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`suggestion-chip ${budget === val ? 'selected' : ''}`}
                                            onClick={() => setBudget(val)}
                                        >
                                            Rp{parseInt(val).toLocaleString('id-ID')}
                                        </button>
                                    ))}
                                </div>
                                <button type="submit" className="onboarding-next-btn">
                                    Lanjut
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-step">
                            <div className="onboarding-step-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                            </div>
                            <h1>Tipe Kendaraan</h1>
                            <p className="onboarding-subtitle">
                                Pilih kendaraan yang biasa kamu gunakan sehari-hari. AI akan menggunakannya untuk menghitung estimasi biaya transportasi dari kos ke kampus.
                            </p>
                            <form onSubmit={handleFinish}>
                                <div className="vehicle-grid">
                                    {vehicleOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`vehicle-card ${vehicle === opt.value ? 'selected' : ''}`}
                                            onClick={() => setVehicle(opt.value)}
                                        >
                                            <span className="vehicle-label">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="onboarding-nav">
                                    <button type="button" className="onboarding-back-btn" onClick={() => setStep(1)}>
                                        Kembali
                                    </button>
                                    <button type="submit" className="onboarding-next-btn" disabled={!vehicle}>
                                        Mulai
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
