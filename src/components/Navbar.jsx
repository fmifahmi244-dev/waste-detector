import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo">
          <span className="navbar-logo-icon">🗂️</span>
          <span className="navbar-logo-text">
            Pilah<span className="gradient-text">AI</span>
          </span>
        </a>

        {/* Links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#detect" onClick={() => setMenuOpen(false)}>Deteksi</a></li>
          <li><a href="#edukasi" onClick={() => setMenuOpen(false)}>Edukasi</a></li>
          <li><a href="#cara-pakai" onClick={() => setMenuOpen(false)}>Cara Pakai</a></li>
        </ul>

        {/* CTA */}
        <a href="#detect" className="btn btn-primary navbar-cta" onClick={() => setMenuOpen(false)}>
          Mulai Deteksi
        </a>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
