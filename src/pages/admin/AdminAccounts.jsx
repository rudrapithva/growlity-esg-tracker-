import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Mail, Calculator, Globe } from 'lucide-react';
import { getPlatformMetrics } from '../../services/adminService';

const AdminAccounts = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlatformMetrics();
        setClients(data.clients);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClients = clients.filter(c => 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Fetching Enterprise Accounts...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Enterprise Accounts</h1>
          <p>Management and oversight of all registered enterprise entities.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-bar" style={{ maxWidth: '400px', flex: 1 }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by enterprise email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'none', padding: '0.5rem', width: '100%' }}
            />
          </div>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <Filter size={16} /> Advanced Filters
          </button>
        </div>
        
        <table className="history-table">
          <thead>
            <tr>
              <th>Enterprise Client</th>
              <th>Activity Volume</th>
              <th>Log Intensity</th>
              <th>Compliance Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.email}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: 'var(--primary)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 600, fontSize: '0.75rem'
                    }}>
                      {client.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{client.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise UID Path</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{client.totalCO2.toLocaleString()} tCO2</td>
                <td>{client.logCount} calculations</td>
                <td>
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}>
                    <ShieldCheck size={12} /> Verified
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Inspect Logs</button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  No enterprise clients matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminAccounts;
