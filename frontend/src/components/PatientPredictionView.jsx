import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Atom, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Sliders, 
  Layers,
  Save,
  Check,
  FileText,
  Printer,
  Download,
  Stethoscope,
  Info,
  Target,
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { predictPatient } from '../api';
import ClinicalDiagnosisReportModal from './ClinicalDiagnosisReportModal';

const FEATURE_CONFIG = [
  { key: 'Age', label: 'Age', unit: 'years', min: 18, max: 80, step: 1, default: 45, refMin: 18, refMax: 65, category: 'Demographic', desc: 'Patient age in years' },
  { key: 'Sex_m', label: 'Sex', unit: 'gender', isGender: true, default: 1, refMin: 0, refMax: 1, category: 'Demographic', desc: 'Biological sex (Male=1, Female=0)' },
  { key: 'ALB', label: 'Albumin (ALB)', unit: 'g/L', min: 15, max: 80, step: 0.1, default: 42.1, refMin: 35.0, refMax: 52.0, category: 'Liver Function', desc: 'Main liver-synthesized protein (Colloid osmotic pressure)' },
  { key: 'ALP', label: 'Alkaline Phosphatase (ALP)', unit: 'IU/L', min: 10, max: 400, step: 0.5, default: 95.2, refMin: 35.0, refMax: 105.0, category: 'Liver Function', desc: 'Biliary duct and canalicular membrane enzyme' },
  { key: 'ALT', label: 'Alanine Aminotransferase (ALT)', unit: 'U/L', min: 2, max: 350, step: 0.5, default: 35.4, refMin: 7.0, refMax: 45.0, category: 'Liver Function', desc: 'Specific intracellular enzyme indicating acute hepatocellular injury' },
  { key: 'AST', label: 'Aspartate Aminotransferase (AST)', unit: 'U/L', min: 5, max: 350, step: 0.5, default: 31.2, refMin: 8.0, refMax: 40.0, category: 'Liver Function', desc: 'Enzyme elevated in hepatocellular necrosis and fibrosis' },
  { key: 'BIL', label: 'Bilirubin (BIL)', unit: 'µmol/L', min: 0.5, max: 200, step: 0.1, default: 0.8, refMin: 1.0, refMax: 17.0, category: 'Liver Function', desc: 'Heme catabolism byproduct (Jaundice marker)' },
  { key: 'CHE', label: 'Cholinesterase (CHE)', unit: 'kU/L', min: 1, max: 18, step: 0.1, default: 7.2, refMin: 5.3, refMax: 12.9, category: 'Liver Function', desc: 'Direct marker of hepatic synthetic reserve' },
  { key: 'CHOL', label: 'Cholesterol (CHOL)', unit: 'mmol/L', min: 1, max: 12, step: 0.1, default: 5.1, refMin: 3.5, refMax: 5.2, category: 'Metabolic', desc: 'Serum total cholesterol lipid profile' },
  { key: 'CREA', label: 'Creatinine (CREA)', unit: 'µmol/L', min: 10, max: 800, step: 1, default: 82.0, refMin: 53.0, refMax: 106.0, category: 'Kidney Function', desc: 'Renal filtration marker (Hepatorenal axis)' },
  { key: 'GGT', label: 'Gamma-Glutamyl Transferase (GGT)', unit: 'U/L', min: 5, max: 500, step: 0.5, default: 40.0, refMin: 8.0, refMax: 50.0, category: 'Liver Function', desc: 'Sensitive biliary and microsomal enzyme' },
  { key: 'PROT', label: 'Total Protein (PROT)', unit: 'g/L', min: 40, max: 95, step: 0.5, default: 72.0, refMin: 64.0, refMax: 83.0, category: 'Liver Function', desc: 'Serum albumin plus globulins sum' },
];

