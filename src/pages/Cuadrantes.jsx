import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Cuadrantes = () => {
    const [data, setData] = useState([])
    const [departamento, setDepartamento] = useState('todos')
    const [municipio, setMunicipio] = useState('todos')

    useEffect(() => {
        axios.get('/cuadrantes.json')
            .then(res => setData(res.data))
            .catch(err => console.error('❌ Error cargando cuadrantes:', err))
    }, [])

    const departamentosUnicos = [...new Set(data.map(d => d.departamento))]
    const municipiosFiltrados = data
        .filter(d => departamento === 'todos' || d.departamento === departamento)
        .map(d => d.municipio)
    const municipiosUnicos = [...new Set(municipiosFiltrados)]

    const dataFiltrada = data.filter(d =>
        (departamento === 'todos' || d.departamento === departamento) &&
        (municipio === 'todos' || d.municipio === municipio)
    )

    return (
        <div style={{ backgroundColor: '#0f1a1a', color: '#e5e5e5', padding: '20px' }}>
            <h2 style={{ color: '#29f77a', marginBottom: '20px' }}>
                📍 Directorio de Cuadrantes Policiales
            </h2>

            <div style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ color: '#29f77a' }}>⬅️ Volver al Mapa</Link>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <select value={departamento} onChange={e => {
                    setDepartamento(e.target.value)
                    setMunicipio('todos')
                }}>
                    <option value="todos">Todos los departamentos</option>
                    {departamentosUnicos.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                    ))}
                </select>

                <select value={municipio} onChange={e => setMunicipio(e.target.value)}>
                    <option value="todos">Todos los municipios</option>
                    {municipiosUnicos.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#1f2f2f' }}>
                    <tr>
                        <th style={tdStyle}>Departamento</th>
                        <th style={tdStyle}>Municipio</th>
                        <th style={tdStyle}>Unidad</th>
                        <th style={tdStyle}>Tipo</th>
                        <th style={tdStyle}>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {dataFiltrada.map((d, i) => (
                        <tr key={i}>
                            <td style={tdStyle}>{d.departamento}</td>
                            <td style={tdStyle}>{d.municipio}</td>
                            <td style={tdStyle}>{d.unidad}</td>
                            <td style={tdStyle}>{d.tipo}</td>
                            <td style={tdStyle}>{d.telefono}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {dataFiltrada.length === 0 && <p style={{ marginTop: '20px' }}>🔍 No se encontraron cuadrantes para este filtro.</p>}
        </div>
    )
}

const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #333',
    textAlign: 'left'
}

export default Cuadrantes
