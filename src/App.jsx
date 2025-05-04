import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import MapaRiesgos from './MapaRiesgos.jsx'
import Splash from './Splash.jsx'
import riesgosData from './datos_riesgos.json'
import Estadisticas from './pages/Estadisticas.jsx'
import EventosRecientes from './components/EventosRecientes.jsx'
import Cuadrantes from './pages/Cuadrantes.jsx'
import LineaTiempo from './components/LineaTiempo.jsx'
import './App.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function App() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEvento, setFiltroEvento] = useState('todos')
  const [mostrarMapa, setMostrarMapa] = useState(false)
  const [datosEstadisticas, setDatosEstadisticas] = useState([])
  const [loading, setLoading] = useState(true)
  const [departamento, setDepartamento] = useState('todos')
  const [municipio, setMunicipio] = useState('todos')

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/estadisticas')
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

  const departamentos = [...new Set(riesgosData.map(r => r.departamento).filter(Boolean))]
  const municipiosFiltrados = riesgosData
    .filter(r => departamento === 'todos' || r.departamento === departamento)
    .map(r => r.municipio)
  const municipiosUnicos = [...new Set(municipiosFiltrados)]

  const filtrarRiesgos = () => {
    return riesgosData.filter(r => {
      const nivelMatch = filtro === 'todos' || r.nivel_riesgo?.toLowerCase() === filtro
      const deptoMatch = departamento === 'todos' || r.departamento === departamento
      const muniMatch = municipio === 'todos' || r.municipio === municipio
      const busquedaMatch = busqueda.trim() === '' || r.municipio?.toLowerCase().includes(busqueda.toLowerCase())
      return nivelMatch && deptoMatch && muniMatch && busquedaMatch
    })
  }

  return (
    <Router>
      <Routes>
        {/* Ruta principal: el mapa */}
        <Route path="/" element={
          mostrarMapa ? (
            <div style={{ backgroundColor: '#0f1a1a', color: '#e5e5e5', minHeight: '100vh' }}>
              <header style={{
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
                <div style={{ marginTop: '10px' }}>
                  <Link to="/cuadrantes" style={{ color: '#29f77a', marginRight: '15px' }}>📍 Cuadrantes</Link>
                  <Link to="/estadisticas" style={{ color: '#29f77a' }}>📊 Estadísticas</Link>
                </div>
              </header>

              <div className="main-container">
                {/* Panel izquierdo: filtros */}
                <div className="left-panel panel-filtros">
                  <h3>Filtros</h3>
                  <label>Filtrar por nivel:</label>
                  <select value={filtro} onChange={e => setFiltro(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="bajo">Bajo</option>
                    <option value="moderado">Moderado</option>
                    <option value="critico">Crítico</option>
                    <option value="alto">Alto</option>
                  </select>

                  <label style={{ marginTop: '15px' }}>Departamento:</label>
                  <select value={departamento} onChange={e => {
                    setDepartamento(e.target.value)
                    setMunicipio('todos')
                  }}>
                    <option value="todos">Todos</option>
                    {departamentos.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>

                  <label style={{ marginTop: '15px' }}>Municipio:</label>
                  <select value={municipio} onChange={e => setMunicipio(e.target.value)}>
                    <option value="todos">Todos</option>
                    {municipiosUnicos.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>

                  <label style={{ marginTop: '15px' }}>Filtrar eventos recientes:</label>
                  <select value={filtroEvento} onChange={e => setFiltroEvento(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="conflicto armado">Conflicto armado</option>
                    <option value="artefacto explosivo">Artefacto explosivo</option>
                    <option value="amenaza">Amenaza</option>
                    <option value="desplazamiento">Desplazamiento</option>
                    <option value="presencia armada">Presencia armada</option>
                  </select>

                  <button
                    onClick={() => {
                      setFiltro('todos')
                      setDepartamento('todos')
                      setMunicipio('todos')
                      setBusqueda('')
                      setFiltroEvento('todos')
                    }}
                    style={{
                      marginTop: '15px',
                      padding: '10px',
                      width: '100%',
                      backgroundColor: '#29f77a',
                      color: '#0f1a1a',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>

                {/* Mapa */}
                <div className="map-container">
                  <MapaRiesgos
                    riesgos={filtrarRiesgos()}
                    filtroEvento={filtroEvento}
                    municipioFiltro={municipio}
                    departamentoFiltro={departamento}
                  />
                </div>

                <div className="right-panel">
                  <div className="chart-container">
                    <h3 style={{ marginBottom: '10px' }}>🕒 Actividad Reciente</h3>
                    <EventosRecientes filtroEvento={filtroEvento} />
                  </div>
                </div>


                {/* Línea de tiempo */}
                <LineaTiempo municipio={municipio} />

              </div>
            </div>
          ) : (
            <Splash onFinish={() => setMostrarMapa(true)} />
          )
        } />

        {/* Otras rutas */}
        <Route path="/cuadrantes" element={<Cuadrantes />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
    </Router>
  )
}

export default App
