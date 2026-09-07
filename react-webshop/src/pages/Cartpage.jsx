import "./Cartpage.css";
import {useContext} from "react";
import {BasketContext} from "../context/BasketContext.jsx";

export default function Cart() {
	const {basket: cartItems, dispatch} = useContext(BasketContext);

	const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.productQuantity, 0);

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

					<div className="cart-total">
						<strong>Total: {totalPrice} kr</strong>
					</div>
				</>
			)}
		</main>
	);
}
