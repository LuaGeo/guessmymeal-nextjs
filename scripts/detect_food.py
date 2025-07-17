"""
Optimized Python script for Next.js API, inspired by working Streamlit version.
"""
import sys
import json
import base64
from PIL import Image
from ultralytics import YOLO
import io
import os

# Suprimir prints do YOLO/Ultralytics
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

# Suprimir logs do Ultralytics
os.environ["YOLO_VERBOSE"] = "False"
os.environ["ULTRALYTICS_LOGGING"] = "False"

def detect_food(image_path, model_path):
    try:
        model = YOLO(model_path)

        # Direct detection
        results = model(image_path)

        # Annotated image from results
        annotated_image = Image.fromarray(results[0].plot())

        # Convert to base64
        buffer = io.BytesIO()
        annotated_image.save(buffer, format='JPEG')
        encoded_img = base64.b64encode(buffer.getvalue()).decode('utf-8')

        # Detection details
        detections = []
        if results[0].boxes is not None:
            for box in results[0].boxes:
                detections.append({
                    'class_name': model.names[int(box.cls.item())],
                    'confidence': float(box.conf.item()),
                    'bbox': [float(coord) for coord in box.xyxy[0].tolist()]
                })

        return {
            'success': True,
            'detections': detections,
            'annotated_image': encoded_img,
            'total_detections': len(detections)
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({'success': False, 'error': 'Usage: python detect_food.py <image_path> <model_path>'}))
        sys.exit(1)

    image_path, model_path = sys.argv[1], sys.argv[2]
    result = detect_food(image_path, model_path)
    print(json.dumps(result))
