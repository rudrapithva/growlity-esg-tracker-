import React, { useState, useEffect } from 'react';
import { Building2, Factory, DollarSign, Zap, Fuel, Plane, Sliders } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getSettings, saveSettings, getFactors, saveFactors } from '../services/carbonService';

const Settings = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({ name: 'Acme Manufacturing US', industry: 'Manufacturing', currency: 'USD' });
  const [factors, setFactors] = useState({ electricity: 0.82, diesel: 2.68, petrol: 2.31, flights: 0.15, waste: 0.5 });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const defaultProfile = { name: 'Acme Manufacturing US', industry: 'Manufacturing', currency: 'USD' };
    const savedProfile = getSettings(currentUser?.email);
    setProfile({ ...defaultProfile, ...savedProfile });
    setFactors(getFactors(currentUser?.email));
  }, [currentUser]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    saveSettings(currentUser?.email, profile);
    showNotification('Target profile updated successfully!');
  };

  const handleFactorsSubmit = (e) => {
    e.preventDefault();
    saveFactors(currentUser?.email, factors);
    showNotification('Saved custom emission multipliers!');
  };

  const handleFactorReset = () => {
    const defaults = { electricity: 0.82, diesel: 2.68, petrol: 2.31, flights: 0.15, waste: 0.5 };
    setFactors(defaults);
    saveFactors(currentUser?.email, defaults);
    showNotification('Factors reset to defaults.');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>System Governance & Parameters</h1>
          <p>Configure organizational defaults, emission factors, and reporting preferences.</p>
        </div>
      </div>

      {notification && (
        <div className="badge badge-success animate-fade-in" style={{ width: '100%', marginBottom: '2rem', padding: '1rem', justifyContent: 'center' }}>
          {notification}
        </div>
      )}

      <div className="grid-7-5">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="nav-icon purple" style={{ width: '32px', height: '32px' }}><Building2 size={16} /></div>
              Organization Profile
            </div>
          </div>
          <form onSubmit={handleProfileSubmit} style={{ padding: '1rem' }}>
            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Legal Entity Name</label>
                <div className="input-wrapper">
                  <Building2 size={18} />
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reporting Sector</label>
                <div className="input-wrapper">
                  <Factory size={18} />
                  <select value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} required>
                    <option value="Manufacturing">Advanced Manufacturing</option>
                    <option value="Technology">Information Technology</option>
                    <option value="Retail">Commercial Retail</option>
                    <option value="Healthcare">Healthcare & BioTech</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Reporting Currency</label>
              <div className="input-wrapper">
                <DollarSign size={18} />
                <select value={profile.currency} onChange={e => setProfile({...profile, currency: e.target.value})} required>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className="btn btn-primary">Synchronize Profile</button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="nav-icon orange" style={{ width: '32px', height: '32px' }}><Sliders size={16} /></div>
              Emission Benchmarks
            </div>
            <button type="button" className="btn btn-outline" onClick={handleFactorReset} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Factory Reset</button>
          </div>
          <form onSubmit={handleFactorsSubmit} style={{ padding: '1rem' }}>
            <div className="form-group">
              <label>Grid Intensity (kg CO2e / kWh)</label>
              <div className="input-wrapper">
                <Zap size={18} />
                <input type="number" step="0.01" value={factors.electricity} onChange={e => setFactors({...factors, electricity: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Diesel Emission Factor (kg / L)</label>
              <div className="input-wrapper">
                <Fuel size={18} />
                <input type="number" step="0.01" value={factors.diesel} onChange={e => setFactors({...factors, diesel: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Aviation Intensity (kg / km)</label>
              <div className="input-wrapper">
                <Plane size={18} />
                <input type="number" step="0.01" value={factors.flights} onChange={e => setFactors({...factors, flights: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className="btn btn-primary" style={{ background: 'var(--primary-gradient)' }}>Apply New Benchmarks</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
