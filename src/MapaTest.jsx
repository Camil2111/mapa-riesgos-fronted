import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapaTest = () => {
    const punto = {
        municipio: "POPAYAN",
        nivel_riesgo: "alto",
        contexto: "Presencia de actores armados",
        estructuras_zona: "ELN, disidencias",
        novedades: "Enfrentamiento reciente",
        lat: 2.456,
        lng: -76.603
    }

    const getColor = (nivel) => {
        switch (nivel.toLowerCase()) {
            case 'alto': return '#e74c3c'
            case 'medio': return '#f39c12'
            case 'bajo': return '#27ae60'
            default: return '#95a5a6'
        }
    }

    return (
        <MapContainer center={[2.45, -76.6]} zoom={10} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Circle
                center={[punto.lat, punto.lng]}
                radius={15000}
                pathOptions={{ color: getColor(punto.nivel_riesgo) }}
                eventHandlers={{
                    click: (e) => e.target.openPopup()
                }}
            >
                <Popup>
                    <div style={{ minWidth: '200px' }}>
                        <strong>{punto.municipio}</strong><br />
                        <span style={{ color: getColor(punto.nivel_riesgo), fontWeight: 'bold' }}>
                            Riesgo: {punto.nivel_riesgo.toUpperCase()}
                        </span><br />
                        Contexto: {punto.contexto}<br />
                        Estructuras: {punto.estructuras_zona}<br />
                        Novedades: {punto.novedades}
                    </div>
                </Popup>
            </Circle>
        </MapContainer>
    )
}

export default MapaTest
