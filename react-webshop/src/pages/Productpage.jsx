import "./Productpage.css";
import Products from "../api/Products";

import {useState, useEffect} from "react";

export default function Productpage() {
	const [product, setProduct] = useState({});
	const [productQuantity, setProductQuantity] = useState(1);

	useEffect(() => {
		async function fetchProduct() {
			const products = new Products();
			const result = await products.getProductById("k2v7r5n");
			setProduct(result);
		}
		fetchProduct();
	}, []);
	const image = `/productImages/${product.imgLink}`;

	function quantityUp() {
		setProductQuantity(productQuantity + 1);
	}

	function quantityDown() {
		if (productQuantity > 1) setProductQuantity(productQuantity - 1);
	}

	function addToCart() {
		console.log(`${productQuantity} product(s) added to cart.`);
	}

	return (
		<>
			<main>
				<p className="backLink">&larr; back to products</p>
				<div className="productContainer">
					<div className="imageContainer" style={{backgroundImage: `url(${image})`}}></div>

					<div className="detailsContainer">
						<h1 className="productTitle">{product.title}</h1>
						<p className="productGenre">
							{product.genre} &middot; {product.release}
						</p>
						<p className="productDescription">{product.description}</p>
						<p className="productPrice">${product.price}</p>
					</div>
				</div>

				<div className="orderFormContainer">
					<div className="quantityPicker">
						<button type="button" className="quantityButton" onClick={quantityDown}>
							-
						</button>
						<span className="quantityNumber">{productQuantity}</span>
						<button type="button" className="quantityButton" onClick={quantityUp}>
							+
						</button>
					</div>

					<button type="button" className="addToCartButton" onClick={addToCart}>
						Add to Cart
					</button>
				</div>
			</main>
		</>
	);
}
