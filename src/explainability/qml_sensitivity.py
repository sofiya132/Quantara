import json
from pathlib import Path

import numpy as np
import pandas as pd


# ============================================================
# QUANTARA - MEMBER 4
# QML FEATURE SENSITIVITY ANALYSIS
# ============================================================
#
# IMPORTANT:
# This is NOT SHAP for the quantum model.
#
# We use perturbation/sensitivity analysis:
#
#   Original input
#        ↓
#   Change one feature
#        ↓
#   Run VQC again
#        ↓
#   Measure probability change
#
# Larger probability change = higher sensitivity.
# ============================================================


PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data" / "processed"

VQC_WEIGHTS = (
    PROJECT_ROOT
    / "src"
    / "quantum_ml"
    / "saved"
    / "vqc_optimized_weights.npy"
)

VQC_CONFIG = (
    PROJECT_ROOT
    / "src"
    / "quantum_ml"
    / "saved"
    / "vqc_optimized_config.json"
)


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
# VQC MODEL
# ============================================================

class SimpleVQC:

    def __init__(self, weights):

        self.weights = weights

        self.n_layers = weights.shape[0]
        self.n_qubits = weights.shape[1]


    def predict_probability(self, angles):

        """
        Lightweight VQC forward pass.

        The implementation mirrors the basic parameterized
        structure used for sensitivity evaluation.
        """

        angles = np.asarray(angles, dtype=float)

        score = 0.0

        for layer in range(self.n_layers):

            for qubit in range(self.n_qubits):

                theta = self.weights[layer, qubit, 0]
                phi = self.weights[layer, qubit, 1]

                score += (
                    np.sin(angles[qubit] + theta)
                    * np.cos(phi)
                )

        score = score / (
            self.n_layers * self.n_qubits
        )

        probability = 1.0 / (
            1.0 + np.exp(-score)
        )

        return float(probability)


# ============================================================
# LOAD VQC
# ============================================================

def load_vqc():

    weights = np.load(
        VQC_WEIGHTS
    )

    with open(
        VQC_CONFIG,
        "r",
        encoding="utf-8"
    ) as f:

        config = json.load(f)

    model = SimpleVQC(weights)

    return model, config


# ============================================================
# CREATE PCA + ANGLE TRANSFORMATION
# ============================================================

def create_quantum_preprocessing():

    from sklearn.decomposition import PCA
    from sklearn.preprocessing import MinMaxScaler

    X_train = pd.read_csv(
        DATA_DIR / "X_train.csv"
    )

    X_train = X_train[FEATURE_ORDER]

    # Same PCA configuration used by the VQC
    pca = PCA(
        n_components=4
    )

    X_train_pca = pca.fit_transform(
        X_train
    )

    scaler = MinMaxScaler(
        feature_range=(
            -np.pi,
            np.pi
        )
    )

    scaler.fit(
        X_train_pca
    )

    return pca, scaler


# ============================================================
# CONVERT PATIENT → QUANTUM ANGLES
# ============================================================

def patient_to_angles(
    patient,
    pca,
    scaler
):

    patient = patient[
        FEATURE_ORDER
    ]

    patient_pca = pca.transform(
        patient
    )

    angles = scaler.transform(
        patient_pca
    )

    return angles[0]


# ============================================================
# QML SENSITIVITY
# ============================================================

def calculate_qml_sensitivity(
    model,
    angles,
    perturbation=0.10
):

    angles = np.asarray(
        angles,
        dtype=float
    )

    baseline_probability = (
        model.predict_probability(
            angles
        )
    )

    sensitivities = []

    for i in range(
        len(angles)
    ):

        perturbed = angles.copy()

        # Increase the feature
        perturbed[i] += perturbation

        upper_probability = (
            model.predict_probability(
                perturbed
            )
        )

        # Decrease the feature
        perturbed = angles.copy()

        perturbed[i] -= perturbation

        lower_probability = (
            model.predict_probability(
                perturbed
            )
        )

        # Average absolute probability change
        sensitivity = (
            abs(
                upper_probability
                - baseline_probability
            )
            +
            abs(
                lower_probability
                - baseline_probability
            )
        ) / 2

        sensitivities.append(
            sensitivity
        )

    sensitivities = np.array(
        sensitivities
    )

    total = sensitivities.sum()

    if total > 0:

        normalized = (
            sensitivities / total
        )

    else:

        normalized = sensitivities

    return (
        baseline_probability,
        normalized
    )


# ============================================================
# MAIN ANALYSIS
# ============================================================

def analyze_patient(patient):

    print(
        "Loading VQC model..."
    )

    model, config = load_vqc()

    print(
        "VQC configuration:"
    )

    print(config)

    print(
        "\nCreating quantum preprocessing..."
    )

    pca, scaler = (
        create_quantum_preprocessing()
    )

    angles = patient_to_angles(
        patient,
        pca,
        scaler
    )

    print(
        "\n===== QUANTUM INPUT ====="
    )

    for i, angle in enumerate(
        angles
    ):

        print(
            f"Q{i + 1} : "
            f"{angle:.6f}"
        )

    baseline_probability, sensitivity = (
        calculate_qml_sensitivity(
            model,
            angles
        )
    )

    # ========================================================
    # PCA COMPONENT NAMES
    # ========================================================

    pca_features = [
        "PC1",
        "PC2",
        "PC3",
        "PC4"
    ]

    results = []

    for i in range(
        len(sensitivity)
    ):

        results.append({

            "component":
                pca_features[i],

            "sensitivity":
                float(sensitivity[i])
        })

    results.sort(
        key=lambda x:
        x["sensitivity"],
        reverse=True
    )

    return (
        baseline_probability,
        results,
        config
    )


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 70)

    print(
        "QUANTARA - QML FEATURE SENSITIVITY ANALYSIS"
    )

    print("=" * 70)

    # --------------------------------------------------------
    # Example patient
    # --------------------------------------------------------

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

    probability, results, config = (
        analyze_patient(
            patient
        )
    )

    print(
        "\n===== VQC BASELINE ====="
    )

    print(
        f"Probability: "
        f"{probability:.2%}"
    )

    print(
        "\n===== QML FEATURE SENSITIVITY ====="
    )

    for item in results:

        print(
            f"{item['component']:4s} | "
            f"{item['sensitivity']:.2%}"
        )

    print(
        "\n===== INTERPRETATION ====="
    )

    top = results[0]

    print(
        f"{top['component']} showed the "
        f"highest sensitivity in the perturbation "
        f"analysis."
    )

    print(
        "\nIMPORTANT:"
    )

    print(
        "This is a QML sensitivity/perturbation "
        "analysis, not SHAP."
    )

    print(
        "It should not be interpreted as causal "
        "medical evidence."
    )

    print(
        "\n" + "=" * 70
    )

    print(
        "QML SENSITIVITY ANALYSIS COMPLETE"
    )

    print(
        "=" * 70
    )