import sys
from pathlib import Path

import pandas as pd


# ============================================================
# QUANTARA - MEMBER 4
# UNIFIED EXPLAINABILITY + ADAPTIVE INTELLIGENCE
# ============================================================


CURRENT_DIR = Path(__file__).resolve().parent

PROJECT_ROOT = CURRENT_DIR.parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(
        0,
        str(PROJECT_ROOT)
    )


# ============================================================
# IMPORT MEMBER 4 MODULES
# ============================================================

from src.explainability.explainability import (
    load_data,
    train_models,
    explain_prediction,
    generate_prediction_reason
)

from src.explainability.model_router import (
    route_models,
    print_router_result,
    generate_model_reason
)


# ============================================================
# FEATURE ORDER
# ============================================================

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


# ============================================================
# CREATE PATIENT
# ============================================================

def create_sample_patient():

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

    return patient[
        FEATURE_ORDER
    ]


# ============================================================
# GET MODEL PROBABILITIES
# ============================================================

def get_model_probabilities(
    models,
    patient
):

    probabilities = {}

    for model_name, model in models.items():

        probability = float(
            model.predict_proba(
                patient
            )[0][1]
        )

        probabilities[
            model_name
        ] = probability

    return probabilities


# ============================================================
# ANALYZE PATIENT
# ============================================================

def analyze_patient(
    patient
):

    print(
        "\n" + "=" * 70
    )

    print(
        "QUANTARA - MEMBER 4 UNIFIED INTELLIGENCE"
    )

    print(
        "=" * 70
    )

    # --------------------------------------------------------
    # TRAIN CLASSICAL MODELS
    # --------------------------------------------------------

    print(
        "\n===== TRAINING CLASSICAL MODELS ====="
    )

    X_train, y_train = load_data()

    models = train_models(
        X_train,
        y_train
    )

    # --------------------------------------------------------
    # GET PROBABILITIES
    # --------------------------------------------------------

    print(
        "\n===== MODEL PREDICTIONS ====="
    )

    classical_probabilities = (
        get_model_probabilities(
            models,
            patient
        )
    )

    for model_name, probability in (
        classical_probabilities.items()
    ):

        print(
            f"{model_name:22s}: "
            f"{probability:.2%}"
        )

    # --------------------------------------------------------
    # ADAPTIVE ROUTING
    # --------------------------------------------------------

    print(
        "\n===== ADAPTIVE MODEL ROUTING ====="
    )

    routing_result = route_models(
        classical_probabilities
    )

    print_router_result(
        routing_result
    )

    # --------------------------------------------------------
    # SELECTED MODEL
    # --------------------------------------------------------

    selected_model_name = (
        routing_result[
            "selected_model"
        ]
    )

    selected_model = models[
        selected_model_name
    ]

    # --------------------------------------------------------
    # EXPLAIN SELECTED MODEL
    # --------------------------------------------------------

    explanation = explain_prediction(

        selected_model,

        selected_model_name,

        patient

    )

    # --------------------------------------------------------
    # WHY THIS PREDICTION
    # --------------------------------------------------------

    prediction_reason = (
        generate_prediction_reason(
            explanation
        )
    )

    # --------------------------------------------------------
    # FINAL REPORT
    # --------------------------------------------------------

    report = {

        "selected_model":
            selected_model_name,

        "probability":
            explanation[
                "probability"
            ],

        "prediction":
            explanation[
                "prediction"
            ],

        "confidence":
            explanation[
                "confidence"
            ],

        "risk_level":
            explanation[
                "risk_level"
            ],

        "threshold":
            explanation[
                "threshold"
            ],

        "why_prediction":
            prediction_reason,

        "why_model":
            generate_model_reason(
                routing_result
            ),

        "top_features":
            explanation[
                "top_features"
            ],

        "model_comparison":
            routing_result[
                "model_comparison"
            ]

    }

    return report


# ============================================================
# PRINT FINAL REPORT
# ============================================================

def print_final_report(
    report
):

    print(
        "\n" + "=" * 70
    )

    print(
        "QUANTARA - FINAL EXPLAINABILITY REPORT"
    )

    print(
        "=" * 70
    )

    print(
        "\n===== FINAL DECISION ====="
    )

    print(
        f"Selected Model : "
        f"{report['selected_model']}"
    )

    print(
        f"Probability    : "
        f"{report['probability']:.2%}"
    )

    print(
        f"Prediction     : "
        f"{report['prediction']}"
    )

    print(
        f"Confidence     : "
        f"{report['confidence']:.2%}"
    )

    print(
        f"Risk Level     : "
        f"{report['risk_level']}"
    )

    print(
        f"Threshold      : "
        f"{report['threshold']:.2%}"
    )

    # --------------------------------------------------------
    # WHY PREDICTION
    # --------------------------------------------------------

    print(
        "\n===== WHY THIS PREDICTION? ====="
    )

    print(
        report[
            "why_prediction"
        ]
    )

    # --------------------------------------------------------
    # TOP FEATURES
    # --------------------------------------------------------

    print(
        "\n===== TOP INFLUENCING FEATURES ====="
    )

    for item in report[
        "top_features"
    ]:

        print(

            f"{item['feature']:6s} | "

            f"{item['description']:30s} | "

            f"{item['patient_contribution']:.2%}"

        )

    # --------------------------------------------------------
    # WHY MODEL
    # --------------------------------------------------------

    print(
        "\n===== WHY THIS MODEL? ====="
    )

    print(
        report[
            "why_model"
        ]
    )

    print(
        "\n" + "=" * 70
    )

    print(
        "UNIFIED INTELLIGENCE COMPLETE"
    )

    print(
        "=" * 70
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    patient = (
        create_sample_patient()
    )

    print(
        "\n===== PATIENT INPUT ====="
    )

    print(
        patient.to_string(
            index=False
        )
    )

    report = analyze_patient(
        patient
    )

    print_final_report(
        report
    )