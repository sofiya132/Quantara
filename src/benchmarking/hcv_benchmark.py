import pandas as pd
from pathlib import Path

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder

from .benchmark import benchmark_models


# ==========================================
# 1. Paths
# ==========================================

X_TRAIN_PATH = Path("data/processed/X_train.csv")
X_TEST_PATH = Path("data/processed/X_test.csv")
Y_TRAIN_PATH = Path("data/processed/y_train.csv")
Y_TEST_PATH = Path("data/processed/y_test.csv")


# ==========================================
# 2. Load HCV processed data
# ==========================================

print("\nLoading HCV processed dataset...")

X_train = pd.read_csv(X_TRAIN_PATH)
X_test = pd.read_csv(X_TEST_PATH)

y_train = pd.read_csv(Y_TRAIN_PATH)
y_test = pd.read_csv(Y_TEST_PATH)


# ==========================================
# 3. Convert target DataFrames to Series
# ==========================================

if y_train.shape[1] == 1:
    y_train = y_train.iloc[:, 0]

if y_test.shape[1] == 1:
    y_test = y_test.iloc[:, 0]


# ==========================================
# 4. Encode target labels
# ==========================================

label_encoder = LabelEncoder()

y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.transform(y_test)

print("\nTarget label mapping:")
for index, label in enumerate(label_encoder.classes_):
    print(f"{index} -> {label}")


# ==========================================
# 4. Remove accidental CSV index columns
# ==========================================

X_train = X_train.loc[
    :,
    ~X_train.columns.str.contains("^Unnamed")
]

X_test = X_test.loc[
    :,
    ~X_test.columns.str.contains("^Unnamed")
]


# ==========================================
# 5. Display dataset information
# ==========================================

print("\nHCV Dataset Information")
print("=======================")

print("X_train shape:", X_train.shape)
print("X_test shape :", X_test.shape)
print("y_train shape:", y_train.shape)
print("y_test shape :", y_test.shape)

print("\nTarget classes:")
print(y_train.value_counts())


# ==========================================
# 6. Define Classical ML models
# ==========================================

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
        ),

    "XGBoost":

        XGBClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.1,
            random_state=42,
            eval_metric="mlogloss"
        )
}

# ==========================================
# 7. Run benchmark
# ==========================================

print("\nStarting HCV benchmark...")

results = benchmark_models(
    models=models,
    X_train=X_train,
    y_train=y_train_encoded,
    X_test=X_test,
    y_test=y_test_encoded
)

# ==========================================
# 8. Display results
# ==========================================

print("\n")
print("=" * 100)
print("HCV CLASSICAL ML BENCHMARK RESULTS")
print("=" * 100)

print(
    results.to_string(
        index=False
    )
)


# ==========================================
# 9. Save results
# ==========================================

results_dir = Path("results")
results_dir.mkdir(
    exist_ok=True
)

output_path = (
    results_dir /
    "hcv_classical_benchmark.csv"
)

results.to_csv(
    output_path,
    index=False
)

print("\nResults saved to:")
print(output_path)