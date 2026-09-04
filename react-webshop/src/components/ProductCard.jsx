import { useEffect, useState } from "react";
import Product from "../api/Products.js";
import "./ProductCard.css";
import DiscountIcon from "./DiscountIcon.jsx";

export default function Products({ filter }) {

    const productsAPI = new Product();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    async function getProducts() {
        const { response, result } = await productsAPI.getAllProducts(page, filter);

        if (response.ok) {
            setProducts(result.data);
            setTotalPages(result.pages);
        } else {
            console.log("Something went wrong while fetching products!");
        }
    }

    useEffect(() => {
        getProducts(page);
    }, [page, filter]);

    const displayedProducts = filter ? products.filter(p => p.genre === filter) : products;
    console.log(displayedProducts.map(p => p.genre));

    return (
        <div class="card-container">
            {
                displayedProducts.map(p => {
                    return (
                        <div class="card" key={p.id} style={{display: "flex", flexDirection: "column"}}>

                            { p.isDiscount ? <DiscountIcon /> : null}

                            <img class="card-img" alt={`${p.title}`} src={`./public/productimages/${p.imgLink}`} />
                            <p class="card-genre">{p.genre.toUpperCase()}</p>
                            <h3 class="card-title">{p.title}</h3>
                            <p class="card-release">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar4-event" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                    <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                                {p.release}
                            </p>
                            <p class="card-description">{p.description}</p>
                            <p class="card-stock">{p.stock}</p>
                            <div>
                                <p class="card-price">${p.price}</p>
                                <button>ADD TO CART</button>
                            </div>
                        </div>
                    )
                })
            }

            {/* Knappar för att bläddra mellan sidorna */}
            <div style={{gridColumn: "span 3", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <button class="previous"
                    disabled={page <= 1}
                    onClick={() => setPage(prev => prev - 1)} // Functional state value
                >
                    Previous
                </button>
                <span class="page">Page {page} of {totalPages}</span>
                <button class="next"
                    disabled={page >= totalPages || displayedProducts.length < 9} 
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}