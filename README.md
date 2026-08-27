# Quantara

A hybrid quantum-classical machine learning platform for **early disease detection using biomedical data**. The project combines classical ML, quantum ML, explainable AI, and model benchmarking into an interactive web platform.

## ✨ Features

* 🧹 Biomedical data preprocessing and feature selection
* 🤖 Classical ML models for baseline prediction
* ⚛️ Hybrid Quantum Machine Learning using variational quantum circuits
* 📊 Classical ML vs QML performance benchmarking
* 🔍 Explainable predictions using feature importance and SHAP
* ⚡ Quantum feasibility analysis
* 🌐 Interactive web dashboard for prediction and visualization

## 🏗️ Architecture

```text
                    Biomedical Data
                          │
                          ▼
              Preprocessing & Feature
                    Selection
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       Classical ML                 Hybrid QML
             │                         │
             └────────────┬────────────┘
                          ▼
                Model Benchmarking
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       Explainability           Quantum Feasibility
             │                         │
             └────────────┬────────────┘
                          ▼
                  Web Dashboard
```

## 🛠️ Tech Stack

| Category             | Technologies                         |
| -------------------- | ------------------------------------ |
| **Language**         | Python, JavaScript                   |
| **Machine Learning** | Pandas, NumPy, Scikit-learn, XGBoost |
| **Quantum ML**       | Qiskit, PennyLane                    |
| **Explainability**   | SHAP                                 |
| **Backend**          | FastAPI / Flask                      |
| **Frontend**         | React                                |
| **Tools**            | Git, GitHub, Jupyter, VS Code        |

## 📊 Model Evaluation

The classical and quantum models are evaluated using common performance metrics:

* Accuracy
* Precision
* Recall
* F1 Score
* ROC-AUC
* Sensitivity
* Specificity
* Training & inference time

QML is additionally evaluated based on:

* Qubit requirements
* Circuit depth
* Noise sensitivity
* Hardware feasibility

## 📁 Project Structure

```text
hybrid-qml-disease-detection/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── preprocessing/
├── classical_ml/
├── quantum_ml/
├── explainability/
├── benchmarking/
├── backend/
├── frontend/
├── notebooks/
├── results/
├── docs/
│
├── requirements.txt
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd hybrid-qml-disease-detection
```

### Create Virtual Environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

Place the raw dataset in:

```text
data/raw/
```

> Do not commit sensitive patient information or personally identifiable healthcare data.

## 🌱 Development

The project follows a feature-branch workflow:

```text
main
├── feature/data-preprocessing
├── feature/classical-ml
├── feature/quantum-ml
├── feature/explainability
├── feature/frontend-backend
└── feature/benchmarking
```

Create a branch:

```bash
git checkout -b feature/your-feature
```

Commit and push your changes:

```bash
git add .
git commit -m "Add your changes"
git push origin feature/your-feature
```


## ⚠️ Disclaimer

This project is developed for **research, educational, and hackathon purposes** and is not intended to replace professional medical diagnosis or clinical decision-making.

---

⭐ **Exploring the practical potential of hybrid quantum-classical machine learning in healthcare.**
