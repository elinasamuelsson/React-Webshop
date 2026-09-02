import "./Homepage.css";

export default function Homepage() {
	return (
		<main>
			{/* Sidbanner med slogan */}
			<div className="pageBanner">
				<h1>Movie magic the old fashioned way!</h1>
				<p>Because physical medium is just that much better</p>
			</div>

			{/* Kategoriknappar som med hjälp av routing kan leda direkt till sorterade vyer på products-sidan */}
			<div className="categoryContainer">
				<p className="categoryItem">Action</p>
				<p className="categoryItem">Adventure</p>
				<p className="categoryItem">Animated</p>
				<p className="categoryItem">Comedy</p>
				<p className="categoryItem">Drama</p>
				<p className="categoryItem">Family</p>
				<p className="categoryItem">Horror</p>
				<p className="categoryItem">Musical</p>
				<p className="categoryItem">Mystery</p>
				<p className="categoryItem">Romance</p>
				<p className="categoryItem">Sci-Fi</p>
				<p className="categoryItem">Thriller</p>
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
