/**
 * WasteIllustrations.jsx
 * Kumpulan ilustrasi vektor SVG murni untuk memvisualisasikan:
 * 1. Tempat sampah tiga warna standar (Hijau Organik, Biru Anorganik, Merah Residu)
 * 2. Ikon material spesifik (Botol, Kaleng, Apel, Daun, Kardus, Styrofoam, dll.)
 * Tanpa emoji, tanpa gradient blur, berbobot garis konsisten dan tajam.
 */

export function WasteBinIllustration({ type = 'organik', size = 80, className = '' }) {
  // Palet warna realistis berdasarkan standar tempat sampah pemilahan
  const config = {
    organik: {
      accent: '#22c55e',
      dark: '#15803d',
      subtle: '#14532d',
      label: 'ORGANIK',
      lidPath: 'M 14 18 L 66 18 L 60 12 L 20 12 Z',
    },
    anorganik: {
      accent: '#3b82f6',
      dark: '#1d4ed8',
      subtle: '#1e3a8a',
      label: 'ANORGANIK',
      lidPath: 'M 14 18 L 66 18 L 60 12 L 20 12 Z',
    },
    residu: {
      accent: '#f97316',
      dark: '#c2410c',
      subtle: '#7c2d12',
      label: 'RESIDU',
      lidPath: 'M 14 18 L 66 18 L 60 12 L 20 12 Z',
    },
  }[type] || {
    accent: '#22c55e',
    dark: '#15803d',
    subtle: '#14532d',
    label: 'ORGANIK',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Roda kiri & kanan */}
      <circle cx="22" cy="80" r="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="58" cy="80" r="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="22" y1="80" x2="58" y2="80" stroke="#1e293b" strokeWidth="2" />

      {/* Badan Tempat Sampah */}
      <path
        d="M 18 24 L 23 76 C 23.5 78 25 79 27 79 L 53 79 C 55 79 56.5 78 57 76 L 62 24 Z"
        fill={config.subtle}
        fillOpacity="0.35"
        stroke={config.dark}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Garis alur vertikal pada bodi bin */}
      <line x1="32" y1="30" x2="34" y2="72" stroke={config.dark} strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="40" y1="30" x2="40" y2="72" stroke={config.dark} strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="48" y1="30" x2="46" y2="72" stroke={config.dark} strokeWidth="1.5" strokeOpacity="0.7" />

      {/* Label Plat Teknis */}
      <rect x="25" y="44" width="30" height="12" rx="2" fill="#0f172a" stroke={config.accent} strokeWidth="1" />
      <text
        x="40"
        y="52.5"
        textAnchor="middle"
        fill={config.accent}
        fontSize="5.5"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        {config.label}
      </text>

      {/* Bibir bin */}
      <rect x="15" y="20" width="50" height="4.5" rx="1" fill={config.dark} stroke="#0f172a" strokeWidth="1" />

      {/* Tutup Tempat Sampah (Lid) */}
      <path
        d="M 12 19 L 68 19 L 63 11 C 62.5 10 61.5 9.5 60 9.5 L 20 9.5 C 18.5 9.5 17.5 10 17 11 Z"
        fill={config.dark}
        stroke={config.accent}
        strokeWidth="1.5"
      />

      {/* Pegangan tutup */}
      <rect x="33" y="6" width="14" height="4" rx="1.5" fill="#0f172a" stroke={config.accent} strokeWidth="1.5" />

      {/* Ikon spesifik pada lid */}
      {type === 'organik' && (
        <path
          d="M 37 36 C 37 33 43 33 43 36 C 43 39 37 40 37 40 C 37 40 39 38 41 37"
          stroke={config.accent}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {type === 'anorganik' && (
        <path
          d="M 36 34 L 40 32 L 44 34 M 44 38 L 42 41 L 38 41 M 36 38 L 35 35"
          stroke={config.accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {type === 'residu' && (
        <path
          d="M 40 33 L 40 38 M 40 40 L 40 40.5"
          stroke={config.accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// Ikon Item Organik
export function LeafItemIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function AppleItemIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 4c.5-1.5 1.5-2.5 3-3" />
      <path d="M10 2c0 2 1.5 3 2 4" />
      <path d="M12 6c2-2 5-2 7 0 2 2 2 6-1 9-1.5 1.5-2.5 3-2.5 5H8.5C8.5 18 7.5 16.5 6 15c-3-3-3-7-1-9 2-2 5-2 7 0Z" />
    </svg>
  );
}

// Ikon Item Anorganik
export function PlasticBottleIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 2h6v3H9z" />
      <path d="M10 5v2l-3 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10l-3-3V5" />
      <line x1="7" y1="14" x2="17" y2="14" />
    </svg>
  );
}

export function CanItemIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <ellipse cx="12" cy="5" rx="6" ry="2.5" />
      <path d="M6 5v14c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V5" />
      <path d="M6 12c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5" />
    </svg>
  );
}

export function BoxCardboardIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

// Ikon Item Residu
export function StyrofoamBoxIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 9l9-4 9 4-9 4-9-4z" />
      <path d="M3 9v6l9 4 9-4V9" />
      <line x1="9" y1="12" x2="15" y2="12" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

export function SachetItemIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <line x1="5" y1="17" x2="19" y2="17" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function RecycleSymbolIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.554-.88 1.8 1.8 0 0 0 .004-1.78L16.8 9.5" />
      <path d="M14.5 5.5h-5L7.2 9.5h9.6Z" />
      <polyline points="7 15 7 19 11 19" />
    </svg>
  );
}
