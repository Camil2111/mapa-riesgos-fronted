// src/pages/EditRiesgos.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditRiesgos() {
    const [riesgos, setRiesgos] = useState([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setRiesgos(res.data))
            .catch(err => {
                console.error('❌ Error al cargar los datos:', err);
                setError('No se pudieron cargar los datos.');
            });
    }, []);

    const actualizarNivel = (index, nuevoNivel) => {
        const actualizados = [...riesgos];
        actualizados[index].nivel_riesgo = nuevoNivel;
        setRiesgos(actualizados);
    };

    const guardarCambios = () => {
        setMensaje('');
        setError('');

        axios.post(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, riesgos, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => setMensaje('✅ Cambios guardados correctamente.'))
            .catch(err => {
                console.error('❌ Error al guardar:', err);
                setError('No se pudieron guardar los cambios.');
            });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                if (!Array.isArray(jsonData)) throw new Error('El archivo no contiene un array válido');

                axios.post(`${import.meta.env.VITE_API_URL}/api/datos-riesgos`, jsonData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(() => {
                        setRiesgos(jsonData);
                        setMensaje('✅ Archivo cargado y datos reemplazados con éxito.');
                    })
                    .catch(err => {
                        console.error('❌ Error al subir el archivo:', err);
                        setError('No se pudo subir el archivo.');
                    });
            } catch (err) {
                console.error('❌ JSON inválido:', err);
                setError('El archivo no contiene un JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Editor de datos_riesgos.json</h2>
            <p>Aquí podrás ver, editar y guardar los niveles de riesgo, o cargar un archivo completo.</p>

            <input type="file" accept=".json" onChange={handleFileUpload} style={{ marginBottom: '15px' }} />

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {riesgos.length > 0 ? (
                <>
                    <table border="1" cellPadding="8" style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Departamento</th>
                                <th>Municipio</th>
                                <th>Nivel de Riesgo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riesgos.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.departamento}</td>
                                    <td>{r.municipio}</td>
                                    <td>
                                        <select value={r.nivel_riesgo} onChange={(e) => actualizarNivel(i, e.target.value)}>
                                            <option value="bajo">Bajo</option>
                                            <option value="moderado">Moderado</option>
                                            <option value="alto">Alto</option>
                                            <option value="critico">Crítico</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={guardarCambios}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#29f77a',
                            color: '#0f1a1a',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold'
                        }}
                    >
                        Guardar cambios
                    </button>
                </>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}
