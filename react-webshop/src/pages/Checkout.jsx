import {useContext} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import Form from "../components/Form.jsx";
import Orders from "../api/Orders.js";

export default function Checkout() {
	const {basket: cartItems, dispatch} = useContext(BasketContext);

	const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.productQuantity, 0);

	const formDescriptor = {
		firstName: {
			label: "Förnamn",
			type: "text",
			initialValue: "",
			required: true,
		},
		lastName: {
			label: "Efternamn",
			type: "text",
			initialValue: "",
			required: true,
		},
	};

	async function handleOrderSubmit(formData) {
		const ordersAPI = new Orders();

		const orderData = {
			...formData,
			items: cartItems,
			total: totalPrice,
		};

		const {response, result} = await ordersAPI.createOrder(orderData);

		if (response && response.ok) {
			console.log("Order placed!", result);
			dispatch({type: "CLEAR"});
		} else {
			console.log("Something went wrong placing the order.");
		}
	}

	return (
		<main className="checkout-page">
			<h1>Checkout</h1>
			<p>Total: {totalPrice} kr</p>
			<Form descriptor={formDescriptor} onSubmit={handleOrderSubmit} />
		</main>
	);
}