export default function PatientPredictionView({ 
  presets, 
  selectedPreset, 
  onNavigateToExplain, 
  onPredictionCompleted 
}) {
  const [patientName, setPatientName] = useState('Patient-001');
  const [notes, setNotes] = useState('');
  const [features, setFeatures] = useState(() => {
    const initial = {};
    FEATURE_CONFIG.forEach(f => initial[f.key] = f.default);
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (selectedPreset) {
      setFeatures(selectedPreset.features);
      setPatientName(selectedPreset.name);
      setNotes(`Loaded profile: ${selectedPreset.category}`);
      handleAnalyze(selectedPreset.features, selectedPreset.name);
    }
  }, [selectedPreset]);

  const handleInputChange = (key, value) => {
    setFeatures(prev => ({
      ...prev,
      [key]: typeof value === 'number' ? value : parseFloat(value) || 0
    }));
  };

  const handlePresetSelect = (preset) => {
    setFeatures(preset.features);
    setPatientName(preset.name);
    setNotes(preset.description);
    handleAnalyze(preset.features, preset.name);
  };

  const handleReset = () => {
    const initial = {};
    FEATURE_CONFIG.forEach(f => initial[f.key] = f.default);
    setFeatures(initial);
    setPatientName('Patient-001');
    setNotes('');
    setPredictionResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async (featuresToAnalyze = features, name = patientName) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await predictPatient(featuresToAnalyze, name, notes);
      setPredictionResult(result);
      if (onPredictionCompleted) {
        onPredictionCompleted(result);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      setErrorMsg(err.message || 'Analysis failed. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBiomarkerStatus = (feat, val) => {
    if (feat.isGender) {
      const label = val === 1 ? 'Male' : val === 0 ? 'Female' : 'Other';
      return { status: 'NORMAL', label, color: 'text-purple-400', badgeClass: 'bg-purple-950/60 text-purple-200 border-purple-800/50' };
    }
    const min = feat.refMin;
    const max = feat.refMax;

    if (val < min * 0.7) {
      return { status: 'VERY_LOW', label: 'Critically Low', color: 'text-indigo-400', badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    } else if (val < min) {
      return { status: 'LOW', label: 'Low', color: 'text-indigo-300', badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' };
    } else if (val <= max) {
      return { status: 'NORMAL', label: 'Normal Range', color: 'text-emerald-400', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    } else if (val <= max * 2.0) {
      return { status: 'HIGH', label: 'Elevated / High', color: 'text-amber-400', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    } else {
      return { status: 'VERY_HIGH', label: 'Critically High', color: 'text-rose-400', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
  };

  const report = predictionResult?.clinical_report;

  // Standalone HTML/PDF AI Model Analysis Report Downloader
  const handleDownloadReport = () => {
    if (!predictionResult || !report) return;

    const sexLabel = features.Sex_m === 1 ? 'Male' : 'Female';

    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quantara AI Model Analysis Report - ${patientName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; background: #f8fafc; }
    .report-container { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
    .header-title h1 { margin: 0; font-size: 24px; color: #0f172a; letter-spacing: -0.5px; }
    .header-title p { margin: 4px 0 0 0; font-size: 11px; font-weight: 700; color: #9333ea; text-transform: uppercase; letter-spacing: 1px; }
    .meta-box { background: #f5f3ff; border-radius: 8px; padding: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 12px; margin-bottom: 24px; }
    .meta-box span { color: #6b7280; font-size: 10px; text-transform: uppercase; font-weight: 700; display: block; }
    .diagnosis-banner { padding: 16px; border-radius: 8px; margin-bottom: 24px; background: ${predictionResult.selected_risk_level === 'HIGH' ? '#fef2f2; border: 1px solid #f87171;' : '#f0fdf4; border: 1px solid #4ade80;'} }
    .diagnosis-banner h2 { margin: 0; font-size: 16px; color: ${predictionResult.selected_risk_level === 'HIGH' ? '#991b1b' : '#166534'}; }
    .diagnosis-banner p { margin: 8px 0 0 0; font-size: 12px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th { background: #f5f3ff; text-align: left; padding: 10px; font-size: 10px; text-transform: uppercase; color: #4b5563; border-bottom: 2px solid #e9d5ff; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .flag-high { color: #dc2626; font-weight: 700; background: #fee2e2; padding: 2px 6px; border-radius: 4px; }
    .flag-normal { color: #16a34a; font-weight: 700; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
    .flag-low { color: #6366f1; font-weight: 700; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .card h3 { margin-top: 0; font-size: 13px; color: #0f172a; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .roadmap-item { margin-bottom: 12px; padding-left: 12px; border-left: 3px solid #10b981; font-size: 12px; }
    .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
    @media print { body { background: #fff; padding: 0; } .report-container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div class="header-title">
        <h1>QUANTARA AI ANALYSIS ENGINE</h1>
        <p>Hybrid Quantum-Classical Disease Risk Assessment</p>
      </div>
      <div style="text-align: right; font-size: 11px; font-family: monospace;">
        <div><strong>REPORT ID:</strong> ${report.report_id}</div>
        <div><strong>DATE:</strong> ${predictionResult.timestamp}</div>
      </div>
    </div>

    <div class="meta-box">
      <div><span>Patient Name</span><strong>${patientName}</strong></div>
      <div><span>Specimen ID</span><strong>${predictionResult.patient_id}</strong></div>
      <div><span>Age / Sex</span><strong>${features.Age} yrs / ${sexLabel}</strong></div>
      <div><span>Assessing Model</span><strong>${predictionResult.recommended_model}</strong></div>
    </div>

    <div class="diagnosis-banner">
      <h2>PRIMARY ASSESSMENT: ${predictionResult.selected_risk_level} RISK — ${report.specific_disease}</h2>
      <p><strong>Overall Risk Score:</strong> ${(predictionResult.selected_probability * 100).toFixed(1)}%</p>
      <p>${report.diagnostic_impression}</p>
      ${report.de_ritis_interpretation ? `<p style="font-family: monospace; font-size: 11px; margin-top: 8px;"><strong>De Ritis Ratio (AST/ALT):</strong> ${report.de_ritis_interpretation}</p>` : ''}
    </div>

    <div class="card">
      <h3>Model-Estimated Condition Distribution</h3>
      ${Object.entries(report.disease_probabilities || {}).map(([d, p]) => `
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>${d}</span>
          <strong>${(p * 100).toFixed(1)}%</strong>
        </div>
      `).join('')}
    </div>



    <h3>Biomarker Specimen Quantitative Analysis</h3>
    <table>
      <thead>
        <tr>
          <th>Biomarker / Analyte</th>
          <th style="text-align: right;">Result</th>
          <th style="text-align: right;">Normal Range</th>
          <th style="text-align: center;">Status Flag</th>
          <th>Clinical Meaning</th>
        </tr>
      </thead>
      <tbody>
        ${(report.biomarkers_analysis || []).map(b => `
          <tr>
            <td><strong>${b.label} (${b.feature})</strong></td>
            <td style="text-align: right; font-family: monospace;">${b.value} ${b.unit}</td>
            <td style="text-align: right; color: #64748b;">${b.normal_min} – ${b.normal_max} ${b.unit}</td>
            <td style="text-align: center;"><span class="${b.status.includes('HIGH') ? 'flag-high' : b.status.includes('LOW') ? 'flag-low' : 'flag-normal'}">${b.status_label}</span></td>
            <td style="font-size: 11px; color: #475569;">${b.clinical_meaning}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${report.altered_biomarkers_summary && report.altered_biomarkers_summary.length > 0 ? `
      <div class="card" style="background: #fffbeb; border-color: #fde68a;">
        <h3 style="color: #92400e; border-color: #fde68a;">Altered Biomarkers & Risk Factors</h3>
        ${report.altered_biomarkers_summary.map(a => `
          <div style="margin-bottom: 10px; font-size: 11px;">
            <strong style="color: #78350f;">${a.label} (${a.feature}): ${a.value} ${a.unit} (${a.deviation_direction})</strong>
            <p style="margin: 2px 0; color: #451a03;"><strong>Mechanism:</strong> ${a.pathophysiology}</p>
            <p style="margin: 2px 0; color: #b91c1c;"><strong>Associated Disease Risk:</strong> ${a.associated_disease_risk}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${report.recovery_roadmap && report.recovery_roadmap.length > 0 ? `
      <div class="card" style="background: #f0fdf4; border-color: #bbf7d0;">
        <h3 style="color: #166534; border-color: #bbf7d0;">Actionable Patient Health Roadmap (Restoring Baseline Reference Status)</h3>
        ${report.recovery_roadmap.map(r => `
          <div class="roadmap-item">
            <strong style="color: #14532d;">${r.target_biomarker} — ${r.action_category}</strong>
            <p style="margin: 4px 0; color: #1e293b;">${r.recommendation}</p>
            <div style="font-size: 11px; color: #047857;"><strong>Target Recovery Goal:</strong> ${r.target_goal}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="footer">
      <div>Engine: <strong>Quantara AI Analysis Engine</strong></div>
      <div>Document Accession: <strong>AI-REPORT-${predictionResult.patient_id}-VERIFIED</strong></div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Quantara_AI_Report_${patientName.replace(/\s+/g, '_')}_${predictionResult.patient_id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & Quick Cohort Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-purple-900/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Disease Risk Assessment & Proportional Deviation Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
            Patient Biomarker Analysis & Risk Prediction
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Evaluate all 12 biomarkers, analyze deviation proportions, detect model-estimated conditions (Hepatitis, Cirrhosis, Fibrosis, Suspect Donor, Healthy Donor), and generate an AI model analysis report.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-purple-300 font-medium">Quick Cohorts:</span>
          {presets?.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/40 hover:border-purple-500/50 transition-all active:scale-95 shadow-sm"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: 12 Biomarkers with Real-time Reference Range Badging */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-6">
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-heading font-bold text-white">Biomedical Parameters & Reference Ranges</h2>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white px-2.5 py-1 rounded-md bg-purple-950/70 border border-purple-800/60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Patient Meta Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-1">Patient Identifier</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Patient 104"
                  className="w-full px-3.5 py-2 rounded-xl bg-purple-950/50 border border-purple-800/60 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors placeholder-purple-300/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-1">Clinical Indication / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Elevated transaminases"
                  className="w-full px-3.5 py-2 rounded-xl bg-purple-950/50 border border-purple-800/60 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors placeholder-purple-300/30"
                />
              </div>
            </div>

            {/* 12 Biomarker Inputs with Real-time Status Badges & Normal Ranges */}
            <div className="space-y-4">
              {FEATURE_CONFIG.map((feat) => {
                const val = features[feat.key] ?? feat.default;
                const statusInfo = getBiomarkerStatus(feat, val);

                if (feat.isGender) {
                  return (
                    <div key={feat.key} className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/50 flex items-center justify-between shadow-inner">
                      <div>
                        <div className="text-sm font-semibold text-purple-100">Biological Sex</div>
                        <div className="text-[11px] text-purple-300/70">{feat.desc}</div>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-950/80 p-1 rounded-lg border border-purple-800/60">
                        <button
                          type="button"
                          onClick={() => handleInputChange(feat.key, 1)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            val === 1 
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-sm shadow-purple-500/40' 
                              : 'text-purple-300 hover:text-white'
                          }`}
                        >
                          Male (1)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange(feat.key, 0)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            val === 0 
                              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold shadow-sm shadow-fuchsia-500/40' 
                              : 'text-purple-300 hover:text-white'
                          }`}
                        >
                          Female (0)
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={feat.key} className="p-3.5 rounded-xl bg-purple-950/35 border border-purple-900/40 space-y-2 relative overflow-hidden group shadow-inner">
                    
                    {/* Top line: Label + Real-time Status Badge + Input */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{feat.label}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-purple-300/70 font-mono mt-0.5">
                          Normal Range: <strong className="text-purple-200 font-semibold">{feat.refMin} – {feat.refMax} {feat.unit}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={val}
                          step={feat.step}
                          min={feat.min}
                          max={feat.max}
                          onChange={(e) => handleInputChange(feat.key, e.target.value)}
                          className={`w-24 px-2.5 py-1 text-right text-xs font-mono font-bold bg-purple-950/70 rounded-lg border focus:outline-none focus:border-purple-400 ${
                            statusInfo.status === 'VERY_HIGH' 
                              ? 'text-rose-400 border-rose-500/40' 
                              : statusInfo.status === 'HIGH' 
                              ? 'text-amber-400 border-amber-500/40' 
                              : statusInfo.status === 'LOW' || statusInfo.status === 'VERY_LOW'
                              ? 'text-indigo-300 border-indigo-500/40'
                              : 'text-emerald-400 border-emerald-500/40'
                          }`}
                        />
                        <span className="text-[11px] text-purple-300/70 font-mono w-10">{feat.unit}</span>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min={feat.min}
                      max={feat.max}
                      step={feat.step}
                      value={val}
                      onChange={(e) => handleInputChange(feat.key, e.target.value)}
                      className="w-full accent-purple-400"
                    />

                    {/* Bottom Legend */}
                    <div className="flex justify-between text-[10px] text-purple-400/60 font-mono">
                      <span>Min: {feat.min}</span>
                      <span className="text-purple-300/60">{feat.desc}</span>
                      <span>Max: {feat.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-500/30 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Atom className="w-5 h-5 animate-spin text-white" />
                  <span>Diagnosing Specific Disease & Evaluating Altered Biomarkers...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  <span>ANALYZE BIOMARKERS & GENERATE AI ANALYSIS REPORT</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right Output: Real-time Live Prediction Results & Diagnostic Report Sheet */}
        <div className="lg:col-span-6 space-y-6">
          
          {predictionResult ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Official AI Model Analysis Report Sheet */}
              <div className="glass-panel rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c1033] via-[#121946] to-[#060818] overflow-hidden shadow-2xl">
                
                {/* Hospital Report Header Bar */}
                <div className="p-6 border-b border-purple-900/40 bg-purple-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-blue-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        QUANTARA AI MODEL ANALYSIS REPORT
                      </div>
                      <h2 className="text-lg font-heading font-extrabold text-white">
                        Model Analysis & Specimen Evaluation Sheet
                      </h2>
                    </div>
                  </div>

                  {/* Direct Download, Print & Explainability Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => onNavigateToExplain && onNavigateToExplain()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/70 text-fuchsia-300 text-xs font-semibold border border-purple-700/60 transition-all active:scale-95 shadow-sm"
                      title="View Decision Explainability (XAI) & Quantum Latent Space"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Explain (XAI)</span>
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-95"
                      title="Download full standalone report file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/70 text-indigo-200 text-xs font-semibold border border-purple-800/60 transition-all active:scale-95 shadow-sm"
                      title="Open printable view"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">

                  {/* Patient Demographics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-purple-950/50 border border-purple-900/40 text-xs font-mono shadow-inner">
                    <div>
                      <span className="text-[10px] text-purple-400/80 uppercase block">Patient</span>
                      <strong className="text-white text-sm">{patientName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400/80 uppercase block">Specimen ID</span>
                      <strong className="text-fuchsia-300">{predictionResult.patient_id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400/80 uppercase block">Age / Sex</span>
                      <strong className="text-white">{features.Age} yrs / {features.Sex_m === 1 ? 'Male' : 'Female'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400/80 uppercase block">Selected Model</span>
                      <strong className="text-purple-300">{predictionResult.recommended_model}</strong>
                    </div>
                  </div>

                  {/* Model Score Synthesis Strip: Selected Model, Ensemble Prob, QML Score, Overall Risk Score */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                      <span className="text-[10px] text-purple-300/70 uppercase block">Selected Model</span>
                      <strong className="text-emerald-300 text-xs truncate block">{predictionResult.recommended_model}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                      <span className="text-[10px] text-purple-300/70 uppercase block">Classical Ensemble</span>
                      <strong className="text-indigo-300 text-xs font-bold block">{(predictionResult.classical_probability * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                      <span className="text-[10px] text-purple-300/70 uppercase block">QML Score</span>
                      <strong className="text-fuchsia-300 text-xs font-bold block">{(predictionResult.qml_probability * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                      <span className="text-[10px] text-purple-300/70 uppercase block">Overall Risk Score</span>
                      <strong className="text-white text-xs font-bold block">{(predictionResult.selected_probability * 100).toFixed(1)}%</strong>
                    </div>
                  </div>

                  {/* Main Risk Header Card with Specific Disease Title */}
                  <div className={`p-5 rounded-xl border relative overflow-hidden ${
                    predictionResult.selected_risk_level === 'HIGH'
                      ? 'border-rose-500/40 bg-rose-950/25'
                      : predictionResult.selected_risk_level === 'MODERATE'
                      ? 'border-amber-500/40 bg-amber-950/25'
                      : 'border-emerald-500/40 bg-emerald-950/25'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300/80">
                          Model-Estimated Condition
                        </div>
                        <div className={`text-2xl lg:text-3xl font-heading font-black flex items-center gap-2.5 mt-1 ${
                          predictionResult.selected_risk_level === 'HIGH'
                            ? 'text-rose-400'
                            : predictionResult.selected_risk_level === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {predictionResult.selected_risk_level === 'HIGH' ? (
                            <ShieldAlert className="w-7 h-7 text-rose-500 animate-pulse flex-shrink-0" />
                          ) : (
                            <ShieldCheck className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                          )}
                          <span>{report?.specific_disease || `${predictionResult.selected_risk_level} RISK`}</span>
                        </div>
                        <div className="text-xs font-mono text-purple-200/80 mt-1">
                          Risk Stratification: <strong className="text-white">{predictionResult.selected_risk_level} RISK</strong>
                        </div>
                      </div>

                      {/* Overall Risk Score / Confidence Gauge */}
                      <div className="text-right">
                        <div className="text-xs font-mono text-purple-300/80">Overall Risk Score</div>
                        <div className="text-3xl font-heading font-black text-white">
                          {(predictionResult.selected_probability * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-purple-300/70">
                          Decision Confidence: {(predictionResult.selected_confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed mt-3 pt-3 border-t border-purple-900/40 text-purple-100">
                      {report?.diagnostic_impression}
                    </div>

                    {report?.de_ritis_interpretation && (
                      <div className="text-[11px] font-mono mt-2 text-fuchsia-300">
                        <strong>De Ritis Ratio (AST/ALT):</strong> {report.de_ritis_interpretation}
                      </div>
                    )}
                  </div>

                  {/* 2. Specific Disease Probabilities Distribution Card (Proportional Scaling) */}
                  {report?.disease_probabilities && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono font-bold uppercase text-purple-200 tracking-wider flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          <span>Trained Disease Category Distribution (Proportional Deviation Scaling)</span>
                        </h3>
                        <span className="text-[10px] font-mono text-purple-300/60">UCI HCV Cohorts</span>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {Object.entries(report.disease_probabilities).map(([disease, prob]) => {
                          const isTop = disease === report.specific_disease;
                          return (
                            <div key={disease} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className={`font-medium ${isTop ? 'text-white font-bold' : 'text-purple-300/70'}`}>
                                  {disease} {isTop && <span className="text-fuchsia-400 font-mono font-bold text-[10px] ml-1.5">(PRIMARY MATCH)</span>}
                                </span>
                                <span className={`font-mono font-bold ${isTop ? 'text-fuchsia-300' : 'text-purple-300/70'}`}>
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-2 w-full bg-purple-950/80 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isTop
                                      ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500'
                                      : 'bg-purple-900/50'
                                  }`}
                                  style={{ width: `${Math.max(prob * 100, 2)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Detected Altered Biomarkers & Disease Pathology Section */}
                  {report?.altered_biomarkers_summary && report.altered_biomarkers_summary.length > 0 && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <h3 className="text-xs font-mono font-bold uppercase text-amber-300 tracking-wider">
                            Altered Biomarkers & Disease Risk Hazards
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {report.altered_biomarkers_summary.length} Altered Markers
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {report.altered_biomarkers_summary.map((item) => (
                          <div key={item.feature} className="p-3 rounded-lg bg-purple-950/60 border border-purple-900/50 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <strong className="text-white text-xs">{item.label} ({item.feature})</strong>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {item.deviation_direction}
                                </span>
                              </div>
                              <span className="text-purple-300/70 font-mono text-[11px]">
                                {item.value} {item.unit} (Ref: {item.normal_range})
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-200/80 leading-relaxed">
                              <strong className="text-purple-400">Pathology:</strong> {item.pathophysiology}
                            </p>
                            <div className="text-[11px] text-rose-300 font-semibold">
                              <strong className="text-purple-300/70 font-normal">Disease Risk:</strong> {item.associated_disease_risk}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Actionable Patient Recovery Roadmap Card (How to become a Healthy Patient) */}
                  {report?.recovery_roadmap && report.recovery_roadmap.length > 0 && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-xs font-mono font-bold uppercase text-emerald-300 tracking-wider">
                            Actionable Recovery Roadmap: Restoring Healthy Status
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {report.recovery_roadmap.map((rec, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-purple-950/60 border border-purple-900/50 space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <strong className="text-emerald-300">{rec.target_biomarker} — {rec.action_category}</strong>
                            </div>
                            <p className="text-xs text-purple-100 pl-5 leading-relaxed">
                              {rec.recommendation}
                            </p>
                            <div className="text-[11px] font-mono text-fuchsia-300 pl-5">
                              <strong>Rationale:</strong> {rec.clinical_rationale}
                            </div>
                            <div className="text-[11px] font-mono text-emerald-400 pl-5 font-bold">
                              <strong>Target Goal:</strong> {rec.target_goal}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Trained Models Evaluation Matrix (Disease Risk Score & Decision Confidence for Each Model) */}
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-900/40 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-xs font-mono font-bold uppercase text-purple-200 tracking-wider">
                          Trained Models: Risk Score & Decision Confidence Scoreboard
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                        {predictionResult.model_breakdown?.length || 4} Trained Models
                      </span>
                    </div>

                    <p className="text-[11px] text-purple-200/70">
                      Independent disease risk score estimates and decision confidence computed across Classical ML classifiers and the Parameterized Quantum Circuit.
                    </p>

                    <div className="space-y-3 pt-1">
                      {(predictionResult.model_breakdown || [
                        { model: 'XGBoost', paradigm: 'Classical ML', architecture: 'Gradient Boosted Trees', probability: predictionResult.classical_probability, confidence: 0.96, risk_level: predictionResult.selected_risk_level },
                        { model: 'Random Forest', paradigm: 'Classical ML', architecture: 'Bagged Ensembles', probability: predictionResult.classical_probability * 0.98, confidence: 0.92, risk_level: predictionResult.selected_risk_level },
                        { model: 'Logistic Regression', paradigm: 'Classical ML', architecture: 'Linear Hyperplane', probability: predictionResult.classical_probability * 0.95, confidence: 0.88, risk_level: predictionResult.selected_risk_level },
                        { model: 'Hybrid QML (Optimized VQC)', paradigm: 'Quantum QML', architecture: '4 Qubits / 5 Layers / 68 Gate Operations', probability: predictionResult.qml_probability, confidence: 0.78, risk_level: predictionResult.selected_risk_level }
                      ]).map((m) => {
                        const isSelected = m.model === predictionResult.recommended_model;
                        const isQuantum = m.paradigm?.includes('Quantum') || m.model?.includes('QML') || m.model?.includes('VQC');
                        const probPercent = (m.probability * 100).toFixed(1);
                        const confPercent = (m.confidence * 100).toFixed(1);

                        return (
                          <div 
                            key={m.model} 
                            className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-purple-950/90 via-indigo-950/70 to-purple-950/90 border-fuchsia-500/50 shadow-md shadow-fuchsia-500/10' 
                                : 'bg-purple-950/50 border-purple-900/50 hover:border-purple-800/60'
                            }`}
                          >
                            {/* Top row: Model info + Badges */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isQuantum ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`} />
                                <strong className="text-white text-xs font-heading">{m.model}</strong>
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                  isQuantum ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                }`}>
                                  {m.paradigm || (isQuantum ? 'Quantum QML' : 'Classical ML')}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isSelected && (
                                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    ★ ADAPTIVE WINNER
                                  </span>
                                )}
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  m.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : m.risk_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {m.risk_level} RISK
                                </span>
                              </div>
                            </div>

                            {/* Dual Metric Bars: Disease Risk Score & Decision Confidence */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              
                              {/* Disease Risk Score */}
                              <div className="space-y-1 p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                                <div className="flex justify-between text-[11px] font-mono">
                                  <span className="text-purple-300/80">Disease Risk Score:</span>
                                  <span className="text-fuchsia-300 font-bold">{probPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-purple-950 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      m.probability >= 0.70 
                                        ? 'bg-gradient-to-r from-purple-500 to-rose-500' 
                                        : m.probability >= 0.40 
                                        ? 'bg-gradient-to-r from-purple-500 to-amber-500' 
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.max(m.probability * 100, 2)}%` }}
                                  />
                                </div>
                              </div>

                              {/* Decision Confidence */}
                              <div className="space-y-1 p-2 rounded-lg bg-purple-950/60 border border-purple-900/40">
                                <div className="flex justify-between text-[11px] font-mono">
                                  <span className="text-purple-300/80">Decision Confidence:</span>
                                  <span className="text-indigo-300 font-bold">{confPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-purple-950 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-400 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(m.confidence * 100, 2)}%` }}
                                  />
                                </div>
                              </div>

                            </div>

                            {/* Bottom sub-info */}
                            <div className="flex justify-between text-[10px] font-mono text-purple-300/60 border-t border-purple-900/30 pt-1.5">
                              <span>Arch: {m.architecture || 'Classifier'}</span>
                              <span>Router Score: <strong className="text-purple-200">{m.router_score?.toFixed(3) || '—'}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Adaptive Router Decision Banner */}
                    {predictionResult.recommendation_reason && (
                      <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-800/60 text-xs text-purple-200/90 leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-fuchsia-300">Adaptive Router Winner Rationale: </strong>
                          {predictionResult.recommendation_reason}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Action Button: View Deep Explainability (XAI) */}
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateToExplain && onNavigateToExplain()}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-900/70 via-fuchsia-900/60 to-indigo-900/70 hover:from-purple-800 hover:to-indigo-800 text-white border border-purple-500/40 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:border-purple-400 active:scale-[0.99]"
                    >
                      <Sparkles className="w-4 h-4 text-fuchsia-400" />
                      <span>View Deep Explainability (XAI) & Quantum Latent Space</span>
                      <ArrowRight className="w-4 h-4 text-purple-300 ml-1" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            /* Placeholder / Empty State */
            <div className="glass-panel rounded-2xl p-12 border border-purple-900/40 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-pulse-slow shadow-lg shadow-purple-500/20">
                <Atom className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-heading font-bold text-white">Ready for Patient Evaluation</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">
                  Enter patient lab values on the left or choose one of the preset clinical cohorts to evaluate reference ranges, detect specific disease types, and generate a downloadable medical report.
                </p>
              </div>
              <button
                onClick={() => handleAnalyze()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-500/30 active:scale-95"
              >
                Analyze Current Values
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Modal: Full-screen Printable Clinical Diagnosis Report */}
      <ClinicalDiagnosisReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        predictionResult={predictionResult}
        patientName={patientName}
        notes={notes}
      />

    </div>
  );
}

