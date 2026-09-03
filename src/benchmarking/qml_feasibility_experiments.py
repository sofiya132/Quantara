"""
QML Feasibility Experiments

Member 6 - Day 3/4

Experiments:
1. Feature count
2. Qubit count
3. Circuit depth
4. Basic noise sensitivity

This script does NOT modify the trained VQC model.
It evaluates lightweight quantum circuits to estimate
hardware feasibility.
"""

import time
from pathlib import Path

import pandas as pd
import pennylane as qml
from pennylane import numpy as np

from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

# PATHS
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data" / "processed"
RESULTS_DIR = PROJECT_ROOT / "results"

RESULTS_DIR.mkdir(exist_ok=True)

# CONFIGURATION
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

FEATURE_COUNTS = [2, 4, 6, 8]
CIRCUIT_DEPTHS = [1, 2, 3, 4]

N_SAMPLES = 20

ANGLE_MIN = -np.pi
ANGLE_MAX = np.pi

# LOAD DATA
print("=" * 70)
print("QML FEASIBILITY EXPERIMENTS")
print("=" * 70)

print("\nLoading HCV data...")

X_train_full = pd.read_csv(
    DATA_DIR / "X_train.csv"
)

X_test = pd.read_csv(
    DATA_DIR / "X_test.csv"
)

y_train_full = pd.read_csv(
    DATA_DIR / "y_train_binary.csv"
).iloc[:, 0].to_numpy()


X_train_full = X_train_full[FEATURE_ORDER]
X_test = X_test[FEATURE_ORDER]

# TRAIN / VALIDATION SPLIT
X_train, X_val, y_train, y_val = train_test_split(
    X_train_full,
    y_train_full,
    test_size=0.20,
    random_state=42,
    stratify=y_train_full
)

# PCA
max_features = max(FEATURE_COUNTS)

pca = PCA(
    n_components=max_features
)

X_train_pca = pca.fit_transform(X_train)

print("\nMaximum PCA components:", max_features)

# SCALE TO QUANTUM ANGLES
scaler = MinMaxScaler(
    feature_range=(-np.pi, np.pi)
)

X_train_scaled = scaler.fit_transform(
    X_train_pca
)

# SAMPLE DATA
X_samples = X_train_scaled[:N_SAMPLES]

print("Samples used:", len(X_samples))

# GATE COUNT
def calculate_gate_counts(
    n_qubits,
    n_layers
):

    rotation_gates = (
        n_qubits *
        n_layers *
        2
    )

    cnot_gates = (
        (n_qubits - 1) *
        n_layers
    )

    total_gates = (
        rotation_gates +
        cnot_gates
    )

    return (
        rotation_gates,
        cnot_gates,
        total_gates
    )

# CIRCUIT BUILDER
def create_circuit(
    n_qubits,
    n_layers,
    noisy=False
):

    if noisy:

        dev = qml.device(
            "default.mixed",
            wires=n_qubits
        )

    else:

        dev = qml.device(
            "default.qubit",
            wires=n_qubits
        )

    @qml.qnode(dev)
    def circuit(features):

        # Feature encoding
        for i in range(n_qubits):

            qml.RY(
                features[i],
                wires=i
            )

        # Variational layers
        for layer in range(n_layers):

            for i in range(n_qubits):

                qml.RY(
                    0.1 * (layer + 1),
                    wires=i
                )

                qml.RZ(
                    0.05 * (layer + 1),
                    wires=i
                )
                
            # Entanglement
            for i in range(
                n_qubits - 1
            ):

                qml.CNOT(
                    wires=[
                        i,
                        i + 1
                    ]
                )
                
            # Optional noise
            if noisy:

                for i in range(
                    n_qubits
                ):

                    qml.DepolarizingChannel(
                        0.01,
                        wires=i
                    )

        return qml.expval(
            qml.PauliZ(0)
        )

    return circuit

# FEATURE / QUBIT COUNT
print("\n")
print("=" * 70)
print("EXPERIMENT 1: FEATURE / QUBIT COUNT")
print("=" * 70)

feature_results = []

for n_features in FEATURE_COUNTS:

    n_qubits = n_features

    circuit = create_circuit(
        n_qubits=n_qubits,
        n_layers=3
    )

    start_time = time.perf_counter()

    outputs = []

    for sample in X_samples:

        features = sample[
            :n_features
        ]

        outputs.append(
            float(
                circuit(features)
            )
        )

    elapsed = (
        time.perf_counter()
        - start_time
    )

    rotation_gates, cnot_gates, total_gates = (
        calculate_gate_counts(
            n_qubits,
            3
        )
    )

    feature_results.append({

        "Features": n_features,

        "Qubits": n_qubits,

        "Layers": 3,

        "Rotation Gates": rotation_gates,

        "CNOT Gates": cnot_gates,

        "Total Gates": total_gates,

        "Samples": N_SAMPLES,

        "Simulation Time (sec)": elapsed,

        "Average Output": sum(outputs)
        / len(outputs)

    })

    print(
        f"{n_features} features | "
        f"{n_qubits} qubits | "
        f"{total_gates} gates | "
        f"{elapsed:.4f} sec"
    )


