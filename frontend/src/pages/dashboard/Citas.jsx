import { useState, useEffect } from "react";
import { FaPlus, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { MdEdit, MdDelete, MdVisibility} from "react-icons/md";
import { AgendarCita } from "../../componentes/AgendarCita";
import '../../styles/pages/dashboard/citas.css';

export function Citas() {

    const [search, setSearch] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);
    const [citas, setCitas] = useState([]);

    const [doctorFiltro, setDoctorFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    function getCitas() {
        return fetch("http://127.0.0.1:8000/api_2/citas/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }).then(res => res.json());
    }

    useEffect(() => {
        const cargarCitas = async () => {
            try {
                const data = await getCitas();
                console.log("CITAS DESDE BACKEND:", data);
                setCitas(data);
            } catch (error) {
                console.error("Error cargando citas:", error);
            }
        };

        cargarCitas();
    }, []);

    const eliminarCita = (id) => {
        setCitas(prev => prev.filter(c => c.id !== id));
    };

    const citasFiltradas = citas
        .filter(c =>
            !search ||
            c.dni?.toString().includes(search)
        )
        .filter(c =>
            !doctorFiltro ||
            c.doctor_nombre === doctorFiltro
        )
        .filter(c =>
            !estadoFiltro ||
            c.estado === estadoFiltro
        )
        .filter(c =>
            !fechaFiltro ||
            c.fecha === fechaFiltro
        );

    const doctoresUnicos = [...new Set(citas.map(c => c.doctor_nombre).filter(Boolean))];

    return (
        <div className="citas-container">

            {/* HEADER */}
            <div className="citas-header">
                <h1><FaCalendarAlt /> Gestión de Citas</h1>
                <button className="btn-nueva-cita" onClick={() => setMostrarForm(true)}>
                    <FaPlus /> Nueva Cita
                </button>
            </div>

            {/* MODAL */}
            {mostrarForm && (
                <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <AgendarCita cerrar={() => setMostrarForm(false)} agregarCita={setCitas} />
                    </div>
                </div>
            )}

            {/* BUSCADOR */}
            <div className="citas-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar por DNI…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* FILTROS */}
            <div className="citas-filtros">

                {/* Doctor */}
                <select value={doctorFiltro} onChange={e => setDoctorFiltro(e.target.value)}>
                    <option value="">Todos los doctores</option>
                    {doctoresUnicos.map(doc => (
                        <option key={doc} value={doc}>{doc}</option>
                    ))}
                </select>

                {/* Estado */}
                <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Atendida">Atendida</option>
                    <option value="Cancelada">Cancelada</option>
                </select>

                {/* Fecha */}
                <input
                    type="date"
                    value={fechaFiltro}
                    onChange={e => setFechaFiltro(e.target.value)}
                />

            </div>

            {/* TABLA */}
            <table className="tabla-citas">
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Paciente</th>
                        <th>Doctor</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {citasFiltradas.map(cita => (
                        <tr key={cita.id}>
                            <td>{cita.dni}</td>
                            <td>{cita.paciente_nombre}</td>
                            <td>{cita.doctor_nombre || "Sin doctor"}</td>
                            <td>{cita.fecha}</td>
                            <td>{cita.hora}</td>
                            <td>
                                <span className={`estado ${cita.estado}`}>
                                    {cita.estado}
                                </span>
                            </td>
                            <td className="btn-changes">
                                <button className="btn-view">
                                    <MdVisibility />
                                </button>
                                <button className="btn-edit">
                                    <MdEdit />
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => eliminarCita(cita.id)}
                                >
                                    <MdDelete />
                                </button>
                            </td>

                        </tr>
                    ))}

                    {citasFiltradas.length === 0 && (
                        <tr>
                            <td colSpan="7" className="sin-datos">
                                No hay citas con esos filtros
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
