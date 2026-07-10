import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage, { PRODUCT_STATUS } from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import { fetchProducts } from "./api/products";
import "./App.css";

function Home() {
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
        if (!active) return;
        setProductsStatus(PRODUCT_STATUS.ERROR);
      });

    return () => {
      active = false;
    };
  }, []);

  return <HomePage products={products} productsStatus={productsStatus} />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":category" element={<CategoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
