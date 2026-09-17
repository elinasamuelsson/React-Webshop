import { useState, useEffect } from "react";
import PriceConverter from "../modules/Admir/index.js";

const priceConverter = new PriceConverter();

export function priceWithTax(amount, category = "standard", targetCurrency = "SEK") {
  const [priceInfo, setPriceInfo] = useState(null);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    if (amount === undefined || amount === null) {
      setPriceInfo(null);
      return;
    }

    let cancelled = false;

    async function calculatePrice() {
      try {
        const result = await priceConverter.run({ amount, category, targetCurrency });
        if (!cancelled) {
          setPriceInfo(result);
          setPriceError(null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setPriceError("Could not calculate price.");
          setPriceInfo(null);
        }
      }
    }

    calculatePrice();
    return () => {
      cancelled = true;
    };
  }, [amount, category, targetCurrency]);

  return { priceInfo, priceError };
}