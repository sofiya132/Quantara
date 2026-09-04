from fastapi import APIRouter, HTTPException
import pandas as pd
from pathlib import Path
from backend.models import DatasetAnalysisResponse
from backend.services.ml_service import ml_service, DATA_DIR, FEATURE_ORDER

router = APIRouter(tags=["Dataset Analysis"])

@router.get("/dataset-analysis", response_model=DatasetAnalysisResponse)
def get_dataset_analysis():
    """
    Return dataset quality metrics, class distributions, summary statistics,
    and biomarker correlation matrices.
    """
    try:
        return ml_service.get_dataset_analysis_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset analysis error: {str(e)}")

@router.get("/dataset-sample")
def get_dataset_sample(limit: int = 50, offset: int = 0):
    """
    Return paginated sample rows from the raw HCV dataset for the UI table explorer.
    """
    try:
        raw_path = DATA_DIR / "raw" / "hcvdat0.csv"
        if not raw_path.exists():
            return {"total": 0, "rows": []}

        df = pd.read_csv(raw_path)
        if "Unnamed: 0" in df.columns:
            df = df.drop(columns=["Unnamed: 0"])

        total = len(df)
        paginated = df.iloc[offset:offset + limit].fillna("N/A")
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "rows": paginated.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset sample error: {str(e)}")
