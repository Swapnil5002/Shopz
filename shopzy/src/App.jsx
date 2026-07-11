import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import { useProducts } from "./hooks/useProducts";
import { addToCart } from "./store/cartSlice";
import "./App.css";

function Home() {
  const { products, status } = useProducts();
  const dispatch = useDispatch();

  return (
    <HomePage
      products={products}
      productsStatus={status}
      onAddToCart={(product) => dispatch(addToCart(product))}
    />
  );
}

function RequireAuth({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path=":category" element={<CategoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
