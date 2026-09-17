import {useState, useEffect, useContext} from "react";
import {ToastContext} from "../context/ToastContext";
import moduleMaker from "../modules/moduleMaker";
import Form from "../components/Form";

import "./Admin.css";

function Admin() {
	let [report, setReport] = useState([]);
	let [formKey, setFormKey] = useState(0);

	const {dispatch} = useContext(ToastContext);

	useEffect(() => {
		moduleMaker.InventoryModule.run().then(setReport);
	}, []);

	function createMovementTableData(item) {
		if (item.movements.length === 0) return "";

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
			return "";
		}

		return (
			<ul>
				{fastMovementWarning && <li>Ovanligt snabb försäljningshastighet!</li>}
				{lowStockWarning && <li>Lågt lagervärde!</li>}
			</ul>
		);
	}

	const formDescriptor = {
		stockItemId: {
			label: "Artikelnummer",
			type: "text",
			initialValue: "",
			required: true,
		},
		type: {
			label: "Händelsetyp",
			type: "text",
			initialValue: "",
			required: true,
		},
		quantity: {
			label: "Kvantitet",
			type: "text",
			initialValue: "",
			required: true,
		},
	};

	async function handleMovementSubmit(formData) {
		try {
			const {response, result} = await moduleMaker.InventoryModule.postMovement(formData);

			if (response && response.ok) {
				dispatch({type: "SHOW", payload: "Movement has been posted."});
				setFormKey((prev) => prev + 1);
				moduleMaker.InventoryModule.run().then(setReport);
			}
		} catch (e) {
			dispatch({type: "SHOW", payload: e.message});
		}
	}

	return (
		<main>
			<h1>Admin</h1>
			<table className="inventoryTable">
				<thead>
					<tr>
						<td>Artikelnummer | Varunamn</td>
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
								<td>
									{item.itemId} | {item.itemName}
								</td>
								<td>{item.balance}</td>
								<td>{createMovementTableData(item)}</td>
								<td>{createWarningTableData(item)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Form key={formKey} descriptor={formDescriptor} onSubmit={handleMovementSubmit} />
		</main>
	);
}

export default Admin;
