from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime

# ============================================================
# PATIENT DATA SCHEMAS
# ============================================================

class PatientFeatures(BaseModel):
    Age: float = Field(default=45.0, description="Patient age (years)", ge=10, le=100)
    ALB: float = Field(default=42.1, description="Albumin (g/L)", ge=10.0, le=90.0)
    ALP: float = Field(default=95.2, description="Alkaline Phosphatase (IU/L)", ge=10.0, le=500.0)
    ALT: float = Field(default=35.4, description="Alanine Aminotransferase (U/L)", ge=1.0, le=400.0)
    AST: float = Field(default=31.2, description="Aspartate Aminotransferase (U/L)", ge=1.0, le=400.0)
    BIL: float = Field(default=0.8, description="Bilirubin (µmol/L)", ge=0.1, le=300.0)
    CHE: float = Field(default=7.2, description="Cholinesterase (kU/L)", ge=0.5, le=20.0)
    CHOL: float = Field(default=5.1, description="Cholesterol (mmol/L)", ge=1.0, le=15.0)
    CREA: float = Field(default=82.0, description="Creatinine (µmol/L)", ge=10.0, le=1200.0)
    GGT: float = Field(default=40.0, description="Gamma-Glutamyl Transferase (U/L)", ge=1.0, le=700.0)
    PROT: float = Field(default=72.0, description="Total Protein (g/L)", ge=30.0, le=110.0)
    Sex_m: float = Field(default=1.0, description="Sex encoded: 1 for Male, 0 for Female", ge=0.0, le=1.0)

class PredictRequest(BaseModel):
    features: PatientFeatures
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    notes: Optional[str] = None

# ============================================================
# PREDICTION & MODEL ANALYSIS SCHEMAS
# ============================================================

class ModelDetail(BaseModel):
    model: str
    probability: float
    confidence: float
    historical_performance: float
    router_score: float
    prediction: str
    risk_level: str
    paradigm: Optional[str] = "Classical ML"
    architecture: Optional[str] = None
    probability_percent: Optional[str] = None
    confidence_percent: Optional[str] = None

class FeatureContribution(BaseModel):
    feature: str
    description: str
    category: str
    importance: float
    patient_contribution: float
    patient_value: float
    baseline_median: float
    deviation_percent: float

class QMLSensitivityComponent(BaseModel):
    component: str
    sensitivity: float
    description: Optional[str] = None

class ExplainabilityData(BaseModel):
    why_prediction: str
    why_model: str
    top_features: List[FeatureContribution]
    all_features: List[FeatureContribution]
    qml_sensitivity: List[QMLSensitivityComponent]
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    specific_disease: Optional[str] = None
    selected_risk_level: Optional[str] = None
    selected_probability: Optional[float] = None
    selected_confidence: Optional[float] = None
    recommended_model: Optional[str] = None
    de_ritis_interpretation: Optional[str] = None
    clinical_report: Optional[Any] = None

class BiomarkerStatus(BaseModel):
    feature: str
    label: str
    unit: str
    value: float
    normal_min: float
    normal_max: float
    status: str
    status_label: str
    clinical_meaning: str

class AlteredBiomarkerDetail(BaseModel):
    feature: str
    label: str
    value: float
    unit: str
    normal_range: str
    deviation_direction: str
    deviation_percent: float
    pathophysiology: str
    associated_disease_risk: str

class RecoveryActionItem(BaseModel):
    target_biomarker: str
    action_category: str
    recommendation: str
    clinical_rationale: str
    target_goal: str

class ClinicalReport(BaseModel):
    report_id: str
    specific_disease: str
    disease_probabilities: Dict[str, float]
    diagnostic_impression: str
    primary_syndrome: str
    de_ritis_ratio: Optional[float] = None
    de_ritis_interpretation: Optional[str] = None
    organ_evaluations: Dict[str, Any]
    biomarkers_analysis: List[BiomarkerStatus]
    altered_biomarkers_summary: List[AlteredBiomarkerDetail]
    clinical_recommendations: List[str]
    recovery_roadmap: List[RecoveryActionItem]
    urgency_level: str

