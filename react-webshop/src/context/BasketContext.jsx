import {createContext, useReducer} from "react";

/* skapar kontext / sammanhang för kundkorgen så att hela applikationen kommer ihåg vad som ligger i medan man bläddrar runt på sidan.
 * importera variabeln och använd den i komponenter genom att lägga den i en variabel:
 * const { dispatch } = useContext(BasketContext); */
export const BasketContext = createContext();

/* skapar reglerna för vilka händelser som kan ske i kontexten.
 * i dispatch kan man passa vidare händesetyp och produkt till kontexten: dispatch({type: "ADD", payload: product, productQuantity}) */
function basketReducer(basket, action) {
	const {type, payload} = action;

	switch (type) {
		case "ADD":
			/* returnerar en array med alla föregående poster, plus den nya */
			let existingProductAdd = basket.find((p) => payload.product.id === p.product.id);

			if (existingProductAdd) {
				return basket.map((p) => {
					if (payload.product.id === p.product.id) {
						console.log("Updating existing product!");
						return {...p, productQuantity: p.productQuantity + payload.productQuantity};
					} else return p;
				});
			}
			let updatedBasketAdd = [...basket, payload];
			console.log("Movie(s) added to cart.");
			console.log(updatedBasketAdd);
			return updatedBasketAdd;
		case "REMOVE":
			console.log("Movie(s) removed from cart.");

			/* returnerar en filtrerad array där alla produkter förutom den vi valt att ta bort finns kvar */
			let updatedBasketRemove = basket.filter((p) => p.id !== payload.id);
			console.log(updatedBasketRemove);
			return updatedBasketRemove;
		/* uppdaterar varukorgen
		 * förutsätter att mängden i varukorgen korrigeras med + / - knappar, om inte kan denna logik ändras för att matcha kundkorgens utseende */
		case "UPDATE":
			let existingProductUpdate = basket.find((p) => payload.product.id === p.product.id);

			if (!existingProductUpdate) {
				console.log("Product doesn't exist");
				return basket;
			}

			let newQuantity = existingProductUpdate.productQuantity + payload.productQuantity;

			if (newQuantity <= 0) {
				return basket.filter((p) => payload.product.id !== p.product.id);
			}

			//förutsätter att uppdateringen på varukorgssidan är + och - knappar, annars kan denna logik ändras
			return basket.map((p) => {
				if (payload.product.id === p.product.id) {
					console.log("Updating existing product!");
					return {...p, productQuantity: newQuantity};
				} else return p;
			});
		case "CLEAR":
			console.log("No items in cart.");

			/* tömmer varukorgen */
			let updatedBasketClear = [];
			console.log(updatedBasketClear);
			return updatedBasketClear;
		default:
			return basket;
	}
}

/* BasketProvider gör varukorgens kontext tillgänglig för alla komponenter / sidor som finns innanför taggarna <BasketProvider> </BasketProvider> istället för att använda useReducer(basketReducer, []) i App.jsx */
export function BasketProvider({children}) {
	const [basket, dispatch] = useReducer(basketReducer, []);
	return <BasketContext.Provider value={{basket, dispatch}}>{children}</BasketContext.Provider>;
}
