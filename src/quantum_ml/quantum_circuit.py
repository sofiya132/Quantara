import pennylane as qml
from pennylane import numpy as np


# Number of qubits
N_QUBITS = 4

# Number of trainable quantum layers
N_LAYERS = 3


# Quantum simulator
dev = qml.device(
    "default.qubit",
    wires=N_QUBITS
)


@qml.qnode(dev)
def quantum_circuit(features, weights):

    # STEP 1: Encode patient features

    for i in range(N_QUBITS):
        qml.RY(
            features[i],
            wires=i
        )

    # STEP 2: Trainable variational layers
    
    for layer in range(N_LAYERS):

        for i in range(N_QUBITS):

            # Trainable Y rotation
            qml.RY(
                weights[layer, i, 0],
                wires=i
            )

            # Trainable Z rotation
            qml.RZ(
                weights[layer, i, 1],
                wires=i
            )

        # STEP 3: Entangle neighbouring qubits

        for i in range(N_QUBITS - 1):

            qml.CNOT(
                wires=[i, i + 1]
            )

    # STEP 4: Measure

    return qml.expval(
        qml.PauliZ(0)
    )
