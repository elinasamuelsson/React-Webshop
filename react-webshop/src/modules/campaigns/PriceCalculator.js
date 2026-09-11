
export class PriceCalculator {
    constructor(cartItems) {
        if (!Array.isArray(cartItems)) {
            throw new Error("Cart must be a list.");
        }
        this.cartItems = cartItems;
    }

    getOriginalTotal() {
        return this.cartItems.reduce(
            (sum, item) => sum + item.product.price * item.productQuantity, 0
        );
    }

    applyCampaign(campaignRule) {
        const originalTotal = this.getOriginalTotal();

        if (originalTotal === 0) {
            throw new Error("Cart is empty.");
        }

        const discountAmount = campaignRule.calculateDiscount(originalTotal, this.cartItems);
        const finalTotal = Math.max(0, originalTotal - discountAmount);

        return {
            code: campaignRule.code,
            originalTotal: Math.round(originalTotal),
            discountAmount: Math.round(discountAmount),
            finalTotal: Math.round(finalTotal),
            message: `Discount code '${campaignRule.code}' applied!`
        };
    }
}