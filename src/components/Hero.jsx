import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        {/* Pill badge */}
        <div className="hero-badge animate-fade-up">
          <span className="hero-badge-dot" />
          Didukung Teknologi AI
        </div>

        {/* Heading */}
        <h1 className="hero-heading animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Kenali Sampahmu,{' '}
          <span className="gradient-text">Jaga Bumi Kita</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Upload foto sampah dan biarkan AI mendeteksi jenisnya secara otomatis —
          <strong style={{ color: 'var(--organik-primary)' }}> Organik</strong>,
          <strong style={{ color: 'var(--anorganik-primary)' }}> Anorganik</strong>, atau
          <strong style={{ color: 'var(--residu-primary)' }}> Residu</strong>.
          Bantu wujudkan pemilahan sampah yang benar mulai dari rumah.
        </p>

        {/* CTA buttons */}
        <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a href="#detect" className="btn btn-primary">
            <span>🔍</span> Deteksi Sekarang
          </a>
          <a href="#edukasi" className="btn btn-outline">
            Pelajari Lebih Lanjut
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="hero-stat">
            <span className="hero-stat-value">3</span>
            <span className="hero-stat-label">Kategori Sampah</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">AI</span>
            <span className="hero-stat-label">Berbasis Machine Learning</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Gratis & Offline</span>
          </div>
        </div>
      </div>

      {/* Floating waste icons */}
      <div className="hero-floats" aria-hidden="true">
        <span className="hero-float-icon" style={{ '--delay': '0s', '--x': '10%', '--y': '20%' }}>🌿</span>
        <span className="hero-float-icon" style={{ '--delay': '1s', '--x': '85%', '--y': '15%' }}>♻️</span>
        <span className="hero-float-icon" style={{ '--delay': '0.5s', '--x': '75%', '--y': '70%' }}>⚠️</span>
        <span className="hero-float-icon" style={{ '--delay': '1.5s', '--x': '15%', '--y': '75%' }}>🗑️</span>
        <span className="hero-float-icon" style={{ '--delay': '2s', '--x': '50%', '--y': '85%' }}>🌍</span>
      </div>
    </section>
  );
}
