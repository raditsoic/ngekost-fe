import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import kostsData from '../data/kosts.json';
import { TopBar } from '../browsemore';
import './style.css';

// Helper function to find intersection and differences
const compareArrays = (arr1: string[] = [], arr2: string[] = []) => {
  const shared = arr1.filter(item => arr2.includes(item));
  const only1 = arr1.filter(item => !arr2.includes(item));
  const only2 = arr2.filter(item => !arr1.includes(item));
  return { shared, only1, only2 };
};

export const CompareKost = () => {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  const kost1 = kostsData.find(k => k.id.toString() === id1) || kostsData[0];
  const kost2 = kostsData.find(k => k.id.toString() === id2) || kostsData[1];

  useEffect(() => {
    const handleResize = () => setScale(window.innerWidth / 1432);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!kost1 || !kost2) {
    return <div>Kosts not found</div>;
  }

  // Compare facilities
  const kamarCompare = compareArrays(kost1.facilities.kamar, kost2.facilities.kamar);
  const kamarMandiCompare = compareArrays(kost1.facilities.kamarMandi, kost2.facilities.kamarMandi);
  const umumCompare = compareArrays(kost1.facilities.umum, kost2.facilities.umum);

  // Compare POI
  // We will collect all unique POI names
  const allPoiNames = Array.from(new Set([
    ...kost1.poi.map(p => p.name),
    ...kost2.poi.map(p => p.name)
  ]));

  const renderFacilitySection = (title: string, data: { shared: string[], only1: string[], only2: string[] }) => (
    <div className="compare-facility-section">
      <h2 className="compare-facility-title">{title}</h2>
      <div className="compare-grid">
        <div className="compare-col left-col">
          <ul className="compare-list">
            {data.only1.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="compare-col center-col">
          <ul className="compare-list shared-list">
            {data.shared.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="compare-col right-col">
          <ul className="compare-list">
            {data.only2.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      </div>
      <hr className="divider" />
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1432, height: `${100 / scale}vh` }}>
        <div className="compare-container" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', backgroundColor: '#F5F5F5' }}>
          <TopBar />

          <div className="compare-wrapper-inner">
            <button 
              onClick={() => navigate(-1)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', 
                fontSize: '18px', fontWeight: 'bold', marginBottom: '20px',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              &larr; Back
            </button>

            {/* Images Header */}
            <div className="compare-images-wrapper">
              <div className="compare-image-card">
                <img src={kost1.images[0]} alt={kost1.name} className="compare-img" />
              </div>
              <div className="vs-circle">vs</div>
              <div className="compare-image-card">
                <img src={kost2.images[0]} alt={kost2.name} className="compare-img" />
              </div>
            </div>

            {/* Info Header */}
            <div className="compare-info-table">
              {/* Title Row */}
              <div className="compare-info-row">
                <div className="title-rating-row">
                  <h1 className="kost-title">{kost1.name}</h1>
                </div>
                <div className="title-rating-row">
                  <h1 className="kost-title">{kost2.name}</h1>
                </div>
              </div>

              {/* Description Row */}
              <div className="compare-info-row">
                <div className="description-text">{kost1.description}</div>
                <div className="description-text">{kost2.description}</div>
              </div>

              {/* Price Row */}
              <div className="compare-info-row">
                <div className="price-row">
                  <span className="price-text">{kost1.price}</span>
                  <span className="period-text">/{kost1.period}</span>
                </div>
                <div className="price-row">
                  <span className="price-text">{kost2.price}</span>
                  <span className="period-text">/{kost2.period}</span>
                </div>
              </div>

              {/* Meta Row */}
              <div className="compare-info-row">
                <div className="meta-row">
                  <div className="gender-badge">kos {kost1.gender.toLowerCase()}</div>
                  <div className="location-pin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="meta-location">{kost1.location}</span>
                  </div>
                  <div className="rating-area" style={{marginLeft: 'auto'}}>
                     <span className="rating-text">{kost1.rating} ({kost1.reviewCount})</span>
                  </div>
                </div>
                <div className="meta-row">
                  <div className="gender-badge">kos {kost2.gender.toLowerCase()}</div>
                  <div className="location-pin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="meta-location">{kost2.location}</span>
                  </div>
                  <div className="rating-area" style={{marginLeft: 'auto'}}>
                     <span className="rating-text">{kost2.rating} ({kost2.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="divider" />

            {renderFacilitySection("Fasilitas kamar", kamarCompare)}
            {renderFacilitySection("Fasilitas kamar mandi", kamarMandiCompare)}
            {renderFacilitySection("Fasilitas umum", umumCompare)}
            {renderFacilitySection("Peraturan kos", { shared: ["Jam malam 22:00"], only1: ["Akses 24 Jam"], only2: ["Tamu menginap bayar"] })}

            {/* Location Section */}
            <div className="location-section">
              <h2 className="compare-facility-title">Lokasi</h2>
              <div className="map-container">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map Placeholder" className="map-image" />
              </div>
              <div className="poi-buttons">
                <button className="poi-btn active">Kampus terdekat</button>
                <button className="poi-btn">Point of Interest</button>
              </div>

              <div className="compare-poi-list">
                {allPoiNames.map((poiName, idx) => {
                  const p1 = kost1.poi.find(p => p.name === poiName);
                  const p2 = kost2.poi.find(p => p.name === poiName);
                  return (
                    <div className="compare-poi-row" key={idx}>
                      <div className="compare-poi-dist left">{p1 ? p1.distance : '-'}</div>
                      <div className="compare-poi-name">{poiName}</div>
                      <div className="compare-poi-dist right">{p2 ? p2.distance : '-'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
