import '../../styles/pages/auth/login.css'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";

export function Login() {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("DATA DEL LOGIN:", data);

            if (response.ok) {

                // Guardar tokens
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                // Guardar el tipo devuelto por la API
                localStorage.setItem("tipo", data.tipo);

                // Obtener datos completos del usuario
                const userResponse = await fetch("http://127.0.0.1:8000/api/user/", {
                    headers: {
                        "Authorization": "Bearer " + data.access
                    }
                });

                const userData = await userResponse.json();
                console.log("USER DATA:", userData);

                // Guardar info del usuario en contexto
                const usuarioFinal = {
                    nombre: `${userData.first_name} ${userData.last_name}`,
                    username: userData.username,
                    rol: userData.tipo,
                    email: userData.email,
                    telefono: userData.telefono
                };

                setUser(usuarioFinal);

                // Guardar también en localStorage
                localStorage.setItem("user", JSON.stringify(usuarioFinal));

                navigate("/dash");
                return;
            }

            setError(data.error || "Usuario o contraseña incorrectos");

        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="login-container">
            <div className="login">
                <h2>INICIAR SESIÓN</h2>

                <form className="form-login" onSubmit={handleLogin}>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingrese su nombre de usuario"
                        required
                    />

                    <label htmlFor="password">Contraseña:</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            className="password-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                        </button>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div className="login-ingresar">
                        <button className="btn-primary" type="submit">Ingresar</button>
                    </div>
                </form>

                <div className="login-cuenta">
                    <button onClick={() => window.location.href = "/"}>Volver</button>
                </div>
            </div>
            <div className="login-illustration">
                <img src="/15049407_5532114.svg" alt="illustration" />
            </div>
        </div>
    );
}
