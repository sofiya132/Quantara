import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# PATHS
PROJECT_ROOT = Path(__file__).resolve().parents[2]

RESULTS_DIR = PROJECT_ROOT / "results"
PLOTS_DIR = RESULTS_DIR / "plots"

PLOTS_DIR.mkdir(
    parents=True,
    exist_ok=True
)

# LOAD RESULTS
feature_df = pd.read_csv(
    RESULTS_DIR / "qml_feature_qubit_experiment.csv"
)

depth_df = pd.read_csv(
    RESULTS_DIR / "qml_circuit_depth_experiment.csv"
)

noise_df = pd.read_csv(
    RESULTS_DIR / "qml_noise_experiment.csv"
)

# 1. FEATURES vs GATES
plt.figure(figsize=(8, 5))

plt.plot(
    feature_df["Features"],
    feature_df["Total Gates"],
    marker="o"
)

plt.xlabel("Number of Features / Qubits")
plt.ylabel("Total Gates")
plt.title("Feature Count vs Quantum Gate Count")

plt.grid(True)

plt.tight_layout()

path = PLOTS_DIR / "qml_features_vs_gates.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# 2. FEATURES vs SIMULATION TIME
plt.figure(figsize=(8, 5))

plt.plot(
    feature_df["Features"],
    feature_df["Simulation Time (sec)"],
    marker="o"
)

plt.xlabel("Number of Features / Qubits")
plt.ylabel("Simulation Time (seconds)")
plt.title("Feature Count vs Simulation Time")

plt.grid(True)

plt.tight_layout()

path = PLOTS_DIR / "qml_features_vs_simulation_time.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# 3. CIRCUIT DEPTH vs GATES
plt.figure(figsize=(8, 5))

plt.plot(
    depth_df["Circuit Depth"],
    depth_df["Total Gates"],
    marker="o"
)

plt.xlabel("Circuit Depth")
plt.ylabel("Total Gates")
plt.title("Circuit Depth vs Quantum Gate Count")

plt.grid(True)

plt.tight_layout()

path = PLOTS_DIR / "qml_depth_vs_gates.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# 4. CIRCUIT DEPTH vs SIMULATION TIME
plt.figure(figsize=(8, 5))

plt.plot(
    depth_df["Circuit Depth"],
    depth_df["Simulation Time (sec)"],
    marker="o"
)

plt.xlabel("Circuit Depth")
plt.ylabel("Simulation Time (seconds)")
plt.title("Circuit Depth vs Simulation Time")

plt.grid(True)

plt.tight_layout()

path = PLOTS_DIR / "qml_depth_vs_simulation_time.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# 5. NOISE COMPARISON
ideal = noise_df["Ideal Average Output"].iloc[0]

noisy = noise_df["Noisy Average Output"].iloc[0]

plt.figure(figsize=(7, 5))

plt.bar(
    ["Ideal", "Noisy"],
    [ideal, noisy]
)

plt.ylabel("Average Circuit Output")
plt.title("Ideal vs Noisy Quantum Circuit")

plt.tight_layout()

path = PLOTS_DIR / "qml_noise_comparison.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# 6. NOISE DIFFERENCE
difference = noise_df["Absolute Difference"].iloc[0]

plt.figure(figsize=(7, 5))

plt.bar(
    ["Noise Effect"],
    [difference]
)

plt.ylabel("Absolute Output Difference")
plt.title("Quantum Circuit Noise Sensitivity")

plt.tight_layout()

path = PLOTS_DIR / "qml_noise_sensitivity.png"

plt.savefig(path, dpi=300)

plt.close()

print("Saved:", path)

# COMPLETED
print("\n" + "=" * 60)
print("QML FEASIBILITY PLOTS GENERATED")
print("=" * 60)

print("\nPlots saved in:")

print(PLOTS_DIR)
