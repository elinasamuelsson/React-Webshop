import "./Toast.css";
import {useEffect} from "react";

export default function Toast({message, onHide}) {
	useEffect(() => {
		const timer = setTimeout(onHide, 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<div className="toastContainer">
				<p className="toastMessage">{message}</p>
			</div>
		</>
	);
}
