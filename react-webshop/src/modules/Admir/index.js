import { Money, CURRENCIES } from "./Money.js";
import { TaxTable } from "./TaxTable.js";
import { ExchangeRateClient } from "./ExchangeRateClient.js";

const TAX_CATEGORIES = ["standard", "groceries", "books"];

export default class PriceConverter {
  static descriptor = {
    name: "price-converter",
    description:
      "Convert prices between SEK, EUR and USD and count Swedish tax " +
      "(25% standard, 12% groceries, 6% books).",
    input: {
      amount: { type: "number", required: true },
      category: { type: "string", required: true },
      targetCurrency: { type: "string", required: false, default: "SEK" },
    },
  };

  #taxTable;
  #rateClient;
  #history = [];

  constructor() {
    this.#taxTable = new TaxTable();
    this.#rateClient = new ExchangeRateClient();
  }

  #validateInput(values) {
    if (values === null || values === undefined || typeof values !== "object") {
      throw new Error(
        'Invalid data: run() is expecting an object.'
      );
    }

    const { amount, category, targetCurrency } = values;

    if (amount === undefined) {
      throw new Error('Invalid data: "amount" is missing.');
    }
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      throw new Error(`Invalid data: "amount" needs to be a number.`);
    }
    if (amount < 0) {
      throw new Error(`Invalid data: "amount" cannot be negativ.`);
    }

    if (category === undefined) {
      throw new Error('Invalid data: "category" is missing.');
    }
    if (typeof category !== "string" || category.trim() === "") {
      throw new Error(`Invalid data: "category" cannot be an empty string.`);
    }
    if (!TAX_CATEGORIES.includes(category.trim().toLowerCase())) {
      throw new Error(
        `Invalid data: unknown category "${category}". Acceptable values are: ${TAX_CATEGORIES.join(", ")}.`
      );
    }

    if (targetCurrency !== undefined) {
      if (typeof targetCurrency !== "string") {
        throw new Error(
          `Invalid data: "targetCurrency" needs to be a string.`
        );
      }
      if (!CURRENCIES.includes(targetCurrency)) {
        throw new Error(
          `Invalid data: Unknown currency "${targetCurrency}". Acceptable values are: ${CURRENCIES.join(", ")}.`
        );
      }
    }
  }

  async run(values, context) {
    this.#validateInput(values);

    const { amount, category, targetCurrency = "SEK" } = values;

    const taxRate = this.#taxTable.getRateFor(category);
    const basePrice = new Money(amount, "SEK");
    const priceWithTax = basePrice.addTax(taxRate);

    let finalPrice = priceWithTax;
    if (targetCurrency !== "SEK") {
      const rate = await this.#rateClient.getRate("SEK", targetCurrency);
      finalPrice = priceWithTax.convert(targetCurrency, rate);
    }

    const output = {
      formatted: finalPrice.format(),
      amount: finalPrice.amount,
      currency: finalPrice.currency,
      taxRate,
    };

    this.#history.push({
      input: { amount, category, targetCurrency },
      output,
      at: new Date().toISOString(),
    });

    return output;
  }

  async getSupportedRates() {
    const rates = await this.#rateClient.getRates();
    return { ...rates };
  }

  getHistory() {
    return [...this.#history];
  }

  getCallCount() {
    return this.#history.length;
  }

  clearHistory() {
    this.#history = [];
  }
}