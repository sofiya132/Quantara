import sys
from pathlib import Path

# Allow imports from the current quantum_ml folder
sys.path.append(str(Path(__file__).resolve().parent))

import pandas as pd
from pennylane import numpy as np

from qml_preprocessing import X_train_4
from quantum_circuit import quantum_circuit


# Take the first real patient after PCA
patient = X_train_4[0]

print("Patient after PCA:")
print(patient)

print("\nNumber of features:")
print(len(patient))


# Initial trainable weights
weights = np.array([
    0.1,
    0.2,
    0.3,
    0.4
], requires_grad=True)


# Run the real patient through the quantum circuit
output = quantum_circuit(patient, weights)

print("\nQuantum circuit output:")
print(output)