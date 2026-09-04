import "./Homepage.css";
import { Link } from "react-router";

export default function Homepage() {

	return (
		<main>
			{/* Sidbanner med slogan */}
			<div className="pageBanner">
				<h1>Movie magic the old fashioned way!</h1>
				<p>Because physical medium is just that much better</p>
			</div>

			{/* Kategoriknappar som med hjälp av routing kan leda direkt till sorterade vyer på products-sidan */}
			{/* Inte den bästa lösning just nu men det funkar just nu med filtrering */}
			<div className="categoryContainer">
				<p className="categoryItem" >	
					<Link to="/products" state={{ filterName: "Action" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Action
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Adventure" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Adventure
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Animated" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Animated
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Comedy" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Comedy
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Drama" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Drama
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Family" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Family
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Horror" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Horror
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Musical" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Musical
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Mystery" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Mystery
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Romance" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Romance
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Sci-Fi" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Sci-Fi
					</Link>
				</p>
				<p className="categoryItem">
					<Link to="/products" state={{ filterName: "Thriller" }} className={({ isActive }) => (isActive ? "active" : "")}>
						Thriller
					</Link>
				</p>
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
