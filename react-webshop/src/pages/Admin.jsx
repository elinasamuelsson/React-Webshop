import {useState, useEffect} from "react";
import inventoryService from "../modules/Elina/inventoryService";

import "./Admin.css";

function Admin() {
	let [report, setReport] = useState([]);

	useEffect(() => {
		const service = new inventoryService();
		service.returnDataReport().then(setReport);
	}, []);

	function createMovementTableData(item) {
		if (item.movements.length === 0) return "Inga rörelser";

		return (
			<ul>
				{item.movements.map((m) => (
					<li key={m.id}>
						{m.timestamp} | {m.quantity} | {m.type}
					</li>
				))}
			</ul>
		);
	}

	function createWarningTableData(item) {
		const {fastMovementWarning, lowStockWarning} = item.warnings;

		if (!fastMovementWarning && !lowStockWarning) {
			return "Lagerbalans okej";
		}

		return (
			<ul>
				{fastMovementWarning && <li>Ovanligt snabb försäljningshastighet!</li>}
				{lowStockWarning && <li>Lågt lagervärde!</li>}
			</ul>
		);
	}

	return (
		<main>
			<h1>Admin</h1>
			<table className="inventoryTable">
				<thead>
					<tr>
						<td>Vara</td>
						<td>Lagervärde</td>
						<td>Senaste rörelser</td>
						<td>Varningar</td>
					</tr>
				</thead>
				<tbody>
					{report.map((item) => {
						const hasWarning = item.warnings.fastMovementWarning || item.warnings.lowStockWarning;
						return (
							<tr key={item.itemId} className={hasWarning ? "warningRow" : ""}>
								<td>{item.itemId}</td>
								<td>{item.balance}</td>
								<td>{createMovementTableData(item)}</td>
								<td>{createWarningTableData(item)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}

export default Admin;
