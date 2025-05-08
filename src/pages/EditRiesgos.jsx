import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EditRiesgos() {
    const [riesgos, setRiesgos] = useState([])
    const [filtroDepto, setFiltroDepto] = useState('todos')
    const [filtroMuni, setFiltroMuni] = useState('todos')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/public/datos-riesgos`)
            .then(res => setRiesgos(res.data))
            .catch(err => console.error('❌ Error cargando riesgos:', err))
    }, [])

    const handleChange = (index, campo, valor) => {
        const copia = [...riesgos]
        copia[index][campo] = campo === 'nivel_riesgo' ? valor.toLowerCase() : valor
        setRiesgos(copia)
    }

    const guardarCambios = () => {
        const token = localStorage.getItem('authToken')
        axios.post(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, riesgos, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => alert('✅ Datos guardados'))
            .catch(() => alert('❌ Error al guardar datos'))
    }

    const departamentos = [...new Set(riesgos.map(r => r.departamento).filter(Boolean))]
    const municipios = [...new Set(riesgos.filter(r => filtroDepto === 'todos' || r.departamento === filtroDepto).map(r => r.municipio))]

    const filtrados = riesgos.filter(r => {
        const d = filtroDepto === 'todos' || r.departamento === filtroDepto
        const m = filtroMuni === 'todos' || r.municipio === filtroMuni
        return d && m
    })

    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#e5e5e5', minHeight: '100vh' }}>
            <h2>Editor de datos_riesgos.json</h2>
            <p>Aquí podrás ver, editar y guardar los niveles de riesgo.</p>

            <div style={{ marginBottom: '15px' }}>
                <label>Filtrar por departamento:</label>
                <select value={filtroDepto} onChange={(e) => {
                    setFiltroDepto(e.target.value)
                    setFiltroMuni('todos')
                }}>
                    <option value="todos">Todos</option>
                    {departamentos.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>

                <label style={{ marginLeft: '10px' }}>Municipio:</label>
                <select value={filtroMuni} onChange={(e) => setFiltroMuni(e.target.value)}>
                    <option value="todos">Todos</option>
                    {municipios.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
            </div>

            <table style={{ width: '100%', backgroundColor: '#262626', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ color: '#29f77a' }}>Municipio</th>
                        <th style={{ color: '#29f77a' }}>Nivel</th>
                        <th style={{ color: '#29f77a' }}>Contexto</th>
                        <th style={{ color: '#29f77a' }}>Novedades</th>
                        <th style={{ color: '#29f77a' }}>Estructuras</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map((item, index) => (
                        <tr key={index}>
                            <td>{item.municipio}</td>
                            <td>
                                <select
                                    value={item.nivel_riesgo?.toLowerCase() || ''}
                                    onChange={(e) => handleChange(index, 'nivel_riesgo', e.target.value)}
                                >
                                    <option value="bajo">Bajo</option>
                                    <option value="moderado">Moderado</option>
                                    <option value="critico">Crítico</option>
                                    <option value="alto">Alto</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.contexto || ''}
                                    onChange={(e) => handleChange(index, 'contexto', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.novedades || ''}
                                    onChange={(e) => handleChange(index, 'novedades', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.estructuras_zona || ''}
                                    onChange={(e) => handleChange(index, 'estructuras_zona', e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}
