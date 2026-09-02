
export default class Product {

    async getAllProducts(page) {
        const response = await fetch(`/api/products?_page=${page}`);
        const result = await response.json();

        return {response, result};
    }
}