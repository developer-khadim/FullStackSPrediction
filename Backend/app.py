from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import io
import base64
import numpy as np
import os

# Direct imports for TensorFlow 2.x (these work despite linter errors)
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import img_to_array

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# Load trained CNN model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "saus_mobilenetv2_final.keras")
model = None
CLASS_NAMES = [
    "Auditorium",
    "Classrooms",
    "Ground",
    "Indoor_Places",
    "Labs",
    "Office",
    "Outdoor_Places",
]


def load_model_once():
    global model
    if model is None:
        try:
            model = load_model(MODEL_PATH)
            print(f"Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise e

def visualize_single_prediction(img, model, true_class=None, img_height=128, img_width=128):
    # Preprocess the image
    img = img.resize((img_height, img_width))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    # Make prediction
    prediction = model.predict(img_array, verbose=0)[0][0]
    predicted_class = "OUTDOOR" if prediction > 0.5 else "INDOOR"

    # Create visualization
    plt.figure(figsize=(6, 6))
    plt.imshow(img)
    title = f"Predicted: {predicted_class} ({prediction:.2f})"
    if true_class:
        title = f"True: {true_class}\n{title}"
    plt.title(title)
    plt.axis('off')
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close()
    buffer.seek(0)

    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return predicted_class, float(prediction), img_base64

@app.route("/")
def home():
    return jsonify({"message": "SAUS Campus Scene Classification API", "status": "running"})

@app.route("/predict", methods=["POST"])
def predict():
    global model
    if model is None:
        try:
            load_model_once()
        except Exception as e:
            return jsonify({"error": f"Model loading failed: {str(e)}"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        img = Image.open(file.stream).convert("RGB")
        
        # Get prediction without visualization for faster response
        img_resized = img.resize((128, 128))
        img_array = img_to_array(img_resized)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        # Ensure model is loaded before prediction
        if model is None:
            load_model_once()
            
        # Make prediction for all 7 classes
        predictions = model.predict(img_array, verbose=0)[0]
        predicted_class_idx = np.argmax(predictions)
        predicted_class = CLASS_NAMES[predicted_class_idx]
        confidence = float(predictions[predicted_class_idx])
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions)[-3:][::-1]
        top_3_predictions = [
            {
                "class": CLASS_NAMES[i],
                "confidence": float(predictions[i])
            }
            for i in top_3_indices
        ]
        
        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence,
            "top_3_predictions": top_3_predictions
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/health")
def health():
    global model
    if model is None:
        try:
            load_model_once()
            return jsonify({"status": "healthy", "model_loaded": True})
        except Exception as e:
            return jsonify({"status": "unhealthy", "model_loaded": False, "error": str(e)}), 500
    else:
        return jsonify({"status": "healthy", "model_loaded": True})

if __name__ == "__main__":
    # Load model on startup
    try:
        load_model_once()
        print("Model loaded successfully on startup")
    except Exception as e:
        print(f"Failed to load model on startup: {str(e)}")
    
    app.run(debug=True, host="0.0.0.0", port=5000)