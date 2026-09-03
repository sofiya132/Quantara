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

# Load trained quantum weights

weights_path = (
    Path(__file__).resolve().parent
    / "saved"
    / "vqc_weights.npy"
)

weights = np.load(weights_path)

print("\nLoaded quantum weights:")
print("Weight shape:", weights.shape)

# Verify expected weight shape

expected_shape = (3, 4, 2)

if weights.shape != expected_shape:
    raise ValueError(
        f"Unexpected weight shape: {weights.shape}. "
        f"Expected: {expected_shape}"
    )

# Run the real patient through quantum circuit

output = quantum_circuit(
    patient,
    weights
)


print("\nQuantum circuit output:")
print(output)
