import "../../styles/pages/dashboard/home.css";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosDocument } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function getCitas() {
    return fetch("http://127.0.0.1:8000/api_2/citas/", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        }
    }).then(res => res.json());
}

export function Home() {

    const [stats, setStats] = useState([
        { label: "Pacientes registrados", value: 0 },
        { label: "Citas hoy", value: 0 },
        { label: "Odontólogos activos", value: 0 },
        { label: "Historiales clínicos", value: 0 },
    ]);

    useEffect(() => {
        console.log("Llamando a /api/stats/ ...");

        fetch("http://127.0.0.1:8000/api/stats/", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access")
            }
        })
        .then(res => {
            console.log("Status de stats:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("Stats response:", data);

            setStats([
                { label: "Pacientes registrados", value: data.pacientes ?? 0 },
                { label: "Citas hoy", value: data.citas_hoy ?? 0 },
                { label: "Odontólogos activos", value: data.odontologos ?? 0 },
                { label: "Historiales clínicos", value: data.historiales ?? 0 },
            ]);
        })
        .catch(err => console.error("Error en estadísticas:", err));
    }, []);
    
    
    const [citasProximas, setCitasProximas] = useState([]);

    useEffect(() => {
        getCitas()
            .then(data => {
                console.log("CITAS HOME:", data);
                setCitasProximas(data);
            })
            .catch(err => console.error("Error cargando citas:", err));
    }, []);

    const hoy = new Date().toLocaleDateString("sv-SE");

    const citasHoy = citasProximas.filter(cita => {
        console.log("HOY:", hoy);
        console.log("FECHA CITA:", cita.fecha);

        return cita.fecha === hoy;
    });

    



    return (
        <div className="home-container">
            <h1 className="home-title">Panel General</h1>
            <p className="home-subtitle">Resumen de actividad del sistema</p>

            <section className="stats-grid">
                {stats.length === 0 ? (
                    <p className="stats-loading">Cargando estadísticas...</p>
                ) : (
                    stats.map((s, i) => (
                        <div className="stat-card" key={i}>
                            <h2>{s.value}</h2>
                            <span>{s.label}</span>
                        </div>
                    ))
                )}
            </section>


            <h2 className="section-title">Módulos principales</h2>

            <section className="modules-grid">
                <div className="module-card">
                    <Link to="/dash/pacientes">
                        <FaUser/> Pacientes
                    </Link>
                </div>
                <div className="module-card">
                    <Link to="/dash/trabajadores">
                        <FaUserDoctor/> Trabajadores
                    </Link>
                </div>
                <div className="module-card">
                    <Link to="/dash/citas">
                        <MdOutlineDateRange/> Citas
                    </Link>
                </div>
                <div className="module-card">
                    <Link to="/historial">
                        <IoIosDocument/> Historial clínico
                    </Link>
                </div>
            </section>

            <h2 className="section-title">Próximas citas</h2>
            <table className="citas-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Doctor</th>
                    </tr>
                </thead>
                <tbody>
                    {citasHoy.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                                No hay citas para hoy
                            </td>
                        </tr>
                    ) : (
                        citasHoy.map((c, i) => (
                            <tr key={i}>
                                <td>{c.hora}</td>
                                <td>{c.paciente_nombre}</td>
                                <td>{c.doctor_nombre || "No asignado"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>

            </table>
        </div>
    );
}