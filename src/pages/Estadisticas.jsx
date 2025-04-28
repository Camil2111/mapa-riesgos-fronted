import { useEffect, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js'
import axios from 'axios'
import '../App.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Estadisticas = () => {
    const [datos, setDatos] = useState([])
    const [filtroMunicipio, setFiltroMunicipio] = useState('todos')

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        axios.get(`${API_URL}/api/estadisticas`)
            .then(res => setDatos(res.data))
            .catch(err => console.error('❌ Error cargando estadísticas:', err))
    }, [])

    const municipiosUnicos = [...new Set(datos.map(d => d.municipio))]

    const datosFiltrados = filtroMunicipio === 'todos'
        ? datos
        : datos.filter(d => d.municipio === filtroMunicipio)

    const agrupadosPorTipo = datosFiltrados.reduce((acc, curr) => {
        acc[curr.tipo] = (acc[curr.tipo] || 0) + curr.cantidad
        return acc
    }, {})

    const agrupadosPorMes = datos
        .filter(d => d.mes && d.mes !== '')
        .reduce((acc, d) => {
            acc[d.mes] = (acc[d.mes] || 0) + d.cantidad
            return acc
        }, {})

    const ranking = datos.reduce((acc, curr) => {
        acc[curr.municipio] = (acc[curr.municipio] || 0) + curr.cantidad
        return acc
    }, {})

    const rankingOrdenado = Object.entries(ranking)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)

    return (
        <div style={{ backgroundColor: '#0f1a1a', color: '#e5e5e5', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#29f77a', marginBottom: '30px' }}>
                🧭 Centro de Monitoreo - Estadísticas Criminales
            </h2>

            {/* Filtro por municipio */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <select
                    value={filtroMunicipio}
                    onChange={e => setFiltroMunicipio(e.target.value)}
                    style={{
                        padding: '10px',
                        backgroundColor: '#1d2d2d',
                        color: '#e5e5e5',
                        border: 'none',
                        borderRadius: '5px',
                        width: '300px'
                    }}
                >
                    <option value="todos">Todos los municipios</option>
                    {municipiosUnicos.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* Gráficos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                {/* Barras */}
                <div>
                    <Bar
                        data={{
                            labels: Object.keys(agrupadosPorTipo),
                            datasets: [{
                                label: 'Casos por tipo',
                                data: Object.values(agrupadosPorTipo),
                                backgroundColor: '#29f77a'
                            }]
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Casos por tipo de delito',
                                    color: '#29f77a'
                                },
                                legend: { labels: { color: '#e5e5e5' } }
                            },
                            scales: {
                                x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
                                y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
                            }
                        }}
                    />
                </div>

                {/* Pastel */}
                <div>
                    <Pie
                        data={{
                            labels: Object.keys(agrupadosPorTipo),
                            datasets: [{
                                label: 'Proporción',
                                data: Object.values(agrupadosPorTipo),
                                backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#2980b9', '#9b59b6']
                            }]
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Proporción de tipos de delito',
                                    color: '#29f77a'
                                },
                                legend: { labels: { color: '#e5e5e5' } }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Línea mensual */}
            <div style={{ marginBottom: '40px' }}>
                <Line
                    data={{
                        labels: Object.keys(agrupadosPorMes),
                        datasets: [{
                            label: 'Evolución mensual de casos',
                            data: Object.values(agrupadosPorMes),
                            borderColor: '#29f77a',
                            backgroundColor: 'rgba(41, 247, 122, 0.2)',
                            tension: 0.3,
                            fill: true
                        }]
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Casos reportados por mes',
                                color: '#29f77a'
                            },
                            legend: { labels: { color: '#e5e5e5' } }
                        },
                        scales: {
                            x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
                            y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
                        }
                    }}
                />
            </div>

            {/* Top 10 Municipios */}
            <div style={{
                backgroundColor: '#141f1f',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: '0 0 10px #29f77a'
            }}>
                <h3 style={{ color: '#29f77a', marginBottom: '15px' }}>🏆 Top 10 municipios con más casos</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {rankingOrdenado.map(([municipio, total], i) => (
                        <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid #2c2c2c' }}>
                            <strong>{i + 1}. {municipio}</strong>: {total} casos
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Estadisticas
