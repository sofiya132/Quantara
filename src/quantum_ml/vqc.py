import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parent)
)

import json
import pandas as pd
import pennylane as qml
from pennylane import numpy as np

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
)

from qml_preprocessing import (
    X_train_4,
    X_val_4,
    X_test_4,
    y_train,
    y_val,
    y_test,
)

from quantum_circuit import (
    quantum_circuit,
    N_QUBITS,
    N_LAYERS,
)


# ==================================================
# 1. Prediction function
# ==================================================

def predict_probability(features, weights):

    expectation = quantum_circuit(
        features,
        weights
    )

    # Convert [-1, +1] to [0, 1]
    probability = (expectation + 1) / 2

    return probability


# ==================================================
# 2. Class weights
# ==================================================

class_0_count = np.sum(y_train == 0)
class_1_count = np.sum(y_train == 1)

total = len(y_train)

weight_0 = total / (2 * class_0_count)
weight_1 = total / (2 * class_1_count)

print("Class weights:")
print("Class 0:", float(weight_0))
print("Class 1:", float(weight_1))


# ==================================================
# 3. Weighted binary cross entropy
# ==================================================

def weighted_binary_cross_entropy(
    predictions,
    targets
):

    eps = 1e-7

    predictions = np.clip(
        predictions,
        eps,
        1 - eps
    )

    sample_weights = np.where(
        targets == 1,
        weight_1,
        weight_0
    )

    loss = -sample_weights * (
        targets * np.log(predictions)
        +
        (1 - targets)
        * np.log(1 - predictions)
    )

    return np.mean(loss)


# ==================================================
# 4. Get probabilities
# ==================================================

def get_probabilities(
    X,
    weights
):

    probabilities = np.array([
        predict_probability(
            X[i],
            weights
        )
        for i in range(len(X))
    ])

    return probabilities


# ==================================================
# 5. Training loss
# ==================================================

def training_cost(weights):

    probabilities = get_probabilities(
        X_train_4,
        weights
    )

    return weighted_binary_cross_entropy(
        probabilities,
        y_train
    )


# ==================================================
# 6. Validation loss
# ==================================================

def validation_cost(weights):

    probabilities = get_probabilities(
        X_val_4,
        weights
    )

    return weighted_binary_cross_entropy(
        probabilities,
        y_val
    )


# ==================================================
# 7. Find best threshold using VALIDATION only
# ==================================================

def find_best_threshold(
    probabilities,
    targets
):

    best_threshold = 0.5
    best_f1 = -1

    for threshold in np.arange(
        0.10,
        0.91,
        0.01
    ):

        predictions = (
            probabilities >= threshold
        ).astype(int)

        score = f1_score(
            targets,
            predictions,
            zero_division=0
        )

        if score > best_f1:

            best_f1 = score
            best_threshold = float(
                threshold
            )

    return best_threshold, best_f1


# ==================================================
# 8. Main training
# ==================================================

