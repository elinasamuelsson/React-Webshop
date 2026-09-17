export const CURRENCIES = ["SEK", "EUR", "USD"];

export class Money {
  #amountInMinorUnits;
  #currency;

  constructor(amount, currency) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      throw new Error(`Money needs to be number.`);
    }
    if (!CURRENCIES.includes(currency)) {
      throw new Error(`Unknown currency: "${currency}"`);
    }
    this.#amountInMinorUnits = Math.round(amount * 100);
    this.#currency = currency;
  }

  get amount() {
    return this.#amountInMinorUnits / 100;
  }

  get currency() {
    return this.#currency;
  }

  add(other) {
    if (!(other instanceof Money)) {
      throw new Error("You can only add an other Money object.");
    }
    if (other.currency !== this.#currency) {
      throw new Error(
        `Cannot combine ${this.#currency} with ${other.currency}. Convert it first.`
      );
    }
    const sum = new Money(0, this.#currency);
    sum.#amountInMinorUnits = this.#amountInMinorUnits + other.#amountInMinorUnits;
    return sum;
  }

  addTax(taxPercent) {
    if (typeof taxPercent !== "number" || taxPercent < 0) {
      throw new Error(`Tax value needs to be positive value.`);
    }
    const factor = 1 + taxPercent / 100;
    const result = new Money(0, this.#currency);
    result.#amountInMinorUnits = Math.round(this.#amountInMinorUnits * factor);
    return result;
  }

  convert(targetCurrency, rate) {
    if (typeof rate !== "number" || rate <= 0) {
      throw new Error(`Currency needs to be positive value.`);
    }
    if (!CURRENCIES.includes(targetCurrency)) {
      throw new Error(`Unknown currency: "${targetCurrency}"`);
    }
    const converted = new Money(0, targetCurrency);
    converted.#amountInMinorUnits = Math.round(this.#amountInMinorUnits * rate);
    return converted;
  }

  format() {
    const value = this.amount.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const symbol = { SEK: "kr", EUR: "€", USD: "$" }[this.#currency];
    return `${value} ${symbol}`;
  }
}