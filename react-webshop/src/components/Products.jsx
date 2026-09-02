import { useEffect, useState } from "react";
import Product from "../api/Products.js";

export default function Products() {

    const productsAPI = new Product();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function getProducts() {
        const { response, result } = await productsAPI.getAllProducts(page);

        if (response.ok) {
            setProducts(result.data);
            setTotalPages(result.pages);
        } else {
            console.log("Something went wrong while fetching products!");
        }
    }

    useEffect(() => {
        getProducts(page);
    }, [page]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "0px"}}>
            {
                products.map(p => {
                    return <div key={p.id} style={{display: "flex", flexDirection: "column"}}>
                        <h3>{p.name}</h3>
                        <p>{p.price}</p>
                        <p>{p.stock}</p>
                    </div>
                })
            }

            <button
                disabled={page <= 1} 
                onClick={() => setPage(prev => prev - 1)}
            >
                Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
                disabled={page >= totalPages} 
                onClick={() => setPage(prev => prev + 1)}
            >
                    Next
            </button>
        </div>
    )
}