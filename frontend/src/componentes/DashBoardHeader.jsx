import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import '../styles/componentes/dashBoardHeader.css'
import { useUser } from "../context/UserContext";

export function DashBoardHeader(){

    const { user } = useUser();
    console.log("VALUE DE user EN HEADER:", user);


    return(
        <header className="dashboard-header">
            <div className="user-info">
                <FaUserCircle className="user-icon"/>
                <div>
                    <span className="user-name">
                        {user ? user.nombre : "Cargando..."}
                    </span>
                    <span className="user-role">
                        {user ? user.rol : ""}
                    </span>
                </div>
            </div>

            <button 
                className="logout-btn"
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
            >
                <MdLogout/>
            </button>
        </header>
    );
}

