from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
    balanced_accuracy_score
)


def evaluate_model(
    model,
    y_true,
    y_pred,
    y_score=None,
    training_time=None,
    model_name=None
):
    """
    Common evaluation framework for HCV classification models.

    Supports binary and multiclass classification.

    Parameters:
        model: Trained model.
        y_true: Actual target values.
        y_pred: Predicted target values.
        y_score: Prediction probabilities/scores for ROC-AUC.
        training_time: Training time in seconds.

    Returns:
        Dictionary containing evaluation metrics.
    """

    # -----------------------------
    # Basic classification metrics
    # -----------------------------

    accuracy = accuracy_score(y_true, y_pred)

    balanced_accuracy = balanced_accuracy_score(
    y_true,
    y_pred
)

    precision = precision_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    # -----------------------------
    # Confusion Matrix
    # -----------------------------

    cm = confusion_matrix(y_true, y_pred)

    # -----------------------------
    # Sensitivity & Specificity
    # One-vs-Rest for each class
    # -----------------------------

    sensitivity_values = []
    specificity_values = []

    for i in range(len(cm)):

        tp = cm[i, i]

        fn = cm[i, :].sum() - tp

        fp = cm[:, i].sum() - tp

        tn = cm.sum() - (tp + fn + fp)

        # Sensitivity / Recall
        if (tp + fn) != 0:
            sensitivity = tp / (tp + fn)
        else:
            sensitivity = 0.0

        # Specificity
        if (tn + fp) != 0:
            specificity = tn / (tn + fp)
        else:
            specificity = 0.0

        sensitivity_values.append(sensitivity)
        specificity_values.append(specificity)

    # Macro average across classes
    sensitivity = sum(sensitivity_values) / len(sensitivity_values)

    specificity = sum(specificity_values) / len(specificity_values)

    # -----------------------------
    # ROC-AUC
    # -----------------------------

    roc_auc = None

    if y_score is not None:

        try:

            # Binary classification
            if len(cm) == 2:

                # If probabilities are 2D,
                # use probability of positive class
                if hasattr(y_score, "ndim") and y_score.ndim == 2:
                    y_score_binary = y_score[:, 1]
                else:
                    y_score_binary = y_score

                roc_auc = roc_auc_score(
                    y_true,
                    y_score_binary
                )

            # Multiclass classification
            else:

                roc_auc = roc_auc_score(
                    y_true,
                    y_score,
                    multi_class="ovr",
                    average="weighted"
                )

        except (ValueError, TypeError):
            roc_auc = None

    # -----------------------------
    # Final results
    # -----------------------------

    return {
    "Model": model_name if model_name else type(model).__name__,
    "Accuracy": accuracy,
    "Balanced Accuracy": balanced_accuracy,
    "Precision": precision,
    "Recall": recall,
    "F1": f1,
    "Sensitivity": sensitivity,
    "Specificity": specificity,
    "ROC-AUC": roc_auc,
    "Training Time": training_time
}
if __name__ == "__main__":

    from sklearn.datasets import load_breast_cancer
    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline
    import time

    # Load test dataset
    data = load_breast_cancer()

    X = data.data
    y = data.target

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Create model
    model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(max_iter=2000))
    ])

    # Train and measure time
    start_time = time.perf_counter()

    model.fit(X_train, y_train)

    training_time = time.perf_counter() - start_time

    # Predictions
    y_pred = model.predict(X_test)
    y_score = model.predict_proba(X_test)

    # Evaluate
    results = evaluate_model(
        model=model,
        y_true=y_test,
        y_pred=y_pred,
        y_score=y_score,
        training_time=training_time,
        model_name="Logistic Regression"
    )

    # Display results
    print("\n==============================")
    print("MODEL EVALUATION RESULTS")
    print("==============================")

    for metric, value in results.items():
        print(f"{metric}: {value}")