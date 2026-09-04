import React from 'react';
import {
  Atom,
  Activity,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Database,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

export default function DashboardView({
  onNavigateToPrediction,
  onLoadPreset,
  presets,
  recentHistory,
  comparisonData,
  datasetData
}) {
  const radarData = [
    { metric: 'Accuracy', Classical: 99.2, Quantum: 83.7 },
    { metric: 'Precision', Classical: 100.0, Quantum: 36.8 },
    { metric: 'Recall', Classical: 93.3, Quantum: 46.7 },
    { metric: 'Specificity', Classical: 100.0, Quantum: 88.9 },
    { metric: 'ROC-AUC', Classical: 99.8, Quantum: 81.4 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Hero / Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 lg:p-8 border border-purple-500/25 quantum-border">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-600/15 via-fuchsia-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-sm">
              <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Hybrid AI for Early Disease Detection</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300">Next-generation early disease detection with hybrid AI</span>
            </h1>
            <p className="text-sm text-purple-200/80 leading-relaxed">
              Quantara combines classical machine learning, quantum machine learning, and explainable AI to support early disease risk assessment.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={onNavigateToPrediction}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/30 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Patient Predictor</span>
            </button>
            <button
              onClick={() => onNavigateToPrediction()}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 text-sm font-semibold transition-all shadow-sm"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span>View Explainability</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="glass-card rounded-xl p-5 border border-purple-900/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">Dataset Records</span>
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-heading text-white">615</div>
            <div className="text-xs text-purple-300/70 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">12 Biomarkers</span>
              <span>• 0 Missing values</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 opacity-60" />
        </div>

        <div className="glass-card rounded-xl p-5 border border-purple-900/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">Quantum Architecture</span>
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Atom className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-heading text-purple-300">4 Qubits / 5 Layers</div>
            <div className="text-xs text-purple-300/70 mt-1 flex items-center gap-1.5">
              <span className="text-fuchsia-400 font-medium">59.8% Variance</span>
              <span>• Ring Entanglement</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 opacity-60" />
        </div>

        <div className="glass-card rounded-xl p-5 border border-purple-900/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">Classical Best AUC</span>
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-heading text-emerald-400">0.998</div>
            <div className="text-xs text-purple-300/70 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">XGBoost</span>
              <span>• 99.2% Accuracy</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 opacity-60" />
        </div>

        <div className="glass-card rounded-xl p-5 border border-purple-900/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">QML Feasibility</span>
            <div className="p-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-heading text-fuchsia-300">NISQ-Compatible</div>
            <div className="text-xs text-purple-300/70 mt-1 flex items-center gap-1.5">
              <span className="text-fuchsia-400 font-medium">~0.81% Noise Sim</span>
              <span>• 68 Gate Operations</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500 opacity-60" />
        </div>

      </div>

      {/* Main Grid: Presets & Model Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Preset Patients (1-Click Test Runs) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Instant Clinical Presets</span>
              </h2>
              <p className="text-xs text-purple-200/70">
                1-click clinical cohorts configured from real UCI Hepatitis C patient profiles for judge verification.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/50 shadow-sm">
              5 Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {presets?.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onLoadPreset(preset)}
                className="glass-card rounded-xl p-4 border border-purple-900/30 hover:border-purple-500/50 cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${preset.risk_expected === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : preset.risk_expected === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                      {preset.risk_expected} RISK
                    </span>
                    <span className="text-[11px] text-purple-300/60 font-mono">Age {preset.features.Age}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-purple-200/60 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-purple-400 font-medium pt-2 border-t border-purple-900/40">
                  <span>Load into Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Radar Benchmark Comparison */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-fuchsia-400" />
              <span>Classical vs QML Capabilities</span>
            </h2>
            <p className="text-xs text-purple-200/70">
              Multi-metric capability radar across test set benchmark metrics.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1e265c" />
                <PolarAngleAxis dataKey="metric" stroke="#a5b4fc" tick={{ fill: '#a5b4fc', fontSize: 11 }} />
                <Radar name="Classical ML" dataKey="Classical" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Radar name="Hybrid QML" dataKey="Quantum" stroke="#818cf8" fill="#6366f1" fillOpacity={0.35} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1338', borderColor: '#3344a0', borderRadius: '8px', fontSize: '12px', color: '#f1f3fd' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-purple-900/40 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/80" />
              <span className="text-slate-300">Classical ML (XGBoost)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-400" />
              <span className="text-indigo-300">Hybrid QML (VQC)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Predictions Feed & Architecture Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* End-to-end Pipeline Steps */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-fuchsia-400" />
            <span>End-to-End System Execution Flow</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/50 space-y-1.5 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto text-xs font-bold font-mono">1</div>
              <div className="text-xs font-semibold text-slate-200">Patient Input</div>
              <div className="text-[11px] text-purple-300/70">12 Cleaned Biomarkers</div>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/50 space-y-1.5 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto text-xs font-bold font-mono">2</div>
              <div className="text-xs font-semibold text-slate-200">Dual Processing</div>
              <div className="text-[11px] text-purple-300/70">PCA Angles + Standard Scaling</div>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/50 space-y-1.5 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center mx-auto text-xs font-bold font-mono">3</div>
              <div className="text-xs font-semibold text-slate-200">Ensemble & VQC</div>
              <div className="text-[11px] text-purple-300/70">3 Classical + 1 QML Engine</div>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/50 space-y-1.5 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xs font-bold font-mono">4</div>
              <div className="text-xs font-semibold text-slate-200">Adaptive Routing</div>
              <div className="text-[11px] text-purple-300/70">XAI & Recommendation</div>
            </div>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-amber-500/25 bg-amber-950/15 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">

            <span>MODEL INTERPRETATION</span>
          </div>
          <p className="text-xs text-purple-200/80 leading-relaxed">
            Classical ML and Hybrid QML models evaluate the patient's biomarker profile using standardized preprocessing and provide interpretable risk scores and feature-level insights. </p>
        </div>

      </div>

    </div>
  );
}

