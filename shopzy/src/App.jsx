import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";

const CategoryPage = lazy(() => import("./pages/CategoryPage/CategoryPage"));
const ProductDetailPage = lazy(
  () => import("./pages/ProductDetailPage/ProductDetailPage"),
);
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage"));
const OrderDetailPage = lazy(
  () => import("./pages/OrderDetailPage/OrderDetailPage"),
);
const OrderHistoryPage = lazy(
  () => import("./pages/OrderHistoryPage/OrderHistoryPage"),
);

function PageFallback() {
  return (
    <p className="page-fallback" role="status">
      Loading page…
    </p>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route
            path="checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="orders"
            element={
              <RequireAuth>
                <OrderHistoryPage />
              </RequireAuth>
            }
          />
          <Route
            path="orders/:orderId"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="checkout/success"
            element={<Navigate to="/orders" replace />}
          />
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
    </Suspense>
  );
}

export default App;
