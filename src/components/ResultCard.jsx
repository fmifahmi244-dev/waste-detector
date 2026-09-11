import { getCategoryData } from '../utils/wasteInfo';
import './ResultCard.css';

export default function ResultCard({ result, imageUrl, onReset }) {
  const { label } = result;
  const categoryData = getCategoryData(label);

  return (
    <div className={`result-card animate-fade-up result-${label}`}>
      {/* Header */}
      <div className="result-header">
        <div className={`result-badge-large result-badge-${label}`}>
          <span className="result-emoji">{categoryData?.emoji}</span>
          <span>Sampah {categoryData?.label}</span>
        </div>
        <button className="result-reset-btn" onClick={onReset} aria-label="Analisis ulang">
          ↺ Coba Lagi
        </button>
      </div>

      {/* Body */}
      <div className="result-body">
        {/* Image preview */}
        <div className="result-image-wrap">
          <img src={imageUrl} alt="Sampah terdeteksi" className="result-image" />
          <div className={`result-image-overlay result-overlay-${label}`} />
          <div className={`result-label-chip result-chip-${label}`}>
            {categoryData?.emoji} {categoryData?.label}
          </div>
        </div>

        {/* Info panel */}
        <div className="result-info">
          {/* Description */}
          <p className="result-description">{categoryData?.description}</p>


          {/* Disposal tips */}
          <div className="result-tips">
            <p className="result-section-title">💡 Cara Pembuangan</p>
            <ul className="result-tips-list">
              {categoryData?.disposal.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Recycle time */}
          <div className={`result-timecard result-timecard-${label}`}>
            <span className="result-timecard-icon">⏱️</span>
            <div>
              <p className="result-timecard-label">Waktu Terurai</p>
              <p className="result-timecard-value">{categoryData?.recycleTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
