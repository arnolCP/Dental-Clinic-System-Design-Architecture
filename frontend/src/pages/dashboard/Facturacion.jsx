import { useState } from "react";
import { FaPlus, FaSearch, FaFileInvoiceDollar } from "react-icons/fa";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { AddFacturaModal } from "../../componentes/AddFacturaModal";
import "../../styles/pages/dashboard/facturacion.css";

export function Facturacion() {

    const [search, setSearch] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    const [facturas, setFacturas] = useState([
        {
            id: 1,
            numero_factura: "F001-0001",
            paciente_nombre: "Juan Pérez",
            paciente_dni: "77889911",
            fecha_emision: "2025-11-27",
            monto_total: "120.00",
            estado: "PENDIENTE"
        },
        {
            id: 2,
            numero_factura: "F001-0002",
            paciente_nombre: "Ana Torres",
            paciente_dni: "66778899",
            fecha_emision: "2025-11-26",
            monto_total: "200.00",
            estado: "PAGADA"
        }
    ]);

    const facturasFiltradas = facturas.filter(f =>
        !search ||
        f.paciente_dni.includes(search) ||
        f.numero_factura.toLowerCase().includes(search.toLowerCase())
    );

    const agregarFacturaFake = (nueva) => {
        setFacturas(prev => [...prev, nueva]);
    };

    return (
        <div className="facturacion-container">

            {/* HEADER */}
            <div className="facturacion-header">
                <h1><FaFileInvoiceDollar /> Facturación</h1>
                <button
                    className="btn-nueva-factura"
                    onClick={() => setMostrarModal(true)}
                >
                    <FaPlus /> Nueva Factura
                </button>
            </div>

            {/* MODAL */}
            {mostrarModal && (
                <AddFacturaModal
                    cerrar={() => setMostrarModal(false)}
                    agregarFactura={agregarFacturaFake}
                />
            )}

            {/* BUSCADOR */}
            <div className="facturacion-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar por DNI o Nº Factura..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* TABLA */}
            <table className="tabla-facturacion">
                <thead>
                    <tr>
                        <th>N° Factura</th>
                        <th>DNI</th>
                        <th>Paciente</th>
                        <th>Fecha</th>
                        <th>Monto (S/.)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {facturasFiltradas.map(factura => (
                        <tr key={factura.id}>
                            <td>{factura.numero_factura}</td>
                            <td>{factura.paciente_dni}</td>
                            <td>{factura.paciente_nombre}</td>
                            <td>{factura.fecha_emision}</td>
                            <td>S/ {factura.monto_total}</td>
                            <td>
                                <span className={`estado ${factura.estado}`}>
                                    {factura.estado}
                                </span>
                            </td>

                            <td className="facturacion-botones">
                                <button className="btn-ver"><MdVisibility /></button>
                                <button className="btn-edit"><MdEdit /></button>
                                <button className="btn-delete"><MdDelete /></button>
                            </td>
                        </tr>
                    ))}

                    {facturasFiltradas.length === 0 && (
                        <tr>
                            <td colSpan="7" className="sin-datos">
                                No hay facturas registradas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
