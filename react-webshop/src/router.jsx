import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Homepage from "./pages/Homepage.jsx";
import Products from "./pages/Products.jsx";
import Admin from "./pages/Admin.jsx";
import Cart from "./pages/Cart.jsx";


// createBrowserRouter skapar routern för applikationen.
const router = createBrowserRouter([
    {
        // Huvud-routen för applikationen, som renderar App-komponenten.
        path: "/",

        element: <App />,


        children: [
            {   
                // Denna route renderar Homepage-komponenten när användaren navigerar till root-pathen "/".
                index: true,
                element: <Homepage />
            },
            {
                path: "/products",
                element: <Products />
            },
            {
                path: "/admin",
                element: <Admin />
            },
            {
                path: "/cart",
                element: <Cart />
            }
        ]
    },
]);

export default router;