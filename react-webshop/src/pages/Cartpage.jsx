import "./Cartpage.css";
import {useContext, useState, useEffect} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import {ToastContext} from "../context/ToastContext.jsx";
import CampaignEngineModule from "../modules/campaigns/CampaignEngineModule.js";
import {Link} from "react-router";
import {CurrencyContext} from "../context/CurrencyContext.jsx";
import {priceWithTax} from "../hooks/priceWithTax.js";
const campaignModule = new CampaignEngineModule();

function CartRow({ item, basketDispatch, toastDispatch, currency, onLineTotal }) {
	const { priceInfo, priceError } = priceWithTax(item.product.price, "standard", currency);
	const lineTotal = priceInfo ? priceInfo.amount * item.productQuantity : null;

	useEffect(() => {
		onLineTotal(item.product.id, lineTotal);
	}, [item.product.id, lineTotal]);

	return (
		<article className="cart-row">
			<img src={`/productImages/${item.product.imgLink}`} alt={item.product.title} />

			<div>
				<h2>{item.product.title}</h2>
				<p>
					{item.product.genre} &middot; {item.product.release}
				</p>
				{priceError && <p style={{ color: "red" }}>{priceError}</p>}
				{!priceError && priceInfo && <p>{priceInfo.formatted} per item</p>}
				{!priceError && !priceInfo && <p>Calculating price...</p>}
			</div>

			<div className="cart-quantity">
				<button
					onClick={() => {
						basketDispatch({
							type: "UPDATE",
							payload: { product: item.product, productQuantity: -1 },
						});
						toastDispatch({ type: "SHOW", payload: "Cart was updated!" });
					}}
				>
					&#45;
				</button>

				<span>{item.productQuantity}</span>

				<button
					onClick={() => {
						basketDispatch({
							type: "UPDATE",
							payload: { product: item.product, productQuantity: 1 },
						});
						toastDispatch({ type: "SHOW", payload: "Cart was updated!" });
					}}
				>
					+
				</button>
			</div>

			<strong>{lineTotal !== null ? `${lineTotal.toFixed(2)} kr` : "..."}</strong>

			<button className="cart-remove-button"
				onClick={() => {
					basketDispatch({ type: "REMOVE", payload: item.product.id });
					toastDispatch({ type: "SHOW", payload: "Cart was updated!" });
				}}
			>
				Remove
			</button>
		</article>
	);
}

export default function Cart() {
	const {
		basket: cartItems,
		appliedDiscount,
		setAppliedDiscount,
		dispatch: basketDispatch,
	} = useContext(BasketContext);
	const { dispatch: toastDispatch } = useContext(ToastContext);
	const { currency } = useContext(CurrencyContext);

	const [promoCode, setPromoCode] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [lineTotals, setLineTotals] = useState({});

	function handleLineTotal(productId, total) {
		setLineTotals((prev) => ({ ...prev, [productId]: total }));
	}

	const rawTotal = Object.values(lineTotals).reduce(
		(sum, value) => sum + (value ?? 0),
		0
	);

	const finalTotal = appliedDiscount
		? rawTotal - appliedDiscount.discountAmount
		: rawTotal;

	async function handleDiscountSubmit(e) {
		e.preventDefault();
		setErrorMessage("");

		try {
			const result = await campaignModule.run({ code: promoCode }, { cartItems });
			setAppliedDiscount(result);
		} catch (error) {
			setAppliedDiscount(null);
			setErrorMessage(error.message);
		}
	}

	return (
		<main className="cart-page">
			<h1>Your Cart</h1>

			{cartItems.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<>
					<p>{cartItems.length} item(s)</p>

					<div className="cart-list">
						{cartItems.map((item) => (
							<CartRow
								key={item.product.id}
								item={item}
								basketDispatch={basketDispatch}
								toastDispatch={toastDispatch}
								currency={currency}
								onLineTotal={handleLineTotal}
							/>
						))}
					</div>

					<div className="cart-total" style={{ display: "flex", flexDirection: "column" }}>
						<form onSubmit={handleDiscountSubmit}>
							<input
								type="text"
								placeholder="Enter promo code"
								onChange={(e) => setPromoCode(e.target.value)}
							/>
							<button type="submit">Apply</button>
						</form>

						{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

						{appliedDiscount ? (
							<div>
								<p style={{ color: "green" }}>{appliedDiscount.message}</p>
								<p>Original total: {rawTotal.toFixed(2)} kr</p>
								<p>Discount: -{appliedDiscount.discountAmount} kr</p>
								<strong>Final total: {finalTotal.toFixed(2)} kr</strong>
							</div>
						) : (
							<strong>Total: {rawTotal.toFixed(2)} kr</strong>
						)}

						<Link to="/checkout">
							<button>Go to Checkout</button>
						</Link>
					</div>
				</>
			)}
		</main>
	);
}
