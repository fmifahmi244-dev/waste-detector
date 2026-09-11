import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import ResultCard from './ResultCard';
import { useWasteDetection } from '../hooks/useWasteDetection';
import './DetectSection.css';

function LoadingOverlay({ isFirstLoad }) {
  return (
    <div className="loading-overlay animate-fade-in">
      <div className="loading-spinner-wrap">
        <div className="loading-spinner" />
        <div className="loading-spinner loading-spinner-2" />
      </div>
      <p className="loading-title">
        {isFirstLoad ? 'Memuat model AI...' : 'Menganalisis sampah...'}
      </p>
      <p className="loading-sub">
        {isFirstLoad
          ? 'Pertama kali butuh beberapa detik — selanjutnya lebih cepat'
          : 'ONNX Runtime sedang memproses gambar Anda'}
      </p>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default function DetectSection() {
  const [selectedImage, setSelectedImage] = useState(null); // { file, url }
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { predict, result, isLoading, error, reset } = useWasteDetection();

  // When image selected, trigger prediction directly with the File/Blob
  useEffect(() => {
    if (selectedImage?.file) {
      predict(selectedImage.file).then(() => setIsFirstLoad(false));
    }
  }, [selectedImage, predict]);

  const handleImageSelect = (imgData) => {
    setSelectedImage(imgData);
    reset();
  };

  const handleReset = () => {
    setSelectedImage(null);
    reset();
  };

  return (
    <section id="detect" className="section detect-section">
      <div className="container">
        {/* Heading */}
        <div className="section-heading">
          <span className="section-eyebrow">🔍 Deteksi Sampah</span>
          <h2>Upload Foto, Dapatkan Hasilnya</h2>
          <p className="section-subtitle">
            Ambil foto sampah di sekitar kamu dan biarkan AI mendeteksi jenis serta cara pembuangannya.
          </p>
        </div>

        {/* Detect area */}
        <div className="detect-area">
          {!selectedImage ? (
            <ImageUploader onImageSelect={handleImageSelect} disabled={isLoading} />
          ) : (
            <div className="detect-result-wrap">

              {isLoading && <LoadingOverlay isFirstLoad={isFirstLoad} />}

              {error && (
                <div className="detect-error animate-fade-in">
                  <span className="detect-error-icon">⚠️</span>
                  <p>{error}</p>
                  <button className="btn btn-outline" onClick={handleReset}>
                    Coba Lagi
                  </button>
                </div>
              )}

              {result && !isLoading && (
                <ResultCard
                  result={result}
                  imageUrl={selectedImage.url}
                  onReset={handleReset}
                />
              )}
            </div>
          )}
        </div>

        {/* How to use */}
        <div id="cara-pakai" className="how-to">
          <p className="how-to-title">Cara Menggunakan</p>
          <div className="how-to-steps">
            {[
              { icon: '📸', step: '1', text: 'Foto atau pilih gambar sampah' },
              { icon: '🤖', step: '2', text: 'AI menganalisis secara otomatis' },
              { icon: '📋', step: '3', text: 'Lihat hasil & cara membuangnya' },
            ].map(({ icon, step, text }) => (
              <div className="how-to-step" key={step}>
                <div className="how-to-step-icon">{icon}</div>
                <div className="how-to-step-num">Langkah {step}</div>
                <p className="how-to-step-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
