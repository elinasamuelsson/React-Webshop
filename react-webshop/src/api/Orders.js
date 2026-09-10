export default class Orders {

    async createOrder(orderData) {

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                console.log("Failed to create order.");
                return null;
            }

            const result = await response.json();
            return {response, result};
        } catch (e) {
            console.error("Fetch failed: €{e}");
            return {response: null, result: null}
        }
    }
}