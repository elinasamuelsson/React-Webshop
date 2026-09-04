import {Outlet} from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {BasketProvider} from "./context/basketContext.jsx";

function App() {
	return (
		<>
			<BasketProvider>
				<Header />
				<Outlet />
				<Footer />
			</BasketProvider>
		</>
	);
}

export default App;
