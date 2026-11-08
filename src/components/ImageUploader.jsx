import { useRef, useState, useCallback, useEffect } from 'react';
import { UploadIcon, CameraIcon, SwitchCameraIcon, CloseIcon, AlertIcon } from './Icons';
import './ImageUploader.css';

const SAMPLE_PRESETS = [
  {
    id: 'anorganik-sample',
    title: 'Botol Plastik PET',
    category: 'Anorganik',
    badgeClass: 'badge-anorganik',
    src: '/samples/botol-plastik.jpg',
  },
  {
    id: 'organik-sample',
    title: 'Kulit Pisang',
    category: 'Organik',
    badgeClass: 'badge-organik',
    src: '/samples/kulit-pisang.jpg',
  },
  {
    id: 'residu-sample',
    title: 'Kotak Styrofoam',
    category: 'Residu',
    badgeClass: 'badge-residu',
    src: '/samples/kotak-styrofoam.jpg',
  },
];

function UploadTab({ onImageSelect, disabled }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingSample, setLoadingSample] = useState(null);

  const processFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      onImageSelect({ file, url: URL.createObjectURL(file) });
    },
    [onImageSelect]
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSelectSample = async (sample) => {
    if (disabled) return;
    setLoadingSample(sample.id);
    try {
      const response = await fetch(sample.src);
      const blob = await response.blob();
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      onImageSelect({ file, url: sample.src });
    } catch (err) {
      console.error('Gagal memuat sampel foto:', err);
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="upload-tab-wrapper">
      <div
        className={`upload-zone ${isDragOver ? 'is-drag-over' : ''} ${disabled ? 'is-disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="upload-input-hidden"
          onChange={handleFileChange}
          id="waste-file-input"
          disabled={disabled}
        />

        <div className="upload-zone-content">
          <UploadIcon size={28} className="upload-icon-graphic" />
          <div className="upload-copy">
            <p className="upload-main-text">Tarik dan letakkan foto sampah ke area ini</p>
            <p className="upload-sub-text">atau pilih foto langsung dari galeri berkas perangkat Anda.</p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Pilih Berkas Foto
          </button>

          <p className="upload-meta">Format foto: PNG, JPG, WebP. Maksimal 10 MB.</p>
        </div>
      </div>

      {/* Preset Sampel Siap Uji */}
      <div className="samples-section">
        <div className="samples-header">
          <span className="samples-title">Belum punya foto? Coba sampel uji cepat:</span>
        </div>

        <div className="samples-grid">
          {SAMPLE_PRESETS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="sample-item-btn"
              onClick={() => handleSelectSample(sample)}
              disabled={disabled || loadingSample === sample.id}
              title={`Uji sampel ${sample.title}`}
            >
              <div className="sample-thumbnail-box">
                <img src={sample.src} alt={sample.title} className="sample-thumbnail-img" />
              </div>
              <div className="sample-btn-info">
                <span className="sample-btn-name">{sample.title}</span>
                <span className={`badge ${sample.badgeClass}`}>{sample.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CameraTab({ onImageSelect, disabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [camState, setCamState] = useState('idle'); // idle | loading | active | error
  const [errorMsg, setErrorMsg] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = useCallback(async (mode = facingMode) => {
    setCamState('loading');
    setErrorMsg('');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamState('active');
    } catch (err) {
      console.error(err);
      const msg =
        err.name === 'NotAllowedError'
          ? 'Izin akses kamera ditolak pada peramban ini.'
          : err.name === 'NotFoundError'
          ? 'Perangkat kamera tidak ditemukan.'
          : 'Kamera tidak dapat diakses saat ini.';
      setErrorMsg(msg);
      setCamState('error');
    }
  }, [facingMode]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const flipCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        onImageSelect({ file, url });
      },
      'image/jpeg',
      0.92
    );
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCamState('idle');
  };

  return (
    <div className="camera-panel">
      <canvas ref={canvasRef} className="camera-canvas-hidden" aria-hidden="true" />

      {camState === 'idle' && (
        <div className="camera-idle-view">
          <CameraIcon size={32} className="camera-icon-lead" />
          <div className="camera-idle-copy">
            <p className="camera-title">Pemindaian Citra Langsung</p>
            <p className="camera-desc">Arahkan kamera ponsel atau komputer tepat ke objek sampah untuk pemindaian langsung.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => startCamera()}
            disabled={disabled}
          >
            Aktifkan Sensor Kamera
          </button>
        </div>
      )}

      {camState === 'loading' && (
        <div className="camera-status-view">
          <p className="camera-status-text">Menghubungkan ke modul kamera...</p>
        </div>
      )}

      {camState === 'error' && (
        <div className="camera-error-view">
          <AlertIcon size={24} className="camera-error-icon" />
          <p className="camera-error-title">Akses kamera gagal</p>
          <p className="camera-error-desc">{errorMsg}</p>
          <button type="button" className="btn btn-secondary" onClick={() => startCamera()}>
            Coba Kembali
          </button>
        </div>
      )}

      <div className={`camera-viewfinder ${camState === 'active' ? 'is-visible' : ''}`}>
        <video
          ref={videoRef}
          className={`camera-stream ${facingMode === 'user' ? 'is-mirrored' : ''}`}
          playsInline
          muted
          aria-label="Tampilan pemindaian kamera langsung"
        />
      </div>

      {camState === 'active' && (
        <div className="camera-bar">
          <button
            type="button"
            className="btn btn-secondary camera-bar-btn"
            onClick={flipCamera}
            title="Ganti orientasi kamera"
            aria-label="Ganti orientasi kamera"
          >
            <SwitchCameraIcon size={16} />
            <span>Balik Kamera</span>
          </button>

          <button
            type="button"
            className="btn btn-primary camera-shutter"
            onClick={capturePhoto}
            disabled={disabled}
            aria-label="Ambil foto"
          >
            Pindai Sampah Ini
          </button>

          <button
            type="button"
            className="btn btn-secondary camera-bar-btn"
            onClick={stopCamera}
            title="Tutup kamera"
            aria-label="Tutup kamera"
          >
            <CloseIcon size={16} />
            <span>Tutup</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ImageUploader({ onImageSelect, disabled }) {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="uploader-card">
      <div className="uploader-tabs" role="tablist" aria-label="Metode masukan gambar">
        <button
          type="button"
          id="tab-upload"
          role="tab"
          aria-selected={activeTab === 'upload'}
          aria-controls="panel-upload"
          className={`uploader-tab ${activeTab === 'upload' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <UploadIcon size={16} />
          <span>Unggah Berkas Foto</span>
        </button>

        <button
          type="button"
          id="tab-camera"
          role="tab"
          aria-selected={activeTab === 'camera'}
          aria-controls="panel-camera"
          className={`uploader-tab ${activeTab === 'camera' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <CameraIcon size={16} />
          <span>Pemindaian Kamera</span>
        </button>
      </div>

      <div className="uploader-body">
        {activeTab === 'upload' ? (
          <div id="panel-upload" role="tabpanel" aria-labelledby="tab-upload">
            <UploadTab onImageSelect={onImageSelect} disabled={disabled} />
          </div>
        ) : (
          <div id="panel-camera" role="tabpanel" aria-labelledby="tab-camera">
            <CameraTab onImageSelect={onImageSelect} disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
}
