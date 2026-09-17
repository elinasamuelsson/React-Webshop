import Carrier from "./Carrier.js";
import Parcel from "./Parcel.js";

// ShippingQuoteService hämtar tillgängliga transportörer, beräknar en offert per transportör,
// och returnerar en sorterad lista - även om någon transportör skulle misslyckas.
export default class ShippingQuoteService {
	// Hämtar transportörsdata asynkront från /api/carriers - json-server läser från carriers.json och skapar själv REST-endpointen /api/carriers
	async fetchCarriers() {
		const response = await fetch("/api/carriers");
		if (!response.ok) {
			throw new Error("Failed to fetch carriers");
		}
		return response.json();
	}

	// Hämtar produktdimensioner asynkront från /api/productDimensions
	async fetchProductDimensions() {
		const response = await fetch("/api/productDimensions");
		if (!response.ok) {
			throw new Error("Failed to fetch product dimensions");
		}
		return response.json();
	}

	// Huvudmetoden: räknar ut och returnerar en sorterad lista med fraktofferter.
	// Om en transportör misslyckas, hoppas den bara över - resten av offerterna returneras ändå.
	async getQuotes(cartItems, postalCode) {
		const [carriersData, dimensions] = await Promise.all([
			this.fetchCarriers(),
			this.fetchProductDimensions(),
		]);

		const parcel = new Parcel(cartItems, dimensions);
		const quotes = [];

		for (const carrierData of carriersData) {
			try {
				const carrier = new Carrier(carrierData);
				const price = carrier.calculatePrice(parcel, postalCode);

				quotes.push({
					carrierId: carrier.id,
					carrierName: carrier.name,
					price: Math.round(price),
					estimatedDays: carrier.estimatedDays,
				});
			} catch (e) {
				console.error(`Failed to get quote from ${carrierData.name}:`, e);
				// Fortsätter till nästa transportör istället för att krascha hela offert-listan
			}
		}

		return quotes.sort((a, b) => a.price - b.price);
	}
}