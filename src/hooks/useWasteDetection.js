import { useState, useCallback, useRef } from 'react';
import * as ort from 'onnxruntime-web';

/**
 * useWasteDetection
 *
 * Inference menggunakan model YOLO26s-cls (ONNX) via onnxruntime-web.
 * Berjalan 100% di browser via WebAssembly — tidak ada server/API.
 *
 * Model Preprocessing:
 *   - Auto-Orient : Handled via createImageBitmap (dipertahankan)
 *   - Crop        : Dihapus (seluruh gambar penuh diskalakan ke 224x224)
 *   - Color       : Warna asli RGB penuh (Grayscale Roboflow dihapus)
 *   - Skala       : Float32 [0.0, 1.0] (dibagi 255.0)
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

  // 2. Resize langsung ke 224x224 piksel (TANPA CROP, skala seluruh gambar)
  const canvas = new OffscreenCanvas(IMG_SIZE, IMG_SIZE);
  const ctx = canvas.getContext('2d');
  
  // Render seluruh gambar ke kanvas 224x224
  ctx.drawImage(imgSource, 0, 0, IMG_SIZE, IMG_SIZE);

  if (imgSource instanceof ImageBitmap) {
    imgSource.close();
  }

  // 3. Warna RGB murni (Grayscale Roboflow dihapus)
  const { data } = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
  const total = IMG_SIZE * IMG_SIZE;
  const buf   = new Float32Array(3 * total);

  for (let i = 0; i < total; i++) {
    buf[0 * total + i] = data[i * 4]     / 255.0; // Channel R
    buf[1 * total + i] = data[i * 4 + 1] / 255.0; // Channel G
    buf[2 * total + i] = data[i * 4 + 2] / 255.0; // Channel B
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
