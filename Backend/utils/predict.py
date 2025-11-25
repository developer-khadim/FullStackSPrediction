import numpy as np
import matplotlib.pyplot as plt
import base64, io
from tensorflow.keras.preprocessing import image

def visualize_single_prediction(img, model, img_height=128, img_width=128):
    # Resize & preprocess
    img_resized = img.resize((img_height, img_width))
    img_array = image.img_to_array(img_resized) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    prediction = model.predict(img_array)[0][0]
    predicted_class = "OUTDOOR" if prediction > 0.5 else "INDOOR"

    # Create visualization
    plt.figure(figsize=(6, 6))
    plt.imshow(img)
    plt.title(f"Predicted: {predicted_class} ({prediction:.2f})")
    plt.axis("off")

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()
    buffer.seek(0)

    img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return predicted_class, float(prediction), img_base64
