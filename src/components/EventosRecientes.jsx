import { useEffect, useState } from 'react'

const EventosRecientes = ({ filtroEvento }) => {
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/eventos`)
            .then(res => res.json())
            .then(data => setEventos(data))
            .catch(err => console.error('❌ Error al obtener eventos:', err))
    }, [])

    const eventosFiltrados = filtroEvento === 'todos'
        ? eventos
        : eventos.filter(e => e.tipo.toLowerCase() === filtroEvento.toLowerCase())

    return (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#29f77a', textAlign: 'center', marginBottom: '10px' }}>
                📢 Últimos eventos reportados
            </h3>
            <ul style={{
                listStyle: 'none',
                padding: 0,
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '14px'
            }}>
                {eventosFiltrados.length === 0 ? (
                    <li style={{ color: '#999', textAlign: 'center' }}>
                        No hay eventos recientes.
                    </li>
                ) : (
                    eventosFiltrados.map((evento, index) => (
                        <li key={index} style={{
                            marginBottom: '8px',
                            padding: '5px',
                            backgroundColor: '#1d2d2d',
                            borderRadius: '5px'
                        }}>
                            <strong>{evento.vereda || 'Zona rural'}</strong> ({evento.municipio})<br />
                            <span style={{ color: '#f39c12', fontSize: '12px' }}>
                                [{evento.tipo}] {evento.fecha}
                            </span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default EventosRecientes


