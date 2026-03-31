import React, { useState, useEffect } from 'react';
import { Search, Download, ShieldCheck, Clock, FileCheck, AlertCircle, ShieldAlert } from 'lucide-react';
import { getPlatformMetrics } from '../../services/adminService';

const AdminCompliance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const data = await getPlatformMetrics();
        const allLogs = [];
        
        if (data && data.clients) {
          data.clients.forEach(client => {
            const history = client.history || [];
            history.forEach(log => {
              allLogs.push({
                ...log,
                enterprise: client.email,
                timestamp: log.date || 'N/A'
              });
            });
          });
        }
        
        // Sort by date (newest first)
        allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(allLogs);
      } catch (e) {
        console.error(e);
        setError(e.code === 'permission-denied' 
          ? 'Secure Access Restricted: Administrator privileges required.' 
          : 'Failed to retrieve compliance audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Auditing Platform Logs...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Compliance Audit Stream</h1>
          <p>Real-time oversight of all carbon calculations across the Growlity network.</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Download size={18} /> Audit Export (JSON/CSV)
           </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Enterprise Client</th>
                <th>Action Profile</th>
                <th>Intensity</th>
                <th>Risk Profile</th>
                <th>Protocol Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={12} /> {log.timestamp}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.enterprise}</td>
                  <td>
                    <span style={{ 
                      background: 'var(--primary-muted)', 
                      color: 'var(--primary)', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>Calculation</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{log.total.toLocaleString()} t</td>
                  <td>
                    <span className={`badge badge-${log.risk === 'High' ? 'danger' : log.risk === 'Medium' ? 'warning' : 'success'}`} style={{ fontSize: '0.75rem' }}>
                      {log.risk} Intensity
                    </span>
                  </td>
                  <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 500 }}>
                          <FileCheck size={14} /> Verified Protocol
                      </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No calculations have been logged on the platform yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminCompliance;
