import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col-main">
          <span className="footer-brand-title">Pilah</span>
          <p className="footer-tagline">
            Sistem klasifikasi visual untuk mendukung pemilahan sampah organik, anorganik, dan residu secara mandiri.
          </p>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Navigasi</span>
          <ul className="footer-list">
            <li><a href="#deteksi" className="footer-link">Inspeksi Sampel</a></li>
            <li><a href="#panduan-visual" className="footer-link">Panduan Kategori</a></li>
            <li><a href="#prosedur" className="footer-link">Tahapan Pengujian</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Klasifikasi</span>
          <ul className="footer-list">
            <li className="footer-item-plain">Sampah Organik (Wadah Hijau)</li>
            <li className="footer-item-plain">Sampah Anorganik (Wadah Biru / Kuning)</li>
            <li className="footer-item-plain">Sampah Residu (Wadah Abu-abu / Merah)</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">
          Sistem berjalan penuh di peramban lokal tanpa penyimpanan data gambar ke peladen eksternal.
        </p>
      </div>
    </footer>
  );
}
