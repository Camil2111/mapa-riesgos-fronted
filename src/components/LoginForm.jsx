// src/components/LoginForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email,
                password,
            });
            localStorage.setItem('authToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </form>
    );
}
