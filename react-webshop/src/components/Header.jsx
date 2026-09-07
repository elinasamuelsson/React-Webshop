// NavLink för att navigera och att veta om sidan är aktiv.
import {NavLink} from "react-router";
import {useContext} from "react";
import {BasketContext} from "../context/BasketContext";
import "./Header.css";

function Header() {
	const {basket} = useContext(BasketContext);
	// Summerar antal varor i korgen (tar hänsyn till productQuantity, inte bara antal olika produkter)
	const itemCount = basket.reduce((total, item) => total + item.productQuantity, 0);

	return (
		<header className="header">
			<div className="header-logo">
				<NavLink to="/" className="logo">
					ReelVault
				</NavLink>
			</div>

			{/* Navigering mellan hem, produkter och admin-sidan*/}
			<nav className="header-nav">
				<ul>
					<li>
						<NavLink to="/" end className={({isActive}) => (isActive ? "active" : "")}>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink to="/products" className={({isActive}) => (isActive ? "active" : "")}>
							Products
						</NavLink>
					</li>
					<li>
						<NavLink to="/admin" className={({isActive}) => (isActive ? "active" : "")}>
							Admin
						</NavLink>
					</li>
				</ul>
			</nav>
			{/* Döper om den till header-cart så den representerar rätt sak, itemcount tar summan av productQuantity
				 sedan om item är större än noll så visas antal*/}
			<div className="header-cart">
				<NavLink to="/cart" className="cart-link">
					Cart {itemCount > 0 && `(${itemCount})`}
				</NavLink>
			</div>
		</header>
	);
}

export default Header;
