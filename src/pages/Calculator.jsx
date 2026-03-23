import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, Users, Fuel, Car, Zap, Plane, Trash2, ArrowRight, ArrowLeft, Calculator as CalcIcon, Cloud, Flame, Calendar, CircleDollarSign, Shield, Download, Edit } from 'lucide-react';
import { calculateEmissions, saveRecord } from '../services/carbonService';
import { generateESGReport } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const CalculatorPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    employees: '',
    diesel: '',
    petrol: '',
    electricity: '',
    flights: '',
    waste: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.companyName || !formData.industry || !formData.employees)) {
      alert("Please fill all required fields.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleCalculate = () => {
    const results = calculateEmissions(formData);
    const record = saveRecord(currentUser?.email, formData, results);
    setCurrentRecord(record);
    setStep(5);
  };

  const getRecommendations = (risk) => {
    switch (risk) {
      case 'High':
        return [
          "Urgent: Audit Scope 2 energy consumption.",
          "Implement fleet electrification immediately.",
          "Review supply chain for high-emission vendors."
        ];
      case 'Medium':
        return [
          "Transition to renewable energy contracts.",
          "Optimize logistics and business travel.",
          "Implement a waste reduction program."
        ];
      default:
        return [
          "Begin investing in verified carbon offsets to hit net-zero.",
          "Start reporting via CDP or SBTi standard frameworks.",
          "Continue tracking quarterly."
        ];
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <section className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Reporting Entity Profile</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Identify the organizational boundary for this ESG assessment.</p>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Legal Entity / Business Unit</label>
                <div className="input-wrapper">
                  <Building2 size={18} />
                  <input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g. Growlity Corp (HQ)" required />
                </div>
              </div>
              <div className="form-group">
                <label>Industrial Classification</label>
                <div className="input-wrapper">
                  <TrendingUp size={18} />
                  <select id="industry" value={formData.industry} onChange={handleInputChange} required>
                    <option value="" disabled>Select sector...</option>
                    <option value="Technology">Information Technology</option>
                    <option value="Manufacturing">Advanced Manufacturing</option>
                    <option value="Retail">Commercial Retail</option>
                    <option value="Healthcare">Healthcare & BioTech</option>
                    <option value="Other">Other Enterprise</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '400px' }}>
              <label>Workforce Size (FTE)</label>
              <div className="input-wrapper">
                <Users size={18} />
                <input type="number" id="employees" value={formData.employees} onChange={handleInputChange} placeholder="Total employees..." min="1" required />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-primary" onClick={nextStep}>
                Configure Scope 1 <ArrowRight size={18} />
              </button>
            </div>
          </section>
        );
      case 2:
        return (
          <section className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Scope 1: Stationary & Mobile Combustion</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Direct GHG emissions from owned or controlled sources.</p>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Diesel Fuel Consumption (Liters)</label>
                <div className="input-wrapper">
                  <Fuel size={18} />
                  <input type="number" id="diesel" value={formData.diesel} onChange={handleInputChange} placeholder="Monthly liters..." />
                </div>
              </div>
              <div className="form-group">
                <label>Petrol / Gasoline Usage (Liters)</label>
                <div className="input-wrapper">
                  <Car size={18} />
                  <input type="number" id="petrol" value={formData.petrol} onChange={handleInputChange} placeholder="Monthly liters..." />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> Entity Profile</button>
              <button className="btn btn-primary" onClick={nextStep}>Configure Scope 2 <ArrowRight size={18} /></button>
            </div>
          </section>
        );
      case 3:
        return (
          <section className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Scope 2: Location-Based Energy</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Indirect emissions from the generation of purchased energy.</p>
            </div>
            <div className="form-group" style={{ maxWidth: '500px' }}>
              <label>Purchased Grid Electricity (kWh)</label>
              <div className="input-wrapper">
                <Zap size={18} />
                <input type="number" id="electricity" value={formData.electricity} onChange={handleInputChange} placeholder="Monthly kWh..." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> Scope 1</button>
              <button className="btn btn-primary" onClick={nextStep}>Configure Scope 3 <ArrowRight size={18} /></button>
            </div>
          </section>
        );
      case 4:
        return (
          <section className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Scope 3: Upstream & Downstream</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Value chain emissions including travel and waste management.</p>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Business Air Travel (km)</label>
                <div className="input-wrapper">
                  <Plane size={18} />
                  <input type="number" id="flights" value={formData.flights} onChange={handleInputChange} placeholder="Total distance..." />
                </div>
              </div>
              <div className="form-group">
                <label>Waste Generated in Operations (kg)</label>
                <div className="input-wrapper">
                  <Trash2 size={18} />
                  <input type="number" id="waste" value={formData.waste} onChange={handleInputChange} placeholder="Total weight..." />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> Scope 2</button>
              <button className="btn btn-primary" onClick={handleCalculate} style={{ padding: '1rem 2.5rem', border: 'none' }}>
                <CalcIcon size={18} /> Generate ESG Analysis
              </button>
            </div>
          </section>
        );
      case 5:
        const riskColor = currentRecord?.risk === 'High' ? 'var(--danger)' : currentRecord?.risk === 'Medium' ? 'var(--warning)' : 'var(--success)';
        
        const chartData = {
          labels: ['Direct (Scope 1)', 'Energy (Scope 2)', 'Value Chain (Scope 3)'],
          datasets: [{
            data: [currentRecord?.s1 || 0, currentRecord?.s2 || 0, currentRecord?.s3 || 0],
            backgroundColor: [
              'rgba(22, 163, 74, 0.8)',   // Primary Green
              'rgba(245, 158, 11, 0.8)',  // Warning Yellow
              'rgba(99, 102, 241, 0.8)'   // Indigo/Accent
            ],
            hoverBackgroundColor: [
              '#16a34a',
              '#d97706',
              '#4f46e5'
            ],
            hoverOffset: 12,
            borderWidth: 0,
            cutout: '72%'
          }]
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'bottom', 
              labels: { 
                usePointStyle: true, 
                padding: 30,
                font: { family: 'inherit', size: 12, weight: '500' },
                color: 'var(--text-secondary)'
              } 
            }
          }
        };

        return (
          <section className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
              <div className="page-title">
                <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Impact Assessment: {currentRecord?.entity}</h1>
                <p style={{ fontSize: '0.875rem' }}>Detailed breakdown of environmental intensity metrics and risk profiling.</p>
              </div>
              <div className={`badge badge-${currentRecord?.risk === 'High' ? 'danger' : currentRecord?.risk === 'Medium' ? 'warning' : 'success'}`} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                <Shield size={16} /> {currentRecord?.risk} Intensity Profile
              </div>
            </div>
            
            <div className="kpi-grid" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
              <div className="kpi-card purple" style={{ padding: '1.25rem' }}>
                <div className="kpi-top">
                  <div className="kpi-content">
                    <h3 style={{ fontSize: '0.7rem' }}>Total Carbon Intensity</h3>
                    <p className="kpi-value" style={{ fontSize: '1.5rem' }}>{currentRecord?.total?.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
                  </div>
                  <div className="kpi-icon" style={{ width: '36px', height: '36px' }}><Cloud size={20} /></div>
                </div>
                <div className="kpi-footer" style={{ fontSize: '0.7rem' }}>
                  <span>tCO2e per period</span>
                </div>
              </div>
              
              <div className="kpi-card blue" style={{ padding: '1.25rem' }}>
                <div className="kpi-top">
                  <div className="kpi-content">
                    <h3 style={{ fontSize: '0.7rem' }}>Direct (Scope 1)</h3>
                    <p className="kpi-value" style={{ fontSize: '1.5rem' }}>{currentRecord?.s1?.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
                  </div>
                  <div className="kpi-icon" style={{ width: '36px', height: '36px' }}><Flame size={20} /></div>
                </div>
                <div className="kpi-footer" style={{ fontSize: '0.7rem' }}>
                  <span>tons CO2e</span>
                </div>
              </div>

              <div className="kpi-card yellow" style={{ padding: '1.25rem' }}>
                <div className="kpi-top">
                  <div className="kpi-content">
                    <h3 style={{ fontSize: '0.7rem' }}>Energy (Scope 2)</h3>
                    <p className="kpi-value" style={{ fontSize: '1.5rem' }}>{currentRecord?.s2?.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
                  </div>
                  <div className="kpi-icon" style={{ width: '36px', height: '36px' }}><Zap size={20} /></div>
                </div>
                <div className="kpi-footer" style={{ fontSize: '0.7rem' }}>
                  <span>tons CO2e</span>
                </div>
              </div>

              <div className="kpi-card orange" style={{ padding: '1.25rem' }}>
                <div className="kpi-top">
                  <div className="kpi-content">
                    <h3 style={{ fontSize: '0.7rem' }}>Supply Chain (Scope 3)</h3>
                    <p className="kpi-value" style={{ fontSize: '1.5rem' }}>{currentRecord?.s3?.toLocaleString(undefined, {maximumFractionDigits:1})}</p>
                  </div>
                  <div className="kpi-icon" style={{ width: '36px', height: '36px' }}><Plane size={20} /></div>
                </div>
                <div className="kpi-footer" style={{ fontSize: '0.7rem' }}>
                  <span>tons CO2e</span>
                </div>
              </div>
            </div>

            <div className="grid-7-5" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card" style={{ background: 'var(--surface)', padding: '1.25rem', marginBottom: '0' }}>
                <div className="card-header" style={{ marginBottom: '1rem' }}>
                  <div className="card-title" style={{ fontSize: '1rem' }}>Distribution of Emissions</div>
                </div>
                <div style={{ height: '240px', padding: '0.5rem' }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>
              
              <div className="card" style={{ background: 'var(--surface)', padding: '1.25rem', marginBottom: '0' }}>
                <div className="card-header" style={{ marginBottom: '1rem' }}>
                  <div className="card-title" style={{ fontSize: '1rem' }}>Mitigation Roadmap</div>
                </div>
                <div>
                  <div style={{ backgroundColor: 'var(--bg-color)', borderLeft: `4px solid ${riskColor}`, padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Recommended Actions</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {getRecommendations(currentRecord?.risk).map((rec, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          <span style={{ color: riskColor }}>•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" style={{ padding: '0.75rem 1.25rem' }} onClick={() => setStep(4)}>
                <Edit size={16} /> Modify Assessment
              </button>
              <button className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }} onClick={() => generateESGReport(currentRecord)}>
                <Download size={16} /> Export Formal ESG Report
              </button>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div className="card" style={{ maxWidth: step === 5 ? '1200px' : '900px', margin: '0 auto', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', padding: '0' }}>
        {step !== 5 && (
          <div style={{ padding: '3rem 3rem 0' }}>
            <div className="progress-container" style={{ marginBottom: '3rem' }}>
              <div className="progress-bar-bg" style={{ height: '8px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="progress-bar" style={{ width: `${(step / 4) * 100}%`, height: '100%', background: 'var(--primary-gradient)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 0 15px var(--primary-glow)' }}></div>
              </div>
              <div className="progress-steps" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                {['Profile', 'Scope 1', 'Scope 2', 'Scope 3'].map((label, idx) => (
                  <div key={idx} style={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: step >= idx + 1 ? 700 : 500, 
                    color: step >= idx + 1 ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: step >= idx + 1 ? 'var(--primary)' : 'var(--border-color)',
                      boxShadow: step >= idx + 1 ? '0 0 10px var(--primary-glow)' : 'none'
                    }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div style={{ padding: '2rem' }}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
