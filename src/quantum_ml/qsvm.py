import sys
import time
from pathlib import Path

import pennylane as qml
from pennylane import numpy as np

from sklearn.svm import SVC
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
)


# ============================================================
# PATH SETUP
# ============================================================

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parents[1]

sys.path.append(str(PROJECT_ROOT / "src" / "quantum_ml"))

from final_qml_preprocessing import (
    X_dev_4,
    X_test_4,
    y_dev,
    y_test,
)


# ============================================================
# QSVM CONFIGURATION
# ============================================================

N_QUBITS = 4
RANDOM_STATE = 42


# ============================================================
# QUANTUM SIMULATOR
# ============================================================

dev = qml.device(
    "default.qubit",
    wires=N_QUBITS
)


# ============================================================
# QUANTUM FEATURE MAP
# ============================================================

def feature_map(x):
    """
    Encodes 4 classical features into 4 qubits.
    """

    # Encode features
    for i in range(N_QUBITS):
        qml.Hadamard(wires=i)
        qml.RY(x[i], wires=i)

    # Entanglement
    for i in range(N_QUBITS - 1):
        qml.CNOT(wires=[i, i + 1])


# ============================================================
# QUANTUM KERNEL
# ============================================================

@qml.qnode(dev)
def quantum_kernel(x1, x2):
    """
    Calculates quantum similarity between two samples.
    """

    # Prepare state for x1
    feature_map(x1)

    # Apply inverse feature map for x2
    qml.adjoint(feature_map)(x2)

    # Probability of returning to |0000>
    return qml.probs(wires=range(N_QUBITS))


# ============================================================
# COMPUTE TRAINING KERNEL MATRIX
# ============================================================

def compute_train_kernel_matrix(X):
    """
    Computes the symmetric quantum kernel matrix
    for the development/training set.
    """

    n = len(X)

    K = np.eye(n)

    print()
    print(f"Computing training kernel matrix: {n} x {n}")
    print(f"Unique kernel evaluations: {n * (n - 1) // 2}")

    start_time = time.perf_counter()

    for i in range(n):

        if (i + 1) % 25 == 0 or i == n - 1:
            elapsed = time.perf_counter() - start_time

            print(
                f"  Progress: {i + 1}/{n} "
                f"({elapsed:.1f}s)"
            )

        for j in range(i + 1, n):

            value = quantum_kernel(X[i], X[j])[0]

            K[i, j] = value
            K[j, i] = value

    elapsed = time.perf_counter() - start_time

    print(f"Training kernel computation completed in {elapsed:.2f}s")

    return np.asarray(K)


# ============================================================
# COMPUTE TEST KERNEL MATRIX
# ============================================================

def compute_test_kernel_matrix(X_test, X_train):
    """
    Computes kernel values between every test sample
    and every training sample.
    """

    n_test = len(X_test)
    n_train = len(X_train)

    K = np.zeros((n_test, n_train))

    print()
    print(
        f"Computing test kernel matrix: "
        f"{n_test} x {n_train}"
    )

    print(
        f"Kernel evaluations: "
        f"{n_test * n_train}"
    )

    start_time = time.perf_counter()

    for i in range(n_test):

        if (i + 1) % 10 == 0 or i == n_test - 1:
            elapsed = time.perf_counter() - start_time

            print(
                f"  Progress: {i + 1}/{n_test} "
                f"({elapsed:.1f}s)"
            )

        for j in range(n_train):

            K[i, j] = quantum_kernel(
                        X_test[i],
                        X_train[j]
                    )[0]

    elapsed = time.perf_counter() - start_time

    print(f"Test kernel computation completed in {elapsed:.2f}s")

    return np.asarray(K)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("FINAL QSVM EXPERIMENT")
    print("=" * 60)

    print()
    print("Development data:")
    print("X_dev_4:", X_dev_4.shape)
    print("y_dev:", y_dev.shape)

    print()
    print("Test data:")
    print("X_test_4:", X_test_4.shape)
    print("y_test:", y_test.shape)

    print()
    print("Class distribution:")
    print("Development:")
    print(np.bincount(y_dev))

    print("Test:")
    print(np.bincount(y_test))


    # --------------------------------------------------------
    # STEP 1: COMPUTE TRAINING KERNEL
    # --------------------------------------------------------

    K_train = compute_train_kernel_matrix(X_dev_4)


    # --------------------------------------------------------
    # STEP 2: COMPUTE TEST KERNEL
    # --------------------------------------------------------

    K_test = compute_test_kernel_matrix(
        X_test_4,
        X_dev_4
    )


    # --------------------------------------------------------
    # STEP 3: TRAIN SVM
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("TRAINING SVM")
    print("=" * 60)

    clf = SVC(
        kernel="precomputed",
        class_weight="balanced",
        probability=True,
        random_state=RANDOM_STATE
    )

    clf.fit(K_train, y_dev)


    # --------------------------------------------------------
    # STEP 4: PREDICTION
    # --------------------------------------------------------

    y_pred = clf.predict(K_test)

    y_prob = clf.predict_proba(K_test)[:, 1]


    # --------------------------------------------------------
    # STEP 5: EVALUATION
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("QSVM FINAL RESULTS")
    print("=" * 60)

    print()
    print("Classification Report:")

    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )

    print("Confusion Matrix:")

    cm = confusion_matrix(
        y_test,
        y_pred
    )

    print(cm)

    roc_auc = roc_auc_score(
        y_test,
        y_prob
    )

    print()
    print(f"ROC-AUC: {roc_auc:.4f}")


    # --------------------------------------------------------
    # ADDITIONAL BIOMEDICAL METRICS
    # --------------------------------------------------------

    tn, fp, fn, tp = cm.ravel()

    sensitivity = tp / (tp + fn)

    specificity = tn / (tn + fp)

    print()
    print("Biomedical Metrics:")
    print(f"Sensitivity (Recall): {sensitivity:.4f}")
    print(f"Specificity:          {specificity:.4f}")


    print()
    print("=" * 60)
    print("QSVM EXPERIMENT COMPLETED")
    print("=" * 60)