export default class Products {
	async getProductById(id) {
		try {
			const response = await fetch(`/api/products/${id}`);
			if (!response.ok) {
				console.log("No such resource.");
				return null;
			}
			const product = await response.json();
			return product;
		} catch (e) {
			console.error(`Fetch failed; ${e}`);
			return null;
		}
	}
}
