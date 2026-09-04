import sqlite3
import json
import csv
import io
import time
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_DIR = Path(__file__).resolve().parents[1] / "data_store"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "prediction_history.db"

class HistoryService:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS history (
                    id TEXT PRIMARY KEY,
                    timestamp TEXT NOT NULL,
                    patient_name TEXT,
                    risk_level TEXT NOT NULL,
                    risk_probability REAL NOT NULL,
                    confidence REAL NOT NULL,
                    selected_model TEXT NOT NULL,
                    classical_probability REAL NOT NULL,
                    qml_probability REAL NOT NULL,
                    features_json TEXT NOT NULL,
                    top_contributor TEXT,
                    notes TEXT
                )
            """)
            conn.commit()

    def add_history(
        self,
        id: str,
        timestamp: str,
        patient_name: Optional[str],
        risk_level: str,
        risk_probability: float,
        confidence: float,
        selected_model: str,
        classical_probability: float,
        qml_probability: float,
        features: Dict[str, float],
        top_contributor: str,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO history (
                    id, timestamp, patient_name, risk_level, risk_probability,
                    confidence, selected_model, classical_probability, qml_probability,
                    features_json, top_contributor, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                id,
                timestamp,
                patient_name or "Anonymous Patient",
                risk_level,
                float(risk_probability),
                float(confidence),
                selected_model,
                float(classical_probability),
                float(qml_probability),
                json.dumps(features),
                top_contributor,
                notes or ""
            ))
            conn.commit()

        return self.get_history_by_id(id)

    def get_all_history(self, limit: int = 100, risk_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM history"
            params = []
            if risk_filter and risk_filter.upper() != "ALL":
                query += " WHERE UPPER(risk_level) = ?"
                params.append(risk_filter.upper())
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            rows = cursor.fetchall()

            result = []
            for row in rows:
                item = dict(row)
                item["features"] = json.loads(item.pop("features_json"))
                result.append(item)
            return result

    def get_history_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM history WHERE id = ?", (id,))
            row = cursor.fetchone()
            if not row:
                return None
            item = dict(row)
            item["features"] = json.loads(item.pop("features_json"))
            return item

    def delete_history_by_id(self, id: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM history WHERE id = ?", (id,))
            conn.commit()
            return cursor.rowcount > 0

    def clear_all_history(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM history")
            conn.commit()
            return cursor.rowcount

    def export_csv_string(self) -> str:
        records = self.get_all_history(limit=500)
        output = io.StringIO()
        if not records:
            return "id,timestamp,patient_name,risk_level,risk_probability,selected_model\n"

        fieldnames = [
            "id", "timestamp", "patient_name", "risk_level", "risk_probability",
            "confidence", "selected_model", "classical_probability", "qml_probability",
            "top_contributor", "notes",
            "Age", "ALB", "ALP", "ALT", "AST", "BIL", "CHE", "CHOL", "CREA", "GGT", "PROT", "Sex_m"
        ]

        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for rec in records:
            row = {
                "id": rec["id"],
                "timestamp": rec["timestamp"],
                "patient_name": rec["patient_name"],
                "risk_level": rec["risk_level"],
                "risk_probability": rec["risk_probability"],
                "confidence": rec["confidence"],
                "selected_model": rec["selected_model"],
                "classical_probability": rec["classical_probability"],
                "qml_probability": rec["qml_probability"],
                "top_contributor": rec["top_contributor"],
                "notes": rec["notes"]
            }
            # Unpack features
            features = rec.get("features", {})
            for k, v in features.items():
                if k in fieldnames:
                    row[k] = v
            writer.writerow(row)

        return output.getvalue()

# Global singleton
history_service = HistoryService()
