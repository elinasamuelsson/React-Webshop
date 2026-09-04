
export default class Product {

    async getAllProducts(page) {
        const response = await fetch(`/api/products?_page=${page}&_per_page=9`);
        const result = await response.json();

        return {response, result};
    }

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
