import stockItem from "./stockItem.js";
import stockMovement from "./stockMovement.js";

export default class inventoryApi {
	/* asynkron hjälpmetod som hämtar lagervaror från databasen och mappar dem till stockItem-objektet innan listan returneras */
	async fetchStockItems() {
		const response = await fetch("api/inventory/stockItems");

		if (!response.ok) {
			throw new Error("stockItems fetch failed");
		}

		const items = await response.json();
		return items.map((i) => new stockItem(i.id, i.reorderPoint));
	}

	/* asnkron hjälpmetod som hämtar lagerrörelser från databasen och mappar dem till stockMovement-objektet innan listan returneras */
	async fetchStockMovements() {
		const response = await fetch("api/inventory/stockMovements");

		if (!response.ok) {
			throw new Error("stockMovements fetch failed");
		}

		const movements = await response.json();
		return movements.map((m) => stockMovement.createFromApiResponse(m));
	}

	async fetchProducts() {
		const response = await fetch("/api/products");

		if (!response.ok) {
			throw new Error("products fetch failed");
		}

		return await response.json();
	}

	async postStockMovements(movement) {
		const movementObject = stockMovement.createFromNew(movement);
		const response = await fetch("/api/inventory/stockMovements", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(movementObject),
		});

		if (!response.ok) {
			console.log("Failed to create movement.");
			return null;
		}

		const result = await response.json();
		console.log({response, result});
		return {response, result};
	}
}
