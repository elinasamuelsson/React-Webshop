import inventoryService from "./inventoryService";

export default class InventoryModule {
	static descriptor = {
		name: "InventoryModule",
		methodsAndInputs: [
			{
				method: "run",
				input: [""],
				output: "Returnerar full datarapport som behövs för att populera tabellen på Admin.jsx",
			},
			{
				method: "postMovement",
				input: "formData - tar in formulärdata från formuläret på Admin.jsx",
				output: "",
			},
		],
	};

	#inventoryService = new inventoryService();

	async run() {
		return await this.#inventoryService.returnDataReport();
	}

	async postMovement(formData) {
		return await this.#inventoryService.postMovement(formData);
	}
}
