import { Outlet } from "react-router-dom";
import '../../styles/pages/dashboard/dashBoardLayout.css'
import DashBoardNavBar from "../../componentes/DashBoardNavBar";
import { DashBoardHeader } from "../../componentes/DashBoardHeader";

export function DashBoardLayout() {
	return (
		<div className="dashboard-container">
			<DashBoardNavBar />
			<main className="dashboard-content">
				<DashBoardHeader/>
				<div className="page-container">
					<Outlet/>
				</div>
			</main>
		</div>
	);
}