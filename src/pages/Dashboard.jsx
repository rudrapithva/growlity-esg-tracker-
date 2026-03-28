import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Globe, Flame, Plug, Recycle, TrendingDown, TrendingUp, Plus, Download, AlertTriangle, Zap, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHistory } from '../services/carbonService';
import { generateESGReport } from '../services/reportService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, s1: 0, s2: 0, s3: 0 });
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const logs = await getHistory(currentUser?.email);
      setHistory(logs);

      if (logs.length > 0) {
        // Calculate Aggregate Metrics (Sum of all calculations)
        const totalSum = logs.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const s1Sum = logs.reduce((acc, curr) => acc + (curr.s1 || 0), 0);
        const s2Sum = logs.reduce((acc, curr) => acc + (curr.s2 || 0), 0);
        const s3Sum = logs.reduce((acc, curr) => acc + (curr.s3 || 0), 0);

        setMetrics({
          total: totalSum,
          s1: s1Sum,
          s2: s2Sum,
          s3: s3Sum,
        });

        // Trend still compares the two most recent records
        const latest = logs[0];
        if (logs.length > 1) {
          const prev = logs[1];
          if (prev.total > 0) {
            const change = ((latest.total - prev.total) / prev.total) * 100;
            setPercentChange(change);
          }
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const chartData = {
    labels: history.slice(0, 6).reverse().map(r => r.date.substring(5)) || [],
    datasets: [
      {
        label: 'Total Emissions (tons CO2)',
        data: history.slice(0, 6).reverse().map(r => r.total) || [],
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [5, 5] }, ticks: { callback: (value) => value + 't' } },
    },
  };

  const doughnutData = {
    labels: ['Direct (S1)', 'Indirect (S2)', 'Supply Chain (S3)'],
    datasets: [
      {
        data: [metrics.s1, metrics.s2, metrics.s3],
        backgroundColor: [
          '#6366f1', // purple-600
          '#3b82f6', // blue-500
          '#f59e0b', // amber-500
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } },
    },
    cutout: '70%',
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Enterprise ESG Overview</h1>
          <p>Welcome back! Here's your corporate carbon footprint summary.</p>
        </div>
        <div className="page-actions">
          <Link to="/calculator" className="btn btn-primary">
            <Plus size={18} /> New Calculation
          </Link>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card purple">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Cumulative ESG Impact</h3>
              <p className="kpi-value">{metrics.total.toLocaleString()}</p>
            </div>
            <div className="kpi-icon"><Globe size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>tons CO2e</span>
            {history.length > 1 && (
              <div className={`kpi-trend ${percentChange > 0 ? 'trend-up' : 'trend-down'}`} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {percentChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(percentChange).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Direct (Scope 1)</h3>
              <p className="kpi-value">{metrics.s1.toLocaleString()}</p>
            </div>
            <div className="kpi-icon"><Flame size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>tons</span>
          </div>
        </div>

        <div className="kpi-card yellow">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Indirect (Scope 2)</h3>
              <p className="kpi-value">{metrics.s2.toLocaleString()}</p>
            </div>
            <div className="kpi-icon"><Plug size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>tons</span>
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-top">
            <div className="kpi-content">
              <h3>Supply Chain (Scope 3)</h3>
              <p className="kpi-value">{metrics.s3.toLocaleString()}</p>
            </div>
            <div className="kpi-icon"><Recycle size={22} /></div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>tons</span>
          </div>
        </div>
      </div>

      <div className="grid-7-5">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Emission Trend</div>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => { if (history.length) generateESGReport(history[0]) }}
              disabled={history.length === 0}
            >
              Export Report <Download size={14} />
            </button>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Scope Distribution</div>
          </div>
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {history.length > 0 ? (
               <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-7-5" style={{ marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          <div className="activity-feed">
            {history.length > 0 ? history.slice(0, 4).map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: log.risk === 'High' ? 'rgba(239, 68, 68, 0.1)' : log.risk === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                  color: log.risk === 'High' ? 'var(--danger)' : log.risk === 'Medium' ? 'var(--warning)' : 'var(--primary)'
                }}>
                  {log.risk === 'High' ? <AlertTriangle size={16} /> : log.risk === 'Medium' ? <Zap size={16} /> : <CheckCircle size={16} />}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Calculation for {log.entity}</p>
                  <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>{log.date}</p>
                </div>
              </div>
            )) : (
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0' }}>
                <Info size={20} className="text-muted" />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
