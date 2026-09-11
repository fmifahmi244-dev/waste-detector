import onnxruntime as ort
import cv2
import numpy as np

# Load model
session = ort.InferenceSession('public/best.onnx')

def preprocess_yolo(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # 1. Resize shortest edge to 224
    h, w = img.shape[:2]
    if h < w:
        new_h, new_w = 224, int(w * 224 / h)
    else:
        new_h, new_w = int(h * 224 / w), 224
    img = cv2.resize(img, (new_w, new_h))
    
    # 2. Center crop to 224x224
    h, w = img.shape[:2]
    start_x = (w - 224) // 2
    start_y = (h - 224) // 2
    img = img[start_y:start_y+224, start_x:start_x+224]
    
    # 3. Normalize to [0, 1]
    img = img.astype(np.float32) / 255.0
    
    # Check if we should use ImageNet mean/std?
    # YOLO classification models default normalization: no ImageNet mean/std!
    # Wait, let's test both and print outputs.
    
    # Transpose to [C, H, W]
    img_no_norm = np.transpose(img, (2, 0, 1))
    
    # ImageNet norm
    mean = np.array([0.485, 0.456, 0.406]).reshape(1, 1, 3)
    std = np.array([0.229, 0.224, 0.225]).reshape(1, 1, 3)
    img_norm = (img - mean) / std
    img_norm = np.transpose(img_norm, (2, 0, 1)).astype(np.float32)
    
    return np.expand_dims(img_no_norm, axis=0).astype(np.float32), np.expand_dims(img_norm, axis=0)

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

# Create a dummy image (e.g., all 128s) to see what happens
cv2.imwrite('test.jpg', np.full((300, 400, 3), 128, dtype=np.uint8))

t_no_norm, t_norm = preprocess_yolo('test.jpg')

out_no_norm = session.run(['output0'], {'images': t_no_norm})[0]
out_norm = session.run(['output0'], {'images': t_norm})[0]

print("No norm raw:", out_no_norm)
print("No norm softmax:", softmax(out_no_norm))

print("With norm raw:", out_norm)
print("With norm softmax:", softmax(out_norm))

