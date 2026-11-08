import { useState } from 'react';
import { WasteBinIllustration } from './WasteIllustrations';
import './Hero.css';

export default function Hero() {
  const [activeBin, setActiveBin] = useState('organik');

  const binInfo = {
    organik: {
      title: 'Tempat Sampah Hijau',
      subtitle: 'Sampah Organik (Mudah Terurai)',
      items: ['Sisa makanan', 'Kulit buah & sayur', 'Daun & ranting kebun', 'Ampas kopi & teh'],
    },
    anorganik: {
      title: 'Tempat Sampah Biru',
      subtitle: 'Sampah Anorganik (Dapat Didaur Ulang)',
      items: ['Botol plastik PET', 'Kaleng aluminium', 'Kardus & kertas bersih', 'Botol & toples kaca'],
    },
    residu: {
      title: 'Tempat Sampah Oranye / Abu',
      subtitle: 'Sampah Residu (Non-Daur Ulang)',
      items: ['Kemasan sachet makanan', 'Wadah styrofoam bekas', 'Popok sekali pakai', 'Kain & kapas kotor'],
    },
  }[activeBin];

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Kolom Kiri: Teks & Aksi */}
          <div className="hero-content">
            <div className="hero-tag-wrap">
              <span className="hero-live-dot" aria-hidden="true" />
              <span className="hero-tag-text">Sistem Pemilahan Sampah Mandiri</span>
            </div>

            <h1 className="hero-heading">
              Pilah sampahmu dengan tepat sebelum masuk ke wadah
            </h1>

            <p className="hero-description">
              Arahkan kamera atau masukkan gambar sampah. Model visi komputer mengidentifikasi objek ke dalam tiga kategori standar: Organik, Anorganik, dan Residu langsung di peramban Anda.
            </p>

            <div className="hero-actions">
              <a href="#deteksi" className="btn btn-primary">
                Mulai Inspeksi Foto
              </a>
              <a href="#panduan-visual" className="btn btn-secondary">
                Lihat Panduan Visual
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="hero-stats-row">
              <div className="hero-stat-block">
                <span className="stat-number">3</span>
                <span className="stat-desc">Wadah Pemilahan</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-block">
                <span className="stat-number">224 px</span>
                <span className="stat-desc">Resolusi Pemindaian</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-block">
                <span className="stat-number">Lokal</span>
                <span className="stat-desc">Privasi Foto Terjaga</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Visualisasi Interaktif 3 Tempat Sampah */}
          <div className="hero-visual-panel">
            <div className="bins-selector-header">
              <span className="bins-panel-title">Tiga Wadah Standar Kota</span>
              <span className="bins-panel-hint">Klik wadah untuk melihat isi</span>
            </div>

            <div className="bins-stage" role="tablist" aria-label="Pilih wadah sampah">
              <button
                type="button"
                className={`bin-display-btn ${activeBin === 'organik' ? 'is-active-organik' : ''}`}
                onClick={() => setActiveBin('organik')}
                aria-selected={activeBin === 'organik'}
              >
                <WasteBinIllustration type="organik" size={72} />
                <span className="bin-btn-label label-organik">Organik</span>
              </button>

              <button
                type="button"
                className={`bin-display-btn ${activeBin === 'anorganik' ? 'is-active-anorganik' : ''}`}
                onClick={() => setActiveBin('anorganik')}
                aria-selected={activeBin === 'anorganik'}
              >
                <WasteBinIllustration type="anorganik" size={72} />
                <span className="bin-btn-label label-anorganik">Anorganik</span>
              </button>

              <button
                type="button"
                className={`bin-display-btn ${activeBin === 'residu' ? 'is-active-residu' : ''}`}
                onClick={() => setActiveBin('residu')}
                aria-selected={activeBin === 'residu'}
              >
                <WasteBinIllustration type="residu" size={72} />
                <span className="bin-btn-label label-residu">Residu</span>
              </button>
            </div>

            {/* Kartu Detail Bin yang Aktif */}
            <div className={`bin-preview-card bin-preview-${activeBin}`}>
              <div className="preview-card-header">
                <span className="preview-bin-name">{binInfo.title}</span>
                <span className="preview-bin-cat">{binInfo.subtitle}</span>
              </div>

              <div className="preview-items-row">
                {binInfo.items.map((item, idx) => (
                  <span key={idx} className="preview-item-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
