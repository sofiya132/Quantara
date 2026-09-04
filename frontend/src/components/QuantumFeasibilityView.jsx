import React, { useState } from 'react';
import { 
  Atom, 
  Cpu, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  CheckCircle2, 
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function QuantumFeasibilityView({ feasibilityData }) {
  const [selectedWire, setSelectedWire] = useState(null);

  const qubitScaling = feasibilityData?.qubit_scaling || [
    { features: 2, qubits: 2, layers: 3, total_gates: 15, simulation_time: 0.0302 },
    { features: 4, qubits: 4, layers: 3, total_gates: 33, simulation_time: 0.0495 },
    { features: 6, qubits: 6, layers: 3, total_gates: 51, simulation_time: 0.0723 },
    { features: 8, qubits: 8, layers: 3, total_gates: 69, simulation_time: 0.0962 },
  ];

  const depthScaling = feasibilityData?.depth_scaling || [
    { depth: 1, qubits: 4, total_gates: 11, simulation_time: 0.0240 },
    { depth: 2, qubits: 4, total_gates: 22, simulation_time: 0.0342 },
    { depth: 3, qubits: 4, total_gates: 33, simulation_time: 0.0457 },
    { depth: 4, qubits: 4, total_gates: 44, simulation_time: 0.0612 },
  ];

  const noiseAnalysis = feasibilityData?.noise_analysis || [
    { noise_model: 'Depolarizing 0.01 (Simulation Baseline)', ideal_output: 0.2204, noisy_output: 0.2122, absolute_diff: 0.0081, ideal_time: 0.055, noisy_time: 0.167 },
  ];

  const quantumWires = [
    { id: 0, label: 'q[0]', feature: 'PC1 (AST/ALT Enzyme Axis)', angle: 'θ₁ = -3.43', gates: ['RY', 'RZ', 'CNOT_ctrl', 'CNOT_tgt_close', '⟨Z⟩'] },
    { id: 1, label: 'q[1]', feature: 'PC2 (Albumin/Protein Axis)', angle: 'θ₂ = +2.18', gates: ['RY', 'RZ', 'CNOT_tgt', 'CNOT_ctrl', '⟨Z⟩'] },
    { id: 2, label: 'q[2]', feature: 'PC3 (Bilirubin/CHE Axis)', angle: 'θ₃ = +0.89', gates: ['RY', 'RZ', 'CNOT_tgt', 'CNOT_ctrl', '⟨Z⟩'] },
    { id: 3, label: 'q[3]', feature: 'PC4 (Creatinine/Renal Axis)', angle: 'θ₄ = -1.15', gates: ['RY', 'RZ', 'CNOT_tgt', 'CNOT_ctrl_close', '⟨Z⟩'] },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Atom className="w-4 h-4" />
            <span>Member 6 — Quantum Feasibility Analysis</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
            Variational Quantum Circuit Architecture & NISQ Compatibility
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Hardware requirements, gate counts, noise sensitivity, and simulation benchmark results.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-mono shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>NISQ-Compatible Architecture (Simulation)</span>
        </div>
      </div>

      {/* Hardware Feasibility Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Qubits Required</div>
          <div className="text-2xl font-bold font-heading text-purple-300">4 Qubits</div>
          <div className="text-[10px] text-purple-400/60">2⁴ = 16 State Dim</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Circuit Depth</div>
          <div className="text-2xl font-bold font-heading text-fuchsia-400">5 Layers</div>
          <div className="text-[10px] text-purple-400/60">Optimized VQC</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Gates</div>
          <div className="text-2xl font-bold font-heading text-white">{feasibilityData?.quantum_specs?.total_gates || 68} Gates</div>
          <div className="text-[10px] text-purple-400/60">8 Enc + 40 Rot + 20 CNOT</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Variance Retained</div>
          <div className="text-2xl font-bold font-heading text-emerald-400">59.8%</div>
          <div className="text-[10px] text-purple-400/60">4 PCA Components</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Simulator Status</div>
          <div className="text-2xl font-bold font-heading text-fuchsia-300">✓ Active</div>
          <div className="text-[10px] text-purple-400/60">PennyLane QNode</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Noise Drift</div>
          <div className="text-xl font-bold font-heading text-amber-400">~0.81%</div>
          <div className="text-[10px] text-purple-400/60">Simulated Deviation</div>
        </div>

      </div>

      {/* Interactive Quantum Circuit Diagram */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-purple-900/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Interactive 4-Qubit Variational Circuit Architecture</span>
            </h2>
            <p className="text-xs text-purple-200/70">
              Dual-Angle Feature Encoding (RY + RZ), Circular Entanglement Ring (CNOT), and 4-Wire Pauli-Z Readout.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-700/50 shadow-sm">
            Click a wire to inspect
          </span>
        </div>

        {/* Quantum Circuit Canvas Box */}
        <div className="p-6 rounded-xl bg-[#060818]/90 border border-purple-900/50 overflow-x-auto space-y-6 font-mono text-xs shadow-inner">
          
          {quantumWires.map((wire) => (
            <div 
              key={wire.id}
              onClick={() => setSelectedWire(wire)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                selectedWire?.id === wire.id 
                  ? 'bg-purple-950/60 border-indigo-500/60 shadow-lg shadow-indigo-500/20' 
                  : 'bg-purple-950/20 border-purple-900/40 hover:border-purple-700/50'
              }`}
            >
              {/* Qubit Label */}
              <div className="w-14 font-bold text-purple-300 flex-shrink-0">
                |0⟩ {wire.label}
              </div>

              {/* Wire line & Gates */}
              <div className="flex-1 flex items-center gap-2 relative">
                <div className="absolute left-0 right-0 h-[1.5px] bg-purple-900/60 pointer-events-none" />

                {/* Gate 1: RY */}
                <div className="relative z-10 px-2.5 py-1 rounded bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold text-[11px] shadow-sm">
                  RY(θ)
                </div>

                {/* Gate 2: RZ */}
                <div className="relative z-10 px-2.5 py-1 rounded bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-[11px] shadow-sm">
                  RZ(θ)
                </div>

                {/* Variational Layer Box */}
                <div className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-900/60 border border-indigo-500/40 text-purple-200 text-[10px]">
                  <span>5x [ RY(w₁) • RZ(w₂) • CNOT Ring ]</span>
                </div>

                {/* Measurement Gate */}
                <div className="relative z-10 ml-auto px-2.5 py-1 rounded bg-emerald-600/90 text-slate-950 font-black text-[11px] flex items-center gap-1">
                  <span>⟨Z⟩</span>
                </div>
              </div>

              {/* Angle display */}
              <div className="w-44 text-right text-[11px] text-purple-300/70 font-mono flex-shrink-0">
                {wire.feature.split(' (')[0]}
              </div>
            </div>
          ))}

        </div>

        {selectedWire && (
          <div className="p-4 rounded-xl bg-purple-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div>
              <span className="font-bold text-purple-300">{selectedWire.label} Parameter Details:</span>
              <span className="text-purple-100 ml-2">{selectedWire.feature}</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-purple-950 text-indigo-300 border border-purple-700">
              Mapped Angle: {selectedWire.angle} rad
            </span>
          </div>
        )}

      </div>

      {/* Scaling Experiments: Qubits & Depth vs Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Qubit Scaling Experiment */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Experiment 1: Feature / Qubit Scaling</span>
              </h3>
              <p className="text-xs text-purple-200/70">Total gates & simulation time as qubit count increases from 2 to 8.</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qubitScaling} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e265c" />
                <XAxis dataKey="qubits" stroke="#6b7280" tick={{ fill: '#a5b4fc', fontSize: 11 }} label={{ value: 'Qubit Count', position: 'insideBottom', offset: -5, fill: '#a5b4fc', fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#a5b4fc', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1338', borderColor: '#3344a0', borderRadius: '8px', fontSize: '12px', color: '#f1f3fd' }} />
                <Bar dataKey="total_gates" fill="#818cf8" radius={[4, 4, 0, 0]} name="Total Gates" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-purple-300/70 font-mono text-center">
            Linear gate growth: 15 gates (2-qubit) → 69 gates (8-qubit).
          </div>
        </div>

        {/* Right: Circuit Depth Scaling Experiment */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Experiment 2: Circuit Depth vs Simulation Time</span>
              </h3>
              <p className="text-xs text-purple-200/70">Depth variation across 4 qubits (1 to 5 variational layers).</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={depthScaling} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e265c" />
                <XAxis dataKey="depth" stroke="#6b7280" tick={{ fill: '#a5b4fc', fontSize: 11 }} label={{ value: 'Variational Layers (Depth)', position: 'insideBottom', offset: -5, fill: '#a5b4fc', fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#a5b4fc', fontSize: 11 }} unit="s" />
                <Tooltip contentStyle={{ backgroundColor: '#0d1338', borderColor: '#3344a0', borderRadius: '8px', fontSize: '12px', color: '#f1f3fd' }} />
                <Line type="monotone" dataKey="simulation_time" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Sim Time (sec)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-purple-300/70 font-mono text-center">
            Depth 4 completes in 0.061s per batch with linear gate scaling (11 to 44 gates).
          </div>
        </div>

      </div>

      {/* Noise Sensitivity Analysis Table */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Experiment 3: NISQ Noise Channel Resilience</span>
            </h3>
            <p className="text-xs text-purple-200/70">
              Evaluating expectation value drift under depolarizing noise simulation channel.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-950/60 text-purple-300 uppercase text-[10px] border-b border-purple-900/50">
              <tr>
                <th className="py-3 px-4 font-sans">Noise Channel Model</th>
                <th className="py-3 px-4 text-right">Ideal State Output</th>
                <th className="py-3 px-4 text-right">Noisy State Output</th>
                <th className="py-3 px-4 text-right">Absolute Drift (Δ)</th>
                <th className="py-3 px-4 text-center">Hardware Viability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30">
              {noiseAnalysis.map((item) => (
                <tr key={item.noise_model} className="hover:bg-purple-950/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-white">{item.noise_model}</td>
                  <td className="py-3 px-4 text-right text-purple-200/80">{item.ideal_output.toFixed(6)}</td>
                  <td className="py-3 px-4 text-right text-fuchsia-300">{item.noisy_output.toFixed(6)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    {item.absolute_diff.toFixed(6)} ({(item.absolute_diff * 100).toFixed(2)}%)
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Compatible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

