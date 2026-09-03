import pandas as pd
from pathlib import Path
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler


# --------------------------------------------------
# Paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data" / "processed"


# --------------------------------------------------
# Load the SAME 492/123 split used by the project
# --------------------------------------------------

X_dev = pd.read_csv(DATA_DIR / "X_train.csv")
X_test = pd.read_csv(DATA_DIR / "X_test.csv")

y_dev = pd.read_csv(
    DATA_DIR / "y_train_binary.csv"
).iloc[:, 0].to_numpy()

y_test = pd.read_csv(
    DATA_DIR / "y_test_binary.csv"
).iloc[:, 0].to_numpy()


# --------------------------------------------------
# Exact feature order
# --------------------------------------------------

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

X_dev = X_dev[FEATURE_ORDER]
X_test = X_test[FEATURE_ORDER]


# --------------------------------------------------
# PCA
#
# IMPORTANT:
# Fit PCA ONLY on the 492 development samples.
# Test data is only transformed.
# --------------------------------------------------

pca = PCA(n_components=4)

X_dev_pca = pca.fit_transform(X_dev)
X_test_pca = pca.transform(X_test)


# --------------------------------------------------
# Scale PCA components to quantum angles [-pi, pi]
#
# IMPORTANT:
# Fit scaler ONLY on development data.
# --------------------------------------------------

angle_scaler = MinMaxScaler(
    feature_range=(-3.141592653589793, 3.141592653589793)
)

X_dev_4 = angle_scaler.fit_transform(X_dev_pca)
X_test_4 = angle_scaler.transform(X_test_pca)

# Keep quantum angles within [-pi, pi]
X_test_4 = X_test_4.clip(
    -3.141592653589793,
    3.141592653589793
)


# --------------------------------------------------
# Verification
# --------------------------------------------------

print("===== FINAL QML DATA =====")

print("Development set:", X_dev.shape)
print("Test set:", X_test.shape)

print("\nLabels:")
print("y_dev:", y_dev.shape)
print("y_test:", y_test.shape)

print("\n===== PCA =====")

print("X_dev_4:", X_dev_4.shape)
print("X_test_4:", X_test_4.shape)

print("\nExplained variance ratio:")
print(pca.explained_variance_ratio_)

print("\nTotal variance retained:")
print(pca.explained_variance_ratio_.sum())

print("\n===== QUANTUM ANGLES =====")

print("Development range:")
print(
    X_dev_4.min(axis=0),
    "to",
    X_dev_4.max(axis=0)
)

print("\nTest range:")
print(
    X_test_4.min(axis=0),
    "to",
    X_test_4.max(axis=0)
)

print("\nFirst development sample:")
print(X_dev_4[0])