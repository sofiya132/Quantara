from pathlib import Path
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[2]


def load_feature_ranking():
    """Load the feature ranking generated during data analysis."""

    ranking_path = PROJECT_ROOT / "results" / "feature_ranking.csv"

    return pd.read_csv(ranking_path)


def get_top_features(n):
    """
    Return the top n features based on the average feature ranking.

    Parameters
    ----------
    n : int
        Number of top features to select.
    """

    ranking = load_feature_ranking()

    top_features = ranking.head(n)["Feature"].tolist()

    return top_features


def get_candidate_feature_sets():
    """Return the candidate feature subsets used for experiments."""

    ranking = load_feature_ranking()

    all_features = ranking["Feature"].tolist()

    return {
        "all_features": all_features,
        "top_8": get_top_features(8),
        "top_6": get_top_features(6),
        "top_4": get_top_features(4)
    }
def select_features(X_train, X_test, features):
    """
    Select the specified features from training and test datasets.
    """

    missing_features = [
        feature for feature in features
        if feature not in X_train.columns
    ]

    if missing_features:
        raise ValueError(
            f"Features not found in dataset: {missing_features}"
        )

    return (
        X_train[features].copy(),
        X_test[features].copy()
    )

if __name__ == "__main__":

    feature_sets = get_candidate_feature_sets()

    print("Candidate Feature Sets:\n")

    for name, features in feature_sets.items():
        print(f"{name}:")
        print(features)
        print()
            # Load processed datasets
    X_train = pd.read_csv(
        PROJECT_ROOT / "data" / "processed" / "X_train.csv"
    )

    X_test = pd.read_csv(
        PROJECT_ROOT / "data" / "processed" / "X_test.csv"
    )

    # Test Top-4 feature selection
    selected_features = feature_sets["top_4"]

    X_train_selected, X_test_selected = select_features(
        X_train,
        X_test,
        selected_features
    )

    print("Top-4 Feature Selection Test:")
    print("X_train shape:", X_train_selected.shape)
    print("X_test shape:", X_test_selected.shape)
    print("\nSelected features:")
    print(X_train_selected.columns.tolist())