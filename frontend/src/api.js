const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or health error:', err);
    return {
      status: 'offline',
      system: 'Quantara Platform (Connecting...)',
      quantum_simulator: 'Standby',
      models_loaded: { classical: [], quantum: [] }
    };
  }
}

export async function fetchPresetPatients() {
  const res = await fetch(`${API_BASE}/api/preset-patients`);
  if (!res.ok) throw new Error('Failed to fetch preset patients');
  return await res.json();
}

export async function predictPatient(features, patientName = '', notes = '') {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      features,
      patient_name: patientName,
      notes
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Prediction request failed' }));
    let msg = 'Prediction failed';
    if (typeof err.detail === 'string') {
      msg = err.detail;
    } else if (Array.isArray(err.detail)) {
      msg = err.detail.map(d => `${d.loc ? d.loc.slice(-1)[0] : 'field'}: ${d.msg}`).join(', ');
    } else if (typeof err.message === 'string') {
      msg = err.message;
    }
    throw new Error(msg);
  }
  return await res.json();
}

export async function fetchExplainability(features) {
  const res = await fetch(`${API_BASE}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features)
  });
  if (!res.ok) throw new Error('Explainability fetch failed');
  return await res.json();
}

export async function fetchModelComparison() {
  const res = await fetch(`${API_BASE}/api/model-comparison`);
  if (!res.ok) throw new Error('Model comparison fetch failed');
  return await res.json();
}

export async function fetchQuantumFeasibility() {
  const res = await fetch(`${API_BASE}/api/quantum-feasibility`);
  if (!res.ok) throw new Error('Quantum feasibility fetch failed');
  return await res.json();
}

export async function fetchDatasetAnalysis() {
  const res = await fetch(`${API_BASE}/api/dataset-analysis`);
  if (!res.ok) throw new Error('Dataset analysis fetch failed');
  return await res.json();
}

export async function fetchDatasetSample(limit = 25, offset = 0) {
  const res = await fetch(`${API_BASE}/api/dataset-sample?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Dataset sample fetch failed');
  return await res.json();
}

export async function fetchHistory(riskFilter = 'ALL') {
  let url = `${API_BASE}/api/history`;
  if (riskFilter && riskFilter !== 'ALL') {
    url += `?risk_filter=${riskFilter}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('History fetch failed');
  return await res.json();
}

export async function deleteHistoryItem(id) {
  const res = await fetch(`${API_BASE}/api/history/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Delete history item failed');
  return await res.json();
}

export async function clearAllHistory() {
  const res = await fetch(`${API_BASE}/api/history`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Clear history failed');
  return await res.json();
}

export function getExportCsvUrl() {
  return `${API_BASE}/api/history/export/csv`;
}
