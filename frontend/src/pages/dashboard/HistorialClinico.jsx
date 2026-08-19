import { useState, useEffect } from "react";
import { FaFileMedical, FaSearch, FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import "../../styles/pages/dashboard/historial.css";

export function HistorialClinico() {

    const [search, setSearch] = useState("");
    const [historiales, setHistoriales] = useState([]);

    const [doctorFiltro, setDoctorFiltro] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    useEffect(() => {
        const dataFake = [
            {
                id: 1,
                dni: "60000000",
                paciente: "Moisés Renzo Olivas",
                doctor: "Dr. Carlos Ramírez",
                fecha: "2025-11-27",
                diagnostico: "Caries profunda",
                tratamiento: "Endodoncia"
            },
            {
                id: 2,
                dni: "77777777",
                paciente: "Juan Pérez",
                doctor: "Dra. Laura Torres",
                fecha: "2025-11-25",
                diagnostico: "Gingivitis",
                tratamiento: "Limpieza dental"
            }
        ];

        setHistoriales(dataFake);
    }, []);

    const doctoresUnicos = [...new Set(historiales.map(h => h.doctor))];

    const historialesFiltrados = historiales
        .filter(h =>
            !search || h.dni.includes(search)
        )
        .filter(h =>
            !doctorFiltro || h.doctor === doctorFiltro
        )
        .filter(h =>
            !fechaFiltro || h.fecha === fechaFiltro
        );

    return (
        <div className="historial-container">

            {/* HEADER */}
            <div className="historial-header">
                <h1><FaFileMedical /> Historial Clínico</h1>

                <button className="btn-nuevo-historial">
                    <FaPlus /> Nuevo Historial
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="historial-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar por DNI..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* FILTROS */}
            <div className="historial-filtros">

                {/* Filtro doctor */}
                <select value={doctorFiltro} onChange={e => setDoctorFiltro(e.target.value)}>
                    <option value="">Todos los doctores</option>
                    {doctoresUnicos.map((doc, i) => (
                        <option key={i} value={doc}>
                            {doc}
                        </option>
                    ))}
                </select>

                {/* Filtro fecha */}
                <input
                    type="date"
                    value={fechaFiltro}
                    onChange={e => setFechaFiltro(e.target.value)}
                />
            </div>

            {/* TABLA */}
            <table className="tabla-historial">
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Paciente</th>
                        <th>Doctor</th>
                        <th>Fecha</th>
                        <th>Diagnóstico</th>
                        <th>Tratamiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {historialesFiltrados.map(h => (
                        <tr key={h.id}>
                            <td>{h.dni}</td>
                            <td>{h.paciente}</td>
                            <td>{h.doctor}</td>
                            <td>{h.fecha}</td>
                            <td>{h.diagnostico}</td>
                            <td>{h.tratamiento}</td>
                            <td className="historial-botones">
                                <button className="btn-ver">
                                    <MdVisibility />
                                </button>
                                <button className="btn-edit">
                                    <MdEdit />
                                </button>
                                <button className="btn-delete">
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {historialesFiltrados.length === 0 && (
                        <tr>
                            <td colSpan="7" className="sin-datos">
                                No hay historiales con esos filtros
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
