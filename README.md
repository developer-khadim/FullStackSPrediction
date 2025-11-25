## FullStack SAUS Prediction

> Smart Academic & University Spaces (SAUS) classifier powered by MobileNetV2 + Vite/React, delivering instant campus-scene recognition with a polished UX.

| Backend | Frontend | Deep Learning |
| --- | --- | --- |
| Flask + TensorFlow 2.20 | React 19 + Vite + Tailwind | Transfer-learned MobileNetV2 |

**Quick Links**
- 📂 [Dataset (Drive)](https://drive.google.com/drive/folders/1kJsJl5Y4HG4ntQB1MOQ6HSfKTSTn5QBZ?usp=sharing) — curated by **Khadim Ali**
- 📘 [Project Report](Frontend/src/Report/Deep-Learning-Project-Report.pdf)
- 📓 [Training Notebook](DeepLearning/SAUS.ipynb)

---

### Table of Contents
1. [Highlights](#highlights)
2. [Repository Layout](#repository-layout)
3. [Prerequisites](#prerequisites)
4. [Run the Backend](#run-the-backend-flask--tensorflow)
5. [Run the Frontend](#run-the-frontend-vite--react)
6. [API Contract](#api-contract)
7. [Model & Data Notes](#model--data-notes)
8. [Tech Stack](#tech-stack)
9. [Deployment Tips](#deployment-tips)
10. [Next Steps](#next-steps)

---

### Highlights
- **MobileNetV2 model** trained on Auditorium, Classroom, Ground, Indoor, Lab, Office, and Outdoor campus spaces.
- **Flask inference API** with `/predict` and `/health` endpoints, top-3 confidences, and lazy model loading.
- **React + Tailwind UI** with authentication stubs, modern visuals, preview modal, and live charting via Chart.js.
- **Dataset-ready structure** (`SAUS/Train|Val|Test`) for further fine-tuning or benchmarking.
- **Report & notebook artifacts** (`DeepLearning/SAUS.ipynb`, `Frontend/src/Report/Deep-Learning-Project-Report.pdf`).

---

### Repository Layout
```
Backend/          # Flask API + TensorFlow model + SAUS dataset splits
DeepLearning/     # Training notebooks and saved Keras weights
Frontend/         # Vite + React client (TailwindCSS, chart.js)
Report/           # Documentation or presentation assets
README.md         # You are here
```

---

### Prerequisites
- Python ≥ 3.10 with virtualenv support
- Node.js ≥ 18 and npm
- (Optional) GPU-enabled TensorFlow environment for retraining

---

### Run the Backend (Flask + TensorFlow)
```bash
cd Backend
python -m venv .venv && .venv\Scripts\activate     # win (use `source .venv/bin/activate` on mac/linux)
pip install -r requirements.txt
python app.py                                      # serves :5000 with /predict and /health
```
- The shipped `model/saus_mobilenetv2_final.keras` loads automatically. Replace it with a new checkpoint if you
  retrain in `DeepLearning/SAUS.ipynb`.
- Update `MODEL_PATH` inside `Backend/app.py` if you rename or relocate weights.

---

### Run the Frontend (Vite + React)
```bash
cd Frontend
npm install
npm run dev                                        # serves :5173 by default
```
- The predictor modal posts to `http://localhost:5000/predict`. Point to another host/port by updating the fetch
  URL inside `src/components/SausPre.jsx` (wrap it with an env variable if deploying).

---

### API Contract
`POST /predict`
```
Body: multipart/form-data  field: file=<image/jpeg|png>
Response 200:
{
  "predicted_class": "Labs",
  "confidence": 0.94,
  "top_3_predictions": [
    {"class": "Labs", "confidence": 0.94},
    {"class": "Classrooms", "confidence": 0.03},
    {"class": "Indoor_Places", "confidence": 0.02}
  ]
}
```
Common errors: `400` (no file), `500` (model missing/corrupt). Use `GET /health` to verify weights were loaded.

---

### Model & Data Notes
- MobileNetV2 backbone fine-tuned on the curated SAUS dataset (train/val/test splits under `Backend/SAUS/`).
- Input resolution: `128x128`, RGB, normalized to `[0,1]`.
- Training notebook (`DeepLearning/SAUS.ipynb`) covers data augmentation, transfer learning strategy, and includes
  tooling for exporting `.keras` weights plus inference visualizations.
- Full dataset (raw captures + splits) lives in this shared Drive: [SAUS Dataset](https://drive.google.com/drive/folders/1kJsJl5Y4HG4ntQB1MOQ6HSfKTSTn5QBZ?usp=sharing).

---

### Tech Stack
- **Backend:** Flask, TensorFlow, NumPy, Pillow, Matplotlib
- **Frontend:** React, Vite, TailwindCSS, Chart.js, React Router, Lucide Icons
- **Tooling:** ESLint, PostCSS, npm scripts, virtualenv
- **Models:** `.keras` checkpoints (`best_mobilenetv2_saus.keras`, `saus_mobilenetv2_final.keras`)

---

### Credits
- **Dataset Author:** Khadim Ali
- **Project Developer:** Khadim Ali

---

### Deployment Tips
- Serve the Flask app with Gunicorn/Waitress behind nginx or Azure App Service.
- Store large `.keras` weights in object storage (S3, Azure Blob) and download at container startup if needed.
- Enable HTTPS for the frontend and turn the predictor URL into an environment-driven config.
- Add authentication (already scaffolded via `AuthContext`) before exposing the predictor publicly.

---

### Next Steps
- Replace the hardcoded API base URL with Vite env variables.
- Automate model re-training and evaluation via CI.
- Expand dataset with more SAUS categories or varied lighting conditions to boost generalization.
