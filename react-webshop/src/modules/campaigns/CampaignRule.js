
export class CampaignRule {
    constructor(campaignData) {
        if (!campaignData || !campaignData.code) {
            throw new Error("Invalid campaign data.");
        }

        this.code = campaignData.code;
        this.type = campaignData.type;
        this.value = campaignData.value || campaignData.discountAmount || 0; // 'percentage' | 'threshold' | 'buyXgetY'
        this.minAmount = campaignData.minAmount || 0; // Procentvärde eller fast rabattsumma
        this.buyCount = campaignData.buyCount || 0; // T.ex 3 i "3 för 2"
        this.payCount = campaignData.payCount || 0; // T.ex 2 i "3 för 2"
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
            // Flat funktion adderar subarrayen till main array. Till exempel [1, 2, 3, [4, 5]] => [1, 2, 3, 4, 5]
            // Flatmap funktion är kombination av flat & map funktionen, det är mer effektivt att använda flatMap än att
            // använda flat och map funktionerna för sig
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