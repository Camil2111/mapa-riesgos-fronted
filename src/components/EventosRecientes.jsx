import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EventosRecientes({ filtroEvento }) {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/eventos`)
            .then(res => {
                const ultimos = res.data
                    .filter(e => !filtroEvento || filtroEvento === 'todos' || e.tipo === filtroEvento)
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 10);
                setEventos(ultimos);
            })
            .catch(err => console.error('❌ Error cargando eventos recientes:', err));
    }, [filtroEvento]);

    return (
        <div style={{
            backgroundColor: '#1d2d2d',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 0 10px #29f77a',
            color: '#e5e5e5',
            maxHeight: '420px',  // 👈 limite visual
            overflowY: 'auto',
            scrollbarWidth: 'thin'  // opcional Firefox
        }}>

            <h3 style={{ color: '#29f77a', marginBottom: '10px' }}>🧠 Actividad Reciente</h3>
            {eventos.length === 0 ? (
                <p>No hay eventos recientes.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {eventos.map((e, i) => (
                        <li key={i} style={{
                            borderBottom: '1px solid #333',
                            marginBottom: '10px',
                            paddingBottom: '10px',
                            paddingLeft: '5px'
                        }}>
                            <strong style={{ color: '#29f77a' }}>{e.municipio || 'No especificado'}</strong>
                            <span style={{ float: 'right', fontSize: '12px', color: '#999' }}>
                                {new Date(e.fecha).toLocaleDateString()}
                            </span>
                            <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                <strong>{e.tipo}</strong><br />
                                {e.descripcion}
                                {e.link && (
                                    <div style={{ marginTop: '5px' }}>
                                        <a href={e.link} target="_blank" rel="noopener noreferrer" style={{ color: '#29f77a' }}>
                                            🔗 Ver noticia
                                        </a>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

