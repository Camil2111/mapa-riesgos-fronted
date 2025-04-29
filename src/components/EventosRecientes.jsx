import { useEffect, useState } from 'react'
import axios from 'axios'

const EventosRecientes = ({ filtroEvento }) => {
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/eventos`)
            .then(res => setEventos(res.data))
            .catch(err => console.error('❌ Error cargando eventos recientes:', err))
    }, [])

    const eventosFiltrados = filtroEvento === 'todos'
        ? eventos
        : eventos.filter(e => e.tipo.toLowerCase() === filtroEvento.toLowerCase())

    return (
        <div className="eventos-recientes">
            <h4>Últimos Eventos Reportados</h4>
            <ul>
                {eventosFiltrados.map((evento, index) => (
                    <li key={index}>
                        <strong>{evento.tipo}</strong> - {evento.municipio} ({evento.fecha})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventosRecientes
