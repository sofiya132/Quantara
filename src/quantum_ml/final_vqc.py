import sys
import json
from pathlib import Path

import numpy as standard_np
from pennylane import numpy as np
import pennylane as qml

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
)


# ============================================================
# PATH SETUP
# ============================================================

CURRENT_DIR = Path(__file__).resolve().parent

sys.path.append(str(CURRENT_DIR))


# ============================================================
# FINAL DATA
# ============================================================

from final_qml_preprocessing import (
    X_dev_4,
    X_test_4,
    y_dev,
    y_test,
)


# ============================================================
# CONFIGURATION
# ============================================================

N_QUBITS = 4
N_LAYERS = 5

EPOCHS = 50
LEARNING_RATE = 0.02

RANDOM_SEED = 42

# Final evaluation uses standard decision threshold.
# The test set is NOT used to select this.
FINAL_THRESHOLD = 0.50


# ============================================================
# DATA
# ============================================================

X_dev_np = standard_np.asarray(
    X_dev_4,
    dtype=float
)

X_test_np = standard_np.asarray(
    X_test_4,
    dtype=float
)

y_dev_np = standard_np.asarray(
    y_dev,
    dtype=int
).reshape(-1)

y_test_np = standard_np.asarray(
    y_test,
    dtype=int
).reshape(-1)


print()
print("=" * 75)
print("QUANTARA - FINAL 4-QUBIT VQC")
print("=" * 75)


print("\nFinal data:")

print(
    "Development:",
    X_dev_np.shape
)

print(
    "Test:",
    X_test_np.shape
)

print(
    "Development labels:",
    y_dev_np.shape
)

print(
    "Test labels:",
    y_test_np.shape
)


print("\nClass distribution:")

print("Development:")
print(standard_np.bincount(y_dev_np))

print("Test:")
print(standard_np.bincount(y_test_np))


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_0_count = standard_np.sum(
    y_dev_np == 0
)

class_1_count = standard_np.sum(
    y_dev_np == 1
)

total_samples = len(y_dev_np)


weight_0 = (
    total_samples
    /
    (2.0 * class_0_count)
)

weight_1 = (
    total_samples
    /
    (2.0 * class_1_count)
)


print("\n===== CLASS WEIGHTS =====")

print(
    "Class 0:",
    weight_0
)

print(
    "Class 1:",
    weight_1
)


# ============================================================
# QUANTUM DEVICE
# ============================================================

dev = qml.device(
    "default.qubit",
    wires=N_QUBITS
)


# ============================================================
# VQC CIRCUIT
# ============================================================

@qml.qnode(dev)
def optimized_circuit(
    features,
    weights
):

    # --------------------------------------------------------
    # DUAL-ANGLE FEATURE ENCODING
    # --------------------------------------------------------

    for i in range(N_QUBITS):

        qml.RY(
            features[i],
            wires=i
        )

        qml.RZ(
            features[i],
            wires=i
        )


    # --------------------------------------------------------
    # VARIATIONAL LAYERS
    # --------------------------------------------------------

    for layer in range(N_LAYERS):

        for i in range(N_QUBITS):

            qml.RY(
                weights[layer, i, 0],
                wires=i
            )

            qml.RZ(
                weights[layer, i, 1],
                wires=i
            )


        # Ring entanglement

        for i in range(N_QUBITS - 1):

            qml.CNOT(
                wires=[
                    i,
                    i + 1
                ]
            )

        qml.CNOT(
            wires=[
                N_QUBITS - 1,
                0
            ]
        )


    # --------------------------------------------------------
    # MULTI-QUBIT READOUT
    # --------------------------------------------------------

    return (
        qml.expval(qml.PauliZ(0)),
        qml.expval(qml.PauliZ(1)),
        qml.expval(qml.PauliZ(2)),
        qml.expval(qml.PauliZ(3)),
    )


# ============================================================
# QUANTUM PROBABILITY
# ============================================================

def quantum_probability(
    features,
    weights
):

    outputs = optimized_circuit(
        features,
        weights
    )

    outputs = np.stack(outputs)

    expectation = np.mean(
        outputs
    )

    probability = (
        expectation + 1.0
    ) / 2.0

    return probability


# ============================================================
# BATCH PREDICTIONS
# ============================================================

def get_probabilities(
    X,
    weights
):

    probabilities = []

    for i in range(len(X)):

        probabilities.append(
            quantum_probability(
                X[i],
                weights
            )
        )

    return np.array(
        probabilities
    )


# ============================================================
# WEIGHTED BINARY CROSS ENTROPY
# ============================================================

def weighted_loss(
    predictions,
    targets
):

    eps = 1e-7

    predictions = np.clip(
        predictions,
        eps,
        1.0 - eps
    )

    sample_weights = np.where(
        targets == 1,
        weight_1,
        weight_0
    )

    loss = (
        -sample_weights
        *
        (
            targets
            *
            np.log(predictions)

            +

            (1 - targets)
            *
            np.log(1 - predictions)
        )
    )

    return np.mean(loss)


