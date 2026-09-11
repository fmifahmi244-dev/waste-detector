import { useRef, useState, useCallback, useEffect } from 'react';
import './ImageUploader.css';

/* ─────────────────────────────────────────
   Tab: Upload file (drag & drop / browse)
───────────────────────────────────────── */
function UploadTab({ onImageSelect, disabled }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`uploader-zone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload gambar sampah"
      onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="uploader-input"
        onChange={handleFileChange}
        id="waste-image-input"
      />

      <div className="uploader-icon-wrap">
        <div className="uploader-icon-ring" />
        <span className="uploader-icon">📂</span>
      </div>

      <div className="uploader-text">
        <p className="uploader-title">Seret &amp; Lepas Foto Sampah</p>
        <p className="uploader-sub">atau <span className="uploader-link">klik di sini</span> untuk memilih file</p>
        <p className="uploader-hint">PNG, JPG, WEBP • Maks. 10MB</p>
      </div>

      <div className="uploader-types">
        <span className="badge badge-organik">🌿 Organik</span>
        <span className="badge badge-anorganik">♻️ Anorganik</span>
        <span className="badge badge-residu">⚠️ Residu</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab: Camera capture (live webcam)
───────────────────────────────────────── */
function CameraTab({ onImageSelect, disabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [camState, setCamState] = useState('idle'); // idle | loading | active | error
  const [errorMsg, setErrorMsg] = useState('');
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // environment | user

  // Start camera
  const startCamera = useCallback(async (mode = facingMode) => {
    setCamState('loading');
    setErrorMsg('');

    // Stop existing stream first
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
          ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.'
          : err.name === 'NotFoundError'
          ? 'Kamera tidak ditemukan di perangkat ini.'
          : 'Kamera tidak bisa diakses. Coba refresh atau gunakan HTTPS.';
      setErrorMsg(msg);
      setCamState('error');
    }
  }, [facingMode]);

  // Stop camera when tab unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Flip camera (front/back)
  const flipCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

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

  return (
    <div className="camera-wrap">
      <canvas ref={canvasRef} className="camera-canvas" aria-hidden="true" />

      {/* Idle: prompt to start */}
      {camState === 'idle' && (
        <div className="camera-placeholder">
          <div className="uploader-icon-wrap">
            <div className="uploader-icon-ring" />
            <span className="uploader-icon">📷</span>
          </div>
          <p className="uploader-title">Aktifkan Kamera</p>
          <p className="uploader-sub">Foto langsung dari kamera perangkatmu</p>
          <button
            className="btn btn-primary cam-start-btn"
            onClick={() => startCamera()}
            disabled={disabled}
            id="camera-start-btn"
          >
            🎥 Buka Kamera
          </button>
        </div>
      )}

      {/* Loading */}
      {camState === 'loading' && (
        <div className="camera-placeholder">
          <div className="cam-spinner" />
          <p className="uploader-sub">Meminta izin kamera...</p>
        </div>
      )}

      {/* Error */}
      {camState === 'error' && (
        <div className="camera-placeholder camera-error">
          <span style={{ fontSize: '2.5rem' }}>🚫</span>
          <p className="uploader-title" style={{ color: 'var(--residu-primary)' }}>Kamera Tidak Tersedia</p>
          <p className="uploader-sub" style={{ maxWidth: 300, textAlign: 'center' }}>{errorMsg}</p>
          <button className="btn btn-outline" onClick={() => startCamera()} id="camera-retry-btn">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Active camera view */}
      <video
        ref={videoRef}
        className={`camera-video ${camState === 'active' ? 'visible' : ''} ${facingMode === 'user' ? 'mirrored' : ''}`}
        playsInline
        muted
        aria-label="Live camera preview"
      />

      {/* Flash overlay */}
      {flash && <div className="camera-flash" aria-hidden="true" />}

      {/* Camera controls */}
      {camState === 'active' && (
        <div className="camera-controls">
          {/* Flip */}
          <button
            className="cam-ctrl-btn cam-flip-btn"
            onClick={flipCamera}
            aria-label="Flip kamera"
            title="Ganti kamera depan/belakang"
            id="camera-flip-btn"
          >
            🔄
          </button>

          {/* Shutter */}
          <button
            className="cam-shutter-btn"
            onClick={capturePhoto}
            disabled={disabled}
            aria-label="Ambil foto"
            id="camera-shutter-btn"
          >
            <span className="cam-shutter-inner" />
          </button>

          {/* Stop */}
          <button
            className="cam-ctrl-btn cam-stop-btn"
            onClick={() => {
              if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
              setCamState('idle');
            }}
            aria-label="Matikan kamera"
            title="Matikan kamera"
            id="camera-stop-btn"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Hybrid Uploader (tabs)
───────────────────────────────────────── */
export default function ImageUploader({ onImageSelect, disabled }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'

  return (
    <div className="hybrid-uploader">
      {/* Tab switcher */}
      <div className="hybrid-tabs" role="tablist">
        <button
          id="tab-upload"
          role="tab"
          aria-selected={activeTab === 'upload'}
          className={`hybrid-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <span>📂</span> Upload File
        </button>
        <button
          id="tab-camera"
          role="tab"
          aria-selected={activeTab === 'camera'}
          className={`hybrid-tab ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <span>📷</span> Ambil Foto
        </button>
      </div>

      {/* Tab content */}
      <div className="hybrid-content">
        {activeTab === 'upload' ? (
          <UploadTab onImageSelect={onImageSelect} disabled={disabled} />
        ) : (
          <CameraTab onImageSelect={onImageSelect} disabled={disabled} />
        )}
      </div>
    </div>
  );
}
