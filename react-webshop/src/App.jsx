import {Outlet} from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {BasketContext} from "./context/basketContext.jsx";

function App() {
	return (
		<>
			<BasketContext>
				<Header />
				<Outlet />
				<Footer />
			</BasketContext>
		</>
	);
}

export default App;
