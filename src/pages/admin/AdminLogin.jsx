import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await adminLogin(email, password);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout" style={{ 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'radial-gradient(circle at 0% 0%, #1e1b4b 0%, #0f172a 100%)' 
        }}>
            <div className="auth-card" style={{ 
                maxWidth: '400px', 
                padding: '2.5rem', 
                background: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--dark)',
                borderRadius: '24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: 'none', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        overflow: 'hidden'
                    }}>
                        <img src="/assets/Growlity-Logo.webp" alt="Growlity" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: '#0f172a' }}>
                        Oversight Login
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Access the Global ESG Admin Hub
                    </p>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        marginBottom: '1.25rem', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        justifyContent: 'flex-start',
                        fontSize: '0.8125rem'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ color: '#475569', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Admin Email</label>
                        <input 
                            type="email" 
                            className="form-input"
                            placeholder="admin@growlity.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                background: '#f8fafc', 
                                borderColor: '#e2e8f0', 
                                color: '#0f172a',
                                padding: '0.75rem 1rem',
                                fontSize: '0.9375rem' 
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: '#475569', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ 
                                    background: '#f8fafc', 
                                    borderColor: '#e2e8f0', 
                                    color: '#0f172a', 
                                    paddingRight: '3rem',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.9375rem'
                                }}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ 
                                    position: 'absolute', 
                                    right: '12px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '0.875rem', 
                            fontSize: '0.9375rem', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            borderRadius: '12px'
                        }}
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                        {loading ? 'Verifying...' : 'Gatekeeper Sign In'}
                    </button>
                </form>

                <p style={{ 
                    textAlign: 'center', 
                    marginTop: '2rem', 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem'
                }}>
                    <Lock size={12} /> Secured Enterprise Access
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
