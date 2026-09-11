
export class CampaignRule {
    constructor(campaignData) {
        if (!campaignData || !campaignData.code) {
            throw new Error("Invalid campaign data.");
        }

        this.code = campaignData.code;
        this.type = campaignData.type;
        this.value = campaignData.value || 0;
        this.minAmount = campaignData.minAmount || 0;
        this.buyCount = campaignData.buyCount || 0;
        this.payCount = campaignData.payCount || 0;
    }

    calculateDiscount(originalTotal, cartItems = []) {
        if (this.type === "percentage") {
            return (this.value / 100) * originalTotal;
        }

        if (this.type === "threshold") {
            if (originalTotal < this.minAmount) {
                throw new Error(
                    `${this.code} requires at least ${this.minAmount} kr to apply the discount.`
                );
            }
            return this.value;
        }

        if (this.type === "buyXgetY") {
            const itemPrices = cartItems.flatMap(item => 
                Array(item.productQuantity).fill(item.product.price)
            );

            if (itemPrices.length < this.buyCount) {
                throw new Error(
                    `Code '${this.code}' requires you to have at least ${this.buyCount} products in the cart.`
                );
            }

            itemPrices.sort((a, b) => a - b);

            const freeItemsCount = this.buyCount - this.payCount;

            const discount = itemPrices
                .slice(0, freeItemsCount)
                .reduce((sum, price) => sum + price, 0);
            
            return discount;
        }

        throw new Error(`Unknown campaign type: ${this.type}`);
    }
}