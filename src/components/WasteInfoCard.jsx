import { wasteCategories } from '../utils/wasteInfo';
import './WasteInfoCard.css';

function InfoCard({ category }) {
  const { emoji, label, color, description, examples, impact } = category;

  return (
    <div className={`info-card info-card-${color}`}>
      {/* Header */}
      <div className="info-card-header">
        <div className={`info-card-icon-wrap info-icon-${color}`}>
          <span>{emoji}</span>
        </div>
        <div>
          <span className={`badge badge-${color}`}>
            {emoji} {label}
          </span>
          <h3 className="info-card-title">Sampah {label}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="info-card-desc">{description}</p>

      {/* Examples */}
      <div className="info-card-section">
        <p className="info-card-section-label">Contoh</p>
        <ul className="info-card-list">
          {examples.slice(0, 4).map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>

      {/* Impact */}
      <div className={`info-card-impact info-impact-${color}`}>
        <span>💡</span>
        <p>{impact}</p>
      </div>
    </div>
  );
}

export default function WasteInfoSection() {
  return (
    <section id="edukasi" className="section">
      <div className="container">
        {/* Section heading */}
        <div className="section-heading">
          <span className="section-eyebrow">📚 Edukasi Sampah</span>
          <h2>Kenali 3 Jenis Sampah</h2>
          <p className="section-subtitle">
            Pemilahan sampah yang benar dimulai dari memahami kategorinya. Yuk pelajari perbedaannya!
          </p>
        </div>

        {/* Cards grid */}
        <div className="info-cards-grid">
          {Object.values(wasteCategories).map((cat) => (
            <InfoCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
