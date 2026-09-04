import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  Atom, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Calendar, 
  Hash, 
  Stethoscope,
  ArrowRight,
  HeartPulse,
  Sparkles,
  Layers,
  TrendingDown,
  Target
} from 'lucide-react';

export default function ClinicalDiagnosisReportModal({ 
  isOpen, 
  onClose, 
  predictionResult, 
  patientName, 
  notes 
}) {
  if (!isOpen || !predictionResult) return null;

  const report = predictionResult.clinical_report || {};
  const isHighRisk = predictionResult.selected_risk_level === 'HIGH';
  const isModRisk = predictionResult.selected_risk_level === 'MODERATE';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090d26] border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/80 overflow-hidden my-8">
        
        {/* Top Control Bar (Screen Only) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-purple-900/50 bg-purple-950/90">
          <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>AI Model Analysis & Patient Evaluation Report</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-900/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Hospital Report Document */}
        <div className="p-8 space-y-6 text-purple-100 bg-[#06081e] print:bg-white print:text-black print:p-0">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/50 print:border-black pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
                <Atom className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-extrabold text-white print:text-black tracking-tight">
                  QUANTARA AI MODEL ANALYSIS REPORT
                </h1>
                <p className="text-xs text-indigo-300 print:text-gray-600 font-mono font-semibold">
                  HYBRID QUANTUM-CLASSICAL MACHINE LEARNING SYSTEM
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono space-y-0.5">
              <div className="text-purple-300/70 print:text-gray-700">REPORT ID: <strong className="text-white print:text-black">{report.report_id || 'REP-QML-884'}</strong></div>
              <div className="text-purple-300/70 print:text-gray-700">EVALUATION DATE: <strong className="text-white print:text-black">{predictionResult.timestamp}</strong></div>
              <div className="text-purple-300/70 print:text-gray-700">ENGINE: <strong className="text-indigo-300 print:text-black">Quantara AI Analysis Engine</strong></div>
            </div>
          </div>

          {/* Patient Demographics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-purple-950/40 print:bg-gray-100 border border-purple-900/50 print:border-gray-300 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-purple-300/70 print:text-gray-600 block">Patient Name</span>
              <strong className="text-white print:text-black text-sm">{patientName || 'Anonymous Patient'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-purple-300/70 print:text-gray-600 block">Specimen ID</span>
              <strong className="text-fuchsia-300 print:text-black font-mono">{predictionResult.patient_id}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-purple-300/70 print:text-gray-600 block">Age / Sex</span>
              <strong className="text-white print:text-black">{predictionResult.features?.Age} yrs / {predictionResult.features?.Sex_m === 1 ? 'Male' : 'Female'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-purple-300/70 print:text-gray-600 block">Model-Estimated Condition</span>
              <strong className="text-rose-400 print:text-red-700 font-bold">{report.specific_disease || 'Evaluated'}</strong>
            </div>
          </div>

          {/* Primary Diagnosis & Risk Stratification Banner */}
          <div className={`p-5 rounded-xl border ${
            isHighRisk
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300 print:bg-red-50 print:border-red-400 print:text-red-900'
              : isModRisk
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300 print:bg-amber-50 print:border-amber-400 print:text-amber-900'
              : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 print:bg-green-50 print:border-green-400 print:text-green-900'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                {isHighRisk ? <ShieldAlert className="w-5 h-5 text-rose-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                <span>PRIMARY MODEL ASSESSMENT: {predictionResult.selected_risk_level} RISK</span>
              </div>
              <span className="text-xs font-mono font-bold">
                OVERALL RISK SCORE: {(predictionResult.selected_probability * 100).toFixed(1)}% | ESTIMATED CONDITION: {report.specific_disease}
              </span>
            </div>

            <div className="text-xs leading-relaxed mt-2 text-purple-100 print:text-gray-800">
              {report.diagnostic_impression}
            </div>

            {report.de_ritis_interpretation && (
              <div className="text-[11px] font-mono mt-2 pt-2 border-t border-purple-900/40 print:border-gray-300 text-purple-300 print:text-blue-900">
                <strong>De Ritis Ratio (AST/ALT):</strong> {report.de_ritis_interpretation}
              </div>
            )}
          </div>

          {/* Disease Category Probabilities Distribution (Trained Categories) */}
          {report.disease_probabilities && (
            <div className="p-4 rounded-xl bg-purple-950/40 print:bg-gray-100 border border-purple-900/50 print:border-gray-300 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-purple-200 print:text-gray-800 tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-fuchsia-400" />
                <span>Multi-Class Disease Classification Distribution (UCI HCV Trained Cohorts)</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(report.disease_probabilities).map(([disease, prob]) => {
                  const isTop = disease === report.specific_disease;
                  return (
                    <div key={disease} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={`font-medium ${isTop ? 'text-white font-bold print:text-black' : 'text-purple-300/70 print:text-gray-600'}`}>
                          {disease} {isTop && <span className="text-fuchsia-400 print:text-blue-700 text-[10px] font-mono font-bold ml-1.5">(PRIMARY MATCH)</span>}
                        </span>
                        <span className={`font-mono ${isTop ? 'text-fuchsia-300 font-bold print:text-black' : 'text-purple-300/70 print:text-gray-600'}`}>
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-purple-950 print:bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop
                              ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 print:bg-blue-600'
                              : 'bg-purple-800/60 print:bg-gray-400'
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



          {/* Altered Biomarkers Detailed Pathology Table */}
          {report.altered_biomarkers_summary && report.altered_biomarkers_summary.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-amber-400 print:text-amber-700 tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Altered Biomarkers & Pathophysiological Disease Risk Analysis</span>
              </h3>
              <div className="space-y-2.5">
                {report.altered_biomarkers_summary.map((item) => (
                  <div key={item.feature} className="p-3.5 rounded-xl bg-purple-950/50 print:bg-gray-100 border border-amber-500/30 print:border-amber-300 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white print:text-black text-sm">{item.label} ({item.feature})</strong>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 print:bg-amber-200 print:text-amber-900">
                          {item.deviation_direction}
                        </span>
                      </div>
                      <div className="text-purple-300/70 print:text-gray-700 font-mono text-[11px]">
                        Value: <strong className="text-white print:text-black">{item.value} {item.unit}</strong> (Ref: {item.normal_range})
                      </div>
                    </div>
                    <div className="text-[11px] text-purple-200/90 print:text-gray-800 leading-relaxed">
                      <strong className="text-purple-300/70 print:text-gray-700">Mechanism:</strong> {item.pathophysiology}
                    </div>
                    <div className="text-[11px] text-rose-300 print:text-red-700 font-semibold">
                      <strong className="text-purple-300/70 print:text-gray-700 font-normal">Associated Disease Risk:</strong> {item.associated_disease_risk}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Patient Recovery Roadmap to Return to Healthy Patient */}
          {report.recovery_roadmap && report.recovery_roadmap.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 print:text-green-700 tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Actionable Recovery Roadmap: Restoring Biomarkers to Healthy Reference Ranges</span>
              </h3>
              <div className="space-y-2.5">
                {report.recovery_roadmap.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-purple-950/40 print:bg-green-50 border border-emerald-500/30 print:border-green-300 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-green-700 flex-shrink-0" />
                        <strong className="text-emerald-300 print:text-green-900">{rec.target_biomarker} — {rec.action_category}</strong>
                      </div>
                    </div>
                    <p className="text-xs text-purple-100 print:text-gray-800 pl-6 leading-relaxed">
                      {rec.recommendation}
                    </p>
                    <div className="text-[11px] font-mono text-purple-300 print:text-blue-800 pl-6">
                      <strong>Clinical Rationale:</strong> {rec.clinical_rationale}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 print:text-green-800 pl-6 font-bold">
                      <strong>Target Recovery Goal:</strong> {rec.target_goal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantitative Specimen Table */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-purple-300/70 print:text-gray-700 tracking-wider mb-2">
              Complete Laboratory Specimen Quantitative Panel
            </h3>
            <div className="overflow-x-auto border border-purple-900/50 print:border-gray-300 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-950/60 print:bg-gray-200 text-purple-300 uppercase font-mono text-[10px] border-b border-purple-900/50 print:border-gray-300">
                  <tr>
                    <th className="py-2.5 px-3">Analyte / Biomarker</th>
                    <th className="py-2.5 px-3 text-right">Result</th>
                    <th className="py-2.5 px-3 text-right">Normal Reference Range</th>
                    <th className="py-2.5 px-3 text-center">Status Flag</th>
                    <th className="py-2.5 px-3">Clinical Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30 print:divide-gray-200 font-mono">
                  {report.biomarkers_analysis?.map((item) => {
                    const isAbnormal = item.status !== 'NORMAL';
                    const isHigh = item.status === 'HIGH' || item.status === 'VERY_HIGH';

                    return (
                      <tr key={item.feature} className="hover:bg-purple-950/40 print:hover:bg-transparent">
                        <td className="py-2 px-3 font-sans font-bold text-white print:text-black">
                          {item.label} ({item.feature})
                        </td>
                        <td className={`py-2 px-3 text-right font-bold ${
                          isHigh ? 'text-rose-400 print:text-red-600' : isAbnormal ? 'text-amber-400 print:text-amber-600' : 'text-emerald-400 print:text-green-700'
                        }`}>
                          {item.value} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-right text-purple-300/70 print:text-gray-600">
                          {item.normal_min} – {item.normal_max} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'VERY_HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 print:bg-red-100 print:text-red-800'
                              : item.status === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 print:bg-amber-100 print:text-amber-800'
                              : item.status === 'LOW' || item.status === 'VERY_LOW'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 print:bg-blue-100 print:text-blue-800'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:bg-green-100 print:text-green-800'
                          }`}>
                            {item.status_label}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-purple-200/80 print:text-gray-700 text-[11px]">
                          {item.clinical_meaning}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Block & Disclaimer */}
          <div className="pt-6 border-t border-purple-900/50 print:border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-purple-300/70 print:text-gray-600 font-mono">
            <div className="space-y-1">
              <div>ANALYSIS ENGINE: <strong>Quantara AI Analysis Engine</strong></div>
              <div>VERIFICATION CODE: <strong>QML-SIGN-{predictionResult.patient_id}-VERIFIED</strong></div>
            </div>
            <div className="text-right space-y-1">
              <div className="italic">AI Model Analysis & Evaluation System</div>
              <div className="text-[10px] text-purple-400/50 print:text-gray-500">For Investigational & Benchmarking Evaluation</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

