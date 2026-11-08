import { wasteCategories } from '../utils/wasteInfo';
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
import { CheckIcon } from './Icons';
import './WasteInfoCard.css';

function CategoryVisualCard({ category }) {
  const { id, label, binColor, description, examples, impact, recycleTime } = category;

  const itemIconsMap = {
    organik: [
      { text: 'Sisa Makanan', Icon: AppleItemIcon },
      { text: 'Kulit Buah & Sayur', Icon: LeafItemIcon },
      { text: 'Dedaunan Kebun', Icon: LeafItemIcon },
      { text: 'Kertas Murni', Icon: BoxCardboardIcon },
    ],
    anorganik: [
      { text: 'Botol Plastik PET', Icon: PlasticBottleIcon },
      { text: 'Kaleng Aluminium', Icon: CanItemIcon },
      { text: 'Kardus & Karton', Icon: BoxCardboardIcon },
      { text: 'Wadah Kaca', Icon: PlasticBottleIcon },
    ],
    residu: [
      { text: 'Busa Styrofoam', Icon: StyrofoamBoxIcon },
      { text: 'Kemasan Sachet', Icon: SachetItemIcon },
      { text: 'Popok & Sanitasi', Icon: SachetItemIcon },
      { text: 'Puntung Rokok', Icon: StyrofoamBoxIcon },
    ],
  }[id] || [];

  return (
    <article className={`visual-cat-card cat-card-${id}`}>
      {/* Header dengan Ilustrasi Bin Vektor */}
      <div className="cat-card-top">
        <div className="cat-bin-graphic-box">
          <WasteBinIllustration type={id} size={70} />
        </div>
        <div className="cat-title-meta">
          <span className={`badge badge-${id}`}>Wadah: {binColor}</span>
          <h3 className="cat-card-heading">Sampah {label}</h3>
        </div>
      </div>

      <p className="cat-card-desc">{description}</p>

      {/* Grid Ikon Material yang Masuk ke Wadah Ini */}
      <div className="cat-items-section">
        <span className="cat-section-title">Contoh Material Yang Masuk:</span>
        <div className="cat-visual-items-grid">
          {itemIconsMap.map((item, idx) => {
            const ItemIcon = item.Icon;
            return (
              <div key={idx} className="cat-visual-item-chip">
                <ItemIcon size={16} className="item-svg-icon" />
                <span className="item-label-text">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prosedur Penanganan Utama */}
      <div className="cat-disposal-section">
        <span className="cat-section-title">Prosedur Pembuangan:</span>
        <ul className="cat-procedures-list">
          {category.disposal.slice(0, 3).map((disp, i) => (
            <li key={i} className="cat-procedure-item">
              <CheckIcon size={14} className="cat-check-icon" />
              <span>{disp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Kartu: Waktu Urai */}
      <div className="cat-card-footer">
        <div className="cat-footer-metric">
          <span className="footer-metric-label">Waktu Penguraian</span>
          <span className="footer-metric-val">{recycleTime}</span>
        </div>
      </div>
    </article>
  );
}

export default function WasteInfoSection() {
  return (
    <section id="panduan-visual" className="section waste-visual-section">
      <div className="container">
        <div className="section-header">
          <span className="section-kicker">Referensi Edukasi Pemilahan</span>
          <h2>Panduan Visual 3 Kategori Sampah</h2>
          <p className="section-description">
            Ketahui wadah yang sesuai, contoh benda sehari-hari, dan tata cara penanganan agar limbah dapat didaur ulang secara optimal.
          </p>
        </div>

        <div className="visual-categories-grid">
          {Object.values(wasteCategories).map((cat) => (
            <CategoryVisualCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
