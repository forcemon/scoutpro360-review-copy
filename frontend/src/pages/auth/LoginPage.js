// frontend/src/pages/auth/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth(); // <--- Usa el contexto de autenticación
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await auth.login(username, password); // <--- Llama al login del AuthContext
            navigate(from, { replace: true });
        } catch (err) {
            const errorMessage =
                err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                (err.response?.status === 400 ? 'Credenciales inválidas. Por favor, inténtalo de nuevo.' : 'Error al iniciar sesión.');
            setError(errorMessage);
            console.error("Error en la página de login:", err.response?.data || err.message || err);
        } finally {
            setLoading(false);
        }
    };

    // ... (resto del JSX)
    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2>Iniciar Sesión en ScoutPro360</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="login-error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;