# ============================================================
# TRAINING COST
# ============================================================

def training_cost(
    weights
):

    probabilities = get_probabilities(
        X_dev_np,
        weights
    )

    return weighted_loss(
        probabilities,
        y_dev_np
    )


# ============================================================
# INITIALIZE PARAMETERS
# ============================================================

np.random.seed(
    RANDOM_SEED
)

weights = np.array(
    0.05
    *
    np.random.randn(
        N_LAYERS,
        N_QUBITS,
        2
    ),
    requires_grad=True
)


print("\n===== FINAL VQC CONFIGURATION =====")

print(
    "Qubits:",
    N_QUBITS
)

print(
    "Variational layers:",
    N_LAYERS
)

print(
    "Epochs:",
    EPOCHS
)

print(
    "Learning rate:",
    LEARNING_RATE
)

print(
    "Dual-angle encoding: ENABLED"
)

print(
    "Ring entanglement: ENABLED"
)

print(
    "Multi-qubit readout: ENABLED"
)

print(
    "Weight shape:",
    weights.shape
)


# ============================================================
# OPTIMIZER
# ============================================================

optimizer = qml.AdamOptimizer(
    stepsize=LEARNING_RATE
)


# ============================================================
# TRAINING
# ============================================================

print()
print("=" * 75)
print("STARTING FINAL VQC TRAINING")
print("=" * 75)


for epoch in range(EPOCHS):

    weights, train_loss = (
        optimizer.step_and_cost(
            training_cost,
            weights
        )
    )

    print(
        f"Epoch {epoch + 1:02d}/{EPOCHS} "
        f"| Train Loss: "
        f"{float(train_loss):.6f}"
    )


# ============================================================
# FINAL TEST EVALUATION
# ============================================================

print()
print("=" * 75)
print("FINAL VQC TEST EVALUATION")
print("=" * 75)


print(
    "\nTest set was not used during training."
)

print(
    "Decision threshold:",
    FINAL_THRESHOLD
)


test_probabilities = get_probabilities(
    X_test_np,
    weights
)

test_probabilities_np = standard_np.asarray(
    test_probabilities,
    dtype=float
)


test_predictions = (
    test_probabilities_np
    >= FINAL_THRESHOLD
).astype(int)


# ============================================================
# METRICS
# ============================================================

accuracy = accuracy_score(
    y_test_np,
    test_predictions
)

precision = precision_score(
    y_test_np,
    test_predictions,
    zero_division=0
)

sensitivity = recall_score(
    y_test_np,
    test_predictions,
    zero_division=0
)

f1 = f1_score(
    y_test_np,
    test_predictions,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test_np,
    test_probabilities_np
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test_np,
    test_predictions,
    labels=[0, 1]
)

tn, fp, fn, tp = cm.ravel()


specificity = (
    tn / (tn + fp)
    if (tn + fp) > 0
    else 0.0
)


# ============================================================
# RESULTS
# ============================================================

print("\n===== FINAL VQC RESULTS =====")

print(
    f"Accuracy: "
    f"{accuracy * 100:.2f}%"
)

print(
    f"Precision: "
    f"{precision * 100:.2f}%"
)

print(
    f"Sensitivity / Recall: "
    f"{sensitivity * 100:.2f}%"
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

print(
    "True Negatives :",
    tn
)

print(
    "False Positives:",
    fp
)

print(
    "False Negatives:",
    fn
)

print(
    "True Positives :",
    tp
)


# ============================================================
# SAVE FINAL MODEL
# ============================================================

MODEL_DIR = (
    CURRENT_DIR
    / "saved"
)

MODEL_DIR.mkdir(
    exist_ok=True
)


weights_path = (
    MODEL_DIR
    / "vqc_final_weights.npy"
)

config_path = (
    MODEL_DIR
    / "vqc_final_config.json"
)


np.save(
    weights_path,
    standard_np.asarray(
        weights
    )
)


config = {

    "model": "Final 4-Qubit VQC",

    "n_qubits": N_QUBITS,

    "n_layers": N_LAYERS,

    "epochs": EPOCHS,

    "learning_rate": LEARNING_RATE,

    "pca_components": N_QUBITS,

    "variance_retained": 0.5981118315709583,

    "dual_angle_encoding": True,

    "ring_entanglement": True,

    "multi_qubit_readout": True,

    "training_samples": 492,

    "test_samples": 123,

    "threshold": FINAL_THRESHOLD,

    "test_accuracy": float(accuracy),

    "test_precision": float(precision),

    "test_sensitivity": float(sensitivity),

    "test_specificity": float(specificity),

    "test_f1": float(f1),

    "test_roc_auc": float(roc_auc)
}


with open(
    config_path,
    "w"
) as file:

    json.dump(
        config,
        file,
        indent=4
    )


print("\nModel saved:")

print(weights_path)

print(config_path)


print()
print("=" * 75)
print("FINAL VQC EXPERIMENT COMPLETE")
print("=" * 75)