import inventoryService from "../modules/Elina/inventoryService";

function Admin() {
	const service = new inventoryService();
	service.returnDataReport();
	return (
		<div>
			<h1>Admin</h1>
		</div>
	);
}

export default Admin;
