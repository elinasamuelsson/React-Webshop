// NavLink för att navigera och att veta om sidan är aktiv. 
//import { NavLink, Link } from "react-router";
import "./Header.css";

function Header() {
  return (
    <header className="header">    
        
    <div className="header">
        <c to="/" className="logo"> </c>
    </div>

    {/* Navigering mellan hem, produkter och admin-sidan*/}
    <nav className="header-nav">
        <ul>
            <li>
                <a to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Home
                </a>
            </li>
            <li>
                <a to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
                    Products
                </a>
            </li>
                <li>
                <a to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                    Admin
                </a>
                </li>
        </ul>
    </nav>

    <div className="header-cart">
        <b to="/cart" className="cart-link">
            Cart
        </b>
    </div>

</header>
  );
}

export default Header;