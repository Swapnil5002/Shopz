import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import { useProducts } from "./hooks/useProducts";
import "./App.css";

function Home() {
  const { products, status } = useProducts();

  return <HomePage products={products} productsStatus={status} />;
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
