import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export const Home = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Login goes to catalogue; Register goes to onboarding
        if (isLogin) {
            navigate('/catalogue');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="home-layout">
            {/* Standard Topbar matches Chat TopBar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, height: '64px', width: '100%', backgroundColor: '#e4e5f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="otter-logo-circle" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
            </div>

            <div className="auth-wrapper">
                <div className="auth-card-container">
                    <div className="auth-header">
                        <h1>{isLogin ? 'Sign In' : 'Register'}</h1>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Name field only on Register */}
                        {!isLogin && (
                            <div className="form-group">
                                <input type="text" placeholder="Full Name" required />
                            </div>
                        )}

                        <div className="form-group">
                            <input type="email" placeholder="Email" required />
                        </div>
                        
                        <div className="form-group password-group">
                            <input type="password" placeholder="Password" required />
                            <span className="eye-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </span>
                        </div>

                        {!isLogin && (
                            <div className="form-group password-group">
                                <input type="password" placeholder="Confirm Password" required />
                                <span className="eye-icon">👁️</span>
                            </div>
                        )}

                        {isLogin && (
                            <div className="form-actions">
                                <label className="remember-me">
                                    <input type="radio" checked readOnly />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>
                        )}

                        <div className="button-group">
                            <button type="submit" className="primary-btn">
                                {isLogin ? 'Sign in' : 'Register'}
                            </button>
                            
                            <button type="button" className="google-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                {isLogin ? 'Sign in with Google' : 'Register with Google'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-footer">
                        {isLogin ? (
                            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>sign up</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={() => setIsLogin(true)}>sign in</span></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
