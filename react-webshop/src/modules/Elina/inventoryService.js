import stockItem from "./stockItem.js";
import stockMovement from "./stockMovement.js";

export default class inventoryService {
	/* returnera fullt dataset innehållande:
	 * stockItems, X
	 * nuvarande lagernivåer efter uträkning baserat på lagerrörelser, X
	 * senaste lagerhändelserna, X
	 * varningar baserat på reorderPoint och försäljningshastighet.
	 * Ansvarar också för POST till databasen vid nya lagerrörelser */

	// lägg till så att funktion returnerar en varning för lågt lagersaldo och ovanliga lagerrörelser
	/* returnerar en array av objekt som innehåller stockItemId, lagersaldovärdet, de tre senaste lagerhändelserna, samt en varning i de fall lagersaldot behöver ses över */
	async returnDataReport() {
		const [stockItems, stockMovements] = await Promise.all([this.fetchStockItems(), this.fetchStockMovements()]);
		const stockItemMovements = stockItems.map((i) => {
			const allItemMovements = stockMovements.filter((m) => m.stockItemId === i.id);
			const stockItemBalance = this.returnStockBalance(allItemMovements);
			const recentMovements = this.returnRecentMovements(allItemMovements);
			const lowStockWarning = this.returnLowStockWarn(stockItemBalance, i.reorderPoint);
			return {
				item: i.id,
				balance: stockItemBalance,
				movements: recentMovements,
				stockWarnings: {lowStockWarning: lowStockWarning, fastMovementWarning: false},
			};
		});
		console.log(stockItemMovements);
		return stockItemMovements;
	}

	/* returnerar den totala summan för de rörelser i arrayen som skickas in som argument */
	returnStockBalance(movements) {
		return movements.reduce((total, movement) => total + movement.quantity, 0);
	}

	/* returnerar de tre senaste rörelserna i arrayen som skickas in som argument, nyast först och äldst sist */
	returnRecentMovements(movements) {
		movements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
		return movements.slice(0, 3);
	}

	/* returnerar en boolean som deklarerar true för varning eller false för ingen varning när lagervärdet är under ombeställningspunkten */
	returnLowStockWarn(balance, reorderPoint) {
		return balance < reorderPoint;
	}

	/* returnerar en boolean som deklarerar true för varning eller false för ingen varning när det sker ovanligt snabba lagerrörelser */
	returnFastMovementWarn() {}

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
