import { useState, useEffect } from "react";
import { FaPlus, FaUser, FaSearch } from "react-icons/fa";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { FormPaciente } from "../../componentes/FormPaciente";
import "../../styles/pages/dashboard/pacientes.css";

export function Pacientes() {

    const [search, setSearch] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);
    const [pacientes, setPacientes] = useState([]);

    const token = localStorage.getItem("access");

    const fetchPacientes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/pacientes/", {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await response.json();
            setPacientes(data);
        } catch (error) {
            console.error("Error cargando pacientes:", error);
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    const eliminarPaciente = (id) => {
        setPacientes(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="usuarios-container">

            {/* HEADER */}
            <div className="usuarios-header">
                <h1><FaUser /> Gestión de Pacientes</h1>
                <button 
                    className="btn-nuevo-usuario"
                    onClick={() => setMostrarForm(true)}
                >
                    <FaPlus /> Nuevo Paciente
                </button>
            </div>

            {/* MODAL */}
            {mostrarForm && (
                <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <FormPaciente 
                            cerrar={() => setMostrarForm(false)}
                            agregarPaciente={(nuevo) => setPacientes(prev => [...prev, nuevo])}
                        />
                    </div>
                </div>
            )}

            {/* BUSCADOR */}
            <div className="usuarios-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar por nombre o DNI…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLA */}
            <table className="tabla-usuarios">
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Género</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {pacientes
                        .filter(p => {
                            const texto = `${p.nombres} ${p.apellidos} ${p.dni}`;
                            return texto.toLowerCase().includes(search.toLowerCase());
                        })
                        .map(p => (
                            <tr key={p.id}>
                                <td>{p.nombres} {p.apellidos}</td>
                                <td>{p.dni}</td>
                                <td>{p.telefono || "-"}</td>
                                <td>{p.direccion || "-"}</td>
                                <td>{p.genero || "-"}</td>
                                <td className="btn-changes">
                                    <button className="btn-ver"><MdVisibility /></button>
                                    <button className="btn-edit"><MdEdit /></button>
                                    <button className="btn-delete" onClick={() => eliminarPaciente(p.id)}><MdDelete /></button>
                                </td>
                            </tr>
                        ))}

                    {pacientes.length === 0 && (
                        <tr>
                            <td colSpan="6" className="sin-datos">
                                No hay pacientes registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
