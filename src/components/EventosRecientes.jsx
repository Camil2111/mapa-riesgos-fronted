import { useEffect, useState } from 'react'
import axios from 'axios'

const EventosRecientes = ({ filtroEvento }) => {
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + '/api/eventos')
            .then(res => setEventos(res.data))
            .catch(err => console.error('❌ Error cargando eventos recientes:', err))
    }, [])

    const eventosFiltrados = filtroEvento === 'todos'
        ? eventos
        : eventos.filter(e => e.tipo.toLowerCase() === filtroEvento.toLowerCase())

    return (
        <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: '#29f77a', marginBottom: '10px' }}>📢 Últimos eventos reportados:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '250px', overflowY: 'auto' }}>
                {eventosFiltrados.length === 0 ? (
                    <li style={{ color: '#ccc' }}>No hay eventos recientes.</li>
                ) : (
                    eventosFiltrados.map((evento, i) => (
                        <li key={i} style={{ padding: '4px 0', color: '#ccc' }}>
                            📍 <strong>{evento.vereda}</strong> ({evento.municipio}) -
                            <span style={{ color: '#f39c12' }}> [{evento.tipo}]</span> {evento.fecha}
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default EventosRecientes



