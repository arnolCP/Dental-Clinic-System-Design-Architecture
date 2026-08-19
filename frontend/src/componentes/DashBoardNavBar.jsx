import '../styles/componentes/DashBoardNavBar.css'
import { Link } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { IoIosDocument } from "react-icons/io";
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

export default function DashBoardNavBar() {

	const { user } = useUser();
	useEffect(() => { console.log('user rol ->', user?.rol); }, [user]);
	if (!user) return null;

	const menuItems = [
		{ name: "Inicio", icon: <FaHome className="icon" />, path: "inicio", roles: ["Administrador","Odontologo"] },
		{ name: "Citas", icon: <MdOutlineDateRange className="icon" />, path: "citas", roles: ["Recepcionista", "Administrador"] },
		{ name: "Pacientes", icon: <FaUser className="icon" />, path: "pacientes", roles: ["Recepcionista", "Administrador"] },
		{ name: "Trabajadores", icon: <FaUserDoctor className="icon" />, path: "trabajadores", roles: ["Administrador"] },
		{ name: "Historiales", icon: <IoIosDocument className="icon" />, path: "historiales", roles: ["Administrador", "Odontologo", "Recepcionista"] },
		{ name: "Facturación", icon: <IoIosDocument className="icon" />, path: "facturacion", roles: ["Administrador", "Recepcionista"] }
  	];

	return (
    <nav className="nav-dash">
		<h4>MENU</h4>
		<ul>
			{menuItems
			.filter(item => item.roles
				.map(r => r.toLowerCase())
				.includes(user.rol.toLowerCase())
			)
			.map(item => (
				<li key={item.path}>
					<Link to={item.path}>
						{item.icon}
						<span>{item.name}</span>
					</Link>
				</li>
			))}
		</ul>
    </nav>
  );
}

