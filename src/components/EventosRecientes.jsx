// src/components/EventosRecientes.jsx

import { useEffect, useState } from 'react';

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
            <h4>Últimos eventos reportados</h4>
            {loading ? (
                <p>Cargando eventos...</p>
            ) : (
                <ul>
                    {eventosFiltrados.length === 0 ? (
                        <li>No hay eventos recientes.</li>
                    ) : (
                        eventosFiltrados.map(evento => (
                            <li key={evento._id}>
                                <strong>{evento.municipio}</strong> - {evento.vereda || 'Zona urbana'}<br />
                                <em>{evento.tipo}</em>: {evento.descripcion}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default EventosRecientes;
