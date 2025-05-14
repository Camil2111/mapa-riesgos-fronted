import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EditRiesgos() {
    const [riesgos, setRiesgos] = useState([])
    const [filtroDepto, setFiltroDepto] = useState('todos')
    const [filtroMuni, setFiltroMuni] = useState('todos')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/riesgos-adicionales`)
            .then(res => setRiesgos(res.data))
            .catch(err => console.error('❌ Error cargando riesgos:', err))
    }, [])

    const handleChange = (index, campo, valor) => {
        setRiesgos(prev =>
            prev.map((r, i) => i === index ? { ...r, [campo]: valor } : r)
        )
    }

    const guardarCambios = () => {
        const token = localStorage.getItem('authToken')
        axios.post(`${import.meta.env.VITE_API_URL}/api/riesgos-adicionales`, { data: riesgos }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => alert('✅ Cambios guardados en MongoDB'))
            .catch(err => {
                console.error('❌ Error al guardar:', err)
                alert('❌ Error al guardar los datos')
            })
    }

    const departamentos = [...new Set(riesgos.map(r => r.departamento).filter(Boolean))]
    const municipios = [...new Set(riesgos.filter(r => filtroDepto === 'todos' || r.departamento === filtroDepto).map(r => r.municipio))]

    const filtrados = riesgos.filter(r => {
        const matchD = filtroDepto === 'todos' || r.departamento === filtroDepto
        const matchM = filtroMuni === 'todos' || r.municipio === filtroMuni
        return matchD && matchM
    })

    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#e5e5e5', minHeight: '100vh' }}>
            <h2>Editor de Riesgos desde MongoDB</h2>

            <button
                style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#29f77a', color: '#0f1a1a', border: 'none', borderRadius: '5px' }}
                onClick={guardarCambios}
            >
                Guardar Cambios
            </button>

            <div style={{ marginBottom: '15px' }}>
                <label>Departamento:</label>
                <select value={filtroDepto} onChange={e => { setFiltroDepto(e.target.value); setFiltroMuni('todos') }}>
                    <option value="todos">Todos</option>
                    {departamentos.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>

                <label style={{ marginLeft: '10px' }}>Municipio:</label>
                <select value={filtroMuni} onChange={e => setFiltroMuni(e.target.value)}>
                    <option value="todos">Todos</option>
                    {municipios.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
            </div>

            <table style={{ width: '100%', backgroundColor: '#141f1f', borderCollapse: 'collapse', color: '#e5e5e5' }}>
                <thead>
                    <tr>
                        <th>Municipio</th>
                        <th>Nivel</th>
                        <th>Contexto</th>
                        <th>Novedades</th>
                        <th>Estructuras</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map((item, i) => (
                        <tr key={i}>
                            <td>{item.municipio}</td>
                            <td>
                                <select value={item.nivel_riesgo || ''} onChange={e => handleChange(i, 'nivel_riesgo', e.target.value)}>
                                    <option value="Bajo">Bajo</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Crítico">Crítico</option>
                                </select>
                            </td>
                            <td>
                                <input type="text" value={item.contexto || ''} onChange={e => handleChange(i, 'contexto', e.target.value)} />
                            </td>
                            <td>
                                <input type="text" value={item.novedades || ''} onChange={e => handleChange(i, 'novedades', e.target.value)} />
                            </td>
                            <td>
                                <input type="text" value={item.estructuras_zona || ''} onChange={e => handleChange(i, 'estructuras_zona', e.target.value)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

