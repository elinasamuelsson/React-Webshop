import inventoryService from "./inventoryService";

export default class InventoryModule {
	static descriptor = {
		name: "InventoryModule",
		methodsAndInputs: [
			{
				method: "run",
				input: [
					"values - valfri parameter i form av ett objekt som specifierar en forceRefresh av cache:ad datarapport, context - valfri parameter i form av ett objekt utan funktion",
				],
				output: "Returnerar full datarapport som behövs för att populera tabellen på Admin.jsx",
			},
			{
				method: "postMovement",
				input: "formData - tar in formulärdata från formuläret på Admin.jsx",
				output: "",
			},
		],
	};

	inventoryService = new inventoryService();

	async run(values, context) {
		const forceRefresh = values?.forceRefresh ?? false;
		return await this.inventoryService.returnDataReport({forceRefresh});
	}

	async postMovement(formData) {
		return await this.inventoryService.postMovement(formData);
	}
}
