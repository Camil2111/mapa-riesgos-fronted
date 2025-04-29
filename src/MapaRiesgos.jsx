import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, Popup, Marker, GeoJSON, useMap } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Colores de riesgo
const getColor = (nivel) => {
    switch (nivel?.toLowerCase()) {
        case 'alto': return '#e74c3c'
        case 'medio': return '#f39c12'
        case 'bajo': return '#27ae60'
        default: return '#95a5a6'
    }
}

// Ícono personalizado para eventos y mas care verga
const iconoEvento = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
})

// Leyenda de niveles de riesgo
const Leyenda = () => {
    const map = useMap()

    useEffect(() => {
        const legend = L.control({ position: 'bottomright' })
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend')
            const niveles = ['Alto', 'Medio', 'Bajo']
            const colores = ['#e74c3c', '#f39c12', '#27ae60']
            div.innerHTML += '<h4>Nivel de Riesgo</h4>'
            niveles.forEach((nivel, i) => {
                div.innerHTML += `<i style="background:${colores[i]}; width:18px; height:18px; display:inline-block; margin-right:5px;"></i> ${nivel}<br>`
            })
            return div
        }
        legend.addTo(map)
    }, [map])

    return null
}

const MapaRiesgos = ({ riesgos, filtroEvento }) => {
    const [limitesDepartamentos, setLimitesDepartamentos] = useState(null)
    const [eventos, setEventos] = useState([])

    // Cargar límites del departamento si quieres (opcional)
    useEffect(() => {
        fetch('/limites_departamentos.geojson')
            .then(res => res.json())
            .then(data => setLimitesDepartamentos(data))
            .catch(err => console.error('❌ Error cargando límites:', err))
    }, [])

    // Cargar eventos en tiempo real
    useEffect(() => {
        axios.get('http://localhost:3000/api/eventos')
            .then(res => setEventos(res.data))
            .catch(err => console.error('❌ Error al cargar eventos:', err))
    }, [])

    if (!Array.isArray(riesgos)) return <p style={{ color: 'white' }}>Cargando datos de riesgos...</p>

    return (
        <MapContainer center={[2.5, -76.6]} zoom={8} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors, Tiles by HOT"
            />

            <Leyenda />

            {/* Límites departamentales opcionales */}
            {limitesDepartamentos && (
                <GeoJSON
                    data={limitesDepartamentos}
                    style={(feature) => ({
                        color: feature.properties.departamento === "Cauca" ? "#2ecc71" : "#ffffff",
                        weight: 2,
                        fillOpacity: 0,
                        dashArray: '3',
                    })}
                />
            )}

            {/* Puntos de riesgos */}
            {riesgos.map((r, i) => (
                <Circle
                    key={i}
                    center={[r.lat, r.lng]}
                    radius={10000}
                    pathOptions={{ color: getColor(r.nivel_riesgo) }}
                >
                    <Popup>
                        <strong>{r.municipio}</strong><br />
                        <span style={{ color: getColor(r.nivel_riesgo), fontWeight: 'bold' }}>
                            Riesgo: {r.nivel_riesgo?.toUpperCase()}
                        </span><br />
                        Contexto: {r.contexto}<br />
                        Estructuras: {r.estructuras_zona}<br />
                        Novedades: {r.novedades}
                    </Popup>
                </Circle>
            ))}

            {/* Puntos de eventos */}
            {eventos
                .filter(e => filtroEvento === 'todos' || e.tipo === filtroEvento)
                .map((evento, i) => (
                    <Marker
                        key={`evento-${i}`}
                        position={[evento.lat, evento.lng]}
                        icon={iconoEvento}
                    >
                        <Popup>
                            <strong>{evento.vereda} ({evento.municipio})</strong><br />
                            <em>{evento.fecha}</em><br />
                            {evento.descripcion}
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    )
}

export default MapaRiesgos
