import { CampaignRule } from "./CampaignRule.js";
import { PriceCalculator } from "./PriceCalculator.js";

export default class CampaignEngineModule {

    static descriptor = {
        moduleName: "CampaignEngine", 
        description: "Calculates discount based on promo code", 
        fields: [
            {
                name: "code", 
                label: "PromoCode", 
                type: "text", 
                required: true
            }
        ]
    };

    constructor() {
        this.campaignCache = null;
        this.lastFetched = null;
    }

    async fetchCampaigns() {
        const CACHE_TTL_MS = 5 * 60 * 1000;
        const now = Date.now();

        if (this.campaignCache && this.lastFetched && now - this.lastFetched < CACHE_TTL_MS) {
            return this.campaignCache;
        }

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
        const code = values?.code?.trim();
        const cartItems = context?.cartItems || [];

        if (!code) {
            throw new Error("Enter promo code");
        }

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        const campaigns = await this.fetchCampaigns();
        const rawCampaign = campaigns.find(
            (c) => c.code === code
        );

        console.log(cartItems);

        if (!rawCampaign) {
            throw new Error("Invalid discount code.");
        }

        const rule = new CampaignRule(rawCampaign);
        const calculator = new PriceCalculator(cartItems);

        return calculator.applyCampaign(rule);
    }
}