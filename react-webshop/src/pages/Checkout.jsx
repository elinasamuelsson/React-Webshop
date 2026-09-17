import {useContext} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import moduleMaker from "../modules/moduleMaker.js";
import Form from "../components/Form.jsx";
import Orders from "../api/Orders.js";

export default function Checkout() {
	const {basket: cartItems, appliedDiscount, rawTotal, finalTotal, dispatch, setAppliedDiscount} = useContext(BasketContext);

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
		}
	};

	async function decreaseStock(orderData) {
		const movements = orderData.items.map((m) => {
			return {
				stockItemId: m.product.id,
				type: "försäljning",
				quantity: "-" + m.productQuantity,
			};
		});

		for (let i = 0; i < movements.length; i++) {
			moduleMaker.InventoryModule.postMovement(movements[i]);
		}
	}

	async function handleOrderSubmit(formData) {
		const ordersAPI = new Orders();

		const orderData = {
			...formData,
			items: cartItems,
			rawTotal: rawTotal, 
			discountApplied: appliedDiscount ? appliedDiscount.discountAmount : 0, 
			total: finalTotal,
		};

		const {response, result} = await ordersAPI.createOrder(orderData);

		if (response && response.ok) {
			console.log("Order placed!", result);
			decreaseStock(orderData);
			dispatch({type: "CLEAR"});
			setAppliedDiscount(null);
		} else {
			console.log("Something went wrong placing the order.");
		}
	}

	return (
		<main className="checkout-page">
			<h1>Checkout</h1>

			{appliedDiscount ? (
				<div>
					<p style={{ textDecoration: "line-through", color: "#888" }}>Original price: {rawTotal}</p>
					<p>
						Discount ({appliedDiscount.code}): -{appliedDiscount.discountAmount} kr
					</p>
					<strong>Total: {finalTotal} kr</strong>
				</div>
			) : (
				<strong>Total: {rawTotal}</strong>
			)}

			<Form descriptor={formDescriptor} onSubmit={handleOrderSubmit} />
		</main>
	);
}
