
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier


def create_logistic_regression():
    return LogisticRegression(
        C=0.01,
        class_weight="balanced",
        solver="lbfgs",
        max_iter=2000,
        random_state=42
    )


def create_random_forest():
    return RandomForestClassifier(
        n_estimators=200,
        max_depth=5,
        min_samples_split=2,
        class_weight="balanced",
        random_state=42
    )


def create_xgboost():
    return XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=1.0,
        objective="multi:softprob",
        num_class=5,
        eval_metric="mlogloss",
        random_state=42
    )


def train_models(X_train, y_train):
    models = {
        "Logistic Regression": create_logistic_regression(),
        "Random Forest": create_random_forest(),
        "XGBoost": create_xgboost()
    }

    for model in models.values():
        model.fit(X_train, y_train)

    return models
