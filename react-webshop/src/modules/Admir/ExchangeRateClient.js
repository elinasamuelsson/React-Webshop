const DEFAULT_CACHE = 5 * 60 * 1000; // 5 minutes

export class ExchangeRateClient {
  #cache = null;
  #defaultCache;
  #endpoint;

  constructor({ endpoint = "/api/rates", defaultCache = DEFAULT_CACHE } = {}) {
    this.#endpoint = endpoint;
    this.#defaultCache = defaultCache;
  }

  #isCacheFresh() {
    return this.#cache !== null && Date.now() - this.#cache.fetchedAt < this.#defaultCache;
  }

  async getRates() {
    if (this.#isCacheFresh()) {
      return this.#cache.rates;
    }
    const response = await fetch(this.#endpoint);
    if (!response.ok) {
      throw new Error(`Could not load currency rates (${response.status})`);
    }
    const rates = await response.json();
    this.#cache = { rates, fetchedAt: Date.now() };
    return rates;
  }

  async getRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;
    const rates = await this.getRates();
    return rates[toCurrency] / rates[fromCurrency];
  }

  invalidateCache() {
    this.#cache = null;
  }
}