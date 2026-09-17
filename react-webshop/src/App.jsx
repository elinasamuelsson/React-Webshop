import { Outlet } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { BasketProvider } from "./context/BasketContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";

function App() {
	return (
		<>
			<CurrencyProvider>
				<ToastProvider>
					<BasketProvider>
						<Header />
						<Outlet />
						<Footer />
					</BasketProvider>
				</ToastProvider>
			</CurrencyProvider>
		</>
	);
}

export default App;
