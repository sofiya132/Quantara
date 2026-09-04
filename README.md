# Quantara ⚛️

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/fastapi-%23009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PennyLane](https://img.shields.io/badge/PennyLane-8A2BE2?style=for-the-badge&logo=quantconnect&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

A hybrid quantum-classical ML platform that predicts disease risk from biomedical data. Every patient record is run through **classical models (Logistic Regression, Random Forest, XGBoost)** and an **optimized 4-qubit Variational Quantum Classifier**, then routed to whichever performs best — with full explainability and quantum feasibility analysis along the way.

**Built for Smart India Hackathon 2026 — Problem Statement SIH26139**

---

## 📝 Problem Statement

Early disease detection from biomedical markers is typically approached with classical ML alone, with little transparency into whether emerging quantum methods are actually viable for healthcare data today. This project builds both approaches side-by-side — a classical benchmark and a working quantum classifier — and honestly evaluates which one performs better and whether the quantum model is practically feasible under current NISQ-era constraints.

---

## ⚙️ How It Works

1. **Preprocessing** — Raw HCV biomarker data is cleaned, imputed, and scaled; the top 8 predictive features are selected.
2. **Classical Models** — Logistic Regression, Random Forest, and XGBoost are trained as baselines.
3. **Quantum Model** — Features are PCA-reduced to 4 components, angle-encoded, and passed through a 5-layer variational quantum circuit (PennyLane).
4. **Adaptive Routing** — Each patient's prediction is routed to the model with the strongest combined confidence + historical performance score.
5. **Explainability** — Classical predictions are explained via permutation importance; the quantum model via latent-space sensitivity analysis.

---

## 📊 Model Performance

| Model | Accuracy | F1 Score | ROC-AUC |
|---|---|---|---|
| Logistic Regression | 98.37% | 92.86% | 98.64% |
| Random Forest | 98.37% | 92.86% | 99.20% |
| **XGBoost** 🏆 | **99.19%** | **96.55%** | **99.75%** |
| Optimized 4-Qubit VQC | 83.74% | 41.18% | 81.42% |

> Classical ML currently outperforms the quantum model — Quantara does not claim quantum advantage. It exists to benchmark and demonstrate feasibility, not to overstate results.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI (Python) REST API |
| Database | SQLite |
| Classical ML | scikit-learn, XGBoost |
| Quantum ML | PennyLane (`default.qubit` simulator) |
| Data Processing | pandas, numpy, PCA |
| Explainability | Permutation Importance, QML Sensitivity Analysis |
| Version Control | GitHub |

---

## ⚛️ Quantum Model Details

| Parameter | Value |
|---|---|
| Qubits | 4 |
| PCA components | 4 |
| Variational layers | 5 |
| Encoding | Dual-angle |
| Entanglement | Ring CNOT |
| Training epochs | 50 (best at epoch 32) |
| Decision threshold | 0.54 |

---

## 💻 Local Setup

### Prerequisites
- Python 3.11
- Node.js + npm
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/sofiya132/Quantara.git
cd Quantara
```

### Step 2 — Create virtual environment
```bash
py -3.11 -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### Step 3 — Install backend dependencies
```bash
pip install fastapi uvicorn pandas numpy scikit-learn xgboost pennylane
```

### Step 4 — Run the FastAPI server
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

You should see:
```
Backend running on http://localhost:8000
API docs available at http://localhost:8000/docs
```

### Step 5 — Install & run the frontend
```bash
cd frontend
npm install
npm run dev
```

Vite will print the local frontend address.

---

## 📁 Project Structure

```
Quantara/
│
├── backend/
│   ├── main.py                 ← FastAPI app entry point
│   ├── models.py
│   ├── routes/
│   │   ├── predict.py          ← Prediction endpoint
│   │   ├── benchmarks.py
│   │   ├── dataset.py
│   │   └── history.py
│   └── services/
│       ├── ml_service.py
│       └── history_service.py
│
├── src/
│   ├── classical_models.py
│   ├── evaluation.py
│   ├── preprocessing/
│   ├── explainability/
│   │   ├── engine.py
│   │   ├── model_router.py
│   │   └── qml_sensitivity.py
│   └── quantum_ml/
│       ├── quantum_circuit.py
│       ├── vqc.py
│       ├── vqc_optimized.py
│       └── saved/              ← trained weights + config
│
├── data/
│   ├── raw/hcvdat0.csv
│   └── processed/
│
├── results/                    ← benchmark + feasibility CSVs
├── notebooks/
├── docs/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   └── api.js
    └── package.json
```

---

## 🔄 Prediction Flow

```
Patient enters biomedical data
            ↓
     Preprocessing
            ↓
   ┌────────┴────────┐
Classical Models   Quantum VQC
   └────────┬────────┘
            ↓
   Adaptive Model Routing
            ↓
     Risk Prediction
            ↓
      Explainability
            ↓
    Prediction History
```

---

## ⚕️ Disclaimer

Quantara is built for research, educational, and hackathon purposes only. It is not a medical device and must not be used as the sole basis for medical diagnosis or treatment decisions. No real patient data, PII, or PHI should be added to this repository.

---

**Quantara** — SIH26139
