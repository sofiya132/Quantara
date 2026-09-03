import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# QUANTARA - MEMBER 4 EXPLAINABILITY
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data" / "processed"
FEATURE_FILE = Path(__file__).resolve().parent / "feature_importance.json"


FEATURE_ORDER = [
    "Age",
    "ALB",
    "ALP",
    "ALT",
    "AST",
    "BIL",
    "CHE",
    "CHOL",
    "CREA",
    "GGT",
    "PROT",
    "Sex_m"
]

# FEATURE INFORMATION
def load_feature_information():

    with open(FEATURE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# LOAD DATA
def load_data():

    X_train = pd.read_csv(DATA_DIR / "X_train.csv")
    y_train = pd.read_csv(
        DATA_DIR / "y_train_binary.csv"
    ).iloc[:, 0].to_numpy()

    X_train = X_train[FEATURE_ORDER]

    return X_train, y_train
    
# CREATE CLASSICAL MODELS
def create_models():

    models = {

        "Logistic Regression":
            LogisticRegression(
                C=0.01,
                class_weight="balanced",
                solver="lbfgs",
                max_iter=2000,
                random_state=42
            ),

        "Random Forest":
            RandomForestClassifier(
                n_estimators=200,
                max_depth=5,
                class_weight="balanced",
                random_state=42
            ),

        "XGBoost":
            XGBClassifier(
                n_estimators=300,
                max_depth=4,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=1.0,
                objective="binary:logistic",
                eval_metric="logloss",
                scale_pos_weight=345 / 48,
                random_state=42
            )
    }

    return models
    
# TRAIN MODELS
def train_models(X_train, y_train):

    models = create_models()

    for name, model in models.items():

        print(f"Training {name}...")
        model.fit(X_train, y_train)

    return models
    
# PERMUTATION FEATURE IMPORTANCE
def calculate_feature_importance(model, X, y):

    result = permutation_importance(
        model,
        X,
        y,
        n_repeats=10,
        random_state=42,
        scoring="f1"
    )

    importance = result.importances_mean

    # Remove negative values
    importance = np.maximum(importance, 0)

    total = importance.sum()

    if total > 0:
        importance = importance / total

    return importance
    
# PATIENT-SPECIFIC CONTRIBUTION
def calculate_patient_contribution(
    model,
    patient,
    global_importance
):

    patient = patient[FEATURE_ORDER]

    # Compare patient values with training medians
    X_train, _ = load_data()

    medians = X_train.median()

    deviation = np.abs(
        patient.iloc[0] - medians
    ).to_numpy()

    # Normalize deviation
    if deviation.max() > 0:
        deviation = deviation / deviation.max()

    contribution = global_importance * deviation

    total = contribution.sum()

    if total > 0:
        contribution = contribution / total

    return contribution

# RISK LEVEL
def get_risk_level(probability):

    if probability >= 0.70:
        return "HIGH"

    elif probability >= 0.40:
        return "MODERATE"

    else:
        return "LOW"

# CONFIDENCE
def calculate_confidence(probability):

    return abs(probability - 0.5) * 2

# EXPLAIN PREDICTION
def explain_prediction(
    model,
    model_name,
    patient,
    threshold=0.50
):

    probability = float(
        model.predict_proba(patient)[0][1]
    )

    prediction = int(
        probability >= threshold
    )

    confidence = calculate_confidence(
        probability
    )

    risk = get_risk_level(
        probability
    )

    X_train, y_train = load_data()

    global_importance = calculate_feature_importance(
        model,
        X_train,
        y_train
    )

    patient_contribution = calculate_patient_contribution(
        model,
        patient,
        global_importance
    )

    feature_info = load_feature_information()

    explanations = []

    for i, feature in enumerate(FEATURE_ORDER):

        explanations.append({

            "feature": feature,

            "description":
                feature_info[feature]["description"],

            "category":
                feature_info[feature]["category"],

            "importance":
                float(global_importance[i]),

            "patient_contribution":
                float(patient_contribution[i])
        })

    explanations.sort(
        key=lambda x: x["patient_contribution"],
        reverse=True
    )

    return {

        "model": model_name,

        "probability":
            probability,

        "prediction":
            "POSITIVE"
            if prediction == 1
            else "NEGATIVE",

        "confidence":
            confidence,

        "risk_level":
            risk,

        "threshold":
            threshold,

        "top_features":
            explanations[:5],

        "all_features":
            explanations
    }

# WHY THIS PREDICTION?
def generate_prediction_reason(explanation):

    prediction = explanation["prediction"]
    probability = explanation["probability"]

    if prediction == "POSITIVE":

        reason = (
            f"The {explanation['model']} model estimated a "
            f"{probability:.2%} probability of the positive class, "
            f"which is above the decision threshold of "
            f"{explanation['threshold']:.2%}."
        )

    else:

        reason = (
            f"The {explanation['model']} model estimated a "
            f"{probability:.2%} probability of the positive class, "
            f"which is below the decision threshold of "
            f"{explanation['threshold']:.2%}."
        )

    return reason
    
# TEST
if __name__ == "__main__":

    print("=" * 70)
    print("QUANTARA - MEMBER 4 EXPLAINABILITY MODULE")
    print("=" * 70)

    X_train, y_train = load_data()

    models = train_models(
        X_train,
        y_train
    )

    # Example patient
    patient = pd.DataFrame([{

        "Age": 45,
        "ALB": 42.1,
        "ALP": 95.2,
        "ALT": 35.4,
        "AST": 31.2,
        "BIL": 0.8,
        "CHE": 7.2,
        "CHOL": 5.1,
        "CREA": 82.0,
        "GGT": 40.0,
        "PROT": 72.0,
        "Sex_m": 1

    }])

    print("\n===== EXPLAINABILITY ANALYSIS =====")

    # Use XGBoost for demonstration
    model_name = "XGBoost"

    explanation = explain_prediction(
        models[model_name],
        model_name,
        patient
    )

    print("\n===== PREDICTION =====")

    print(
        f"Model       : {model_name}"
    )

    print(
        f"Probability : "
        f"{explanation['probability']:.2%}"
    )

    print(
        f"Prediction  : "
        f"{explanation['prediction']}"
    )

    print(
        f"Confidence  : "
        f"{explanation['confidence']:.2%}"
    )

    print(
        f"Risk Level  : "
        f"{explanation['risk_level']}"
    )

    print("\n===== WHY THIS PREDICTION? =====")

    print(
        generate_prediction_reason(
            explanation
        )
    )

    print("\n===== TOP INFLUENCING FEATURES =====")

    for item in explanation["top_features"]:

        print(
            f"{item['feature']:6s} | "
            f"{item['description']:30s} | "
            f"{item['patient_contribution']:.2%}"
        )

    print("\n" + "=" * 70)
    print("EXPLAINABILITY ANALYSIS COMPLETE")
    print("=" * 70)
