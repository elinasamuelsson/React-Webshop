import inventoryApi from "./inventoryApi.js";

export default class inventoryService {
	/* returnerar en array av objekt som innehåller stockItemId, lagersaldovärdet, de tre senaste lagerhändelserna, samt en varningar i de fall lagersaldot behöver ses över av olika anledningar (lågt lagervärde, ovanligt snabb försäljning) */
	api = new inventoryApi();
	constructor() {
		this.stockItems = null;
		this.lastReport = null;
	}

	async getStockItems() {
		if (this.stockItems) {
			return this.stockItems;
		}
		this.stockItems = await this.api.fetchStockItems();
		return this.stockItems;
	}

	async returnDataReport({forceRefresh = false} = {}) {
		if (!forceRefresh && this.lastReport) {
			return this.lastReport;
		}

		const [stockItems, stockMovements, products] = await Promise.all([
			this.getStockItems(),
			this.api.fetchStockMovements(),
			this.api.fetchProducts(),
		]);

		const stockItemMovements = stockItems.map((i) => {
			const itemName = this.returnItemName(i, products);
			const allItemMovements = this.returnItemMovements(i, stockMovements);
			const stockItemBalance = this.returnStockBalance(allItemMovements);
			const recentMovements = this.returnRecentMovements(allItemMovements);
			const lowStockWarning = this.returnLowStockWarn(stockItemBalance, i.reorderPoint);
			const fastMovementWarning = this.returnFastMovementWarn(allItemMovements, i.reorderPoint);
			return {
				itemId: i.id,
				itemName: itemName,
				balance: stockItemBalance,
				movements: recentMovements,
				warnings: {lowStockWarning: lowStockWarning, fastMovementWarning: fastMovementWarning},
			};
		});

		this.lastReport = stockItemMovements;
		return stockItemMovements;
	}

	async postMovement(formData) {
		const items = await this.getStockItems();
		const stockItemIds = items.map((i) => i.id);

		if (!stockItemIds.includes(formData.stockItemId)) {
			throw new Error(`Det finns ingen lagerprodukt med angivet id.`);
		}

		const movement = {
			...formData,
			timestamp: new Date().toISOString(),
		};

		this.lastReport = null;
		return await this.api.postStockMovements(movement);
	}

	returnItemName(item, products) {
		const product = products.filter((p) => p.id === item.id)[0];
		return product.title;
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
}
