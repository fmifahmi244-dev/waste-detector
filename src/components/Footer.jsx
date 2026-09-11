import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">🗂️ Pilah<span className="gradient-text">AI</span></span>
          <p>Deteksi sampah cerdas untuk Indonesia yang lebih bersih.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <p className="footer-links-title">Navigasi</p>
          <a href="#detect">Deteksi Sampah</a>
          <a href="#edukasi">Edukasi</a>
          <a href="#cara-pakai">Cara Pakai</a>
        </div>

        {/* Categories */}
        <div className="footer-links">
          <p className="footer-links-title">Kategori</p>
          <span className="badge badge-organik">🌿 Organik</span>
          <span className="badge badge-anorganik">♻️ Anorganik</span>
          <span className="badge badge-residu">⚠️ Residu</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PilahAI — Dibuat untuk edukasi pemilahan sampah. Berjalan 100% di browser Anda.</p>
      </div>
    </footer>
  );
}
