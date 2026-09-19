import "./Cartpage.css";
import {useContext, useState} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import {ToastContext} from "../context/ToastContext.jsx";
import CampaignEngineModule from "../modules/campaigns/CampaignEngineModule.js";
import {Link} from "react-router";
import {ToastContext} from "../context/ToastContext.jsx";

const campaignModule = new CampaignEngineModule();

export default function Cart() {
	const {
		basket: cartItems,
		appliedDiscount,
		setAppliedDiscount,
		rawTotal,
		finalTotal,
		dispatch: basketDispatch,
	} = useContext(BasketContext);
	const {dispatch: toastDispatch} = useContext(ToastContext);

	const [promoCode, setPromoCode] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	async function handleDiscountSubmit(e) {
		e.preventDefault();
		setErrorMessage("");

		try {
			const result = await campaignModule.run({code: promoCode}, {cartItems});

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
							<article className="cart-row" key={item.product.id}>
								<img src={`/productImages/${item.product.imgLink}`} alt={item.product.title} />

								<div>
									<h2>{item.product.title}</h2>
									<p>
										{item.product.genre} · {item.product.release}
									</p>
									<p>{item.product.price} kr per item</p>
								</div>

								<div className="cart-quantity">
									<button
										onClick={() => {
											basketDispatch({
												type: "UPDATE",
												payload: {product: item.product, productQuantity: -1},
											});
											toastDispatch({type: "SHOW", payload: "Cart was updated!"});
										}}
									>
										&#45;
									</button>

									<span>{item.productQuantity}</span>

									<button
										onClick={() => {
											basketDispatch({
												type: "UPDATE",
												payload: {product: item.product, productQuantity: 1},
											});
											toastDispatch({type: "SHOW", payload: "Cart was updated!"});
										}}
									>
										+
									</button>
								</div>

								<strong>{item.product.price * item.productQuantity} kr</strong>

								<button
									onClick={() => {
										basketDispatch({type: "REMOVE", payload: item.product.id});
										toastDispatch({type: "SHOW", payload: "Cart was updated!"});
									}}
								>
									Remove
								</button>
							</article>
						))}
					</div>

					<div className="cart-total" style={{display: "flex", flexDirection: "column"}}>
						<form onSubmit={handleDiscountSubmit}>
							<input
								type="text"
								placeholder="Enter promo code"
								onChange={(e) => setPromoCode(e.target.value)}
							/>
							<button type="submit">Apply</button>
						</form>

						{errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

						{appliedDiscount ? (
							<div>
								<p style={{color: "green"}}>{appliedDiscount.message}</p>
								<p>Original total: {rawTotal}</p>
								<p>Discount: -{appliedDiscount.discountAmount} kr</p>
								<strong>Final total: {finalTotal} kr</strong>
							</div>
						) : (
							<strong>Total: {rawTotal} kr</strong>
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
