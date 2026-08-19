import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch} from 'react-icons/fa';
import { MdEdit, MdDelete, MdVisibility} from "react-icons/md";
import { FaUserDoctor, FaUserTie, FaUserShield } from "react-icons/fa6";
import { AddOdontologoModal } from '../../componentes/AddOdontologoModal';
import { AddRecepcionistaModal } from '../../componentes/AddRecepcionistaModal';
import { AddAdministradorModal } from '../../componentes/AddAdministradorModal';
import '../../styles/pages/dashboard/trabajadores.css';

export function Trabajadores() {

    const [activeTab, setActiveTab] = useState("odontologos");
    const [search, setSearch] = useState("");

    const [odontologos, setOdontologos] = useState([]);
    const [recepcionistas, setRecepcionistas] = useState([]);
    const [administradores, setAdministradores] = useState([]);

    const [modalOdoOpen, setModalOdoOpen] = useState(false);
    const [modalRecOpen, setModalRecOpen] = useState(false);
    const [modalAdminOpen, setModalAdminOpen] = useState(false);

    const [editOdoData, setEditOdoData] = useState(null);
    const [editRecData, setEditRecData] = useState(null);
    const [editAdminData, setEditAdminData] = useState(null);


    const API = "http://127.0.0.1:8000/api_1/trabajadores/";

    const fetchTrabajadores = async () => {
        const response = await fetch(API, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access")
            }
        });

        const data = await response.json();

        console.log("RESPUESTA:", data);

        if (!Array.isArray(data)) {
            console.error("El backend no devolvió una lista");
            return;
        }

        setOdontologos(data.filter(t => t.tipo === "Odontologo"));
        setRecepcionistas(data.filter(t => t.tipo === "Recepcionista"));
        setAdministradores(data.filter(t => t.tipo === "Administrador"));
    };



    useEffect(() => {
        fetchTrabajadores();
    }, []);

    const handleSaveOdontologo = async () => {
        await fetchTrabajadores();
        setModalOdoOpen(false);
        setEditOdoData(null);
    };

    const handleSaveRecepcionista = async () => {
        await fetchTrabajadores();
        setModalRecOpen(false);
        setEditRecData(null);
    };

    const handleSaveAdmin = async () => {
        await fetchTrabajadores();
        setModalAdminOpen(false);
        setEditAdminData(null);
    };

    const filtrarLista = (lista) => {
        return lista.filter(t => {
            const texto = `${t.first_name} ${t.last_name} ${t.dni}`.toLowerCase();
            return texto.includes(search.toLowerCase());
        });
    };


    const renderTabla = (lista, tipo) => (
        
        <table className="tabla-principal">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Email</th>

                    {tipo === "Odontologo" && <th>Especialidad</th>}
                    {tipo === "Recepcionista" && <th>Área</th>}
                    {tipo === "Administrador" && <th>Cargo</th>}
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {filtrarLista(lista).map((t, i) => (
                    <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td>{t.first_name} {t.last_name}</td>
                        <td>{t.dni}</td>
                        <td>{t.email}</td>

                        {tipo === "Odontologo" && (
                            <td>{t.especialidad || "Sin especialidad"}</td>
                        )}

                        {tipo === "Recepcionista" && (
                            <td>{t.area_asignada || "-"}</td>
                        )}

                        {tipo === "Administrador" && (
                            <td>Administrador</td>
                        )}

                        <td className="btn-changes">
                            <button className="btn-view">
                                <MdVisibility />
                            </button>
                            <button className="btn-edit">
                                <MdEdit />
                            </button>
                            <button
                                className="btn-delete"
                            >
                                <MdDelete />
                            </button>
                        </td>
                    </tr>
                ))}

                {lista.length === 0 && (
                    <tr>
                        <td colSpan="5" className="sin-datos">
                            No hay registros
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

    );
    
    return (
        <div className="pagina-contenedor">

            {/* ===== PESTAÑAS ===== */}
            <div className="tabs-container">
                <button className={activeTab === "odontologos" ? "tab active" : "tab"} onClick={() => setActiveTab("odontologos")}>
                    <FaUserDoctor /> Odontólogos
                </button>

                <button className={activeTab === "recepcionistas" ? "tab active" : "tab"} onClick={() => setActiveTab("recepcionistas")}>
                    <FaUserTie /> Recepcionistas
                </button>

                <button className={activeTab === "administradores" ? "tab active" : "tab"} onClick={() => setActiveTab("administradores")}>
                    <FaUserShield /> Administradores
                </button>
            </div>

            {/* ==== ODONTÓLOGOS ==== */}
            {activeTab === "odontologos" && (
                <>
                    <div className="pagina-header">
                        <h1>Odontologos</h1>
                        <button className="boton-primario" onClick={() => setModalOdoOpen(true)}>
                            <FaPlus /> Agregar
                        </button>
                    </div>
                    <div className="usuarios-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o DNI…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {renderTabla(odontologos, "Odontologo")}
                </>
            )}

            {/* ==== RECEPCIONISTAS ==== */}
            {activeTab === "recepcionistas" && (
                <>
                    <div className="pagina-header">
                        <h1>Recepcionistas</h1>
                        <button className="boton-primario" onClick={() => setModalRecOpen(true)}>
                            <FaPlus /> Agregar
                        </button>
                    </div>
                    
                    <div className="usuarios-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o DNI…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {renderTabla(recepcionistas, "Recepcionista")}
                </>
            )}

            {/* ==== ADMINISTRADORES ==== */}
            {activeTab === "administradores" && (
                <>
                    <div className="pagina-header">
                        <h1>Administradores</h1>
                        <button className="boton-primario" onClick={() => setModalAdminOpen(true)}>
                            <FaPlus /> Agregar
                        </button>
                    </div>
                    <div className="usuarios-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o DNI…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {renderTabla(administradores, "Administrador")}
                </>
            )}

            {/* ==== MODALES ==== */}
                        {/* ==== MODAL ODONTÓLOGO ==== */}
            {modalOdoOpen && (
                <div className="modal-overlay-simple" onClick={() => setModalOdoOpen(false)}>
                    <div className="modal-content-simple" onClick={e => e.stopPropagation()}>
                        <AddOdontologoModal 
                            onClose={() => setModalOdoOpen(false)}
                            editData={editOdoData}
                            onSave={handleSaveOdontologo}
                        />
                    </div>
                </div>
            )}

            {/* ==== MODAL RECEPCIONISTA ==== */}
            {modalRecOpen && (
                <div className="modal-overlay-simple" onClick={() => setModalRecOpen(false)}>
                    <div className="modal-content-simple" onClick={e => e.stopPropagation()}>
                        <AddRecepcionistaModal
                            onClose={() => setModalRecOpen(false)}
                            editData={editRecData}
                            onSave={handleSaveRecepcionista}
                        />
                    </div>
                </div>
            )}

            {/* ==== MODAL ADMINISTRADOR ==== */}
            {modalAdminOpen && (
                <div className="modal-overlay-simple" onClick={() => setModalAdminOpen(false)}>
                    <div className="modal-content-simple" onClick={e => e.stopPropagation()}>
                        <AddAdministradorModal
                            onClose={() => setModalAdminOpen(false)}
                            editData={editAdminData}
                            onSave={handleSaveAdmin}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
