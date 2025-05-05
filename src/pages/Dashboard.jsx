// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div>
            <h1>Panel de Administración</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/editar-riesgos">Editar datos_riesgos.json</Link></li>
                    {/* Agrega más enlaces aquí */}
                </ul>
            </nav>
            <button onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/admin/login';
            }}>
                Cerrar sesión
            </button>

        </div>
    );
}
