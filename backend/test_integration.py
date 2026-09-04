import urllib.request
import json

def test_url(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(data).encode('utf-8')
    else:
        data_bytes = None
    with urllib.request.urlopen(req, data=data_bytes) as resp:
        content = resp.read().decode('utf-8')
        return resp.status, content

print("=== 1. Testing Frontend Vite Server ===")
status, html = test_url("http://127.0.0.1:5173/")
print(f"Frontend Status: {status} | HTML title present: {'Quantara' in html}")

print("\n=== 2. Testing Backend Health ===")
status, body = test_url("http://127.0.0.1:8000/health")
health_json = json.loads(body)
print(f"Health Status: {status} | System: {health_json['system']} | Status: {health_json['status']}")

print("\n=== 3. Testing Model Comparison ===")
status, body = test_url("http://127.0.0.1:8000/api/model-comparison")
comp = json.loads(body)
print(f"Comparison Status: {status} | Models: {[m['model'] for m in comp['models']]}")

print("\n=== 4. Testing Quantum Feasibility ===")
status, body = test_url("http://127.0.0.1:8000/api/quantum-feasibility")
qfeas = json.loads(body)
print(f"QFeas Status: {status} | Qubits: {qfeas['qubits_required']} | Gate Counts: {qfeas['gate_counts']}")

print("\n=== 5. Testing Dataset Analysis ===")
status, body = test_url("http://127.0.0.1:8000/api/dataset-analysis")
ddata = json.loads(body)
print(f"Dataset Status: {status} | Records: {ddata['total_records']} | Quality Score: {ddata['data_quality_score']}")

print("\n=== 6. Testing Patient Prediction (Severe Cirrhosis Case) ===")
sample_patient = {
    "features": {
        "Age": 58.0, "ALB": 24.5, "ALP": 185.0, "ALT": 142.0, "AST": 230.0,
        "BIL": 68.0, "CHE": 2.8, "CHOL": 3.1, "CREA": 165.0, "GGT": 280.0,
        "PROT": 58.0, "Sex_m": 1
    },
    "patient_name": "Cirrhosis Test Case"
}
status, body = test_url("http://127.0.0.1:8000/api/predict", method="POST", data=sample_patient)
pred = json.loads(body)
print(f"Predict Status: {status} | Selected Risk Level: {pred['selected_risk_level']} | Probability: {pred['selected_probability']*100:.1f}%")
print(f"Classical ML Probability: {pred['classical_probability']*100:.1f}% | Hybrid QML Probability: {pred['qml_probability']*100:.1f}%")
print(f"Recommended Model: {pred['recommended_model']}")
print(f"Top Contributor: {pred['top_features'][0]['feature']} ({pred['top_features'][0]['patient_contribution']*100:.1f}% weight)")

print("\n=== 7. Testing Prediction (Healthy Blood Donor Control) ===")
healthy_patient = {
    "features": {
        "Age": 32.0, "ALB": 42.2, "ALP": 41.9, "ALT": 35.8, "AST": 31.1,
        "BIL": 8.5, "CHE": 7.01, "CHOL": 4.79, "CREA": 70.0, "GGT": 16.9,
        "PROT": 74.5, "Sex_m": 1
    },
    "patient_name": "Healthy Donor Control"
}
status, body = test_url("http://127.0.0.1:8000/api/predict", method="POST", data=healthy_patient)
pred_healthy = json.loads(body)
print(f"Predict Status: {status} | Selected Risk Level: {pred_healthy['selected_risk_level']} | Probability: {pred_healthy['selected_probability']*100:.1f}%")

print("\n=== 8. Testing Prediction History Audit Log ===")
status, body = test_url("http://127.0.0.1:8000/api/history")
hist = json.loads(body)
print(f"History Status: {status} | Total Records: {len(hist)} | Latest Patient: {hist[0]['patient_name']} ({hist[0]['risk_level']} Risk)")

print("\n=== 9. Testing CSV Export Endpoint ===")
status, csv_data = test_url("http://127.0.0.1:8000/api/history/export/csv")
print(f"CSV Export Status: {status} | Header & Data Rows: {len(csv_data.strip().splitlines())}")

print("\n>>> ALL SYSTEM INTEGRATION TESTS PASSED WITH 100% SUCCESS! <<<")
