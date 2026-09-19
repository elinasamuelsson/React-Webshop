import {useContext, useState} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import {ToastContext} from "../context/ToastContext.jsx";
import moduleMaker from "../modules/moduleMaker.js";
import Form from "../components/Form.jsx";
import Orders from "../api/Orders.js";
import ShippingQuoteService from "../modules/alex/ShippingQuoteService.js";

export default function Checkout() {
	const {basket: cartItems, appliedDiscount, rawTotal, finalTotal, dispatch, setAppliedDiscount} = useContext(BasketContext);
  	const {dispatch: toastDispatch} = useContext(ToastContext);

	// "form" -> "shipping" -> "done"
	const [step, setStep] = useState("form");
	const [customerData, setCustomerData] = useState(null);
	const [quotes, setQuotes] = useState([]);
	const [selectedQuote, setSelectedQuote] = useState(null);
	const [loadingQuotes, setLoadingQuotes] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

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
		address: {
			label: "Adress",
			type: "text",
			initialValue: "",
			required: true,
		},
		zipCode: {
			label: "Postnummer",
			type: "text",
			initialValue: "",
			required: true,
		},
	};

	// Enkel validering: svenskt postnummer, exakt 5 siffror
	function isValidZipCode(zipCode) {
		return /^\d{5}$/.test(zipCode);
	}

	// Minskar lagersaldo för varje köpt produkt via InventoryModule
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

	async function handleFormSubmit(formData) {
		setErrorMessage(null);

		if (!isValidZipCode(formData.zipCode)) {
			setErrorMessage("Please enter a valid 5-digit zip code.");
			return;
		}

		setCustomerData(formData);
		setLoadingQuotes(true);

		try {
			const shippingService = new ShippingQuoteService();
			const result = await shippingService.getQuotes(cartItems, formData.zipCode);

			if (result.length === 0) {
				setErrorMessage("No shipping options available right now. Please try again later.");
			} else {
				setQuotes(result);
				setStep("shipping");
			}
		} catch (e) {
			console.error("Failed to fetch shipping quotes:", e);
			setErrorMessage("Something went wrong fetching shipping options. Please try again.");
		} finally {
			setLoadingQuotes(false);
		}
	}

	async function handlePlaceOrder() {
		const ordersAPI = new Orders();

		const orderData = {
			...customerData,
			items: cartItems,
			rawTotal: rawTotal,
			discountApplied: appliedDiscount ? appliedDiscount.discountAmount : 0,
			shipping: selectedQuote,
			total: finalTotal + selectedQuote.price,
		};

		const {response, result} = await ordersAPI.createOrder(orderData).catch((e) => {
			toastDispatch({type: "SHOW", payload: `${e}`});
			return {response: null, result: null};
		});

		if (response && response.ok) {
			decreaseStock(orderData);
	toastDispatch({type: "SHOW", payload: "Your order has been placed!"});		
  dispatch({type: "CLEAR"});
			setAppliedDiscount(null);
			setStep("done");
		} else {
			setErrorMessage("Something went wrong placing the order. Please try again.");
		}
	}

	if (step === "done") {
		return (
			<main className="checkout-page">
				<h1>Thank you!</h1>
				<p>Your order has been placed.</p>
			</main>
		);
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
				<strong>Total: {rawTotal} kr</strong>
			)}

			{errorMessage && <p className="error-message">{errorMessage}</p>}

			{step === "form" && (
				<>
					{loadingQuotes ? (
						<p>Fetching shipping options...</p>
					) : (
						<Form descriptor={formDescriptor} onSubmit={handleFormSubmit} />
					)}
				</>
			)}

			{step === "shipping" && (
				<div className="shipping-options">
					<h2>Choose shipping</h2>
					{quotes.map((quote) => (
						<label key={quote.carrierId} className="shipping-option">
							<input
								type="radio"
								name="shipping"
								checked={selectedQuote?.carrierId === quote.carrierId}
								onChange={() => setSelectedQuote(quote)}
							/>
							{quote.carrierName} – {quote.price} kr ({quote.estimatedDays} days)
						</label>
					))}

					<button type="button" disabled={!selectedQuote} onClick={handlePlaceOrder}>
						Place Order
					</button>
				</div>
			)}
		</main>
	);
}
