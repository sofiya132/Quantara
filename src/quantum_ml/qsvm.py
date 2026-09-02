import numpy as np
import pandas as pd
import pennylane as qml
from sklearn.svm import SVC
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from qml_preprocessing import X_train_4, X_test_4, y_train, y_test

# 1. Setup 4-qubit device
n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)

# 2. Define Quantum Kernel Feature Map (Overlap/Fidelity)
@qml.qnode(dev)
def kernel_circuit(x1, x2):
    # Encode first vector
    for i in range(n_qubits):
        qml.RY(x1[i], wires=i)
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i + 1])
        
    # Apply adjoint of second vector
    for i in reversed(range(n_qubits - 1)):
        qml.CNOT(wires=[i, i + 1])
    for i in range(n_qubits):
        qml.RY(-x2[i], wires=i)
        
    # Projective measurement onto ground state |0...0>
    return qml.probs(wires=range(n_qubits))

def quantum_kernel(x1, x2):
    return kernel_circuit(x1, x2)[0]

# 3. Compute Gram Matrix
def compute_kernel_matrix(A, B):
    matrix = np.zeros((len(A), len(B)))
    for i in range(len(A)):
        for j in range(len(B)):
            matrix[i, j] = quantum_kernel(A[i], B[j])
    return matrix

# 4. Train and Evaluate
# Use a subset of X_train_4 (e.g., 100-150 samples) for rapid simulation
K_train = compute_kernel_matrix(X_train_4[:120], X_train_4[:120])
K_test = compute_kernel_matrix(X_test_4, X_train_4[:120])

clf = SVC(kernel="precomputed", class_weight="balanced", probability=True)
clf.fit(K_train, y_train[:120])

y_pred = clf.predict(K_test)
y_prob = clf.predict_proba(K_test)[:, 1]

print("QSVM Evaluation:")
print(classification_report(y_test, y_pred, zero_division=0))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))
