import numpy as np


# ============================================================
# QUANTARA - MEMBER 4
# ADAPTIVE MODEL ROUTER
# ============================================================
#
# Purpose:
#   Compare model predictions and select the model that is
#   most appropriate for the current patient.
#
# The router considers:
#   1. Patient-specific confidence
#   2. Historical benchmark performance
#   3. Model probability
#
# IMPORTANT:
# This is an adaptive routing mechanism, not a medical diagnosis.
# ============================================================


# ============================================================
# HISTORICAL MODEL PERFORMANCE
# ============================================================

MODEL_PERFORMANCE = {

    "Logistic Regression": 0.8706,

    "Random Forest": 0.8814,

    "XGBoost": 0.8906,

    "VQC": 0.6045
}


# ============================================================
# ROUTER WEIGHTS
# ============================================================

# Current patient confidence is more important than historical
# performance because routing is patient-specific.

CONFIDENCE_WEIGHT = 0.60
PERFORMANCE_WEIGHT = 0.40


# ============================================================
# CONFIDENCE
# ============================================================

def calculate_confidence(probability):
    """
    Confidence is the distance from an uncertain 50% prediction.

    50%  -> 0% confidence
    75%  -> 50% confidence
    100% -> 100% confidence
    """

    probability = float(probability)

    confidence = abs(probability - 0.50) * 2.0

    return float(
        np.clip(confidence, 0.0, 1.0)
    )


# ============================================================
# RISK LEVEL
# ============================================================

def get_risk_level(probability):

    probability = float(probability)

    if probability >= 0.70:
        return "HIGH"

    elif probability >= 0.40:
        return "MODERATE"

    else:
        return "LOW"


# ============================================================
# MODEL ROUTER SCORE
# ============================================================

def calculate_router_score(
    probability,
    model_name
):

    probability = float(probability)

    confidence = calculate_confidence(
        probability
    )

    historical_performance = MODEL_PERFORMANCE.get(
        model_name,
        0.50
    )

    score = (
        CONFIDENCE_WEIGHT * confidence
        +
        PERFORMANCE_WEIGHT * historical_performance
    )

    return float(score)


# ============================================================
# ANALYZE ONE MODEL
# ============================================================

def analyze_model(
    model_name,
    probability
):

    probability = float(probability)

    prediction = (
        "POSITIVE"
        if probability >= 0.50
        else "NEGATIVE"
    )

    confidence = calculate_confidence(
        probability
    )

    performance = MODEL_PERFORMANCE.get(
        model_name,
        0.50
    )

    router_score = calculate_router_score(
        probability,
        model_name
    )

    return {

        "model":
            model_name,

        "probability":
            probability,

        "confidence":
            confidence,

        "historical_performance":
            performance,

        "router_score":
            router_score,

        "prediction":
            prediction,

        "risk_level":
            get_risk_level(
                probability
            )
    }


# ============================================================
# ROUTE MODELS
# ============================================================

def route_models(
    model_probabilities
):
    """
    Parameters
    ----------
    model_probabilities : dict

        Example:

        {
            "Logistic Regression": 0.90,
            "Random Forest": 0.72,
            "XGBoost": 0.88,
            "VQC": 0.25
        }

    Returns
    -------
    dict
        Routing result.
    """

    if not isinstance(
        model_probabilities,
        dict
    ):

        raise TypeError(
            "model_probabilities must be a dictionary."
        )

    if len(model_probabilities) == 0:

        raise ValueError(
            "No model probabilities were provided."
        )

    analyses = []

    # --------------------------------------------------------
    # Analyze every model
    # --------------------------------------------------------

    for model_name, probability in (
        model_probabilities.items()
    ):

        result = analyze_model(
            model_name,
            probability
        )

        analyses.append(
            result
        )

    # --------------------------------------------------------
    # Select best model
    # --------------------------------------------------------

    analyses.sort(
        key=lambda x:
        x["router_score"],
        reverse=True
    )

    selected = analyses[0]

    # --------------------------------------------------------
    # Second-best model
    # --------------------------------------------------------

    if len(analyses) > 1:

        second_best = analyses[1]

        score_difference = (
            selected["router_score"]
            -
            second_best["router_score"]
        )

    else:

        second_best = None

        score_difference = 0.0

    return {

        "selected_model":
            selected["model"],

        "selected_probability":
            selected["probability"],

        "selected_confidence":
            selected["confidence"],

        "selected_prediction":
            selected["prediction"],

        "selected_risk_level":
            selected["risk_level"],

        "selected_router_score":
            selected["router_score"],

        "second_best_model":
            (
                second_best["model"]
                if second_best
                else None
            ),

        "score_difference":
            score_difference,

        "model_comparison":
            analyses
    }


