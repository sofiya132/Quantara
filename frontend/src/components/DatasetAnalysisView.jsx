import React, { useState, useEffect } from 'react';
import {
  Database,
  BarChart3,
  ShieldCheck,
  Layers,
  Search,
  SlidersHorizontal,
  Table,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { fetchDatasetSample } from '../api';

export default function DatasetAnalysisView({ datasetData }) {
  const [sampleData, setSampleData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const loadSample = async () => {
      try {
        const res = await fetchDatasetSample(50, 0);
        setSampleData(res.rows || []);
      } catch (err) {
        console.error('Failed to load dataset sample rows:', err);
      }
    };
    loadSample();
  }, []);

  const classBalance = datasetData?.class_balance || [
    { category_code: '0', label: 'Blood Donor (Healthy)', count: 533, percentage: 86.67 },
    { category_code: '0s', label: 'Suspect Blood Donor', count: 7, percentage: 1.14 },
    { category_code: '1', label: 'Hepatitis Patient', count: 24, percentage: 3.90 },
    { category_code: '2', label: 'Fibrosis Patient', count: 21, percentage: 3.41 },
    { category_code: '3', label: 'Cirrhosis Patient', count: 30, percentage: 4.88 },
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#8b5cf6', '#f43f5e'];

  const statsList = datasetData?.features_stats || [
    { feature: 'Age', description: 'Patient Age', category: 'Demographic', min: 19.0, max: 77.0, mean: 47.4, median: 47.0, std: 10.1, unit: 'years' },
    { feature: 'ALB', description: 'Albumin level', category: 'Liver function', min: 14.9, max: 82.2, mean: 41.6, median: 41.9, std: 5.8, unit: 'g/L' },
    { feature: 'ALP', description: 'Alkaline Phosphatase', category: 'Liver function', min: 11.3, max: 416.6, mean: 68.3, median: 66.2, std: 26.1, unit: 'IU/L' },
    { feature: 'ALT', description: 'Alanine Aminotransferase', category: 'Liver function', min: 0.9, max: 325.3, mean: 28.5, median: 23.0, std: 25.5, unit: 'U/L' },
    { feature: 'AST', description: 'Aspartate Aminotransferase', category: 'Liver function', min: 10.6, max: 324.0, mean: 34.7, median: 25.9, std: 33.1, unit: 'U/L' },
    { feature: 'BIL', description: 'Bilirubin level', category: 'Liver function', min: 0.8, max: 254.0, mean: 11.4, median: 7.3, std: 19.7, unit: 'µmol/L' },
    { feature: 'CHE', description: 'Cholinesterase', category: 'Liver function', min: 1.4, max: 16.4, mean: 8.2, median: 8.3, std: 2.2, unit: 'kU/L' },
    { feature: 'CHOL', description: 'Cholesterol', category: 'Metabolic', min: 1.4, max: 9.7, mean: 5.4, median: 5.3, std: 1.1, unit: 'mmol/L' },
    { feature: 'CREA', description: 'Creatinine level', category: 'Kidney function', min: 8.0, max: 1079.0, mean: 81.3, median: 77.0, std: 49.8, unit: 'µmol/L' },
    { feature: 'GGT', description: 'Gamma-Glutamyl Transferase', category: 'Liver function', min: 4.5, max: 650.9, mean: 39.5, median: 23.3, std: 54.7, unit: 'U/L' },
    { feature: 'PROT', description: 'Total Protein level', category: 'Liver function', min: 44.8, max: 90.0, mean: 72.0, median: 72.2, std: 5.4, unit: 'g/L' },
    { feature: 'Sex_m', description: 'Sex (Male=1, Female=0)', category: 'Demographic', min: 0.0, max: 1.0, mean: 0.61, median: 1.0, std: 0.49, unit: 'encoded' },
  ];

  const filteredSample = sampleData.filter(row => {
    const matchesSearch = searchQuery === '' || Object.values(row).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || String(row.Category).includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Dataset Integrity & Clinical Health</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-white">
            Biomedical HCV Dataset Analysis
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Laboratory values of 615 donors and hepatitis C patients evaluated across 12 clinical biomarkers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>UCI Benchmark Dataset (615 Records)</span>
        </div>
      </div>

      {/* Dataset Health Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Records</div>
          <div className="text-2xl font-bold font-heading text-white">615</div>
          <div className="text-[10px] text-purple-400/60">UCI Repository</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Train / Test Split</div>
          <div className="text-2xl font-bold font-heading text-indigo-300">492 / 123</div>
          <div className="text-[10px] text-purple-400/60">Train / Held-Out Test</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Features</div>
          <div className="text-2xl font-bold font-heading text-purple-300">12</div>
          <div className="text-[10px] text-purple-400/60">11 Num + 1 Binary</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Missing Cleaned</div>
          <div className="text-2xl font-bold font-heading text-emerald-400">100%</div>
          <div className="text-[10px] text-emerald-400/60">Median Imputed</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">QML Encoding</div>
          <div className="text-2xl font-bold font-heading text-indigo-400">PCA Angles</div>
          <div className="text-[10px] text-purple-400/60">4 Principal Comp</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-purple-900/40 text-center space-y-1">
          <div className="text-[10px] text-purple-300/70 uppercase font-mono">Class Balance</div>
          <div className="text-2xl font-bold font-heading text-amber-400">86.7 / 13.3</div>
          <div className="text-[10px] text-purple-400/60">Donor vs Disease</div>
        </div>

      </div>

      {/* Class Balance Chart & Summary Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Class Distribution Pie Chart */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Cohort Class Distribution</span>
            </h3>
            <p className="text-xs text-purple-200/70">
              Distribution of blood donor controls vs diagnosed hepatic conditions.
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classBalance}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {classBalance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1338', borderColor: '#3344a0', borderRadius: '8px', fontSize: '12px', color: '#f1f3fd' }}
                  formatter={(val, name, entry) => [`${val} patients (${entry.payload.percentage}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-purple-900/40 text-[11px] font-mono">
            {classBalance.map((item, idx) => (
              <div key={item.category_code} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-purple-200">{item.label}</span>
                </div>
                <span className="text-purple-300/70 font-bold">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Biomarker Statistical Ranges Table */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Clinical Biomarker Descriptive Statistics</span>
            </h3>
            <span className="text-xs font-mono text-purple-300">12 Parameters</span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto pr-1">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-purple-950/60 text-purple-300 uppercase text-[10px] border-b border-purple-900/50 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Biomarker</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3 text-right">Min</th>
                  <th className="py-2.5 px-3 text-right">Median</th>
                  <th className="py-2.5 px-3 text-right">Mean</th>
                  <th className="py-2.5 px-3 text-right">Max</th>
                  <th className="py-2.5 px-3 text-right">Std Dev</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {statsList.map((stat) => (
                  <tr key={stat.feature} className="hover:bg-purple-950/40 transition-colors">
                    <td className="py-2 px-3 font-sans font-bold text-white flex items-center gap-1.5">
                      <span>{stat.feature}</span>
                    </td>
                    <td className="py-2 px-3 text-purple-300/70">{stat.unit}</td>
                    <td className="py-2 px-3 text-right text-purple-200/80">{stat.min}</td>
                    <td className="py-2 px-3 text-right font-bold text-fuchsia-300">{stat.median}</td>
                    <td className="py-2 px-3 text-right text-purple-200/80">{stat.mean}</td>
                    <td className="py-2 px-3 text-right text-purple-200/80">{stat.max}</td>
                    <td className="py-2 px-3 text-right text-purple-300/60">±{stat.std}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Dataset Explorer: Sample Data Table */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-purple-400" />
              <span>Interactive HCV Raw Data Browser</span>
            </h3>
            <p className="text-xs text-purple-200/70">
              Browse actual sample records from the UCI Hepatitis C dataset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-purple-400/80 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search values..."
                className="pl-8 pr-3 py-1.5 text-xs bg-purple-950/70 border border-purple-800/60 rounded-lg text-white focus:outline-none focus:border-purple-400 placeholder-purple-300/30"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 text-xs bg-purple-950/70 border border-purple-800/60 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400"
            >
              <option value="ALL">All Categories</option>
              <option value="Blood Donor">Blood Donors</option>
              <option value="Hepatitis">Hepatitis</option>
              <option value="Fibrosis">Fibrosis</option>
              <option value="Cirrhosis">Cirrhosis</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-950 text-purple-300 uppercase text-[10px] border-b border-purple-900/50 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 font-sans">Category</th>
                <th className="py-2.5 px-3 text-right">Age</th>
                <th className="py-2.5 px-3 text-center">Sex</th>
                <th className="py-2.5 px-3 text-right">ALB</th>
                <th className="py-2.5 px-3 text-right">ALP</th>
                <th className="py-2.5 px-3 text-right">ALT</th>
                <th className="py-2.5 px-3 text-right">AST</th>
                <th className="py-2.5 px-3 text-right">BIL</th>
                <th className="py-2.5 px-3 text-right">CHE</th>
                <th className="py-2.5 px-3 text-right">CHOL</th>
                <th className="py-2.5 px-3 text-right">CREA</th>
                <th className="py-2.5 px-3 text-right">GGT</th>
                <th className="py-2.5 px-3 text-right">PROT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30">
              {filteredSample.slice(0, 20).map((row, idx) => (
                <tr key={idx} className="hover:bg-purple-950/40 transition-colors">
                  <td className="py-2 px-3 font-sans font-semibold text-fuchsia-300">
                    {String(row.Category).replace('0=', '').replace('1=', '').replace('2=', '').replace('3=', '')}
                  </td>
                  <td className="py-2 px-3 text-right text-white">{row.Age}</td>
                  <td className="py-2 px-3 text-center text-purple-300/70">{row.Sex}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.ALB}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.ALP}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.ALT}</td>
                  <td className="py-2 px-3 text-right font-bold text-amber-300">{row.AST}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.BIL}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.CHE}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.CHOL}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.CREA}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.GGT}</td>
                  <td className="py-2 px-3 text-right text-purple-200/80">{row.PROT}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

