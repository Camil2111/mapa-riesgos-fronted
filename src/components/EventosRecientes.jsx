import { useEffect, useState } from 'react';
import './EventosRecientes.css';

const tipoColores = {
    'conflicto armado': '#e74c3c',
    'artefacto explosivo': '#f1c40f',
    'amenaza': '#e67e22',
    'desplazamiento': '#3498db',
    'presencia armada': '#9b59b6',
    'otro': '#95a5a6'
};

const EventosRecientes = ({ filtroEvento }) => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/api/eventos')
            .then(res => res.json())
            .then(data => {
                setEventos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error al obtener eventos:', err);
                setLoading(false);
            });
    }, []);

    const eventosFiltrados = filtroEvento === 'todos'
        ? eventos
        : eventos.filter(e => e.tipo?.toLowerCase() === filtroEvento.toLowerCase());

    return (
        <div className="eventos-recientes">
            {loading ? (
                <p>Cargando eventos...</p>
            ) : (
                <ul className="lista-eventos">
                    {eventosFiltrados.length === 0 ? (
                        <li className="sin-eventos">No hay eventos recientes.</li>
                    ) : (
                        eventosFiltrados.map(evento => {
                            const color = tipoColores[evento.tipo?.toLowerCase()] || tipoColores['otro'];
                            return (
                                <li key={evento._id} className="evento-item" style={{ borderLeft: `6px solid ${color}` }}>
                                    <div className="evento-header">
                                        <span className="municipio">{evento.municipio}</span>
                                        <span className="vereda">{evento.vereda || 'Zona urbana'}</span>
                                    </div>
                                    <div className="evento-tipo" style={{ color }}>{evento.tipo}</div>
                                    <p className="evento-descripcion">{evento.descripcion}</p>
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
};

export default EventosRecientes;
