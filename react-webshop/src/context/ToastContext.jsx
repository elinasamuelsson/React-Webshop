import {createContext, useReducer} from "react";
import Toast from "../components/Toast";

export const ToastContext = createContext();

function toastReducer(toast, action) {
	const {type, payload} = action;

	switch (type) {
		case "SHOW":
			return {message: payload, isVisible: true};
		case "HIDE":
			return {message: null, isVisible: false};
		default:
			return toast;
	}
}

export function ToastProvider({children}) {
	const [toast, dispatch] = useReducer(toastReducer, []);
	return (
		<ToastContext.Provider value={{toast, dispatch}}>
			{children}
			{toast.isVisible && <Toast message={toast.message} onHide={() => dispatch({type: "HIDE"})} />}
		</ToastContext.Provider>
	);
}
