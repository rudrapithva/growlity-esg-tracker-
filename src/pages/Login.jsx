import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, signup, googleSignIn, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-side">
        <div className="animate-fade-in">
          <img src="/assets/Growlity-Logo.webp" alt="Growlity Logo" className="sidebar-logo" style={{ maxHeight: '50px', marginBottom: '2rem' }} />
          <h1 className="animate-fade-in" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
            <span style={{ opacity: 0.4 }}>Measure.</span><br />
            <span style={{ opacity: 0.6 }}>Reduce.</span><br />
            <span style={{ color: 'var(--secondary)', textShadow: '0 0 40px var(--secondary-glow)' }}>Sustain.</span>
          </h1>
          <p className="animate-fade-in" style={{ marginBottom: '2.5rem', maxWidth: '420px', fontSize: '1.125rem' }}>
            The world's most intuitive ESG tracking platform for modern enterprises committed to net-zero and sustainable growth.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              "Real-time Scope 1, 2, & 3 Analytics",
              "GHG Protocol & ISO 14064 Compliant",
              "Automated Regulatory Reporting"
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="animate-fade-in">
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-glow)', 
                  border: '1px solid hsla(0,0%,100%,0.2)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>✓</div>
                <span style={{ fontWeight: 500, opacity: 0.9, fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <form className="auth-card animate-fade-in" onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{isLogin ? 'Sign In' : 'Join Growlity'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{isLogin ? 'Access your sustainability dashboard' : 'Start your journey to carbon neutrality'}</p>
          </div>
          
          {error && <div className="badge badge-danger" style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center', padding: '1rem' }}>{error}</div>}
          
          <div className="form-group">
            <label>Business Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Secure Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Enterprise Login' : 'Create ESG Instance'}
          </button>
          
          {isLogin && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <div style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Secure Connect</div>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <button type="button" onClick={handleGoogleLogin} className="btn btn-outline" style={{ width: '100%' }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {isLogin ? "New to Growlity? " : "Already have an instance? "}
              <b style={{ color: 'var(--primary)' }}>{isLogin ? 'Start Free Trial' : 'Sign in here'}</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
