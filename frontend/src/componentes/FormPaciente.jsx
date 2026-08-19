import { useState } from "react";
import '../styles/componentes/formPaciente.css'
export function FormPaciente({ cerrar, agregarPaciente }) {

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        dni: "",
        telefono: "",
        direccion: "",
        fecha_nacimiento: "",
        genero: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/registro/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("access")
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje("✅ Paciente registrado correctamente");
                agregarPaciente(prev => [...prev, data]);
                cerrar();
            } else {
                setError("Error: " + JSON.stringify(data));
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <form className="form-usuario" onSubmit={handleSubmit}>

            <h2>Registrar Paciente</h2>

            <label>Nombres</label>
            <input 
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
            />

            <label>Apellidos</label>
            <input 
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
            />

            <label>DNI</label>
            <input 
                type="text"
                maxLength="8"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
            />

            <label>Teléfono</label>
            <input 
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
            />

            <label>Dirección</label>
            <input 
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
            />

            <label>Fecha de nacimiento</label>
            <input 
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
            />

            <label>Género</label>
            <select 
                name="genero"
                value={formData.genero}
                onChange={handleChange}
            >
                <option value="">Seleccione…</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
            </select>

            {mensaje && <p className="mensaje-success">{mensaje}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            <div className="form-buttons">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={cerrar}>Cancelar</button>
            </div>
        </form>
    );
}
