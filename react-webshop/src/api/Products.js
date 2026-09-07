
export default class Product {

    async getAllProducts(page, genre = null) {
		let url = `/api/products?_page=${page}&_per_page=9`;
		if (genre) { // Om genre är null så gäller pagination som vanligt
			// EncodedURIComponent säger till servern att ignorera special karaktärer som "+-%&#/"
			// Annars blir det error när man hämtar "Sci-Fi" category och inget hämtas & renderas
			url += `&genre=${encodeURIComponent(genre)}`;
		}

        const response = await fetch(url);
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
