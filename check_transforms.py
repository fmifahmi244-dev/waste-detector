import sys
try:
    from ultralytics.data.augment import ClassifyLetterBox
    print("ClassifyLetterBox exists")
except Exception as e:
    print(e)

try:
    from ultralytics import YOLO
    model = YOLO('public/best.onnx')
    print("Transforms:", model.transforms)
except Exception as e:
    print(e)
