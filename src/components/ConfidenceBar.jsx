import './ConfidenceBar.css';

export default function ConfidenceBar({ label, score, isMain }) {
  const pct = Math.round(score * 100);
  const colorMap = {
    organik: 'organik',
    anorganik: 'anorganik',
    residu: 'residu',
  };
  const colorClass = colorMap[label] || 'organik';

  return (
    <div className={`conf-bar ${isMain ? 'main' : ''}`}>
      <div className="conf-bar-header">
        <span className="conf-bar-label">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
        <span className={`conf-bar-pct conf-pct-${colorClass}`}>{pct}%</span>
      </div>
      <div className="conf-bar-track">
        <div
          className={`conf-bar-fill conf-fill-${colorClass}`}
          style={{ '--pct': `${pct}%` }}
        />
      </div>
    </div>
  );
}
