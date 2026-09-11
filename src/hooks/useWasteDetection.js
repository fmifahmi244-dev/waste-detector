import { useState, useCallback, useRef } from 'react';
import * as ort from 'onnxruntime-web';

/**
 * useWasteDetection
 *
 * Inference menggunakan model YOLO11n-cls (ONNX) via onnxruntime-web.
 * Berjalan 100% di browser via WebAssembly — tidak ada server/API.
 *
 * Model info:
 *   - File    : /public/best.onnx
 *   - Input   : 'images'  → Float32[1, 3, 224, 224]
 *   - Output  : 'output0' → Float32[1, 3]
 *   - Classes : {0: 'Anorganik', 1: 'Organik', 2: 'Residu'}
 */

const MODEL_URL    = '/best.onnx';
const INPUT_NAME   = 'images';
const OUTPUT_NAME  = 'output0';
const IMG_SIZE     = 224;
const CLASS_LABELS = ['anorganik', 'organik', 'residu'];

// Konfigurasi ORT
ort.env.wasm.numThreads = 1; // single-thread, hindari SharedArrayBuffer requirement

// ── Helpers ────────────────────────────────────────────

function softmax(arr) {
  const max  = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum  = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

async function preprocessImage(source) {
  // Ambil dimensi asli gambar (bisa File, HTMLImageElement, atau HTMLVideoElement)
  let srcW, srcH;
  if (source instanceof File || source instanceof Blob) {
    const bmp = await createImageBitmap(source);
    srcW = bmp.width;
    srcH = bmp.height;
    source = bmp; // gunakan bmp sebagai source
  } else {
    srcW = source.naturalWidth || source.videoWidth || source.width;
    srcH = source.naturalHeight || source.videoHeight || source.height;
  }

  // Hitung center crop
  const size = Math.min(srcW, srcH);
  const startX = (srcW - size) / 2;
  const startY = (srcH - size) / 2;

  // Render crop area ke canvas 224x224
  const canvas = new OffscreenCanvas(IMG_SIZE, IMG_SIZE);
  const ctx = canvas.getContext('2d');
  
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(source, startX, startY, size, size, 0, 0, IMG_SIZE, IMG_SIZE);

  if (source instanceof ImageBitmap) {
    source.close();
  }

  const { data } = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);

  const total = IMG_SIZE * IMG_SIZE;
  const buf   = new Float32Array(3 * total);

  // Normalisasi YOLOv8 (hanya / 255.0)
  for (let i = 0; i < total; i++) {
    buf[0 * total + i] = data[i * 4]     / 255.0; // R
    buf[1 * total + i] = data[i * 4 + 1] / 255.0; // G
    buf[2 * total + i] = data[i * 4 + 2] / 255.0; // B
  }

  return buf;
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
  const buf    = await preprocessImage(source);
  const tensor = new ort.Tensor('float32', buf, [1, 3, IMG_SIZE, IMG_SIZE]);
  const output = await session.run({ [INPUT_NAME]: tensor });

  // FIX: Model YOLO ONNX sudah apply softmax internal (output sum = 1.0).
  // JANGAN apply softmax lagi — double softmax menyebabkan output stuck di 58/21/21.
  const probs  = Array.from(output[OUTPUT_NAME].data);
  const maxIdx = probs.indexOf(Math.max(...probs));

  console.debug('[ONNX] Probabilities (direct):', probs);

  return {
    label:      CLASS_LABELS[maxIdx],
    confidence: probs[maxIdx],
    scores:     CLASS_LABELS.map((lbl, i) => ({ label: lbl, score: probs[i] })),
  };
}

// ── Hook ───────────────────────────────────────────────

export function useWasteDetection() {
  const [result,    setResult]    = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const cacheRef = useRef(null);

  const predict = useCallback(async (imgEl) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      if (!cacheRef.current) {
        cacheRef.current = await loadSession();
      }
      const { ort, session } = cacheRef.current;
      const prediction = await runInference(ort, session, imgEl);
      setResult(prediction);
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
