import { useEffect } from 'react'

const Splash = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish()
        }, 3000) // dura 3 segundos

        return () => clearTimeout(timer)
    }, [onFinish])

    return (
        <div style={{
            height: '100vh',
            backgroundColor: '#0f1a1a',
            color: '#29f77a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Courier New, monospace',
            fontSize: '1.5rem'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <span>▌ Cargando entorno ...</span>
            </div>
            <div className="terminal-loader"></div>
        </div>
    )
}

export default Splash
