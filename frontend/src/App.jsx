import { Login } from './pages/auth/login';
import { useUser } from "./context/UserContext";
import { Registro } from './pages/auth/Registro';
import LandingPage from './pages/auth/Landing';
import { Home } from './pages/dashboard/Home';
import { Route, Routes } from 'react-router-dom';
import { DashBoardLayout } from './pages/dashboard/DashboardLayout';
import { Citas } from './pages/dashboard/Citas';
import { Pacientes } from './pages/dashboard/Pacientes';
import { Trabajadores } from './pages/dashboard/Trabajadores';
import { ProtectedRoute } from "./componentes/RutaProtegida";
import { HistorialClinico} from './pages/dashboard/HistorialClinico'; 
import { Facturacion} from './pages/dashboard/Facturacion'; 

function App() {
    const { user } = useUser();

    return (
        <Routes>

            {/* RUTAS PUBLICAS */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* RUTAS PROTEGIDAS */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dash" element={<DashBoardLayout />}>
                console.log("USER:", user);
                    {/* Rutas internas del Dashboard */}
                    <Route
                        index
                        element={<Home />}
                    />
                    <Route
                        path="inicio"
                        element={user?.rol === "Recepcionista" ? <Home /> : <Home />}
                    />

                    <Route path="citas" element={<Citas />} />
                    <Route path="pacientes" element={<Pacientes />} />
                    <Route path="trabajadores" element={<Trabajadores />} />
                    <Route path="historiales" element={<HistorialClinico />} />
                    <Route path="facturacion" element={<Facturacion />} />

                </Route>
            </Route>

        </Routes>
    );
}

export default App;
