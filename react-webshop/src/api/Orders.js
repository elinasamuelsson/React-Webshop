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
				throw new Error("Network error while creating your order!");
			}

			const result = await response.json();
			return {response, result};
		} catch (e) {
			throw new Error("Your order has NOT been created!");
		}
	}
}
