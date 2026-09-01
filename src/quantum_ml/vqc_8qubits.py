from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from pathlib import Path

# --------------------------------------------------
# PROJECT PATH
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

sys.path.append(str(PROJECT_ROOT / "src"))

# --------------------------------------------------
# FLASK APP
# --------------------------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Quantara Backend API is running"
    })


# --------------------------------------------------
# PREDICTION API
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        required_features = [
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

        # Check missing features
        missing = [
            feature
            for feature in required_features
            if feature not in data
        ]

        if missing:
            return jsonify({
                "status": "error",
                "message": "Missing features",
                "missing": missing
            }), 400

        # --------------------------------------------------
        # Convert input to numbers
        # --------------------------------------------------

        patient = {
            feature: float(data[feature])
            for feature in required_features
        }

        # --------------------------------------------------
        # TEMPORARY RESPONSE
        # --------------------------------------------------
        # We will connect this to the actual Quantara
        # prediction pipeline in the next step.

        return jsonify({
            "status": "success",
            "message": "Patient data received",
            "patient": patient
        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