class PredictResponse(BaseModel):
    patient_id: str
    timestamp: str
    features: Dict[str, float]
    
    # Classical predictions
    classical_prediction: str
    classical_probability: float
    
    # QML predictions
    qml_prediction: str
    qml_probability: float
    qml_angles: List[float]
    
    # Unified Adaptive Selection
    recommended_model: str
    selected_prediction: str
    selected_probability: float
    selected_confidence: float
    selected_risk_level: str
    risk_score: float
    
    # Detailed breakdown
    model_breakdown: List[ModelDetail]
    recommendation_reason: str
    
    # Explainability snippet
    top_features: List[FeatureContribution]
    all_features: Optional[List[FeatureContribution]] = None
    why_prediction: str
    
    # Quantum feasibility info
    quantum_specs: Dict[str, Any]

    # Clinical Diagnostic Report
    clinical_report: Optional[ClinicalReport] = None

# ============================================================
# BENCHMARK & COMPARISON SCHEMAS
# ============================================================

class MetricItem(BaseModel):
    metric: str
    classical: float
    qml: float
    unit: str = "%"
    better: str
    delta: str

class ModelBenchmark(BaseModel):
    model: str
    accuracy: float
    precision: float
    recall: float
    specificity: float
    f1: float
    roc_auc: float
    training_time: float
    inference_time: float
    tp: int
    tn: int
    fp: int
    fn: int

class ModelComparisonResponse(BaseModel):
    models: List[ModelBenchmark]
    head_to_head: List[MetricItem]
    roc_curves: Dict[str, List[Dict[str, float]]]
    key_insights: List[str]

# ============================================================
# QUANTUM FEASIBILITY SCHEMAS
# ============================================================

class QubitExperiment(BaseModel):
    features: int
    qubits: int
    layers: int
    rotation_gates: int
    cnot_gates: int
    total_gates: int
    simulation_time: float
    avg_output: float

class DepthExperiment(BaseModel):
    depth: int
    qubits: int
    features: int
    rotation_gates: int
    cnot_gates: int
    total_gates: int
    simulation_time: float
    avg_output: float

class NoiseExperiment(BaseModel):
    noise_model: str
    ideal_output: float
    noisy_output: float
    absolute_diff: float
    ideal_time: float
    noisy_time: float

class QuantumFeasibilityResponse(BaseModel):
    qubits_required: int
    circuit_depth: int
    pca_components: int
    variance_retained: float
    dual_angle_encoding: bool
    ring_entanglement: bool
    multi_qubit_readout: bool
    simulator_supported: bool
    hardware_ready: bool
    noise_sensitivity: str
    gate_counts: Dict[str, int]
    qubit_scaling: List[QubitExperiment]
    depth_scaling: List[DepthExperiment]
    noise_analysis: List[NoiseExperiment]

# ============================================================
# DATASET ANALYSIS SCHEMAS
# ============================================================

class FeatureStat(BaseModel):
    feature: str
    description: str
    category: str
    min: float
    max: float
    mean: float
    median: float
    std: float
    unit: Optional[str] = None

class ClassDistribution(BaseModel):
    category_code: str
    label: str
    count: int
    percentage: float

class DatasetAnalysisResponse(BaseModel):
    total_records: int
    clean_split_records: int
    total_features: int
    missing_values: int
    duplicates: int
    class_balance: List[ClassDistribution]
    features_stats: List[FeatureStat]
    correlation_matrix: Dict[str, Dict[str, float]]
    data_quality_score: float

# ============================================================
# HISTORY SCHEMAS
# ============================================================

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    patient_name: Optional[str] = "Anonymous Patient"
    risk_level: str
    risk_probability: float
    confidence: float
    selected_model: str
    classical_probability: float
    qml_probability: float
    features: Dict[str, float]
    top_contributor: str
    notes: Optional[str] = None
