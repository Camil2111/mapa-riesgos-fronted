import { useEffect, useState } from 'react'
import axios from 'axios'

const ConsultaRiesgo = () => {
    const [datos, setDatos] = useState([])
    const [municipio, setMunicipio] = useState("")

    useEffect(() => {
        axios.get('http://localhost:3000/api/riesgos')
            .then(res => setDatos(res.data))
            .catch(err => console.error('❌ Error al obtener los datos:', err))
    }, [])

    const filtrados = datos.filter(item =>
        item.municipio.toLowerCase().includes(municipio.toLowerCase())
    )

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px' }}>Consulta de Riesgos por Municipio</h1>

            <input
                type="text"
                placeholder="Buscar municipio..."
                value={municipio}
                onChange={e => setMunicipio(e.target.value)}
                style={{
                    padding: '10px',
                    width: '300px',
                    marginBottom: '30px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Municipio</th>
                        <th style={thStyle}>Nivel de Riesgo</th>
                        <th style={thStyle}>Contexto</th>
                        <th style={thStyle}>Estructuras en la zona</th>
                        <th style={thStyle}>Novedades</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrados.map((item, index) => (
                        <tr key={index} style={index % 2 === 0 ? rowEven : rowOdd}>
                            <td style={tdStyle}>{item.municipio}</td>
                            <td style={tdStyle}>{item.nivel_riesgo}</td>
                            <td style={tdStyle}>{item.contexto}</td>
                            <td style={tdStyle}>{item.estructuras_zona}</td>
                            <td style={tdStyle}>{item.novedades}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const thStyle = {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderBottom: '2px solid #ccc'
}

const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee'
}

const rowEven = { backgroundColor: '#fff' }
const rowOdd = { backgroundColor: '#f9f9f9' }

export default ConsultaRiesgo
