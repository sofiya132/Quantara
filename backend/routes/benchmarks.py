from fastapi import APIRouter, HTTPException
from backend.models import ModelComparisonResponse, QuantumFeasibilityResponse
from backend.services.ml_service import ml_service

router = APIRouter(tags=["Benchmarks & Feasibility"])

@router.get("/model-comparison", response_model=ModelComparisonResponse)
def get_model_comparison():
    """
    Return comprehensive evaluation benchmarks for Classical models vs Hybrid QML:
    - Accuracy, Precision, Recall, Specificity, F1, ROC-AUC
    - Training times, inference latency, Confusion Matrix TP/TN/FP/FN
    - ROC Curve coordinate points
    """
    try:
        return ml_service.get_model_comparison_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Benchmark error: {str(e)}")

@router.get("/quantum-feasibility", response_model=QuantumFeasibilityResponse)
def get_quantum_feasibility():
    """
    Return Member 6 QML experimental feasibility metrics:
    - Qubit & feature scaling
    - Circuit depth vs gate counts
    - Depolarizing noise impact analysis
    - Hardware readiness verification
    """
    try:
        return ml_service.get_quantum_feasibility_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quantum feasibility error: {str(e)}")
