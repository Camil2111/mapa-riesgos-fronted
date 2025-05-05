// src/router.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditRiesgos from './pages/EditRiesgos';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/editar-riesgos" element={<ProtectedRoute><EditRiesgos /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
