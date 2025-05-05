// src/pages/EditRiesgos.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EditRiesgos() {
    const [riesgos, setRiesgos] = useState([])
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [filtroDepto, setFiltroDepto] = useState('todos')

    const token = localStorage.getItem('authToken')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setRiesgos(res.data))
            .catch(err => {
                console.error('❌ Error al cargar los datos:', err)
                setError('No se pudieron cargar los datos.')
            })
    }, [])

    const actualizarCampo = (indexReal, campo, valor) => {
        const actualizados = [...riesgos]
        actualizados[indexReal][campo] = valor
        setRiesgos(actualizados)
    }

    const guardarCambios = () => {
        setMensaje('')
        setError('')
        axios.post(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, riesgos, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => setMensaje('✅ Cambios guardados correctamente.'))
            .catch(err => {
                console.error('❌ Error al guardar:', err)
                setError('No se pudieron guardar los cambios.')
            })
    }

    const departamentos = [...new Set(riesgos.map(r => r.departamento).filter(Boolean))]
    const riesgosFiltrados = filtroDepto === 'todos'
        ? riesgos
        : riesgos.filter(r => r.departamento === filtroDepto)

    return (
        <div style={{ padding: '20px' }}>
            <h2>Editor de datos_riesgos.json</h2>
            <p>Aquí podrás ver, editar y guardar los niveles de riesgo.</p>

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Filtrar por departamento:</label>
            <select value={filtroDepto} onChange={e => setFiltroDepto(e.target.value)}>
                <option value="todos">Todos</option>
                {departamentos.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                ))}
            </select>

            {riesgosFiltrados.length > 0 ? (
                <>
                    <table border="1" cellPadding="8" style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Departamento</th>
                                <th>Municipio</th>
                                <th>Nivel</th>
                                <th>Contexto</th>
                                <th>Novedades</th>
                                <th>Estructuras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riesgosFiltrados.map((r, i) => {
                                const indexReal = riesgos.findIndex(orig => orig.municipio === r.municipio && orig.departamento === r.departamento)
                                return (
                                    <tr key={i}>
                                        <td>{r.departamento}</td>
                                        <td>{r.municipio}</td>
                                        <td>
                                            <select value={r.nivel_riesgo} onChange={(e) => actualizarCampo(indexReal, 'nivel_riesgo', e.target.value)}>
                                                <option value="bajo">Bajo</option>
                                                <option value="moderado">Moderado</option>
                                                <option value="alto">Alto</option>
                                                <option value="critico">Crítico</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={r.contexto || ''}
                                                onChange={(e) => actualizarCampo(indexReal, 'contexto', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={r.novedades || ''}
                                                onChange={(e) => actualizarCampo(indexReal, 'novedades', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={r.estructuras_zona || ''}
                                                onChange={(e) => actualizarCampo(indexReal, 'estructuras_zona', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <button
                        onClick={guardarCambios}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#29f77a',
                            color: '#0f1a1a',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold'
                        }}
                    >
                        Guardar cambios
                    </button>
                </>
            ) : (
                <p style={{ marginTop: '20px' }}>No hay datos para mostrar.</p>
            )}
        </div>
    )
}
