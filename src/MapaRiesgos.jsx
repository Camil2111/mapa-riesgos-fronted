import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const getColor = (nivel) => {
    const normalizado = nivel?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    switch (normalizado) {
        case 'bajo': return '#27ae60';
        case 'moderado':
        case 'medio': return '#f1c40f';
        case 'critico': return '#e67e22';
        case 'alto': return '#e74c3c';
        default: return '#95a5a6';
    }
};

const iconoEvento = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
});

const Leyenda = () => {
    const map = useMap();
    useEffect(() => {
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            const niveles = ['Bajo', 'Moderado', 'Crítico', 'Alto'];
            const colores = ['#27ae60', '#f1c40f', '#e67e22', '#e74c3c'];
            div.innerHTML += '<h4 style="margin-bottom:5px; color:#29f77a">Nivel de Riesgo</h4>';
            niveles.forEach((nivel, i) => {
                div.innerHTML += `<i style="background:${colores[i]}; width:18px; height:18px; display:inline-block; margin-right:5px;"></i> ${nivel}<br>`;
            });
            div.style.background = '#1c2b2b';
            div.style.padding = '10px';
            div.style.borderRadius = '8px';
            div.style.color = '#e5e5e5';
            div.style.fontSize = '14px';
            return div;
        };
        legend.addTo(map);
    }, [map]);
    return null;
};

export default function MapaRiesgos({ filtroNivel, filtroEvento, municipioFiltro, departamentoFiltro }) {
    const [riesgos, setRiesgos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const mapRef = useRef();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/riesgos-adicionales`)
            .then(res => setRiesgos(res.data))
            .catch(err => console.error('❌ Error cargando riesgos públicos:', err.message));

        axios.get(`${import.meta.env.VITE_API_URL}/api/eventos`)
            .then(res => setEventos(res.data))
            .catch(err => console.error('❌ Error cargando eventos:', err.message));
    }, []);

    const normalizar = (str) =>
        str?.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

    const mapNivel = nivel => {
        const n = normalizar(nivel);
        if (n === 'medio') return 'moderado';
        return n;
    };

    const riesgosFiltrados = useMemo(() => riesgos.filter(r => {
        const nivelMatch = filtroNivel === 'todos' || mapNivel(r.nivel_riesgo) === mapNivel(filtroNivel);
        const depMatch = departamentoFiltro === 'todos' || normalizar(r.departamento) === normalizar(departamentoFiltro);
        const munMatch = municipioFiltro === 'todos' || normalizar(r.municipio) === normalizar(municipioFiltro);
        return nivelMatch && depMatch && munMatch && r.lat && r.lng;
    }), [riesgos, filtroNivel, municipioFiltro, departamentoFiltro]);

    const departamentos = useMemo(() => {
        const mapaNormalizado = new Map();

        riesgos.forEach(r => {
            const raw = r.departamento;
            const key = normalizar(raw);
            if (key && !mapaNormalizado.has(key)) {
                const display = key.charAt(0).toUpperCase() + key.slice(1);
                mapaNormalizado.set(key, display);
            }
        });

        return Array.from(mapaNormalizado.entries()).map(([key, value]) => ({
            key,
            label: value
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [riesgos]);

    useEffect(() => {
        if (mapRef.current && riesgosFiltrados.length === 1) {
            const r = riesgosFiltrados[0];
            mapRef.current.flyTo([r.lat, r.lng], 11);
        }
    }, [riesgosFiltrados]);

    return (
        <MapContainer
            center={[4.6, -74]}
            zoom={6.3}
            style={{ height: '85vh', width: '100%' }}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors, Tiles by HOT"
            />


            <Leyenda />

            {riesgosFiltrados.map((r, i) => {
                const color = getColor(r.nivel_riesgo);
                const isCritico = normalizar(r.nivel_riesgo) === 'critico';
                const icono = L.divIcon({
                    className: isCritico ? 'parpadeo' : '',
                    html: `<div style="
                        background:${color};
                        opacity: 0.85;
                        width: ${isCritico ? 14 : 8}px;
                        height: ${isCritico ? 14 : 8}px;
                        border-radius: 50%;
                        border: 1px solid white;
                        box-shadow: 0 0 3px black;
                      "></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                });

                return (
                    <Marker key={`riesgo-${i}`} position={[r.lat, r.lng]} icon={icono}>
                        <Popup>
                            <strong>{r.municipio}</strong><br />
                            <span style={{ color, fontWeight: 'bold' }}>
                                Riesgo: {r.nivel_riesgo?.toUpperCase()}
                            </span><br />
                            {r.contexto && <>🧠 Contexto: {r.contexto}<br /></>}
                            {r.novedades && <>📌 Novedades: {r.novedades}<br /></>}
                            {r.estructuras_zona && <>🚩 Estructuras: {r.estructuras_zona}</>}
                        </Popup>
                    </Marker>
                );
            })}

            {useMemo(() => eventos
                .filter(e => filtroEvento === 'todos' || e.tipo === filtroEvento)
                .map((evento, i) => (
                    <Marker key={`evento-${i}`} position={[evento.lat, evento.lng]} icon={iconoEvento}>
                        <Popup>
                            <strong>{evento.vereda} ({evento.municipio})</strong><br />
                            <em>{evento.fecha}</em><br />
                            {evento.descripcion}<br />
                            {evento.link && (
                                <a href={evento.link} target="_blank" rel="noopener noreferrer" style={{ color: '#29f77a' }}>
                                    🔗 Ver noticia completa
                                </a>
                            )}
                        </Popup>
                    </Marker>
                )), [eventos, filtroEvento])}
        </MapContainer>
    );
}
