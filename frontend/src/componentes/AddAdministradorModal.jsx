import React, { useState } from "react";
import "../styles/componentes/addOdontologo.css";

export function AddAdministradorModal({ onClose, onSave }) {

    const [formData, setFormData] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        dni: "",
        telefono: "",
        correo: "",
        direccion: "",
        contraseña: "",
        confirmacion: "",
        genero: "",
        fecha_contratacion: "",
        sueldo: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.contraseña !== formData.confirmacion) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const payload = {
            username: formData.dni,
            dni: formData.dni,
            first_name: formData.nombres,
            last_name: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
            telefono: formData.telefono,
            email: formData.correo,
            direccion: formData.direccion,
            password: formData.contraseña,
            genero: formData.genero,
            tipo: "Administrador",
            fecha_contratacion: formData.fecha_contratacion,
            sueldo: formData.sueldo,
        };

        const response = await fetch("http://127.0.0.1:8000/api_1/registro_trabajador/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            onSave();
            onClose();
        } else {
            const error = await response.json();
            alert(JSON.stringify(error));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h3>Agregar Administrador</h3>

                <form onSubmit={handleSubmit} className="modal-formulario">

                    {/* === SECCIÓN 1: DATOS PERSONALES === */}
                    <div className="form-section">
                        <h3>Datos Personales</h3>

                        <div className="section-grid">
                            <input name="nombres" placeholder="Nombres" onChange={handleChange}/>
                            <input name="apellidoPaterno" placeholder="Apellido Paterno" onChange={handleChange}/>
                            <input name="apellidoMaterno" placeholder="Apellido Materno" onChange={handleChange}/>
                            <input name="dni" placeholder="DNI" onChange={handleChange}/>
                            <input name="telefono" placeholder="Teléfono" onChange={handleChange}/>
                            <input name="correo" placeholder="Correo" onChange={handleChange}/>
                            <input name="direccion" placeholder="Dirección" onChange={handleChange}/>
                        </div>
                    </div>

                    {/* === SECCIÓN 2: CREDENCIALES === */}
                    <div className="form-section">
                        <h3>Credenciales de Acceso</h3>

                        <div className="section-grid">
                            <input type="password" name="contraseña" placeholder="Contraseña" onChange={handleChange}/>
                            <input type="password" name="confirmacion" placeholder="Confirmar contraseña" onChange={handleChange}/>
                        </div>
                    </div>

                    {/* === SECCIÓN 3: INFORMACIÓN LABORAL === */}
                    <div className="form-section">
                        <h3>Información Laboral</h3>

                        <div className="section-grid">
                            <input type="date" name="fecha_contratacion" onChange={handleChange}/>
                            <input name="sueldo" placeholder="Sueldo" onChange={handleChange}/>
                        </div>
                    </div>

                    {/* === BOTONES === */}
                    <div className="form-buttons">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
