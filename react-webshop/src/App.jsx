import { useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}

export default App;