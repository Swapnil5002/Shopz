import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage, { PRODUCT_STATUS } from "./pages/HomePage";
import { fetchProducts } from "./api/products";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState(PRODUCT_STATUS.LOADING);

  useEffect(() => {
    let active = true;

    setProductsStatus(PRODUCT_STATUS.LOADING);
    fetchProducts()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setProductsStatus(
          data.length === 0 ? PRODUCT_STATUS.EMPTY : PRODUCT_STATUS.IDLE,
        );
      })
      .catch(() => {
        setProductsStatus(PRODUCT_STATUS.ERROR);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <HomePage products={products} productsStatus={productsStatus} />
      </main>
      <Footer />
    </>
  );
}

export default App;
