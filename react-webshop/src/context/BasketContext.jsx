import {createContext, useReducer} from "react";

{
	/* skapar kontext / sammanhang för kundkorgen så att hela applikationen kommer ihåg vad som ligger i medan man bläddrar runt på sidan.
	 * importera variabeln och använd den i komponenter genom att lägga den i en variabel:
	 * const { dispatch } = useContext(BasketContext); */
}
export const BasketContext = createContext();

{
	/* bestämmer vilka händelser som kan ske i kontexten.
	 * i dispatch kan man passa vidare händesetyp och produkt till kontexten: dispatch({type: "ADD", payload: product}) */
}
function basketReducer(basket, action) {
	const {type, payload} = action;

	switch (type) {
		case "ADD":
			console.log("Movie(s) added to cart.");
			{
				/* returnerar en array med alla föregående poster, plus den nya */
			}
			return [...basket, payload];
		case "REMOVE":
			console.log("Movie(s) removed from cart.");
			{
				/* returnerar en filtrerad array där alla produkter förutom den vi valt att ta bort finns kvar */
			}
			return basket.filter((i) => i.id !== payload.id);
		case "CLEAR":
			console.log("No items in cart.");
			return [];
		default:
			return basket;
	}
}

/* BasketProvider gör varukorgen tillgänglig för alla komponenter / sidor som finns innanför taggarna <BasketContext.Provider> </BasketContext.Provider> */
export function BasketProvider({children}) {
	const [basket, dispatch] = useReducer(basketReducer, []);
	return <BasketContext.Provider value={{basket, dispatch}}>{children}</BasketContext.Provider>;
}
