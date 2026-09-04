import React, { useState, useEffect } from 'react';
import { 
  History, 
  Download, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  FileText,
  CheckCircle2,
  Atom,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { fetchHistory, deleteHistoryItem, clearAllHistory, getExportCsvUrl } from '../api';

export default function PredictionHistoryView({ onLoadHistoricalPatient }) {
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHistory(riskFilter);
      setHistoryList(data);
    } catch (err) {
      console.error('Failed to load history records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [riskFilter]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setHistoryList(prev => prev.filter(item => item.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all historical prediction records?')) {
      try {
        await clearAllHistory();
        setHistoryList([]);
        setSelectedRecord(null);
      } catch (err) {
        console.error('Clear all history failed:', err);
      }
    }
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(historyList, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `quantara_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = historyList.filter(item => {
    const matchesSearch = 
      searchTerm === '' ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.patient_name && item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.selected_model && item.selected_model.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const highRiskCount = historyList.filter(h => h.risk_level === 'HIGH').length;
  const modRiskCount = historyList.filter(h => h.risk_level === 'MODERATE').length;
  const lowRiskCount = historyList.filter(h => h.risk_level === 'LOW').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Audit Trail & Persistence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
            Patient Prediction History & Audit Records
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Persistent log of all evaluated patients with 1-click test reloading and clinical export capabilities.
          </p>
        </div>

        {/* Action Buttons: Export & Clear */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={getExportCsvUrl()}
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60 text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60 text-xs font-semibold transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Evaluations</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">{historyList.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-rose-500/20 text-center">
          <div className="text-[10px] text-rose-400 uppercase font-mono">High Risk Cases</div>
          <div className="text-2xl font-bold font-heading text-rose-400 mt-1">{highRiskCount}</div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-amber-500/20 text-center">
          <div className="text-[10px] text-amber-400 uppercase font-mono">Moderate Risk Cases</div>
          <div className="text-2xl font-bold font-heading text-amber-400 mt-1">{modRiskCount}</div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-emerald-500/20 text-center">
          <div className="text-[10px] text-emerald-400 uppercase font-mono">Low Risk Controls</div>
          <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">{lowRiskCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-purple-400/70 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, model..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-purple-950/70 border border-purple-800/60 rounded-xl text-white focus:outline-none focus:border-purple-400 placeholder-purple-300/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                riskFilter === risk
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'bg-purple-950/60 text-purple-300/70 hover:text-white border border-purple-900/50'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-950/60 text-purple-300 uppercase font-mono text-[10px] border-b border-purple-900/50">
                <tr>
                  <th className="py-3 px-4">Patient / ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Risk Level</th>
                  <th className="py-3 px-4 text-right">Probability</th>
                  <th className="py-3 px-4">Recommended Model</th>
                  <th className="py-3 px-4">Top Contributor</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {filteredHistory.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className={`hover:bg-purple-950/40 cursor-pointer transition-colors ${
                      selectedRecord?.id === item.id ? 'bg-purple-950/60' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{item.patient_name || 'Anonymous Patient'}</div>
                      <div className="text-[10px] text-purple-400/60 font-mono">ID: {item.id}</div>
                    </td>
                    <td className="py-3 px-4 text-purple-300/70 font-mono text-[11px]">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        item.risk_level === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.risk_level === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-fuchsia-300">
                      {(item.risk_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-purple-200/80 font-sans">
                      {item.selected_model}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800/60">
                        {item.top_contributor || 'AST'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadHistoricalPatient(item);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 border border-purple-500/40 text-[11px] font-semibold transition-all shadow-sm"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Load</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded text-purple-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-purple-300/50 space-y-2">
            <History className="w-8 h-8 mx-auto text-purple-400/40" />
            <p className="text-xs">No prediction history records found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Selected Record Detail Drawer / Card */}
      {selectedRecord && (
        <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-[#060818] space-y-4 animate-fadeIn shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase">Inspecting Audit Record</span>
              <h3 className="text-base font-heading font-bold text-white">
                {selectedRecord.patient_name} — {selectedRecord.timestamp}
              </h3>
            </div>
            <button
              onClick={() => onLoadHistoricalPatient(selectedRecord)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Load this Patient into Predictor</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {Object.entries(selectedRecord.features || {}).map(([k, v]) => (
              <div key={k} className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-900/50">
                <div className="text-[10px] text-purple-300/70 font-mono">{k}</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

