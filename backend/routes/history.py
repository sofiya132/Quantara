from fastapi import APIRouter, HTTPException, Response, Query
from typing import Optional, List
from backend.models import HistoryItem
from backend.services.history_service import history_service

router = APIRouter(prefix="/history", tags=["Prediction History & Audit"])

@router.get("", response_model=List[HistoryItem])
def get_all_history(
    limit: int = Query(default=100, ge=1, le=500),
    risk_filter: Optional[str] = Query(default=None, description="Filter by risk: ALL, HIGH, MODERATE, LOW")
):
    """Retrieve all stored patient prediction audits."""
    try:
        return history_service.get_all_history(limit=limit, risk_filter=risk_filter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@router.get("/{id}", response_model=HistoryItem)
def get_history_item(id: str):
    """Retrieve a single history record by ID."""
    item = history_service.get_history_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="History record not found")
    return item

@router.delete("/{id}")
def delete_history_item(id: str):
    """Delete a specific history record."""
    success = history_service.delete_history_by_id(id)
    if not success:
        raise HTTPException(status_code=404, detail="History record not found or already deleted")
    return {"message": "Record deleted successfully", "id": id}

@router.delete("")
def clear_all_history():
    """Clear all historical prediction records."""
    count = history_service.clear_all_history()
    return {"message": f"Cleared {count} history records"}

@router.get("/export/csv")
def export_history_csv():
    """Export prediction audit logs as a downloadable CSV."""
    csv_data = history_service.export_csv_string()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=quantara_prediction_history.csv"}
    )
