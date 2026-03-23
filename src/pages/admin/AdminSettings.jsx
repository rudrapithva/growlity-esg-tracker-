import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, ShieldCheck, Zap, Flame, Fuel, Plane, Trash2, Globe } from 'lucide-react';
import { getGlobalFactors, updateGlobalFactors } from '../../services/adminService';

const AdminSettings = () => {
  const [factors, setFactors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGlobalFactors();
      setFactors(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const success = await updateGlobalFactors(factors);
    if (success) {
      setMessage('Global ESG standards updated and synced with Cloud!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to sync standards. Check console for errors.');
    }
    setSaving(false);
  };

  const handleFactorChange = (key, value) => {
    setFactors(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  if (loading) return <div className="loading-spinner">Fetching Global Standards...</div>;

  const icons = {
    electricity: Zap,
    diesel: Fuel,
    petrol: Flame,
    flights: Plane,
    waste: Trash2
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Global ESG Standards</h1>
          <p>Maintenance of the platform's emission factors and calculation logic.</p>
        </div>
        <div className="page-actions">
           <button 
                className="btn btn-primary" 
                onClick={handleSave} 
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Syncing...' : 'Apply Globally'}
           </button>
        </div>
      </div>

      {message && (
        <div className={`badge badge-${message.includes('Failed') ? 'danger' : 'success'}`} 
             style={{ width: '100%', marginBottom: '2rem', padding: '1rem', justifyContent: 'center' }}>
          {message}
        </div>
      )}

      <div className="grid-7-5">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Emission Multipliers (kg CO2e / unit)</div>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {factors && Object.keys(factors).map((key) => {
                    const Icon = icons[key] || Globe;
                    return (
                        <div key={key} className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', 
                                background: 'var(--bg-color)', color: 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Icon size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                                    {key.replace('_', ' ')}
                                </label>
                                <input 
                                    type="number" 
                                    step="0.001"
                                    value={factors[key]}
                                    onChange={(e) => handleFactorChange(key, e.target.value)}
                                    className="form-input"
                                    style={{ margin: 0, padding: '0.625rem' }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Oversight Governance</div>
          </div>
          <div style={{ padding: '2rem' }}>
             <div style={{ padding: '1.5rem', background: 'var(--primary-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-glow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <ShieldCheck size={20} />
                    <span style={{ fontWeight: 600 }}>Global Sync Protocol</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Updating these factors will immediately affect all future calculations across the entire enterprise network. 
                    Changes are logged and versioned for regulatory compliance.
                </p>
             </div>
             
             <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Last Standard Revisions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { date: '2024-03-15', action: 'Grid Electricity Factor updated (UK/EU)', user: 'System Admin' },
                        { date: '2024-02-28', action: 'Aviation intensity recalibrated', user: 'System Admin' }
                    ].map((history, i) => (
                        <div key={i} style={{ fontSize: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{history.action}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{history.date} • {history.user}</div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
