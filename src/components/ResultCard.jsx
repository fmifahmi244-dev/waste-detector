import { getCategoryData } from '../utils/wasteInfo';
import { ResetIcon, CheckIcon } from './Icons';
import {
  WasteBinIllustration,
  LeafItemIcon,
  AppleItemIcon,
  PlasticBottleIcon,
  CanItemIcon,
  BoxCardboardIcon,
  StyrofoamBoxIcon,
  SachetItemIcon,
} from './WasteIllustrations';
import './ResultCard.css';

export default function ResultCard({ result, imageUrl, onReset }) {
  const { label } = result;
  const categoryData = getCategoryData(label);
  const normalizedKey = String(label).toLowerCase().trim();

  const binColorTitles = {
    organik: 'Wadah Sampah Hijau (Organik)',
    anorganik: 'Wadah Sampah Biru (Anorganik)',
    residu: 'Wadah Sampah Oranye / Abu (Residu)',
  }[normalizedKey] || 'Wadah Sampah Terpilah';

  return (
    <div className={`result-card result-theme-${normalizedKey}`}>
      {/* Header kartu hasil */}
      <div className="result-header">
        <div className="result-heading-wrap">
          <span className="result-tag">Hasil Identifikasi Visual</span>
          <h2 className="result-main-title">Sampah {categoryData?.label || label}</h2>
        </div>

        <button
          type="button"
          className="btn btn-secondary result-reset-btn"
          onClick={onReset}
          aria-label="Pindai sampel gambar baru"
        >
          <ResetIcon size={15} />
          <span>Uji Gambar Lain</span>
        </button>
      </div>

      <div className="result-grid">
        {/* Kolom 1: Pratinjau Citra Asli dengan Crosshair */}
        <div className="result-preview-panel">
          <div className="result-image-box">
            <img src={imageUrl} alt="Sampel sampah yang diuji" className="result-image" />
          </div>

          <div className="result-meta-row">
            <span className="result-meta-label">Metode inferensi</span>
            <span className="result-meta-value">ONNX Runtime Lokal</span>
          </div>
        </div>

        {/* Kolom 2: Rekomendasi Wadah Visual & Detail Prosedur */}
        <div className="result-detail-panel">
          {/* Target Wadah Pembuangan yang Ditonjolkan */}
          <div className="bin-target-box">
            <div className="bin-target-graphic">
              <WasteBinIllustration type={normalizedKey} size={64} />
            </div>

            <div className="bin-target-info">
              <span className="bin-target-eyebrow">Tujuan Pembuangan:</span>
              <p className="bin-target-name">{binColorTitles}</p>
              <p className="bin-target-rule">
                Pastikan material telah dipisahkan dari jenis limbah lainnya sebelum dibuang.
              </p>
            </div>
          </div>

          {/* Deskripsi Material */}
          <div className="result-section">
            <span className="result-section-label">Karakteristik Material</span>
            <p className="result-description">{categoryData?.description}</p>
          </div>

          {/* Prosedur Pemilahan */}
          <div className="result-section">
            <span className="result-section-label">Panduan Penanganan yang Benar</span>
            <ul className="result-procedures">
              {categoryData?.disposal.map((step, index) => (
                <li key={index} className="result-procedure-item">
                  <CheckIcon size={16} className="procedure-icon" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contoh Material Serupa dengan Ikon Vektor */}
          <div className="result-section">
            <span className="result-section-label">Contoh Benda Sejenis</span>
            <div className="related-items-row">
              {normalizedKey === 'organik' && (
                <>
                  <span className="related-item-badge">
                    <AppleItemIcon size={15} />
                    <span>Sisa Makanan</span>
                  </span>
                  <span className="related-item-badge">
                    <LeafItemIcon size={15} />
                    <span>Dedaunan & Ranting</span>
                  </span>
                </>
              )}

              {normalizedKey === 'anorganik' && (
                <>
                  <span className="related-item-badge">
                    <PlasticBottleIcon size={15} />
                    <span>Botol Plastik PET</span>
                  </span>
                  <span className="related-item-badge">
                    <CanItemIcon size={15} />
                    <span>Kaleng Aluminium</span>
                  </span>
                  <span className="related-item-badge">
                    <BoxCardboardIcon size={15} />
                    <span>Kardus & Kertas</span>
                  </span>
                </>
              )}

              {normalizedKey === 'residu' && (
                <>
                  <span className="related-item-badge">
                    <StyrofoamBoxIcon size={15} />
                    <span>Busa Styrofoam</span>
                  </span>
                  <span className="related-item-badge">
                    <SachetItemIcon size={15} />
                    <span>Kemasan Sachet</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Waktu Urai */}
          <div className="result-timeline-box">
            <span className="timeline-label">Estimasi Waktu Penguraian di Alam:</span>
            <span className="timeline-value">{categoryData?.recycleTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
