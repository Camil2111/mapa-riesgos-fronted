import { useEffect } from 'react'
import './App.css'

function Splash({ onFinish }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish()
        }, 2500)

        return () => clearTimeout(timer)
    }, [onFinish])

    return (
        <div className="splash-screen">
            <h1 className="splash-title">🛡️ Sistema de Monitoreo de Riesgos</h1>
        </div>
    )
}

export default Splash

