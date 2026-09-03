import sys
from pathlib import Path
import json

sys.path.append(str(Path(__file__).resolve().parent))

import numpy as standard_np
from pennylane import numpy as np
import pennylane as qml

from sklearn.decomposition import PCA
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
)

from qml_preprocessing import (
    X_train,
    X_val,
    X_test,
    y_train,
    y_val,
    y_test,
)

# CONFIGURATION
N_QUBITS = 4
N_LAYERS = 5
EPOCHS = 50

LEARNING_RATE = 0.02

RANDOM_SEED = 42

# Try several thresholds, but select ONLY using validation data
THRESHOLDS = standard_np.arange(
    0.10,
    0.91,
    0.01
)

# DATA
print()
print("=" * 75)
print("QUANTARA - OPTIMIZED 4-QUBIT VQC")
print("=" * 75)


X_train_np = standard_np.asarray(
    X_train,
    dtype=float
)

X_val_np = standard_np.asarray(
    X_val,
    dtype=float
)

X_test_np = standard_np.asarray(
    X_test,
    dtype=float
)

y_train_np = standard_np.asarray(
    y_train,
    dtype=int
).reshape(-1)

y_val_np = standard_np.asarray(
    y_val,
    dtype=int
).reshape(-1)

y_test_np = standard_np.asarray(
    y_test,
    dtype=int
).reshape(-1)


print("\nOriginal data:")

print(
    "Training:",
    X_train_np.shape
)

print(
    "Validation:",
    X_val_np.shape
)

print(
    "Test:",
    X_test_np.shape
)

# PCA
pca = PCA(
    n_components=N_QUBITS
)

X_train_pca = pca.fit_transform(
    X_train_np
)

X_val_pca = pca.transform(
    X_val_np
)

X_test_pca = pca.transform(
    X_test_np
)


variance_retained = (
    pca.explained_variance_ratio_.sum()
)


print("\n===== PCA =====")

print(
    "X_train_4:",
    X_train_pca.shape
)

print(
    "X_val_4:",
    X_val_pca.shape
)

print(
    "X_test_4:",
    X_test_pca.shape
)

print(
    "\nExplained variance ratio:"
)

print(
    pca.explained_variance_ratio_
)

print(
    "\nTotal variance retained:"
)

print(
    f"{variance_retained * 100:.2f}%"
)

# QUANTUM ANGLE ENCODING
# Scale each PCA feature independently to [-pi, pi]
train_min = X_train_pca.min(axis=0)
train_max = X_train_pca.max(axis=0)

range_values = train_max - train_min

range_values[
    range_values == 0
] = 1.0


def scale_to_angles(X):

    scaled = (
        (X - train_min)
        / range_values
    )

    scaled = (
        scaled * 2.0
        - 1.0
    )

    return (
        scaled * standard_np.pi
    )


X_train_angles = scale_to_angles(
    X_train_pca
)

X_val_angles = scale_to_angles(
    X_val_pca
)

X_test_angles = scale_to_angles(
    X_test_pca
)


print("\n===== QUANTUM ANGLES =====")

print(
    "Training range:"
)

print(
    X_train_angles.min(axis=0),
    "to",
    X_train_angles.max(axis=0)
)

print(
    "\nFirst training sample:"
)

print(
    X_train_angles[0]
)

# CLASS WEIGHTS
class_0_count = standard_np.sum(
    y_train_np == 0
)

class_1_count = standard_np.sum(
    y_train_np == 1
)

total_samples = len(
    y_train_np
)

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

# QUANTUM DEVICE
dev = qml.device(
    "default.qubit",
    wires=N_QUBITS
)

# OPTIMIZED QUANTUM CIRCUIT
@qml.qnode(dev)
def optimized_circuit(
    features,
    weights
):
    
    # FEATURE ENCODING
     for i in range(N_QUBITS):

        qml.RY(
            features[i],
            wires=i
        )

        qml.RZ(
            features[i],
            wires=i
        )

    # VARIATIONAL LAYERS
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
        for i in range(
            N_QUBITS - 1
        ):

            qml.CNOT(
                wires=[
                    i,
                    i + 1
                ]
            )

        # Close the ring
        qml.CNOT(
            wires=[
                N_QUBITS - 1,
                0
            ]
        )

    # MULTI-QUBIT READOUT
    return (
        qml.expval(qml.PauliZ(0)),
        qml.expval(qml.PauliZ(1)),
        qml.expval(qml.PauliZ(2)),
        qml.expval(qml.PauliZ(3)),
    )

# QUANTUM OUTPUT
def quantum_probability(
    features,
    weights
):

    outputs = optimized_circuit(
        features,
        weights
    )

    outputs = np.stack(
        outputs
    )

    # Average the four measured qubits
    expectation = np.mean(
        outputs
    )

    probability = (
        expectation + 1.0
    ) / 2.0

    return probability

# BATCH PREDICTIONS
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

# WEIGHTED BINARY CROSS ENTROPY
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
            targets * np.log(
                predictions
            )
            +
            (1 - targets)
            *
            np.log(
                1 - predictions
            )
        )
    )

    return np.mean(
        loss
    )

