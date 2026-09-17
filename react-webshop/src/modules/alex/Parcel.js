// Parcel representerar den fysiska "paketeringen" av varukorgens innehåll.
// Räknar ut total vikt, volym och den viktigaste siffran för fraktberäkning: chargeable weight
// (den vikt transportörer faktiskt debiterar efter - max av faktisk och volymetrisk vikt).
export default class Parcel {
	constructor(cartItems, dimensions) {
		const totalQuantity = cartItems.reduce((sum, item) => sum + item.productQuantity, 0);

		// Total vikt i gram, baserat på antal enheter i varukorgen
		this.weight = totalQuantity * dimensions.weightGrams;

		// Total volym i kubikcentimeter
		this.volume = totalQuantity * (dimensions.lengthCm * dimensions.widthCm * dimensions.heightCm);
	}

	// Volymetrisk vikt: hur mycket paketet "väger" baserat på hur mycket plats det tar,
	// oavsett faktisk vikt. Vanligt inom frakt eftersom stora, lätta paket
	// tar upp plats i en lastbil/flygplan som annars kunde använts för tyngre gods.
	get volumetricWeight() {
		const volumetricFactor = 5000; // gram per cm³, branschvanlig divisor (kan justeras)
		return this.volume / volumetricFactor;
	}

	// Den vikt transportören faktiskt debiterar för - det högsta av faktisk och volymetrisk vikt
	get chargeableWeight() {
		return Math.max(this.weight, this.volumetricWeight);
	}
}