import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const getColor = (nivel) => {
    switch (nivel?.toLowerCase()) {
        case 'bajo': return '#27ae60'
        case 'moderado':
        case 'medio': return '#f1c40f'
        case 'critico': return '#e67e22'
        case 'alto': return '#e74c3c'
        default: return '#95a5a6'
    }
}

const iconoEvento = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
})

const Leyenda = () => {
    const map = useMap()
    useEffect(() => {
        const legend = L.control({ position: 'bottomright' })
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend')
            const niveles = ['Bajo', 'Moderado', 'Crítico', 'Alto']
            const colores = ['#27ae60', '#f1c40f', '#e67e22', '#e74c3c']
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

export default function MapaRiesgos({ filtroEvento, municipioFiltro, departamentoFiltro }) {
    const [riesgos, setRiesgos] = useState([])
    const [eventos, setEventos] = useState([])
    const mapRef = useRef()

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        axios.get(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log('✅ Datos cargados:', res.data)
                setRiesgos(res.data)
            })
            .catch(err => console.error('❌ Error cargando riesgos:', err))
    }, [])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/eventos`)
            .then(res => setEventos(res.data))
            .catch(err => console.error('❌ Error al cargar eventos:', err))
    }, [])

    useEffect(() => {
        if (mapRef.current && riesgos.length === 1) {
            const r = riesgos[0]
            mapRef.current.flyTo([r.lat, r.lng], 11)
        }
    }, [riesgos])

    const filtrar = (r) => {
        const depMatch = departamentoFiltro === 'todos' || r.departamento?.toLowerCase() === departamentoFiltro.toLowerCase()
        const munMatch = municipioFiltro === 'todos' || r.municipio?.toLowerCase() === municipioFiltro.toLowerCase()
        return depMatch && munMatch && r.lat && r.lng
    }

    const riesgosFiltrados = riesgos.filter(filtrar)

    return (
        <MapContainer
            center={[3.5, -75.7]}
            zoom={6.5}
            style={{ height: '700px', width: '100%' }}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors, Tiles by HOT"
            />

            <Leyenda />

            {riesgosFiltrados.map((r, i) => {
                const color = getColor(r.nivel_riesgo)
                const icono = L.divIcon({
                    className: '',
                    html: `<div style="
              background:${color};
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 2px black;
            "></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                })

                return (
                    <Marker key={`riesgo-${i}`} position={[r.lat, r.lng]} icon={icono}>
                        <Popup>
                            <strong>{r.municipio}</strong><br />
                            <span style={{ color: color, fontWeight: 'bold' }}>
                                Riesgo: {r.nivel_riesgo?.toUpperCase()}
                            </span><br />
                            {r.contexto && <>🧠 Contexto: {r.contexto}<br /></>}
                            {r.novedades && <>📌 Novedades: {r.novedades}<br /></>}
                            {r.estructuras_zona && <>🚩 Estructuras: {r.estructuras_zona}</>}
                        </Popup>
                    </Marker>
                )
            })}

            {eventos
                .filter(e => filtroEvento === 'todos' || e.tipo === filtroEvento)
                .map((evento, i) => (
                    <Marker key={`evento-${i}`} position={[evento.lat, evento.lng]} icon={iconoEvento}>
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