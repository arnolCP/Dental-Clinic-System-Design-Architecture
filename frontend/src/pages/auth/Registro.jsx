import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/pages/auth/registro.css'

export function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    dni: "",
    correo: "",
    contraseña: "",
    confirmacion: "",
    fecha_nacimiento: "",
    genero: "",
  });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMensaje("");
		setError("");

		if (form.contraseña !== form.confirmacion) {
		alert("Las contraseñas no coinciden");
		return;
		}

		try {
			const response = await fetch("http://127.0.0.1:8000/api/registro/", {
				method: "POST",
				headers: {
				"Content-Type": "application/json",
				},
				body: JSON.stringify({
				username: form.dni,
				first_name: form.nombres,
				last_name: `${form.apellidos}`,
				telefono: form.telefono,
				dni: form.dni,
				email: form.correo,
				password: form.contraseña,
				fecha_nacimiento: form.fecha_nacimiento,
				genero: form.genero,
				}),
			});

			if (response.ok) {
				setMensaje("Paciente registrado correctamente");
				setForm({
				nombres: "",
				apellidos: "",
				telefono: "",
				dni: "",
				correo: "",
				contraseña: "",
				confirmacion: "",
				fecha_nacimiento: "",
				genero: "",
				});
			} else {
				const data = await response.json();
				setError(JSON.stringify(data));
			}
		} catch (err) {
			console.error(err);
			setError("Error de conexión con el servidor ❌");
		}
	};

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="registro-container">
		<div className="register-ilustration">
			<img src="/14661061_5495573.svg" alt="ilustracion" />
		</div>
		<div className="registro">
			<h2>REGÍSTRATE</h2>
			<form className="form-registro" onSubmit={handleSubmit}>
			<div className="registro-datos">
				<div className="registro-datos-campo">
				<label>Nombres:</label>
				<input
					name="nombres"
					value={form.nombres}
					onChange={handleChange}
					required
				/>
				</div>
				<div className="registro-datos-campo">
				<label>Apellidos:</label>
				<input
					name="apellidos"
					value={form.apellidos}
					onChange={handleChange}
					required
				/>
				</div>
			</div>

			<div className="registro-datos">
				<div className="registro-datos-campo">
				<label>Teléfono:</label>
				<input
					name="telefono"
					value={form.telefono}
					onChange={handleChange}
				/>
				</div>
				<div className="registro-datos-campo">
				<label>DNI:</label>
				<input
					name="dni"
					value={form.dni}
					onChange={handleChange}
					required
				/>
				</div>
			</div>

			<label>Fecha de nacimiento:</label>
			<input
				name="fecha_nacimiento"
				type="date"
				value={form.fecha_nacimiento}
				onChange={handleChange}
				required
			/>

			<label>Género:</label>
			<select
				name="genero"
				value={form.genero}
				onChange={handleChange}
				required
				className = "select-genero"
			>
				<option value=""></option>
				<option value="M">Masculino</option>
				<option value="F">Femenino</option>
				<option value="O">Otro</option>
			</select>

			<label>Correo electrónico:</label>
			<input
				name="correo"
				type="email"
				value={form.correo}
				onChange={handleChange}
				required
			/>

			<label>Contraseña:</label>
			<div className="registro-password-wrapper">
				<input
				name="contraseña"
				type={showPassword ? "text" : "password"}
				className="registro-password-input"
				value={form.contraseña}
				onChange={handleChange}
				required
				/>
				<button
				type="button"
				className="registro-password-toggle"
				onClick={() => setShowPassword((prev) => !prev)}
				>
				{showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
				</button>
			</div>

			<label>Confirmación de contraseña:</label>
			<input
				name="confirmacion"
				type={showPassword ? "text" : "password"}
				placeholder="Repita su contraseña"
				className="registro-password-input"
				value={form.confirmacion}
				onChange={handleChange}
				required
			/>

			<button type="submit" className="registro-submit">
				Registrarse
			</button>
			</form>

			{mensaje && <p className="mensaje-exito">{mensaje}</p>}
			{error && <p className="mensaje-error">{error}</p>}

			<div className="sesión-container">
			<p>¿Ya tienes una cuenta?</p>
			<Link to="/login" className="sesión-container-button">
				Iniciar Sesión
			</Link>
			</div>
		</div>
		</div>
	);
}