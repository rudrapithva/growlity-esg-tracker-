import React, { useState, useEffect } from 'react';
import { Globe, Users, FileText, Activity, ShieldAlert, CloudLightning, TrendingUp, Download } from 'lucide-react';
import { getPlatformMetrics } from '../../services/adminService';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    const absNum = Math.abs(num);
    const units = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
    let tier = Math.log10(absNum) / 3 | 0;
    if (tier < 0) tier = 0;
    if (tier === 0) return num.toFixed(2);
    
    const maxTier = units.length - 1;
    const finalTier = Math.min(tier, maxTier);
    const suffix = units[finalTier];
    const scale = Math.pow(10, finalTier * 3);
    const scaled = num / scale;
    return scaled.toFixed(2) + ' ' + suffix;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlatformMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Aggregating Platform Data...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Platform Oversight Dashboard</h1>
          <p>Global monitoring of enterprise ESG performance and system health.</p>
        </div>
        <div className="page-actions">
           <button className="btn btn-outline">
            <Download size={18} /> Global ESG Export
           </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card purple">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Total Platform CO2</h3>
              <p className="kpi-value" title={metrics?.totalCO2.toLocaleString()}>
                {formatNumber(metrics?.totalCO2)}
              </p>
            </div>
            <div className="kpi-icon"><Globe size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span>tons CO2e aggregated</span>
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Enterprise Clients</h3>
              <p className="kpi-value">{metrics?.totalUsers}</p>
            </div>
            <div className="kpi-icon"><Users size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span>Active organizations</span>
          </div>
        </div>

        <div className="kpi-card yellow">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Calculations Logged</h3>
              <p className="kpi-value">{metrics?.totalLogs}</p>
            </div>
            <div className="kpi-icon"><Activity size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span>Total platform volume</span>
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Avg Impact/Client</h3>
              <p className="kpi-value" title={metrics?.avgImpact.toLocaleString()}>
                {formatNumber(metrics?.avgImpact)}
              </p>
            </div>
            <div className="kpi-icon"><TrendingUp size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span>tons CO2e per tenant</span>
          </div>
        </div>
      </div>

      <div className="grid-7-5">
        <div className="card">
          <div className="card-header">
            <div className="card-title">System Health & Cloud Sync</div>
          </div>
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <CloudLightning size={48} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '1.5rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>All Cloud Systems Operational</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Real-time Firestore synchronization is active across all regions.
              Direct link to ESG oversight database verified.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Security & Compliance</div>
          </div>
          <div className="activity-feed">
             <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <ShieldAlert size={20} color="var(--success)" />
                    <span style={{ fontWeight: 600 }}>Protocol V4 Active</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Automated audit scanning is currently monitoring 100% of platform traffic. 
                    No anomalies detected in the last 24 hours.
                </p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
