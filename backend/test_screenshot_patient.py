import urllib.request
import json

def test_case(name, features):
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/predict",
        method="POST",
        data=json.dumps({"features": features, "patient_name": name}).encode("utf-8")
    )
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
    
    rep = res["clinical_report"]
    print(f"\n========================================================")
    print(f"PATIENT TEST: {name}")
    print(f"Risk Level: {res['selected_risk_level']} ({res['selected_probability']*100:.1f}%)")
    print(f"Specific Disease Diagnosed: {rep['specific_disease']}")
    print(f"Altered Biomarkers Detected: {len(rep['altered_biomarkers_summary'])}")
    print(f"Top Disease Probabilities: {[(k, f'{v*100:.1f}%') for k, v in rep['disease_probabilities'].items() if v > 0.05]}")
    print(f"Recovery Roadmap Items: {len(rep['recovery_roadmap'])}")

print("=== RUNNING FULL MULTI-CLASS CLINICAL VERIFICATION SUITE ===")

# 1. User screenshot case 1 (ALT=284)
test_case("1. User Screenshot Case (ALT 284)", {
    "Age": 70.0, "ALB": 68.7, "ALP": 24.0, "ALT": 284.0, "AST": 5.0,
    "BIL": 0.8, "CHE": 7.2, "CHOL": 5.1, "CREA": 82.0, "GGT": 40.0,
    "PROT": 72.0, "Sex_m": 0
})

# 1b. User screenshot case 2 (ALP=249, ALB=68.1, Age=66, Sex=Other 0.5)
test_case("1b. User Screenshot Case 2 (ALP 249, ALB 68.1, Age 66, Sex=Other 0.5)", {
    "Age": 66.0, "ALB": 68.1, "ALP": 249.0, "ALT": 35.4, "AST": 31.2,
    "BIL": 0.8, "CHE": 7.2, "CHOL": 5.1, "CREA": 82.0, "GGT": 40.0,
    "PROT": 72.0, "Sex_m": 0.5
})

# 2. Severe Cirrhosis Case (High AST, High Bilirubin, Low Albumin, Low CHE)
test_case("2. Severe Cirrhosis Case", {
    "Age": 58.0, "ALB": 24.5, "ALP": 185.0, "ALT": 142.0, "AST": 230.0,
    "BIL": 68.0, "CHE": 2.8, "CHOL": 3.1, "CREA": 165.0, "GGT": 280.0,
    "PROT": 58.0, "Sex_m": 1
})

# 3. Intermediate Fibrosis Case (High GGT, High ALP)
test_case("3. Hepatic Fibrosis Case", {
    "Age": 51.0, "ALB": 34.0, "ALP": 110.0, "ALT": 65.0, "AST": 95.0,
    "BIL": 22.0, "CHE": 5.2, "CHOL": 4.5, "CREA": 92.0, "GGT": 145.0,
    "PROT": 66.0, "Sex_m": 0
})

# 4. Healthy Blood Donor Control
test_case("4. Healthy Blood Donor Control", {
    "Age": 32.0, "ALB": 42.2, "ALP": 41.9, "ALT": 35.8, "AST": 31.1,
    "BIL": 8.5, "CHE": 7.01, "CHOL": 4.79, "CREA": 70.0, "GGT": 16.9,
    "PROT": 74.5, "Sex_m": 1
})
