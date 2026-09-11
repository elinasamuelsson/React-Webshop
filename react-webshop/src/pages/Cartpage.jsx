import "./Cartpage.css";
import {useContext, useState} from "react";
import {BasketContext} from "../context/BasketContext.jsx";
import CampaignEngineModule from "../modules/campaigns/CampaignEngineModule.js";

const campaignModule = new CampaignEngineModule();

export default function Cart() {
	const {basket: cartItems, dispatch} = useContext(BasketContext);

	const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.productQuantity, 0);

	const [promoCode, setPromoCode] = useState("");
	const [discountResult, setDiscountResult] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setErrorMessage("");

		try {
			const result = await campaignModule.run(
				{ code: promoCode }, 
				{ cartItems }
			);

			setDiscountResult(result);
		} catch (error) {
			setDiscountResult(null);
			setErrorMessage(error.message);
			console.log(error);
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
										onClick={() =>
											dispatch({
												type: "UPDATE",
												payload: {product: item.product, productQuantity: -1},
											})
										}
									>
										&#45;
									</button>

									<span>{item.productQuantity}</span>

									<button
										onClick={() =>
											dispatch({
												type: "UPDATE",
												payload: {product: item.product, productQuantity: 1},
											})
										}
									>
										+
									</button>
								</div>

								<strong>{item.product.price * item.productQuantity} kr</strong>

								<button>Remove</button>
							</article>
						))}
					</div>

					<div className="cart-total" style={{display: "flex", flexDirection: "column"}}>
						<form onSubmit={handleSubmit}>
							<input 
								type="text" 
								placeholder="Enter promo code" 
								onChange={(e) => setPromoCode(e.target.value)}/>
							<button type="submit">Apply</button>
						</form>

						{errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

						{discountResult ? (
							<div>
								<p style={{color: "green"}}>{discountResult.message}</p>
								<p>Original total: {totalPrice}</p>
								<p>Discount: -{discountResult.discountAmount} kr</p>
								<strong>Final total: {discountResult.finalTotal} kr</strong>
							</div>
						) : <strong>Total: {totalPrice} kr</strong>}
					</div>
				</>
			)}
		</main>
	);
}
