from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from backend.models import (
    PredictRequest,
    PredictResponse,
    ExplainabilityData,
    PatientFeatures
)
from backend.services.ml_service import ml_service
from backend.services.history_service import history_service

router = APIRouter(tags=["Prediction & Explainability"])

@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    """
    Run patient features through the complete pipeline:
    Preprocessing -> Classical Models (LR, RF, XGBoost) + QML VQC ->
    Adaptive Model Router -> Explainability & Recommendations.
    """
    try:
        features_dict = payload.features.model_dump()
        result = ml_service.predict_patient(features_dict)
        
        # Override ID and patient name if supplied
        if payload.patient_id:
            result["patient_id"] = payload.patient_id
        
        # Automatically persist to audit history
        top_contrib_name = result["top_features"][0]["feature"] if result["top_features"] else "Unknown"
        history_service.add_history(
            id=result["patient_id"],
            timestamp=result["timestamp"],
            patient_name=payload.patient_name or f"Patient {result['patient_id']}",
            risk_level=result["selected_risk_level"],
            risk_probability=result["selected_probability"],
            confidence=result["selected_confidence"],
            selected_model=result["recommended_model"],
            classical_probability=result["classical_probability"],
            qml_probability=result["qml_probability"],
            features=features_dict,
            top_contributor=top_contrib_name,
            notes=payload.notes
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/explain", response_model=ExplainabilityData)
def explain(payload: PatientFeatures):
    """
    Return comprehensive XAI breakdown:
    - Global feature importance vs Patient-specific contribution
    - Top 5 biomarkers with medical interpretations and baseline deviations
    - QML Latent space sensitivity (PCA components)
    """
    try:
        features_dict = payload.model_dump()
        return ml_service.explain_patient(features_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability error: {str(e)}")

@router.get("/preset-patients")
def get_preset_patients():
    """Return pre-configured patient profiles for immediate 1-click test runs."""
    return ml_service.get_preset_patients()
