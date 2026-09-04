// NavLink för att navigera och att veta om sidan är aktiv.
import {NavLink} from "react-router";
import "./Header.css";

function Header() {
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

			<div className="header-cart">
				<NavLink to="/cart" className="cart-link">
					Cart
				</NavLink>
			</div>
		</header>
	);
}

export default Header;
