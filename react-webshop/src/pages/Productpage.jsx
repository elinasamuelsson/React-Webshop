import "./Productpage.css";
import Product from "../api/Products";

import {useState, useEffect, useContext} from "react";
import {useParams, NavLink} from "react-router";
import {BasketContext} from "../context/BasketContext";
import {ToastContext} from "../context/ToastContext";

export default function Productpage() {
	const {id} = useParams();
	const [product, setProduct] = useState({});
	const [productQuantity, setProductQuantity] = useState(1);
	const {dispatch: basketDispatch} = useContext(BasketContext);
	const {dispatch: toastDispatch} = useContext(ToastContext);

	useEffect(() => {
		async function fetchProduct() {
			const products = new Product();
			const result = await products.getProductById(id);
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
		basketDispatch({type: "ADD", payload: {product, productQuantity}});
		toastDispatch({type: "SHOW", payload: "Item(s) added to cart!"});
	}

	return (
		<>
			<main>
				<NavLink to="/" className="backLink">
					&larr; back to products
				</NavLink>
				<div className="productContainer">
					<div className="imageContainer" style={{backgroundImage: `url(${image})`}}></div>

					<div className="detailsContainer">
						<h1 className="productTitle">{product.title}</h1>
						<p className="productGenre">
							{product.genre} &middot; {product.release}
						</p>
						<p className="productDescription">{product.description}</p>
						<p className="productPrice">{product.price} SEK</p>
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
