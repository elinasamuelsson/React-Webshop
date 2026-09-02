import {useState} from "react";
import "./App.css";
import Footer from "./components/Footer.jsx";
import Products from "./components/Products.jsx";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			{/* <h3>Hello World!</h3> */}
			<Products />
			<Footer />
		</>
	);
}

export default App;
