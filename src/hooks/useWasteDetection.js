import { useState, useCallback, useRef } from 'react';
import * as ort from 'onnxruntime-web';

/**
 * useWasteDetection
 *
 * Inference menggunakan model YOLO26s-cls (ONNX) via onnxruntime-web.
 * Berjalan 100% di browser via WebAssembly — tidak ada server/API.
 *
 * Model Roboflow Preprocessing Specification:
 *   - Auto-Orient : Handled via createImageBitmap
 *   - Static Crop : 25%-75% Horizontal Region, 25%-75% Vertical Region (central 50% box)
 *   - Resize      : Scaled to 224x224 (model imgsz)
 *   - Grayscale   : Applied (ITU-R BT.601 standard luminance, replicated to 3 channels)
 *   - Classes     : {0: 'Anorganik', 1: 'Organik', 2: 'Residu'}
 */

const MODEL_URL    = '/best.onnx';
const INPUT_NAME   = 'images';
const OUTPUT_NAME  = 'output0';
const IMG_SIZE     = 224;
const CLASS_LABELS = ['anorganik', 'organik', 'residu'];

// Konfigurasi ORT
ort.env.wasm.numThreads = 1; // single-thread, hindari SharedArrayBuffer requirement

// ── Preprocessing sesuai spesifikasi Roboflow ──────────

async function preprocessImage(source) {
  // 1. Ambil dimensi asli gambar (Auto-Orient otomatis ditangani browser)
  let srcW, srcH;
  let imgSource = source;
  if (source instanceof File || source instanceof Blob) {
    const bmp = await createImageBitmap(source);
    srcW = bmp.width;
    srcH = bmp.height;
    imgSource = bmp;
  } else {
    srcW = source.naturalWidth || source.videoWidth || source.width;
    srcH = source.naturalHeight || source.videoHeight || source.height;
  }

  // 2. Static Crop: 25-75% Horizontal, 25-75% Vertical
  // Memotong area tengah 50% lebar dan 50% tinggi gambar
  const startX = srcW * 0.25;
  const startY = srcH * 0.25;
  const cropW  = srcW * 0.50;
  const cropH  = srcH * 0.50;

  // 3. Resize: Skala ke 224x224 piksel (sesuai imgsz model ONNX)
  const canvas = new OffscreenCanvas(IMG_SIZE, IMG_SIZE);
  const ctx = canvas.getContext('2d');
  
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(imgSource, startX, startY, cropW, cropH, 0, 0, IMG_SIZE, IMG_SIZE);

  if (imgSource instanceof ImageBitmap) {
    imgSource.close();
  }

  // 4. Grayscale: Applied
  // Ekstrak piksel RGBA dan konversi ke Grayscale (Luminance ITU-R BT.601)
  // lalu replikasi ke 3 channel tensor [1, 3, 224, 224]
  const { data } = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
  const total = IMG_SIZE * IMG_SIZE;
  const buf   = new Float32Array(3 * total);

  for (let i = 0; i < total; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    
    // Standar grayscale Roboflow / OpenCV: Y = 0.299*R + 0.587*G + 0.114*B
    const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;

    buf[0 * total + i] = gray; // Channel R
    buf[1 * total + i] = gray; // Channel G
    buf[2 * total + i] = gray; // Channel B
  }

  let croppedUrl = null;
  try {
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
    croppedUrl = URL.createObjectURL(blob);
  } catch (e) {
    console.debug('convertToBlob fallback:', e);
  }

  return { buf, croppedUrl };
}

// ── Session loader ─────────────────────────────────────

async function loadSession() {
  const session = await ort.InferenceSession.create(MODEL_URL, {
    executionProviders: ['wasm'],
  });

  return { ort, session };
}

// ── Inference ──────────────────────────────────────────

async function runInference(ort, session, source) {
  const { buf, croppedUrl } = await preprocessImage(source);
  const tensor = new ort.Tensor('float32', buf, [1, 3, IMG_SIZE, IMG_SIZE]);
  const output = await session.run({ [INPUT_NAME]: tensor });

  // Model YOLO ONNX sudah menyertakan softmax internal (output sum = 1.0)
  const probs  = Array.from(output[OUTPUT_NAME].data);
  const maxIdx = probs.indexOf(Math.max(...probs));

  console.debug('[ONNX] Probabilitas hasil evaluasi (Roboflow Preproc):', probs);

  return {
    label:      CLASS_LABELS[maxIdx],
    confidence: probs[maxIdx],
    scores:     CLASS_LABELS.map((lbl, i) => ({ label: lbl, score: probs[i] })),
    croppedUrl: croppedUrl,
  };
}

// ── Hook ───────────────────────────────────────────────

export function useWasteDetection() {
  const [result,    setResult]    = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const cacheRef = useRef(null);

  const predict = useCallback(async (imgSource) => {
  setIsLoading(true);
  setResult(null);
  setError(null);

  try {
    // Catat apakah model sudah pernah dimuat
    const isFirstInference = !cacheRef.current;

    // Mulai pengukuran
    const startTime = performance.now();

    // Load model hanya jika belum tersedia
    if (isFirstInference) {
      cacheRef.current = await loadSession();
    }

    const { ort, session } = cacheRef.current;

    // Preprocessing + inference
    const prediction = await runInference(ort, session, imgSource);

    // Akhiri pengukuran
    const endTime = performance.now();
    const latency = endTime - startTime;

    // Simpan informasi pengukuran
    const benchmark = {
      type: isFirstInference ? 'First Inference' : 'Subsequent Inference',
      latencyMs: Number(latency.toFixed(2)),
    };

    console.log('[BENCHMARK]', benchmark);

    setResult({
      ...prediction,
      benchmark,
    });

  } catch (err) {
    console.error('[ONNX] Inference error:', err);
    setError('Deteksi gagal: ' + (err?.message ?? 'Error tidak diketahui'));
  } finally {
    setIsLoading(false);
  }
}, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { predict, result, isLoading, error, reset };
}
