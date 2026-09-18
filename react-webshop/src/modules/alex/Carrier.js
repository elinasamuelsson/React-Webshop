// Carrier representerar en transportör och vet hur den räknar ut sitt eget pris,
// beroende på vilken prismodell den använder (viktbaserad, zonbaserad eller volymetrisk).
export default class Carrier {
	constructor({id, name, pricingModel, pricePerKg, basePrice, zonePrices, estimatedDays}) {
		this.id = id;
		this.name = name;
		this.pricingModel = pricingModel;
		this.pricePerKg = pricePerKg;
		this.basePrice = basePrice;
		this.zonePrices = zonePrices;
		this.estimatedDays = estimatedDays;
	}

	// Räknar ut priset för denna transportör, baserat på paketets vikt/volym
	// och (om zonbaserad) destinationens postnummer.
	calculatePrice(parcel, postalCode) {
		switch (this.pricingModel) {
			case "weight":
				return this.calculateWeightBasedPrice(parcel);
			case "volumetric":
				return this.calculateVolumetricPrice(parcel);
			case "zone":
				return this.calculateZoneBasedPrice(postalCode);
			default:
				throw new Error(`Unknown pricing model: ${this.pricingModel}`);
		}
	}

	// Pris baserat på faktisk vikt (gram omvandlat till kg)
	calculateWeightBasedPrice(parcel) {
		const weightInKg = parcel.weight / 1000;
		return this.basePrice + weightInKg * this.pricePerKg;
	}

	// Pris baserat på chargeable weight (max av faktisk och volymetrisk vikt)
	calculateVolumetricPrice(parcel) {
		const weightInKg = parcel.chargeableWeight / 1000;
		return this.basePrice + weightInKg * this.pricePerKg;
	}

	// Pris baserat på vilken zon postnumret tillhör
	calculateZoneBasedPrice(postalCode) {
		const zone = this.getZoneFromPostalCode(postalCode);
		return this.zonePrices[zone];
	}

	// Enkel regel: första siffran i postnumret avgör zon
	getZoneFromPostalCode(postalCode) {
		const firstDigit = postalCode.charAt(0);
		if (["1", "2"].includes(firstDigit)) return "zone1";
		if (["3", "4", "5", "6"].includes(firstDigit)) return "zone2";
		return "zone3";
	}
}