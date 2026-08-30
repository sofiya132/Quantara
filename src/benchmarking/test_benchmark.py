from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from .benchmark import benchmark_models


# -----------------------------
# Load test dataset
# -----------------------------

data = load_breast_cancer()

X = data.data
y = data.target


# -----------------------------
# Train/Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------
# Define models
# -----------------------------

models = {

    "Logistic Regression":

        Pipeline([
            (
                "scaler",
                StandardScaler()
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=2000
                )
            )
        ]),

    "Random Forest":

        RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )
}


# -----------------------------
# Run Benchmark
# -----------------------------

results = benchmark_models(
    models=models,
    X_train=X_train,
    y_train=y_train,
    X_test=X_test,
    y_test=y_test
)


# -----------------------------
# Display Results
# -----------------------------

print("\n")
print("=" * 80)
print("BENCHMARK RESULTS")
print("=" * 80)

print(
    results.to_string(
        index=False
    )
)


# -----------------------------
# Save Results
# -----------------------------

results.to_csv(
    "results/test_benchmark_results.csv",
    index=False
)

print("\nResults saved to:")
print("results/test_benchmark_results.csv")