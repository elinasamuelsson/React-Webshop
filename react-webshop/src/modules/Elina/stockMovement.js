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
		const quantity = Number(newMovement.quantity);

		if (
			newMovement.type !== "försäljning" &&
			newMovement.type !== "inleverans" &&
			newMovement.type !== "justering"
		) {
			throw new Error(`Rörelsetyp måste vara "försäljning", "inleverans", eller "justering".`);
		}

		if (typeof quantity !== "number" || Number.isNaN(quantity)) {
			throw new Error(`Kvantiteten måste vara ett giltigt nummer.`);
		}
		if (newMovement.type === "justering" && quantity >= 0) {
			throw new Error(`Justeringar måste vara negativa.`);
		}

		if (newMovement.type === "inleverans" && quantity < 0) {
			throw new Error(`Inleveranser får inte vara negativa eller 0.`);
		}

		if (newMovement.type === "försäljning" && quantity >= 0) {
			throw new Error(`Försäljningar måste vara negativa.`);
		}

		return new stockMovement(
			this.createStockMovementId(newMovement.timestamp), //skrivs över av json-servers egna id-generator >:(
			newMovement.stockItemId,
			newMovement.type,
			quantity,
			newMovement.timestamp,
		);
	}

	/* metoden skapar ett stockMovementId genom att använda string:en "sm" (kort för Stock Movement) och tidsstämpeln i millisekunder sedan UNIX epoch.
	 * Att två rörelser skulle ske i exakt samma millisekund är väldigt otroligt */
	static createStockMovementId(timestamp) {
		const date = new Date(`${timestamp}`);
		return "sm" + date.getTime().toString();
	}
}
