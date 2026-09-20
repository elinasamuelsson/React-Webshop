import ShippingQuoteService from "./ShippingQuoteService.js";

// ShippingModule är kontraktslagret som gruppens moduleMaker och UI pratar med.
// Den äger ett kort cache-minne (senaste offerten), och delegerar själva
// beräkningsarbetet till ShippingQuoteService.
export default class ShippingModule {
	static descriptor = {
		name: "ShippingModule",
		methodsAndInputs: [
			{
				method: "run",
				input: [
					"values - objekt med { postalCode }, kundens postnummer",
					"context - objekt med { cartItems }, varukorgens innehåll",
				],
				output: "Returnerar en sorterad array med fraktofferter: [{ carrierId, carrierName, price, estimatedDays }]",
			},
		],
	};

	shippingQuoteService = new ShippingQuoteService();

	// Cache: sparar senaste resultatet tillsammans med en tidsstämpel och
	// en "nyckel" som beskriver vilken varukorg + postnummer det gällde.
	cache = null;
	cacheTimestamp = null;
	cacheDurationMs = 30000; // 30 sekunder

	async run(values, context) {
		const postalCode = values?.postalCode;
		const cartItems = context?.cartItems ?? [];

		if (!postalCode) {
			throw new Error("ShippingModule: postalCode is required in values.");
		}

		const cacheKey = this.buildCacheKey(cartItems, postalCode);

		if (this.isCacheValid(cacheKey)) {
			console.log("ShippingModule: returning cached quotes");
			return this.cache.quotes;
		}

		const quotes = await this.shippingQuoteService.getQuotes(cartItems, postalCode);

		this.cache = {key: cacheKey, quotes};
		this.cacheTimestamp = Date.now();

		return quotes;
	}

	// Bygger en enkel textnyckel som representerar varukorgens innehåll + postnummer,
	// så vi kan avgöra om en ny förfrågan är "samma sak" som förra gången.
	buildCacheKey(cartItems, postalCode) {
		const itemsKey = cartItems.map((item) => `${item.product.id}:${item.productQuantity}`).join(",");
		return `${postalCode}|${itemsKey}`;
	}

	isCacheValid(cacheKey) {
		if (!this.cache || this.cache.key !== cacheKey) return false;
		const age = Date.now() - this.cacheTimestamp;
		return age < this.cacheDurationMs;
	}
}