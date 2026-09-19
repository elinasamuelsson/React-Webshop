import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext.jsx";
import "./CurrencySelector.css";

export default function CurrencySelector() {
    const { currency, setCurrency } = useContext(CurrencyContext);

    return (
        <select
            className="currency-selector"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Välj valuta"
        >
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
        </select>
    );
}