import React, { useState } from 'react';
import './style.css';

export const Financial = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    // Mock data for history (last 5)
    const [transactions] = useState([
        { id: 1, title: 'Food 1', amount: -12500, category: 'Konsumsi', date: '12 May 2026', color: '#22c55e' },
        { id: 2, title: 'Essential 1', amount: -12500, category: 'Utilitas', date: '11 May 2026', color: '#ef4444' },
        { id: 3, title: 'Entertainment 1', amount: -12500, category: 'Lainnya', date: '10 May 2026', color: '#d946ef' },
        { id: 4, title: 'Essential 2', amount: -12500, category: 'Utilitas', date: '09 May 2026', color: '#ef4444' },
        { id: 5, title: 'Transport 1', amount: -12500, category: 'Transportasi', date: '08 May 2026', color: '#3b82f6' },
    ]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(amount));
    };

    return (
        <div className="financial-wrapper">
            {/* Standard Topbar matches Chat TopBar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, height: '64px', width: '100%', backgroundColor: '#e4e5f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="otter-logo-circle" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
                
                <div style={{ position: 'absolute', right: '50px', width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: '"Plus Jakarta Sans-Medium", Helvetica', fontWeight: 500, color: '#000', fontSize: '24px' }}>D</span>
                </div>
            </div>

            <div className="financial-container">
                {/* Purple Summary Card - Compact Version */}
                <div className="summary-card">
                    <div className="summary-section">
                        <p className="summary-label">Total Balance ^</p>
                        <h1 className="summary-amount">Rp7.500.000</h1>
                    </div>
                    
                    <div className="summary-divider">
                        <div className="summary-item">
                            <div className="summary-label-flex">
                                <span className="arrow-icon down">↓</span> Income
                            </div>
                            <h2>Rp5.000.000</h2>
                        </div>
                        <div className="summary-item">
                            <div className="summary-label-flex">
                                <span className="arrow-icon up">↑</span> Expenses
                            </div>
                            <h2>Rp2.500.000</h2>
                        </div>
                    </div>
                </div>

                <div className="financial-actions">
                    <button className="add-transaction-btn" onClick={() => setShowAddModal(true)}>
                        + Add Transaction
                    </button>
                </div>

                <div className="financial-grid">
                    {/* History Panel */}
                    <div className="history-panel">
                        <div className="history-panel-header">
                            <h3>History</h3>
                        </div>
                        <div className="history-list">
                            {transactions.map(t => (
                                <div key={t.id} className="history-item">
                                    <div className="history-indicator" style={{ backgroundColor: t.color }}></div>
                                    <div className="history-info">
                                        <h4>{t.title}</h4>
                                        <p>{t.date}</p>
                                    </div>
                                    <div className="history-amount">
                                        -{formatCurrency(t.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="history-footer">
                            <button className="browse-more-btn">Browse All Transactions</button>
                        </div>
                    </div>

                    {/* Chart Panel Placeholder */}
                    <div className="chart-panel">
                        <h3>Expenses Breakdown</h3>
                        <div className="empty-graph-placeholder">
                            <p>Graphic place will be filled here.</p>
                        </div>
                    </div>
                </div>
                
                {/* Expected vs Actual Expenses Placeholder Panel */}
                <div className="expected-panel">
                    <h3>Monthly Expected vs Actual Expenses</h3>
                    <div className="empty-graph-placeholder">
                        <p>Graphic place will be filled here.</p>
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>Add New Transaction</h3>
                            <button className="close-btn-modal" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="modal-content">
                            <p className="modal-desc">Upload receipt for auto-fill (OCR) or manually input below.</p>
                            
                            {/* OCR Upload Section */}
                            <div className="ocr-upload-box">
                                <div className="upload-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </div>
                                <button className="btn-upload">Choose Photo</button>
                            </div>

                            <div className="horizontal-divider"><span>OR</span></div>

                            {/* Manual Input Form */}
                            <form className="manual-form">
                                <div className="form-group">
                                    <label>Amount (Rp)</label>
                                    <input type="number" placeholder="e.g. 45000" required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select required>
                                        <option value="" disabled selected>Select Category</option>
                                        <option value="Konsumsi">Konsumsi</option>
                                        <option value="Transportasi">Transportasi</option>
                                        <option value="Utilitas">Utilitas</option>
                                        <option value="Sewa">Sewa</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" required />
                                </div>
                                <button type="button" className="btn-submit">Add Record</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
