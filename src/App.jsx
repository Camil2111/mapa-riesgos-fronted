import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import MapaRiesgos from './mapaRiesgos'
import Splash from './Splash.jsx'
import riesgosData from './datos_riesgos.json'
import Estadisticas from './pages/estadisticas.jsx'
import EventosRecientes from './components/EventosRecientes.jsx'
import './App.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function App() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEvento, setFiltroEvento] = useState('todos')
  const [mostrarMapa, setMostrarMapa] = useState(false)
  const [datosEstadisticas, setDatosEstadisticas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/estadisticas`)
      .then(res => res.json())
      .then(data => {
        setDatosEstadisticas(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Error al obtener estadísticas:', err)
        setLoading(false)
      })
  }, [])

  const filtrarRiesgos = () => {
    let filtrados = riesgosData
    if (filtro !== 'todos') {
      filtrados = filtrados.filter(r => r.nivel_riesgo?.toLowerCase() === filtro)
    }
    if (busqueda.trim() !== '') {
      filtrados = filtrados.filter(r => r.municipio?.toLowerCase().includes(busqueda.toLowerCase()))
    }
    return filtrados
  }

  return (
    <Router>
      {mostrarMapa ? (
        <div style={{ backgroundColor: '#0f1a1a', color: '#e5e5e5', minHeight: '100vh', padding: '10px' }}>
          {/* Encabezado */}
          <div style={{
            backgroundColor: '#141f1f',
            padding: '15px 20px',
            textAlign: 'center',
            borderBottom: '2px solid #29f77a',
            boxShadow: '0 0 15px #29f77a'
          }}>
            <h2 style={{
              margin: 0,
              color: '#29f77a',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontSize: '22px'
            }}>
              Sistema de Monitoreo de Riesgo Territorial
            </h2>
          </div>

          {/* Layout principal */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* Filtros */}
            <div style={{
              width: '300px',
              backgroundColor: '#141f1f',
              padding: '20px',
              border: '1px solid #2c2c2c',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(41, 247, 122, 0.2)',
              fontSize: '15px',
              height: 'fit-content'
            }}>
              <h3 style={{ color: '#29f77a', textAlign: 'center', marginBottom: '20px' }}>Filtros</h3>

              <label>Filtrar por nivel:</label>
              <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ width: '100%' }}>
                <option value="todos">Todos</option>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
                <option value="bajo">Bajo</option>
              </select>

              <label style={{ marginTop: '15px' }}>Buscar municipio:</label>
              <input
                type="text"
                placeholder="Ej: Argelia"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ width: '100%' }}
              />

              <label style={{ marginTop: '15px' }}>Filtrar eventos recientes:</label>
              <select value={filtroEvento} onChange={e => setFiltroEvento(e.target.value)} style={{ width: '100%' }}>
                <option value="todos">Todos</option>
                <option value="conflicto armado">Conflicto armado</option>
                <option value="artefacto explosivo">Artefacto explosivo</option>
                <option value="amenaza">Amenaza</option>
                <option value="desplazamiento">Desplazamiento</option>
                <option value="presencia armada">Presencia armada</option>
              </select>

              <EventosRecientes filtroEvento={filtroEvento} />
            </div>

            {/* Mapa */}
            <div style={{ flex: 2 }}>
              <MapaRiesgos riesgos={filtrarRiesgos()} filtroEvento={filtroEvento} />
            </div>

            {/* Estadísticas */}
            <div style={{
              flex: 1,
              backgroundColor: '#101a1a',
              padding: '20px',
              border: '1px solid #2c2c2c',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(41, 247, 122, 0.2)',
              minWidth: '400px'
            }}>
              <h3 style={{ color: '#29f77a', marginBottom: '20px' }}>Estadísticas de Riesgo</h3>
              {loading ? (
                <p>🔄 Cargando datos...</p>
              ) : (
                <Bar
                  data={{
                    labels: datosEstadisticas.map(item => item.municipio),
                    datasets: [{
                      label: 'Casos por municipio',
                      data: datosEstadisticas.map(item => item.casos),
                      backgroundColor: '#29f77a'
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { labels: { color: '#e5e5e5' } },
                      title: { display: true, text: 'Casos por Municipio', color: '#29f77a' }
                    },
                    scales: {
                      x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
                      y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Splash onFinish={() => setMostrarMapa(true)} />
      )}
    </Router>
  )
}

export default App
