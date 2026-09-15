import { CampaignRule } from "./CampaignRule.js";
import { PriceCalculator } from "./PriceCalculator.js";

export default class CampaignEngineModule {

    static descriptor = {
        moduleName: "CampaignEngine", 
        description: "Calculates discount based on promo code"
    };

    constructor() {
        this.campaignCache = null;
        this.lastFetched = null;
    }

    async fetchCampaigns() {
        const CACHE_TTL_MS = 5 * 60 * 1000; // Det här blir 5 minuter eller 300 000 tusen millisekunder
        const now = Date.now();

        // Kollar så att campaignCache och lastFetched är inte null OCH
        // now - den sista fetchen är inte större än 5 minuter (300 000 ms)
        //
        // Helt enkelt, om datan finns och datan har inte varit i cache över 5 minuter
        // Så behöver vi inte göra en request
        if (this.campaignCache && this.lastFetched && now - this.lastFetched < CACHE_TTL_MS) {
            return this.campaignCache;
        }

        // Om datan finns inte, då hämtar vi datan och spara den i cache
        try {
            const response = await fetch("/api/campaigns");
            if (!response.ok) {
                throw new Error("Couldn't get campaigns from the server");
            }
            this.campaignCache = await response.json();
            this.lastFetched = now;
            return this.campaignCache;
        } catch (error) {
            throw new Error(`Network error while getting campaigns: ${error.message}`);
        }
    }

    async run(values, context = {}) {
        // trim metod tar bort whitespaces från båda sidor t.ex "    HELLO WORLD    " => "HELLO WORLD"
        const code = values?.code?.trim();
        const cartItems = context?.cartItems || [];

        if (!code) {
            throw new Error("Enter promo code");
        }

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        const campaigns = await this.fetchCampaigns();
        // Hittar en specifik json object från campaigns beroende på kampanjkoden
        const rawCampaign = campaigns.find(
            (c) => c.code === code
        );

        if (!rawCampaign) {
            throw new Error("Invalid discount code.");
        }

        const rule = new CampaignRule(rawCampaign);
        const calculator = new PriceCalculator(cartItems);

        return calculator.applyCampaign(rule);
    }
}