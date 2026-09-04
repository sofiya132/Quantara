import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import PatientPredictionView from './components/PatientPredictionView';
import ExplainabilityView from './components/ExplainabilityView';
import ModelComparisonView from './components/ModelComparisonView';
import QuantumFeasibilityView from './components/QuantumFeasibilityView';
import DatasetAnalysisView from './components/DatasetAnalysisView';
import PredictionHistoryView from './components/PredictionHistoryView';

import { 
  fetchHealth, 
  fetchPresetPatients, 
  fetchModelComparison, 
  fetchQuantumFeasibility, 
  fetchDatasetAnalysis, 
  fetchHistory 
} from './api';
import { Atom, ShieldCheck, HeartPulse, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthData, setHealthData] = useState(null);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [feasibilityData, setFeasibilityData] = useState(null);
  const [datasetData, setDatasetData] = useState(null);

  // Load initial system data on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [h, p, c, q, d] = await Promise.allSettled([
          fetchHealth(),
          fetchPresetPatients(),
          fetchModelComparison(),
          fetchQuantumFeasibility(),
          fetchDatasetAnalysis()
        ]);

        if (h.status === 'fulfilled') setHealthData(h.value);
        if (p.status === 'fulfilled') {
          setPresets(p.value);
          if (p.value?.length > 0 && !currentFeatures) {
            setCurrentFeatures(p.value[0].features);
          }
        }
        if (c.status === 'fulfilled') setComparisonData(c.value);
        if (q.status === 'fulfilled') setFeasibilityData(q.value);
        if (d.status === 'fulfilled') setDatasetData(d.value);
      } catch (err) {
        console.warn('Initial data fetch warning:', err);
      }
    };
    initData();
  }, []);

  const handleLoadPresetFromDashboard = (preset) => {
    setSelectedPreset(preset);
    setCurrentFeatures(preset.features);
    setActiveTab('prediction');
  };

  const handlePredictionCompleted = (prediction) => {
    setLastPrediction(prediction);
    setCurrentFeatures(prediction.features);
  };

  const handleLoadHistoricalPatient = (historyItem) => {
    const p = {
      name: historyItem.patient_name || `Patient ${historyItem.id}`,
      description: historyItem.notes || `Loaded from audit history (${historyItem.risk_level} Risk)`,
      category: 'Historical Record',
      features: historyItem.features
    };
    setSelectedPreset(p);
    setCurrentFeatures(p.features);
    setActiveTab('prediction');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060818] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        healthData={healthData} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView 
            onNavigateToPrediction={() => setActiveTab('prediction')}
            onLoadPreset={handleLoadPresetFromDashboard}
            presets={presets}
            comparisonData={comparisonData}
            datasetData={datasetData}
          />
        )}

        {activeTab === 'prediction' && (
          <PatientPredictionView 
            presets={presets}
            selectedPreset={selectedPreset}
            onNavigateToExplain={() => setActiveTab('explainability')}
            onPredictionCompleted={handlePredictionCompleted}
          />
        )}

        {activeTab === 'explainability' && (
          <ExplainabilityView 
            lastPrediction={lastPrediction}
            currentFeatures={currentFeatures}
            presets={presets}
            onSelectPreset={(preset) => {
              setSelectedPreset(preset);
              setCurrentFeatures(preset.features);
            }}
            onNavigateToPrediction={() => setActiveTab('prediction')}
            onPredictionUpdate={(prediction) => {
              setLastPrediction(prediction);
              setCurrentFeatures(prediction.features);
            }}
          />
        )}

        {activeTab === 'benchmarks' && (
          <ModelComparisonView 
            comparisonData={comparisonData}
          />
        )}

        {activeTab === 'quantum' && (
          <QuantumFeasibilityView 
            feasibilityData={feasibilityData}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetAnalysisView 
            datasetData={datasetData}
          />
        )}

        {activeTab === 'history' && (
          <PredictionHistoryView 
            onLoadHistoricalPatient={handleLoadHistoricalPatient}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-purple-500/15 py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-300">QUANTARA</span>
            <span>— Hybrid Quantum Machine Learning Healthcare Integration</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>FastAPI + PennyLane + React + Tailwind</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">Member 5 Integration</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
