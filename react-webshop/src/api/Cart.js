export default class Cart {
  async getCart() {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        console.log("No such resource.");
        return [];
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error("Fetch failed", e);
      return [];
    }
  }

  async addToCart(productId, quantity) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        console.log("No such resource.");
        return null;
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error("Fetch failed", e);
      return null;
    }
  }

  async updateQuantity(cartItemId, quantity) {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        console.log("No such resource.");
        return null;
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error("Fetch failed", e);
      return null;
    }
  }

  async removeFromCart(cartItemId) {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.log("No such resource.");
        return false;
      }
      return true;
    } catch (e) {
      console.error("Fetch failed", e);
      return false;
    }
  }
}