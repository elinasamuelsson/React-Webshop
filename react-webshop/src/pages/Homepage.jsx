import {NavLink} from "react-router";
import "./Homepage.css";

export default function Homepage() {
	return (
		<main>
			{/* Sidbanner med slogan */}
			<div className="pageBanner">
				<h1>ReelVault</h1>
				<h2>Movie magic the old fashioned way!</h2>
				<p>Because physical medium is just that much better</p>
			</div>

			{/* Kategoriknappar som med hjälp av routing kan leda direkt till sorterade vyer på products-sidan */}
			<div className="categoryContainer">
				<NavLink className="categoryItem" to="/products/k3j9x2q">
					Die Hard
				</NavLink>
				<NavLink className="categoryItem" to="/products/v2k6d1q">
					A Minecraft Movie
				</NavLink>
				<NavLink className="categoryItem" to="/products/s2p7d4x">
					Jurassic Park
				</NavLink>
			</div>

			{/* Kundomdömen */}
			<div className="testimonyContainer">
				<div className="testimonyItem">
					<p>All the titles I wanted in one place! 10/10 webshop</p>
					<p>- Jonas, Google Reviews</p>
				</div>
				<div className="testimonyItem">
					<p>Customer service is top notch, I was truly impressed!</p>
					<p>- Anonym, Trustpilot</p>
				</div>
				<div className="testimonyItem">
					<p>
						I thought there was no way I'd ever find a physical copy of The Exorcist in todays digital
						society but here it was. Long live physical media!
					</p>
					<p>- Tobias, Trustpilot</p>
				</div>
			</div>
		</main>
	);
}
