import {useContext} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import {ToastContext} from "../context/ToastContext.jsx";
import moduleMaker from "../modules/moduleMaker.js";
import Form from "../components/Form.jsx";
import Orders from "../api/Orders.js";

export default function Checkout() {
	const {basket: cartItems, dispatch: basketDispatch} = useContext(BasketContext);
	const {dispatch: toastDispatch} = useContext(ToastContext);

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
			total: totalPrice,
		};

		const {response, result} = await ordersAPI.createOrder(orderData);

		if (response && response.ok) {
			decreaseStock(orderData);
			toastDispatch({type: "SHOW", payload: "Your order has been placed!"});
			basketDispatch({type: "CLEAR"});
		} else {
			toastDispatch({type: "SHOW", payload: "Something went wrong!"});
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
