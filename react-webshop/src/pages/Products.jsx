import ProductCard from "../components/ProductCard.jsx";
import { useLocation } from "react-router";

function Products() {

  const location = useLocation();
  const filterName = location.state?.filterName; // Fångar filterName egenskap som ligger i state attribut i Link komponent

  return (
    <div>
      <ProductCard filter={filterName} />
    </div>
  );
}

export default Products;