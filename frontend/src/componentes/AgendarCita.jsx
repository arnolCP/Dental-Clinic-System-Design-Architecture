import { useEffect, useState } from "react";
import "../styles/componentes/AgendarCita.css";


function generarHoras(inicio, fin, intervaloMinutos) {
    const horas = [];
    const actual = new Date();
    actual.setHours(inicio, 0, 0, 0);

    const finHora = new Date();
    finHora.setHours(fin, 0, 0, 0);

    while (actual <= finHora) {
        const hh = String(actual.getHours()).padStart(2, "0");
        const mm = String(actual.getMinutes()).padStart(2, "0");
        horas.push(`${hh}:${mm}`);
        actual.setMinutes(actual.getMinutes() + intervaloMinutos);
    }

    return horas;
}

function getDoctores() {
    return fetch("http://127.0.0.1:8000/api_1/odontologos/", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        }
    }).then(res => res.json());
}

function getTratamientos() {
    return fetch("http://127.0.0.1:8000/api_3/tratamientos/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.data)) return data.data;
        return [];
    })
    .catch(err => {
        console.error("Error cargando tratamientos:", err);
        return [];
    });
}

async function buscarPacientePorDNI(dni) {
    const res = await fetch(`http://127.0.0.1:8000/api/pacientes/buscar/${dni}/`, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        }
    });

    return await res.json();
}


export function AgendarCita({ cerrar, agregarCita }) {

    const hoy = new Date().toISOString().split("T")[0];
    const horasDisponibles = generarHoras(9, 17, 60);

    const fechaActual = new Date();
    const [mesActual, setMesActual] = useState(fechaActual.getMonth());
    const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());

    const diasDelMes = new Date(anioActual, mesActual + 1, 0).getDate();

    const nombreMes = new Date(anioActual, mesActual, 1).toLocaleString("es-PE", {
        month: "long"
    });

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const [formCita, setFormCita] = useState({
        dni: "",
        paciente: null,
        doctor: "",
        tratamiento: "",
        fecha: "",
        hora: "",
        motivo: ""
    });

    const [doctores, setDoctores] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);

    useEffect(() => {
        getDoctores().then(data => {
            console.log("ODONTOLOGOS:", data);
            setDoctores(data);
        });

        getTratamientos().then(data => {
            console.log("TRATAMIENTOS:", data);
            setTratamientos(data);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCita(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBuscarPaciente = async () => {
        if (!formCita.dni) {
            alert("Ingrese un DNI");
            return;
        }

        try {
            const data = await buscarPacientePorDNI(formCita.dni);

            if (data?.id) {
                setFormCita(prev => ({
                    ...prev,
                    paciente: data.id
                }));
                alert("✅ Paciente encontrado correctamente");
            } else {
                alert("❌ Paciente no encontrado");
            }

        } catch (error) {
            console.error(error);
            alert("Error buscando paciente");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formCita.paciente) {
            alert("Debe validar paciente");
            return;
        }

        const nuevaCita = {
            paciente: formCita.paciente,
            doctor: formCita.doctor || null,
            tratamiento: formCita.tratamiento || null,
            fecha: formCita.fecha,
            hora: formCita.hora,
            motivo: formCita.motivo,
            estado: "Pendiente"
        };

        console.log("Enviando cita:", nuevaCita);

        try {
            const res = await fetch("http://127.0.0.1:8000/api_2/citas/crear/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access")
                },
                body: JSON.stringify(nuevaCita)
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Error backend:", data);
                alert("Error: " + JSON.stringify(data));
                return;
            }

            agregarCita(prev => [...prev, data]);
            cerrar();
        } catch (error) {
            console.error(error);
            alert("❌ Error al conectar con backend");
        }
    };

    return (
        <div className="agenda-wrapper">

            <div className="agenda-container">

                {/* ===== CALENDARIO ===== */}
                <div className="calendar-box">
                    <h2>Agenda</h2>

                    <div className="month-year-selector">
                        <button onClick={() => setMesActual(mesActual === 0 ? 11 : mesActual - 1)}>‹</button>
                        <span>{nombreMes} {anioActual}</span>
                        <button onClick={() => setMesActual(mesActual === 11 ? 0 : mesActual + 1)}>›</button>
                    </div>

                    <div className="week-row">
                        {diasSemana.map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="days-grid">
                        {Array.from({ length: diasDelMes }, (_, i) => i + 1).map(day => {
                            const fechaDelDia = new Date(anioActual, mesActual, day);
                            const esPasado = fechaDelDia < new Date(hoy);

                            return (
                                <div
                                    key={day}
                                    className={`day 
                                        ${formCita.fecha.endsWith(String(day).padStart(2, "0")) ? "selected" : ""}
                                        ${esPasado ? "disabled" : ""}`}
                                    onClick={() => {
                                        if (!esPasado) {
                                            setFormCita(prev => ({
                                                ...prev,
                                                fecha: `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                                            }));
                                        }
                                    }}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== FORMULARIO ===== */}
                <div className="form-section">

                    <input
                        type="text"
                        placeholder="DNI del paciente"
                        name="dni"
                        value={formCita.dni}
                        onChange={handleChange}
                    />

                    <button onClick={handleBuscarPaciente}>Buscar Paciente</button>

                    {formCita.paciente && <p className="paciente-ok">Paciente validado ✅</p>}

                    <input
                        type="text"
                        name="motivo"
                        placeholder="Motivo de consulta"
                        value={formCita.motivo}
                        onChange={handleChange}
                    />

                    <select name="doctor" value={formCita.doctor} onChange={handleChange}>
                        <option value="">Seleccione doctor</option>
                        {doctores.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.trabajador?.usuario?.first_name} {d.trabajador?.usuario?.last_name}
                            </option>
                        ))}
                    </select>

                    <select name="tratamiento" value={formCita.tratamiento} onChange={handleChange}>
                        <option value="">Seleccione tratamiento</option>
                        {tratamientos.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.tipo} - S/ {t.precio}
                            </option>
                        ))}
                    </select>


                    <select name="hora" value={formCita.hora} onChange={handleChange}>
                        <option value="">Seleccione hora</option>
                        {horasDisponibles.map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>

                    <div className="buttons-row">
                        <button onClick={handleSubmit} className="btn-guardar">Guardar</button>
                        <button onClick={cerrar} className="btn-cerrar">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
