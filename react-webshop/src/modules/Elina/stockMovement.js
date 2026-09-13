export default class stockMovement {
	/* constructor för nya lagerrörelser */
	constructor(id, stockItemId, type, quantity, timestamp) {
		this.id = id;
		this.stockItemId = stockItemId;
		this.type = type;
		this.quantity = quantity;
		this.timestamp = timestamp;
	}

	/* statisk metod som skapar en stockMovement från existerande källa */
	static createFromApiResponse(apiResponse) {
		return new stockMovement(
			apiResponse.id,
			apiResponse.stockItemId,
			apiResponse.type,
			apiResponse.quantity,
			apiResponse.timestamp,
		);
	}

	/* statisk metod som skapar en stockMovement utan tidigare källa */
	static createFromNew(newMovement) {
		return new stockMovement(
			createStockMovementId(newMovement.timestamp),
			newMovement.stockItemId,
			newMovement.type,
			newMovement.quantity,
			newMovement.timestamp,
		);
	}

	/* metoden skapar ett stockMovementId genom att använda string:en "sm" (kort för Stock Movement) och tidsstämpeln i millisekunder sedan UNIX epoch.
	 * Att två rörelser skulle ske i exakt samma millisekund är väldigt otroligt */
	createStockMovementId(timestamp) {
		const date = new Date(`${timestamp}`);
		return "sm" + date.getTime().toString();
	}

	// metod som bestämmer att kvantitet inte kan vara 0

	// metod som bestämmer att type enbart kan vara "inleverans", "justering", eller "försäljning"
}
