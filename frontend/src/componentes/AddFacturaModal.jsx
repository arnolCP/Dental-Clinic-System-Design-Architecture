import { useState } from "react";
import "../styles/componentes/AgendarCita.css";

export function AddFacturaModal({ cerrar, agregarFactura }) {

    const [formFactura, setFormFactura] = useState({
        numero_factura: "",
        paciente_nombre: "",
        paciente_dni: "",
        fecha_emision: "",
        monto_total: "",
        estado: "PENDIENTE"
    });

    const handleChange = (e) => {
        setFormFactura({
            ...formFactura,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevaFactura = {
            ...formFactura,
            id: Date.now() // fake id
        };

        agregarFactura(nuevaFactura);
        cerrar();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2>Nueva Factura</h2>

                <form onSubmit={handleSubmit} className="modal-formulario">

                    <input name="numero_factura" placeholder="N° Factura" onChange={handleChange} />
                    <input name="paciente_nombre" placeholder="Nombre del paciente" onChange={handleChange} />
                    <input name="paciente_dni" placeholder="DNI del paciente" onChange={handleChange} />
                    <input type="date" name="fecha_emision" onChange={handleChange} />
                    <input type="number" name="monto_total" placeholder="Monto total" onChange={handleChange} />

                    <select name="estado" onChange={handleChange}>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="PAGADA">Pagada</option>
                        <option value="ANULADA">Anulada</option>
                    </select>

                    <div className="buttons-row">
                        <button type="submit" className="btn-guardar">Guardar</button>
                        <button type="button" className="btn-cerrar" onClick={cerrar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