feature_df = pd.DataFrame(
    feature_results
)

feature_path = (
    RESULTS_DIR /
    "qml_feature_qubit_experiment.csv"
)

feature_df.to_csv(
    feature_path,
    index=False
)

# CIRCUIT DEPTH
print("\n")
print("=" * 70)
print("EXPERIMENT 2: CIRCUIT DEPTH")
print("=" * 70)

depth_results = []

n_qubits = 4
n_features = 4

for depth in CIRCUIT_DEPTHS:

    circuit = create_circuit(
        n_qubits=n_qubits,
        n_layers=depth
    )

    start_time = time.perf_counter()

    outputs = []

    for sample in X_samples:

        features = sample[
            :n_features
        ]

        outputs.append(
            float(
                circuit(features)
            )
        )

    elapsed = (
        time.perf_counter()
        - start_time
    )

    rotation_gates, cnot_gates, total_gates = (
        calculate_gate_counts(
            n_qubits,
            depth
        )
    )

    depth_results.append({

        "Qubits": n_qubits,

        "Features": n_features,

        "Circuit Depth": depth,

        "Rotation Gates": rotation_gates,

        "CNOT Gates": cnot_gates,

        "Total Gates": total_gates,

        "Samples": N_SAMPLES,

        "Simulation Time (sec)": elapsed,

        "Average Output": sum(outputs)
        / len(outputs)

    })

    print(
        f"Depth {depth} | "
        f"{total_gates} gates | "
        f"{elapsed:.4f} sec"
    )


depth_df = pd.DataFrame(
    depth_results
)

depth_path = (
    RESULTS_DIR /
    "qml_circuit_depth_experiment.csv"
)

depth_df.to_csv(
    depth_path,
    index=False
)

# NOISE SENSITIVITY
print("\n")
print("=" * 70)
print("EXPERIMENT 3: NOISE SENSITIVITY")
print("=" * 70)

noise_results = []

n_qubits = 4
n_features = 4
n_layers = 3

ideal_circuit = create_circuit(
    n_qubits,
    n_layers,
    noisy=False
)

noisy_circuit = create_circuit(
    n_qubits,
    n_layers,
    noisy=True
)

ideal_outputs = []
noisy_outputs = []

start_time = time.perf_counter()

for sample in X_samples:

    features = sample[
        :n_features
    ]

    ideal_outputs.append(
        float(
            ideal_circuit(features)
        )
    )

ideal_time = (
    time.perf_counter()
    - start_time
)


start_time = time.perf_counter()

for sample in X_samples:

    features = sample[
        :n_features
    ]

    noisy_outputs.append(
        float(
            noisy_circuit(features)
        )
    )

noisy_time = (
    time.perf_counter()
    - start_time
)


ideal_mean = sum(
    ideal_outputs
) / len(ideal_outputs)

noisy_mean = sum(
    noisy_outputs
) / len(noisy_outputs)

mean_difference = abs(
    ideal_mean -
    noisy_mean
)

noise_results.append({

    "Qubits": n_qubits,

    "Features": n_features,

    "Layers": n_layers,

    "Noise Model":
        "Depolarizing 0.01",

    "Ideal Average Output":
        ideal_mean,

    "Noisy Average Output":
        noisy_mean,

    "Absolute Difference":
        mean_difference,

    "Ideal Simulation Time":
        ideal_time,

    "Noisy Simulation Time":
        noisy_time

})


print(
    f"Ideal output: {ideal_mean:.6f}"
)

print(
    f"Noisy output: {noisy_mean:.6f}"
)

print(
    f"Absolute difference: "
    f"{mean_difference:.6f}"
)


noise_df = pd.DataFrame(
    noise_results
)

noise_path = (
    RESULTS_DIR /
    "qml_noise_experiment.csv"
)

noise_df.to_csv(
    noise_path,
    index=False
)

print("\n")
print("=" * 70)
print("EXPERIMENTS COMPLETED")
print("=" * 70)

print("\nResults saved:")

print(
    feature_path
)

print(
    depth_path
)

print(
    noise_path
)

print("\nFeature / Qubit results:")
print(feature_df.to_string(index=False))

print("\nCircuit depth results:")
print(depth_df.to_string(index=False))

print("\nNoise results:")
print(noise_df.to_string(index=False))

print("\n")
print("=" * 70)
print("QML FEASIBILITY EXPERIMENTS COMPLETED")
print("=" * 70)
