
export default class Product {

    async getAllProducts(page) {
        const response = await fetch(`/api/products?_page=${page}&_per_page=9`);
        const result = await response.json();

        return {response, result};
    }
}