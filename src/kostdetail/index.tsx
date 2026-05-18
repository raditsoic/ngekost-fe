import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import kostsData from '../data/kosts.json';
import { TopBar } from '../browsemore';
import './style.css';

export const KostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  const kost = kostsData.find(k => k.id.toString() === id) || kostsData[0];

  useEffect(() => {
    const handleResize = () => setScale(window.innerWidth / 1432);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!kost) {
    return <div>Kost not found</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1432, height: `${100 / scale}vh` }}>
        <div className="kost-detail-container" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', backgroundColor: '#F5F5F5' }}>
          <TopBar />

          <div className="content-wrapper">
            {/* Images Gallery */}
            <div className="gallery-section">
              <div className="main-image">
                <img src={kost.images[0]} alt="Main Kost" />
              </div>
              <div className="side-images">
                {kost.images[1] && <img src={kost.images[1]} alt="Kost 2" />}
                {kost.images[2] && (
                  <div className="image-with-overlay">
                    <img src={kost.images[2]} alt="Kost 3" />
                    <div className="overlay">
                      <p className="overlay-text">+4</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="compare-wrapper">
                <button 
                  className="compare-btn" 
                  title="Compare Kost"
                  onClick={() => navigate(`/compare/${kost.id}/${kost.id.toString() === '1' ? '2' : '1'}`)}
                >
                  +
                </button>
                <div className="compare-placeholder"></div>
              </div>
            </div>

            {/* Title & Rating */}
            <div className="title-rating-row">
              <h1 className="kost-title">{kost.name}</h1>
              <div className="rating-area">
                <span className="star-icon">★</span>
                <span className="rating-text">{kost.rating} ({kost.reviewCount})</span>
              </div>
            </div>

            {/* Price */}
            <div className="price-row">
              <span className="price-text">{kost.price}</span>
              <span className="period-text">/{kost.period}</span>
            </div>

            {/* Gender and Location */}
            <div className="meta-row">
              <div className="gender-badge">kos {kost.gender.toLowerCase()}</div>
              <span className="meta-separator">-</span>
              <div className="location-pin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span className="meta-location">{kost.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <p className="description-text">{kost.description}</p>
            </div>

            <hr className="divider" />

            {/* Facilities Vertical List */}
            <div className="facility-section">
              <h2 className="facility-title">Spesifikasi tipe kamar</h2>
              <ul className="facility-list">
                {kost.facilities.kamar.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            
            <hr className="divider" />

            <div className="facility-section">
              <h2 className="facility-title">Fasilitas kamar</h2>
              <ul className="facility-list">
                {kost.facilities.kamar.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            <hr className="divider" />

            <div className="facility-section">
              <h2 className="facility-title">Fasilitas kamar mandi</h2>
              <ul className="facility-list">
                {kost.facilities.kamarMandi.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            <hr className="divider" />

            <div className="facility-section">
              <h2 className="facility-title">Fasilitas umum</h2>
              <ul className="facility-list">
                {kost.facilities.umum.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            <hr className="divider" />

            <div className="facility-section">
              <h2 className="facility-title">Peraturan kos</h2>
              {/* placeholder for peraturan kos items */}
            </div>

            <hr className="divider" />

            {/* Location & POI */}
            <div className="location-section">
              <h2 className="location-title">Lokasi</h2>
              
              <div className="map-container">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map Placeholder" className="map-image" />
              </div>

              <div className="poi-buttons">
                <button className="poi-btn active">Kampus terdekat</button>
                <button className="poi-btn">Point of Interest</button>
              </div>

              <div className="poi-list">
                {kost.poi.map((p, i) => (
                  <div key={i} className="poi-item">
                    <div className="poi-name">{p.name}</div>
                    <div className="poi-distance">{p.distance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
