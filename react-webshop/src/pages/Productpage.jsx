import "./Productpage.css";
import Product from "../api/Products";
import PriceConverter from "../modules/Admir/index.js";

import { useState, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router";
import { BasketContext } from "../context/BasketContext";
import { ToastContext } from "../context/ToastContext";

const priceConverter = new PriceConverter();

export default function Productpage() {
	const { id } = useParams();
	const [product, setProduct] = useState({});
	const [productQuantity, setProductQuantity] = useState(1);
	const { dispatch: basketDispatch } = useContext(BasketContext);
	const { dispatch: toastDispatch } = useContext(ToastContext);
	const [priceInfo, setPriceInfo] = useState(null);
	const [priceError, setPriceError] = useState(null);

	useEffect(() => {
		async function fetchProduct() {
			const products = new Product();
			const result = await products.getProductById(id);
			setProduct(result);
		}
		fetchProduct();
	}, []);

	useEffect(() => {
		if (!product || product.price === undefined) return;

		async function calculatePrice() {
			try {
				const result = await priceConverter.run({
					amount: product.price,
					category: "standard",
					targetCurrency: "SEK",
				});
				setPriceInfo(result);
				setPriceError(null);
			} catch (err) {
				console.error(err);
				setPriceError("Could not calculate price.");
				setPriceInfo(null);
			}
		}

		calculatePrice();
	}, [product]);

	const image = `/productImages/${product.imgLink}`;

	function quantityUp() {
		setProductQuantity(productQuantity + 1);
	}

	function quantityDown() {
		if (productQuantity > 1) setProductQuantity(productQuantity - 1);
	}

	function addToCart() {
		basketDispatch({ type: "ADD", payload: { product, productQuantity } });
		toastDispatch({ type: "SHOW", payload: "Item(s) added to cart!" });
	}

	if (!product) return null;

	return (
		<>
			<main>
				<NavLink to="/" className="backLink">
					&larr; back to products
				</NavLink>
				<div className="productContainer">
					<div className="imageContainer" style={{ backgroundImage: `url(${image})` }}></div>

					<div className="detailsContainer">
						<h1 className="productTitle">{product.title}</h1>
						<p className="productGenre">
							{product.genre} &middot; {product.release}
						</p>
						<p className="productDescription">{product.description}</p>

						{priceError && <p className="productPrice">{priceError}</p>}
						{!priceError && priceInfo && (
							<p className="productPrice">
								{priceInfo.formatted}{" "}
								<span className="productPriceVatNote">
									(inkl. {priceInfo.taxRate}% moms)
								</span>
							</p>
						)}
						{!priceError && !priceInfo && (
							<p className="productPrice">Calculating price...</p>
						)}
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
