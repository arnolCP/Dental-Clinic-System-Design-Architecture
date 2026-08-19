import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { refreshToken } from "../utils/refreshToken";

export function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access");

            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            const newToken = await refreshToken();

            if (!newToken) {
                localStorage.clear();
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) return <p>Cargando sesión...</p>;

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
