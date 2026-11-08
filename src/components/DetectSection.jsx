import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import ResultCard from './ResultCard';
import { AlertIcon } from './Icons';
import { useWasteDetection } from '../hooks/useWasteDetection';
import './DetectSection.css';

function LoadingState() {
  return (
    <div className="detect-loading-panel" role="status" aria-live="polite">
      <div className="detect-spinner" aria-hidden="true" />
      <div className="detect-loading-copy">
        <p className="detect-loading-title">Memproses inferensi citra</p>
        <p className="detect-loading-sub">
          Model YOLO sedang mengevaluasi tensor masukan 224x224 piksel melalui WebAssembly.
        </p>
      </div>
    </div>
  );
}

export default function DetectSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { predict, result, isLoading, error, reset } = useWasteDetection();

  useEffect(() => {
    if (selectedImage?.file) {
      predict(selectedImage.file);
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
    <section id="deteksi" className="section detect-section">
      <div className="container">
        <div className="section-header">
          <h2>Inspeksi Sampel Sampah</h2>
          <p className="section-description">
            Unggah berkas foto atau gunakan kamera langsung untuk mengidentifikasi klasifikasi material dan memperoleh rekomendasi wadah pemilahan.
          </p>
        </div>

        <div className="detect-workspace">
          {!selectedImage ? (
            <ImageUploader onImageSelect={handleImageSelect} disabled={isLoading} />
          ) : (
            <div className="detect-stage">
              {isLoading && <LoadingState />}

              {error && (
                <div className="detect-error-box" role="alert">
                  <AlertIcon size={20} className="detect-error-icon" />
                  <div className="detect-error-text">
                    <p className="detect-error-heading">Kesalahan Inferensi</p>
                    <p className="detect-error-msg">{error}</p>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>
                    Coba Kembali
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

        <div id="prosedur" className="workflow-section">
          <h3 className="workflow-title">Tahapan Pengujian</h3>
          <div className="workflow-steps">
            <div className="workflow-step">
              <span className="step-index">01</span>
              <h4 className="step-name">Pengambilan citra</h4>
              <p className="step-desc">
                Posisikan material sampah di tengah bingkai dengan pencahayaan cukup dan latar belakang yang tidak terlalu ramai.
              </p>
            </div>

            <div className="workflow-step">
              <span className="step-index">02</span>
              <h4 className="step-name">Ekstraksi dan cropping</h4>
              <p className="step-desc">
                Sistem melakukan center crop otomatis dan penskalaan ke resolusi 224x224 piksel tanpa distorsi rasio aspek.
              </p>
            </div>

            <div className="workflow-step">
              <span className="step-index">03</span>
              <h4 className="step-name">Hasil dan prosedur</h4>
              <p className="step-desc">
                Label klasifikasi ditampilkan bersama instruksi wadah penampungan serta waktu penguraian material yang teridentifikasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
