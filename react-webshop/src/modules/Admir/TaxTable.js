export class TaxTable {
  #rates;

  constructor(customRates = {}) {
    const defaultRates = { standard: 25, groceries: 12, books: 6 };
    this.#rates = { ...defaultRates, ...customRates };
  }

  getRateFor(category) {
    if (typeof category !== "string" || category.trim() === "") {
      throw new Error("Category cannot be an empty string.");
    }
    const normalized = category.trim().toLowerCase();
    if (!(normalized in this.#rates)) {
      throw new Error(`Unknown category: "${category}"`);
    }
    return this.#rates[normalized];
  }

  listCategories() {
    return { ...this.#rates };
  }
}