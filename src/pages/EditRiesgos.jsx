// src/pages/EditRiesgos.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EditRiesgos() {
    const [datos, setDatos] = useState([])
    const [editados, setEditados] = useState([])
    const [departamentoFiltro, setDepartamentoFiltro] = useState('todos')
    const [municipioFiltro, setMunicipioFiltro] = useState('todos')

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        axios.get(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setDatos(res.data)
                setEditados(res.data)
            })
            .catch(err => console.error('❌ Error al cargar datos:', err))
    }, [])

    const handleEdit = (index, campo, valor) => {
        const nuevos = [...editados]
        nuevos[index][campo] = valor
        setEditados(nuevos)
    }

    const handleGuardar = async () => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, editados, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert('✅ Datos guardados correctamente')
        } catch (err) {
            console.error('❌ Error guardando:', err)
            alert('Error al guardar')
        }
    }

    const departamentosUnicos = [...new Set(datos.map(d => d.departamento).filter(Boolean))].sort()
    const municipiosUnicos = [...new Set(
        datos
            .filter(d => departamentoFiltro === 'todos' || d.departamento === departamentoFiltro)
            .map(d => d.municipio)
            .filter(Boolean)
    )].sort()

    const filtrados = editados.filter(d => {
        const dep = departamentoFiltro === 'todos' || d.departamento === departamentoFiltro
        const mun = municipioFiltro === 'todos' || d.municipio === municipioFiltro
        return dep && mun
    })

    return (
        <div style={{ padding: '20px' }}>
            <h2>🛠️ Editor de datos_riesgos.json</h2>

            {/* Filtros */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                <div>
                    <label>Departamento:</label><br />
                    <select value={departamentoFiltro} onChange={e => {
                        setDepartamentoFiltro(e.target.value)
                        setMunicipioFiltro('todos')
                    }}>
                        <option value="todos">Todos</option>
                        {departamentosUnicos.map((dep, i) => (
                            <option key={i} value={dep}>{dep}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Municipio:</label><br />
                    <select value={municipioFiltro} onChange={e => setMunicipioFiltro(e.target.value)}>
                        <option value="todos">Todos</option>
                        {municipiosUnicos.map((mun, i) => (
                            <option key={i} value={mun}>{mun}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabla editable */}
            <table border="1" cellPadding="6" style={{ width: '100%', fontSize: '14px' }}>
                <thead style={{ background: '#f0f0f0' }}>
                    <tr>
                        <th>Municipio</th>
                        <th>Departamento</th>
                        <th>Nivel de riesgo</th>
                        <th>Contexto</th>
                        <th>Novedades</th>
                        <th>Estructuras zona</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.municipio}</td>
                            <td>{item.departamento}</td>
                            <td>
                                <select value={item.nivel_riesgo || ''} onChange={e => handleEdit(itemIndex(item), 'nivel_riesgo', e.target.value)}>
                                    <option value="">--</option>
                                    <option value="Bajo">Bajo</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Crítico">Crítico</option>
                                </select>
                            </td>
                            <td>
                                <input value={item.contexto || ''} onChange={e => handleEdit(itemIndex(item), 'contexto', e.target.value)} />
                            </td>
                            <td>
                                <input value={item.novedades || ''} onChange={e => handleEdit(itemIndex(item), 'novedades', e.target.value)} />
                            </td>
                            <td>
                                <input value={item.estructuras_zona || ''} onChange={e => handleEdit(itemIndex(item), 'estructuras_zona', e.target.value)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Guardar */}
            <button onClick={handleGuardar} style={{ marginTop: '15px', padding: '10px 20px' }}>
                💾 Guardar cambios
            </button>
        </div>
    )

    // Para ubicar el índice original del item editado
    function itemIndex(item) {
        return editados.findIndex(d => d.municipio === item.municipio && d.departamento === item.departamento)
    }
}
