import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler

# Paths

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data" / "processed"

# Load Member 1's existing data

X_train_full = pd.read_csv(DATA_DIR / "X_train.csv")
X_test = pd.read_csv(DATA_DIR / "X_test.csv")

y_train_full = pd.read_csv(
    DATA_DIR / "y_train_binary.csv"
).iloc[:, 0].to_numpy()

y_test = pd.read_csv(
    DATA_DIR / "y_test_binary.csv"
).iloc[:, 0].to_numpy()

# Exact feature order

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

X_train_full = X_train_full[FEATURE_ORDER]
X_test = X_test[FEATURE_ORDER]


# --------------------------------------------------
# Stratified train/validation split
# --------------------------------------------------

X_train, X_val, y_train, y_val = train_test_split(
    X_train_full,
    y_train_full,
    test_size=0.20,
    random_state=42,
    stratify=y_train_full
)

# PCA
# IMPORTANT:
# Fit PCA ONLY on training data

pca = PCA(n_components=4)

X_train_pca = pca.fit_transform(X_train)
X_val_pca = pca.transform(X_val)
X_test_pca = pca.transform(X_test)

# Scale PCA components to [-pi, pi]
# IMPORTANT:
# Fit scaler ONLY on training PCA data

angle_scaler = MinMaxScaler(
    feature_range=(-3.141592653589793, 3.141592653589793)
)

X_train_4 = angle_scaler.fit_transform(X_train_pca)
X_val_4 = angle_scaler.transform(X_val_pca)
X_test_4 = angle_scaler.transform(X_test_pca)

# Information / verification

print("===== DATA SPLIT =====")

print("Full training set:", X_train_full.shape)
print("Training subset:", X_train.shape)
print("Validation subset:", X_val.shape)
print("Test set:", X_test.shape)

print("\n===== CLASS DISTRIBUTION =====")

print("Training:")
print(pd.Series(y_train).value_counts().sort_index())

print("\nValidation:")
print(pd.Series(y_val).value_counts().sort_index())

print("\nTest:")
print(pd.Series(y_test).value_counts().sort_index())


print("\n===== PCA =====")

print("X_train_4:", X_train_4.shape)
print("X_val_4:", X_val_4.shape)
print("X_test_4:", X_test_4.shape)

print("\nExplained variance ratio:")
print(pca.explained_variance_ratio_)

print("\nTotal variance retained:")
print(pca.explained_variance_ratio_.sum())


print("\n===== QUANTUM ANGLES =====")

print("Training range:")
print(
    X_train_4.min(axis=0),
    "to",
    X_train_4.max(axis=0)
)

print("\nFirst training sample:")
print(X_train_4[0])
