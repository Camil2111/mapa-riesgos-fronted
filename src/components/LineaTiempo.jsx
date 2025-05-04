import { useEffect, useState } from 'react'
import axios from 'axios'

const LineaTiempo = ({ municipio }) => {
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        if (!municipio || municipio === 'todos') return
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/eventos?municipio=${municipio}`)
            .then(res => {
                const ordenados = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                setEventos(ordenados)
            })
            .catch(err => {
                console.error('❌ Error al cargar línea de tiempo:', err)
            })
    }, [municipio])

    if (!municipio || municipio === 'todos') return null

    return (
        <div style={{
            backgroundColor: '#1d2d2d',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px',
            color: '#e5e5e5',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: '0 0 10px #29f77a'
        }}>
            <h3 style={{ color: '#29f77a', marginBottom: '10px' }}>
                🕒 Línea de tiempo - {municipio}
            </h3>
            {eventos.length === 0 ? (
                <p>No hay eventos registrados.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {eventos.map((e, i) => (
                        <li key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <strong>{new Date(e.fecha).toLocaleDateString()}</strong> - <em>{e.tipo}</em><br />
                            {e.descripcion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default LineaTiempo
