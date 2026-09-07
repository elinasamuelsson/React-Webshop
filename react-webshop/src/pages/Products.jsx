import ProductCard from "../components/ProductCard.jsx";
import { useLocation } from "react-router";

function Products() {

  const location = useLocation();
  
  // Fångar filterName egenskap som ligger i state attribut i Link komponent
  const filterName = location.state?.filterName;

  return (
    <div>
      <ProductCard filter={filterName} />
    </div>
  );
}

export default Products;