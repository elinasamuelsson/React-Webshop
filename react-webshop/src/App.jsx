import {Outlet} from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {BasketProvider} from "./context/BasketContext.jsx";
import {ToastProvider} from "./context/ToastContext.jsx";

function App() {
	return (
		<>
			<ToastProvider>
				<BasketProvider>
					<Header />
					<Outlet />
					<Footer />
				</BasketProvider>
			</ToastProvider>
		</>
	);
}

export default App;
