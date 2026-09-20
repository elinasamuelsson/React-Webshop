// Parcel representerar den fysiska "paketeringen" av varukorgens innehåll.
// Räknar ut total vikt, volym och den viktigaste siffran för fraktberäkning: chargeable weight
export default class Parcel {
	constructor(cartItems, dimensions) {
		const totalQuantity = cartItems.reduce((sum, item) => sum + item.productQuantity, 0);

		// Total vikt i gram, baserat på antal enheter i varukorgen
		this.weight = totalQuantity * dimensions.weightGrams;

		// Total volym i kubikcentimeter
		this.volume = totalQuantity * (dimensions.lengthCm * dimensions.widthCm * dimensions.heightCm);
	}

	// Volymetrisk vikt: hur mycket paketet "väger" baserat på hur mycket plats det tar
	get volumetricWeight() {
    const volumetricFactor = 5000; // cm³ per kg (branschstandard-divisor)
    return (this.volume / volumetricFactor) * 1000; // omvandlat till gram, för att matcha this.weight
}
	

	// Den vikt transportören faktiskt debiterar för - det högsta av faktisk och volymetrisk vikt
	get chargeableWeight() {
		return Math.max(this.weight, this.volumetricWeight);
	}
}