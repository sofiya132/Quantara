import pandas as pd
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


RANDOM_STATE = 42


def load_data(path):
    """Load the raw HCV dataset."""
    return pd.read_csv(path)


def basic_cleaning(df):
    """Remove non-predictive columns and separate features/target."""

    df = df.copy()

    # Remove row identifier
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    # Separate target
    X = df.drop(columns=["Category"])
    y = df["Category"]

    return X, y


def preprocess_data(path):
    """Prepare the dataset for machine learning."""

    df = load_data(path)

    X, y = basic_cleaning(df)

    # Encode categorical feature
    X = pd.get_dummies(
        X,
        columns=["Sex"],
        drop_first=True,
        dtype=int
    )

    # Train/test split BEFORE fitting preprocessing
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y
    )

    # Continuous numerical features
    numerical_columns = [
        "Age", "ALB", "ALP", "ALT", "AST",
        "BIL", "CHE", "CHOL", "CREA", "GGT", "PROT"
    ]

    # Handle missing values using training-set medians
    train_medians = X_train[numerical_columns].median()

    X_train[numerical_columns] = X_train[numerical_columns].fillna(
        train_medians
    )

    X_test[numerical_columns] = X_test[numerical_columns].fillna(
        train_medians
    )

    # Scale only continuous numerical features
    scaler = StandardScaler()

    X_train[numerical_columns] = scaler.fit_transform(
        X_train[numerical_columns]
    )

    X_test[numerical_columns] = scaler.transform(
        X_test[numerical_columns]
    )

    return X_train, X_test, y_train, y_test, scaler


if __name__ == "__main__":

    PROJECT_ROOT = Path(__file__).resolve().parents[2]

    path = PROJECT_ROOT / "data" / "raw" / "hcvdat0.csv"

    X_train, X_test, y_train, y_test, scaler = preprocess_data(path)

    output_dir = PROJECT_ROOT / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)

    X_train.to_csv(output_dir / "X_train.csv", index=False)
    X_test.to_csv(output_dir / "X_test.csv", index=False)
    y_train.to_csv(output_dir / "y_train.csv", index=False)
    y_test.to_csv(output_dir / "y_test.csv", index=False)

    print("Preprocessing completed successfully.")
    print("X_train:", X_train.shape)
    print("X_test:", X_test.shape)
    print("y_train:", y_train.shape)
    print("y_test:", y_test.shape)

    print("\nProcessed files saved to:", output_dir)