# TRAINING COST
def training_cost(
    weights
):

    probabilities = get_probabilities(
        X_train_angles,
        weights
    )

    return weighted_loss(
        probabilities,
        y_train_np
    )

# THRESHOLD OPTIMIZATION
def find_best_threshold(
    probabilities,
    targets
):

    probabilities_np = (
        standard_np.asarray(
            probabilities,
            dtype=float
        )
    )

    targets_np = (
        standard_np.asarray(
            targets,
            dtype=int
        )
    )

    best_threshold = 0.50
    best_f1 = -1.0

    for threshold in THRESHOLDS:

        predictions = (
            probabilities_np
            >= threshold
        ).astype(int)

        score = f1_score(
            targets_np,
            predictions,
            zero_division=0
        )

        if score > best_f1:

            best_f1 = score

            best_threshold = float(
                threshold
            )

    return (
        best_threshold,
        best_f1
    )

# INITIALIZE PARAMETERS
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


print("\n===== OPTIMIZED QUANTUM MODEL =====")

print(
    "Qubits:",
    N_QUBITS
)

print(
    "Variational layers:",
    N_LAYERS
)

print(
    "Ring entanglement: ENABLED"
)

print(
    "Dual-angle encoding: ENABLED"
)

print(
    "Multi-qubit readout: ENABLED"
)

print(
    "Weight shape:",
    weights.shape
)

# OPTIMIZER
optimizer = qml.AdamOptimizer(
    stepsize=LEARNING_RATE
)

# TRAINING
best_val_f1 = -1.0
best_val_loss = float("inf")
best_threshold = 0.50
best_epoch = 0
best_weights = None


print("\n")
print("=" * 75)
print("STARTING OPTIMIZED VQC TRAINING")
print("=" * 75)


for epoch in range(EPOCHS):

    weights, train_loss = (
        optimizer.step_and_cost(
            training_cost,
            weights
        )
    )

    # Validation probabilities
    val_probabilities = (
        get_probabilities(
            X_val_angles,
            weights
        )
    )

    val_loss = weighted_loss(
        val_probabilities,
        y_val_np
    )

    # Validation threshold
    threshold, val_f1 = (
        find_best_threshold(
            val_probabilities,
            y_val_np
        )
    )


    print(
        f"Epoch {epoch + 1:02d}/{EPOCHS} "
        f"| Train Loss: "
        f"{float(train_loss):.6f} "
        f"| Val Loss: "
        f"{float(val_loss):.6f} "
        f"| Val F1: "
        f"{val_f1:.4f} "
        f"| Threshold: "
        f"{threshold:.2f}"
    )

    # Save best validation model
    if val_f1 > best_val_f1:

        best_val_f1 = val_f1

        best_val_loss = float(
            val_loss
        )

        best_threshold = (
            threshold
        )

        best_epoch = (
            epoch + 1
        )

        best_weights = np.array(
            weights,
            requires_grad=False
        )

# TRAINING SUMMARY
print("\n")
print("=" * 75)
print("OPTIMIZED VQC TRAINING COMPLETE")
print("=" * 75)

print(
    "\nBest epoch:",
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

# FINAL TEST EVALUATION
print("\n")
print("=" * 75)
print("FINAL TEST EVALUATION")
print("=" * 75)

print(
    "\nIMPORTANT:"
)

print(
    "The test set was NOT used during "
    "training or threshold selection."
)


test_probabilities = (
    get_probabilities(
        X_test_angles,
        best_weights
    )
)

test_probabilities_np = (
    standard_np.asarray(
        test_probabilities,
        dtype=float
    )
)

test_predictions = (
    test_probabilities_np
    >= best_threshold
).astype(int)

# METRICS
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

# CONFUSION MATRIX
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

# DISPLAY RESULTS
print(
    f"\nAccuracy: "
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

# SAVE MODEL
MODEL_DIR = (
    Path(__file__).resolve().parent
    / "saved"
)

MODEL_DIR.mkdir(
    exist_ok=True
)


weights_path = (
    MODEL_DIR
    / "vqc_optimized_weights.npy"
)

config_path = (
    MODEL_DIR
    / "vqc_optimized_config.json"
)


np.save(
    weights_path,
    standard_np.asarray(
        best_weights
    )
)


config = {

    "model": "Optimized 4-Qubit VQC",

    "n_qubits": N_QUBITS,

    "n_layers": N_LAYERS,

    "pca_components": N_QUBITS,

    "variance_retained":
        float(
            variance_retained
        ),

    "dual_angle_encoding":
        True,

    "ring_entanglement":
        True,

    "multi_qubit_readout":
        True,

    "learning_rate":
        LEARNING_RATE,

    "epochs":
        EPOCHS,

    "best_epoch":
        int(best_epoch),

    "threshold":
        float(best_threshold),

    "validation_f1":
        float(best_val_f1),

    "test_accuracy":
        float(accuracy),

    "test_precision":
        float(precision),

    "test_sensitivity":
        float(sensitivity),

    "test_specificity":
        float(specificity),

    "test_f1":
        float(f1),

    "test_roc_auc":
        float(roc_auc)
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

print(
    weights_path
)

print(
    config_path
)


print("\n")
print("=" * 75)
print("OPTIMIZED VQC EXPERIMENT COMPLETE")
print("=" * 75)
