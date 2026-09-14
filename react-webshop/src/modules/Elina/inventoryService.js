import stockItem from "./stockItem.js";
import stockMovement from "./stockMovement.js";

export default class inventoryService {
	/* returnerar en array av objekt som innehåller stockItemId, lagersaldovärdet, de tre senaste lagerhändelserna, samt en varningar i de fall lagersaldot behöver ses över av olika anledningar (lågt lagervärde, ovanligt snabb försäljning) */
	async returnDataReport() {
		const [stockItems, stockMovements] = await Promise.all([this.fetchStockItems(), this.fetchStockMovements()]);
		const stockItemMovements = stockItems.map((i) => {
			const allItemMovements = this.returnItemMovements(i, stockMovements);
			const stockItemBalance = this.returnStockBalance(allItemMovements);
			const recentMovements = this.returnRecentMovements(allItemMovements);
			const lowStockWarning = this.returnLowStockWarn(stockItemBalance, i.reorderPoint);
			const fastMovementWarning = this.returnFastMovementWarn(allItemMovements, i.reorderPoint);
			return {
				item: i.id,
				balance: stockItemBalance,
				movements: recentMovements,
				stockWarnings: {lowStockWarning: lowStockWarning, fastMovementWarning: fastMovementWarning},
			};
		});
		console.log(stockItemMovements);
		return stockItemMovements;
	}

	/* returnerar det aktuella stockItem:ets lagerrörelser */
	returnItemMovements(item, movements) {
		return movements.filter((m) => m.stockItemId === item.id);
	}

	/* returnerar den totala summan för de rörelserna */
	returnStockBalance(movements) {
		return movements.reduce((total, movement) => total + movement.quantity, 0);
	}

	/* returnerar de tre senaste rörelserna, nyast först och äldst sist */
	returnRecentMovements(movements) {
		movements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
		return movements.slice(0, 3);
	}

	/* returnerar en boolean som deklarerar true för varning eller false för ingen varning när lagervärdet är under ombeställningspunkten */
	returnLowStockWarn(balance, reorderPoint) {
		return balance < reorderPoint;
	}

	/* returnerar en boolean som deklarerar true för varning eller false för ingen varning när det sker ovanligt snabba lagerrörelser */
	returnFastMovementWarn(movements, reorderPoint) {
		if (movements.length === 0) return false;

		const mostRecent = [...movements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
		const allSales = movements.filter((m) => m.type === "försäljning");

		if (allSales.length === 0) return false;

		const unusualMovements = allSales
			.filter((m) => new Date(m.timestamp) > new Date(mostRecent.timestamp) - 3 * 24 * 60 * 60 * 1000)
			.reduce((sum, m) => sum + Math.abs(m.quantity), 0);

		return unusualMovements >= reorderPoint / 3;
	}

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
}
