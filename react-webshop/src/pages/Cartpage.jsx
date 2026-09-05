import "./Cartpage.css";
import { useEffect, useState } from "react";
import CartApi from "../api/Cart.js";
import Products from "../api/Products.js";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        const cartApi = new CartApi();
        const productsApi = new Products();

        const [cart, productResponse] = await Promise.all([
          cartApi.getCart(),
          productsApi.getAllProducts(),
        ]);

        setItems(cart);
        setProducts(productResponse.result);
      } catch (err) {
        console.error(err);
        setError("Cart could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const cartItems = items
    .map((item) => {
      const product = products.find(
        (productItem) => productItem.id === item.productId
      );

      return {
        ...item,
        product,
      };
    })
    .filter((item) => item.product);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function changeQuantity(item, amount) {
    const newQuantity = item.quantity + amount;
    const cartApi = new CartApi();

    if (newQuantity <= 0) {
      await removeItem(item.id);
      return;
    }

    await cartApi.updateQuantity(item.id, newQuantity);

    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, quantity: newQuantity }
          : currentItem
      )
    );
  }

  async function removeItem(cartItemId) {
    const cartApi = new CartApi();

    await cartApi.removeFromCart(cartItemId);

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== cartItemId)
    );
  }

  if (loading) {
    return <main className="cart-page">Loading cart...</main>;
  }

  if (error) {
    return <main className="cart-page">{error}</main>;
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p>{totalQuantity} item(s)</p>

          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-row" key={item.id}>
                <img
                  src={`/productImages/${item.product.imgLink}`}
                  alt={item.product.title}
                />

                <div>
                  <h2>{item.product.title}</h2>
                  <p>
                    {item.product.genre} · {item.product.release}
                  </p>
                  <p>{item.product.price} kr per item</p>
                </div>

                <div className="cart-quantity">
                  <button onClick={() => changeQuantity(item, -1)}>
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => changeQuantity(item, 1)}>
                    +
                  </button>
                </div>

                <strong>
                  {item.product.price * item.quantity} kr
                </strong>

                <button onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <div className="cart-total">
            <strong>Total: {totalPrice} kr</strong>
          </div>
        </>
      )}
    </main>
  );
}