if __name__ == "__main__":

    np.random.seed(42)

    # ------------------------------------------------
    # Initialize quantum weights
    # ------------------------------------------------

    weights = np.array(
        0.01 * np.random.randn(
            N_LAYERS,
            N_QUBITS,
            2
        ),
        requires_grad=True
    )

    print("\nWeight shape:")
    print(weights.shape)

    # ------------------------------------------------
    # Optimizer
    # ------------------------------------------------

    optimizer = qml.AdamOptimizer(
        stepsize=0.05
    )

    epochs = 30

    # ------------------------------------------------
    # Track best model
    # ------------------------------------------------

    best_val_f1 = -1
    best_val_loss = float("inf")
    best_threshold = 0.5
    best_weights = None
    best_epoch = 0

    print("\nStarting VQC training...")

    print(
        "Training samples:",
        len(X_train_4)
    )

    print(
        "Validation samples:",
        len(X_val_4)
    )

    print(
        "Test samples:",
        len(X_test_4)
    )

    print("\n----------------------------------------")

    # ==================================================
    # Training loop
    # ==================================================

    for epoch in range(epochs):

        weights, train_loss = (
            optimizer.step_and_cost(
                training_cost,
                weights
            )
        )

        # ----------------------------------------------
        # Validation
        # ----------------------------------------------

        val_probabilities = get_probabilities(
            X_val_4,
            weights
        )

        val_loss = weighted_binary_cross_entropy(
            val_probabilities,
            y_val
        )

        # Find best threshold ONLY on validation data
        threshold, val_f1 = find_best_threshold(
            val_probabilities,
            y_val
        )

        print(
            f"Epoch {epoch + 1:02d}/{epochs} "
            f"| Train Loss: "
            f"{float(train_loss):.6f} "
            f"| Val Loss: "
            f"{float(val_loss):.6f} "
            f"| Val F1: "
            f"{val_f1:.4f} "
            f"| Threshold: "
            f"{threshold:.2f}"
        )

        # ----------------------------------------------
        # Save best model
        # ----------------------------------------------

        if val_f1 > best_val_f1:

            best_val_f1 = val_f1
            best_val_loss = float(val_loss)
            best_threshold = threshold
            best_epoch = epoch + 1

            best_weights = np.array(
                weights,
                requires_grad=False
            )

    print("----------------------------------------")

    print("\nTraining completed.")

    print(
        "Best epoch:",
        best_epoch
    )

    print(
        "Best validation loss:",
        best_val_loss
    )

    print(
        "Best validation F1:",
        best_val_f1
    )

    print(
        "Best validation threshold:",
        best_threshold
    )


    # ==================================================
    # 9. Save model
    # ==================================================

    MODEL_DIR = (
        Path(__file__).resolve().parent
        / "saved"
    )

    MODEL_DIR.mkdir(
        exist_ok=True
    )

    np.save(
        MODEL_DIR / "vqc_weights.npy",
        np.array(best_weights)
    )

    config = {
        "n_qubits": N_QUBITS,
        "n_layers": N_LAYERS,
        "threshold": best_threshold,
        "best_epoch": best_epoch,
        "best_validation_f1": best_val_f1,
    }

    with open(
        MODEL_DIR / "vqc_config.json",
        "w"
    ) as file:

        json.dump(
            config,
            file,
            indent=4
        )

    print("\nModel saved.")

    print(
        "Weights:",
        MODEL_DIR / "vqc_weights.npy"
    )

    print(
        "Config:",
        MODEL_DIR / "vqc_config.json"
    )


    # ==================================================
    # 10. FINAL TEST EVALUATION
    # ==================================================

    print("\n========================================")
    print("FINAL TEST EVALUATION")
    print("========================================")

    print(
        "\nIMPORTANT:"
        "\nThe test set was NOT used during training "
        "or threshold selection."
    )

    test_probabilities = get_probabilities(
        X_test_4,
        best_weights
    )

    test_predictions = (
        test_probabilities >= best_threshold
    ).astype(int)


    # --------------------------------------------------
    # Metrics
    # --------------------------------------------------

    accuracy = accuracy_score(
        y_test,
        test_predictions
    )

    precision = precision_score(
        y_test,
        test_predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        test_predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        test_predictions,
        zero_division=0
    )

    roc_auc = roc_auc_score(
        y_test,
        test_probabilities
    )


    # --------------------------------------------------
    # Confusion matrix
    # --------------------------------------------------

    cm = confusion_matrix(
        y_test,
        test_predictions,
        labels=[0, 1]
    )

    tn, fp, fn, tp = cm.ravel()


    # --------------------------------------------------
    # Sensitivity and specificity
    # --------------------------------------------------

    sensitivity = (
        tp /
        (tp + fn)
        if (tp + fn) > 0
        else 0
    )

    specificity = (
        tn /
        (tn + fp)
        if (tn + fp) > 0
        else 0
    )


    # ==================================================
    # Print results
    # ==================================================

    print(
        f"\nAccuracy: "
        f"{accuracy * 100:.2f}%"
    )

    print(
        f"Precision: "
        f"{precision * 100:.2f}%"
    )

    print(
        f"Recall / Sensitivity: "
        f"{recall * 100:.2f}%"
    )

    print(
        f"Specificity: "
        f"{specificity * 100:.2f}%"
    )

    print(
        f"F1 Score: "
        f"{f1:.4f}"
    )

    print(
        f"ROC-AUC: "
        f"{roc_auc:.4f}"
    )

    print("\nConfusion Matrix:")

    print(cm)

    print("\nBreakdown:")

    print("True Negatives :", tn)
    print("False Positives:", fp)
    print("False Negatives:", fn)
    print("True Positives :", tp)