# ============================================================
# WHY THIS MODEL?
# ============================================================

def generate_model_reason(
    routing_result
):

    selected = routing_result[
        "selected_model"
    ]

    probability = routing_result[
        "selected_probability"
    ]

    confidence = routing_result[
        "selected_confidence"
    ]

    score = routing_result[
        "selected_router_score"
    ]

    performance = MODEL_PERFORMANCE.get(
        selected,
        0.50
    )

    second_best = routing_result[
        "second_best_model"
    ]

    difference = routing_result[
        "score_difference"
    ]

    if second_best:

        comparison = (
            f"The next strongest model was "
            f"{second_best}, with a routing-score "
            f"difference of {difference:.2%}."
        )

    else:

        comparison = (
            "No competing model was available."
        )

    reason = (

        f"{selected} was selected because it "
        f"achieved the strongest combined routing "
        f"score. Its historical benchmark score "
        f"was {performance:.2%}, while its "
        f"patient-specific confidence was "
        f"{confidence:.2%}. "
        f"{comparison} "
        f"For this patient, the selected model "
        f"estimated a positive-class probability "
        f"of {probability:.2%}."
    )

    return reason


# ============================================================
# DISPLAY ROUTER RESULT
# ============================================================

def print_router_result(
    routing_result
):

    print("\n" + "=" * 70)

    print(
        "QUANTARA - ADAPTIVE MODEL ROUTER"
    )

    print("=" * 70)

    print(
        f"\nSelected Model : "
        f"{routing_result['selected_model']}"
    )

    print(
        f"Probability    : "
        f"{routing_result['selected_probability']:.2%}"
    )

    print(
        f"Confidence     : "
        f"{routing_result['selected_confidence']:.2%}"
    )

    print(
        f"Prediction     : "
        f"{routing_result['selected_prediction']}"
    )

    print(
        f"Risk Level     : "
        f"{routing_result['selected_risk_level']}"
    )

    print(
        f"Router Score   : "
        f"{routing_result['selected_router_score']:.4f}"
    )

    print(
        "\n===== MODEL COMPARISON ====="
    )

    for item in routing_result[
        "model_comparison"
    ]:

        print(
            f"\n{item['model']}"
        )

        print(
            f"  Probability : "
            f"{item['probability']:.2%}"
        )

        print(
            f"  Confidence  : "
            f"{item['confidence']:.2%}"
        )

        print(
            f"  Performance : "
            f"{item['historical_performance']:.2%}"
        )

        print(
            f"  Router Score: "
            f"{item['router_score']:.4f}"
        )

        print(
            f"  Prediction  : "
            f"{item['prediction']}"
        )

    print(
        "\n===== WHY THIS MODEL? ====="
    )

    print(
        generate_model_reason(
            routing_result
        )
    )


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print(
        "QUANTARA - MEMBER 4 MODEL ROUTER TEST"
    )

    probabilities = {

        "Logistic Regression":
            0.90,

        "Random Forest":
            0.72,

        "XGBoost":
            0.88,

        "VQC":
            0.25
    }

    result = route_models(
        probabilities
    )

    print_router_result(
        result
    )

    print(
        "\n" + "=" * 70
    )

    print(
        "MODEL ROUTER TEST COMPLETE"
    )

    print(
        "=" * 70
    )