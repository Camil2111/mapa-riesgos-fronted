import React, { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

import MapaRiesgos from './MapaRiesgos.jsx'
import Splash from './Splash.jsx'
import Estadisticas from './pages/Estadisticas.jsx'
import EventosRecientes from './components/EventosRecientes.jsx'
import Cuadrantes from './pages/Cuadrantes.jsx'
import LineaTiempo from './components/LineaTiempo.jsx'

// NUEVOS IMPORTS PARA ADMIN
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditRiesgos from './pages/EditRiesgos.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
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
  const [riesgosData, setRiesgosData] = useState([])

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

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/riesgos-adicionales')
      .then(res => res.json())
      .then(data => setRiesgosData(data))
      .catch(err => console.error('❌ Error al cargar riesgos:', err))
  }, [])

  const normalizar = (str) =>
    str?.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

  const departamentos = useMemo(() => {
    const mapa = new Map()
    riesgosData.forEach(r => {
      const raw = r.departamento
      if (raw && !mapa.has(raw)) {
        mapa.set(raw, raw)
      }
    })
    return Array.from(mapa.entries()).map(([key, label]) => ({ key, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [riesgosData])

  const municipiosFiltrados = riesgosData
    .filter(r => departamento === 'todos' || normalizar(r.departamento) === normalizar(departamento))
    .map(r => (r.municipio || '').trim())
  const municipiosUnicos = [...new Set(municipiosFiltrados)]

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          mostrarMapa ? (
            <div style={{ backgroundColor: '#0f1a1a', color: '#e5e5e5', minHeight: '100vh' }}>
              <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 25px',
                background: 'linear-gradient(to right, #0f1a1a, #141f1f)',
                boxShadow: '0 2px 8px rgba(0, 255, 128, 0.2)',
                borderBottom: '1px solid #29f77a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: '#29f77a',
                    borderRadius: '50%',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1a1a',
                    fontWeight: 'bold'
                  }}>
                    PR
                  </div>
                  <h2 style={{
                    margin: 0,
                    color: '#29f77a',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Riesgo Territorial
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <Link to="/cuadrantes" style={{ color: '#29f77a', fontWeight: '500' }}> 👮 Cuadrantes</Link>
                  <Link to="/estadisticas" style={{ color: '#29f77a', fontWeight: '500' }}>📊 Estadísticas</Link>
                </div>
              </header>


              <div className="main-container">
                <div style={{
                  backgroundColor: 'rgba(20, 31, 31, 0.85)',
                  padding: '20px',
                  borderRadius: '10px',
                  color: '#e5e5e5',
                  fontSize: '14px',
                  width: '270px',
                  minHeight: '100%',
                  boxShadow: '0 0 8px #29f77a',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h3 style={{ color: '#29f77a', marginBottom: '10px' }}>🎛️ Filtros</h3>

                  <label>📊 Nivel de Riesgo:</label>
                  <select value={filtro} onChange={e => setFiltro(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="bajo">Bajo</option>
                    <option value="moderado">Moderado</option>
                    <option value="critico">Crítico</option>
                    <option value="alto">Alto</option>
                  </select>

                  <label>🧭 Departamento:</label>
                  <select value={departamento} onChange={e => {
                    setDepartamento(e.target.value)
                    setMunicipio('todos')
                  }}>
                    <option value="todos">Todos</option>
                    {departamentos.map((d, i) => (
                      <option key={i} value={d.key}>{d.label}</option>
                    ))}
                  </select>

                  <label>🏘️ Municipio:</label>
                  <select value={municipio} onChange={e => setMunicipio(e.target.value)}>
                    <option value="todos">Todos</option>
                    {municipiosUnicos.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>

                  <label>📰 Tipo de Evento:</label>
                  <select value={filtroEvento} onChange={e => setFiltroEvento(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="conflicto armado">Conflicto armado</option>
                    <option value="artefacto explosivo">Artefacto explosivo</option>
                    <option value="amenaza">Amenaza</option>
                    <option value="desplazamiento">Desplazamiento</option>
                    <option value="presencia armada">Presencia armada</option>
                    <option value="Noticia Google News">Noticia Google News</option>
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
                      backgroundColor: '#29f77a',
                      color: '#0f1a1a',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px',
                      marginTop: '15px',
                      width: '100%',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🧹 Limpiar filtros
                  </button>
                </div>


                <div className="map-container">
                  <MapaRiesgos
                    filtroNivel={filtro}
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

                <LineaTiempo municipio={municipio} />
              </div>
            </div>
          ) : (
            <Splash onFinish={() => setMostrarMapa(true)} />
          )
        } />

        <Route path="/cuadrantes" element={<Cuadrantes />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/editar-riesgos" element={<ProtectedRoute><EditRiesgos /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App

