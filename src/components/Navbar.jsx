import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-container">
        <a href="#" className="nav-brand">
          <span className="brand-title">Pilah</span>
          <span className="brand-tag">Klasifikasi Limbah</span>
        </a>

        <nav className={`nav-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi utama">
          <a href="#deteksi" className="nav-link" onClick={() => setMenuOpen(false)}>
            Inspeksi
          </a>
          <a href="#panduan-visual" className="nav-link" onClick={() => setMenuOpen(false)}>
            Panduan Kategori
          </a>
          <a href="#prosedur" className="nav-link" onClick={() => setMenuOpen(false)}>
            Prosedur
          </a>
        </nav>

        <div className="nav-actions">
          <a href="#deteksi" className="btn btn-secondary nav-action-btn">
            Mulai Uji
          </a>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Buka menu navigasi"
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </div>
    </header>
  );
}
