import pandas as pd
from pathlib import Path

DATA_DIR = Path("data/processed")

X_train = pd.read_csv(DATA_DIR / "X_train.csv")
X_test = pd.read_csv(DATA_DIR / "X_test.csv")

y_train = pd.read_csv(DATA_DIR / "y_train_binary.csv")
y_test = pd.read_csv(DATA_DIR / "y_test_binary.csv")

features = pd.read_csv(DATA_DIR / "binary_feature_list.csv")

print("\n===== X TRAIN =====")
print("Shape:", X_train.shape)
print("Columns:")
print(X_train.columns.tolist())

print("\n===== X TEST =====")
print("Shape:", X_test.shape)
print("Columns:")
print(X_test.columns.tolist())

print("\n===== Y TRAIN =====")
print("Shape:", y_train.shape)
print(y_train.head())
print("Value counts:")
print(y_train.iloc[:, 0].value_counts())

print("\n===== Y TEST =====")
print("Shape:", y_test.shape)
print(y_test.head())
print("Value counts:")
print(y_test.iloc[:, 0].value_counts())

print("\n===== FEATURE LIST =====")
print(features)