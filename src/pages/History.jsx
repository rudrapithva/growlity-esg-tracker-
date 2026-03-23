import React, { useState, useEffect } from 'react';
import { Download, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getHistory, deleteHistory } from '../services/carbonService';
import { generateESGReport } from '../services/reportService';

const History = () => {
  const { currentUser } = useAuth();
  const [completeHistory, setCompleteHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    const data = getHistory(currentUser?.email);
    setCompleteHistory(data);
    setFilteredHistory(data);
  }, [currentUser]);

  useEffect(() => {
    if (riskFilter === 'All') {
      setFilteredHistory(completeHistory);
    } else {
      setFilteredHistory(completeHistory.filter(r => r.risk === riskFilter));
    }
  }, [riskFilter, completeHistory]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this historical record?')) {
      const updated = deleteHistory(currentUser?.email, id);
      setCompleteHistory(updated);
    }
  };

  const handleDownloadPDF = async (record) => {
    await generateESGReport(record);
  };

  const handleExportCSV = () => {
    if (completeHistory.length === 0) return alert('No data to export');
    const headers = ['Date', 'Entity', 'Scope 1 (tCO2)', 'Scope 2 (tCO2)', 'Scope 3 (tCO2)', 'Total (tCO2)', 'Risk Level'];
    const csvData = completeHistory.map(r => 
      `${r.date},"${r.entity}",${r.s1.toFixed(2)},${r.s2.toFixed(2)},${r.s3.toFixed(2)},${r.total.toFixed(2)},${r.risk}`
    );
    const csvString = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Growlity_Emission_History.csv";
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeClass = (risk) => {
    if(risk === 'Low') return 'var(--success)';
    if(risk === 'Medium') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>Environmental History Audit</h1>
          <p>Comprehensive record of all previous carbon footprint assessments and sustainability metrics.</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-wrapper" style={{ width: '280px' }}>
            <Filter size={18} />
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
              <option value="All">Filter by Intensity: All</option>
              <option value="High">High Priority Events</option>
              <option value="Medium">Medium Priority Events</option>
              <option value="Low">Low Priority Events</option>
            </select>
          </div>
          <button className="btn btn-outline" onClick={handleExportCSV}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Audit Date</th>
                <th>Entity / Facility</th>
                <th>Scope 1</th>
                <th>Scope 2</th>
                <th>Scope 3</th>
                <th>Total Intensity</th>
                <th>Risk Profile</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No historical logs found. Initiate a calculation to generate audit data.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 600 }}>{record.date}</td>
                    <td>{record.entity}</td>
                    <td>{record.s1.toFixed(1)} <small>t</small></td>
                    <td>{record.s2.toFixed(1)} <small>t</small></td>
                    <td>{record.s3.toFixed(1)} <small>t</small></td>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{record.total.toFixed(1)} <small>tCO2e</small></td>
                    <td>
                      <span className={`badge badge-${record.risk === 'High' ? 'danger' : record.risk === 'Medium' ? 'warning' : 'success'}`}>
                        {record.risk}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" title="Generate PDF Report" onClick={() => handleDownloadPDF(record)}>
                          <Download size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete Audit Log" onClick={() => handleDelete(record.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
