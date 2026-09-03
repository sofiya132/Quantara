import time
import pandas as pd

from .evaluate import evaluate_model


def get_prediction_scores(model, X_test):
    """
    Get prediction scores/probabilities for ROC-AUC.

    Tries:
    1. predict_proba()
    2. decision_function()

    Returns:
        Prediction scores or None.
    """

    # Try probability predictions
    if hasattr(model, "predict_proba"):

        try:
            return model.predict_proba(X_test)

        except Exception:
            pass

    # Try decision function
    if hasattr(model, "decision_function"):

        try:
            return model.decision_function(X_test)

        except Exception:
            pass

    return None


def benchmark_model(
    model,
    model_name,
    X_train,
    y_train,
    X_test,
    y_test
):
    """
    Train and evaluate one model.
    """

    print(f"\nTraining {model_name}...")

    # Training time
    start_time = time.perf_counter()

    model.fit(X_train, y_train)

    training_time = time.perf_counter() - start_time

    # Predictions
    y_pred = model.predict(X_test)

    # Prediction scores
    y_score = get_prediction_scores(
        model,
        X_test
    )
    
    # Evaluate model
    results = evaluate_model(
        model=model,
        y_true=y_test,
        y_pred=y_pred,
        y_score=y_score,
        training_time=training_time,
        model_name=model_name
    )

    print(f"{model_name} completed.")

    return results


def benchmark_models(
    models,
    X_train,
    y_train,
    X_test,
    y_test
):
    """
    Benchmark multiple models.

    Parameters:
        models:
            Dictionary containing model names
            and model objects.

        Example:

            {
                "Logistic Regression": model1,
                "Random Forest": model2
            }

    Returns:
        Pandas DataFrame containing results.
    """

    all_results = []
    
    # Run each model
    for model_name, model in models.items():

        try:

            result = benchmark_model(
                model=model,
                model_name=model_name,
                X_train=X_train,
                y_train=y_train,
                X_test=X_test,
                y_test=y_test
            )

            all_results.append(result)

        except Exception as e:

            print(f"\nERROR in {model_name}:")
            print(e)

    # Create DataFrame
    results_df = pd.DataFrame(all_results)

    return results_df


def save_results(results_df, output_path):
    """
    Save benchmark results to CSV.
    """

    results_df.to_csv(
        output_path,
        index=False
    )

    print(f"\nResults saved to: {output_path}")
