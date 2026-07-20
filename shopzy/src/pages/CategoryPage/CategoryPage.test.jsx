import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CategoryPage from "./CategoryPage";
import productsReducer from "../../store/productsSlice";
import wishlistReducer from "../../store/wishlistSlice";
import { fetchProducts } from "../../api/products";

vi.mock("../../api/products", () => ({
  fetchProducts: vi.fn(),
}));

function renderCategoryPage(category = "women") {
  const store = configureStore({
    reducer: { products: productsReducer, wishlist: wishlistReducer },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/${category}`]}>
        <Routes>
          <Route path=":category" element={<CategoryPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

const sampleProducts = [
  {
    id: 1,
    name: "Silk Wrap Dress",
    category: "Women",
    price: 89,
    rating: 4.8,
    reviews: 124,
    bg: "linear-gradient(160deg, #fff 0%, #eee 100%)",
  },
  {
    id: 2,
    name: "Linen Blazer",
    category: "Women",
    price: 74,
    rating: 4.6,
    reviews: 89,
    bg: "linear-gradient(160deg, #fff 0%, #eee 100%)",
  },
];

describe("CategoryPage", () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the category hero for a known category", async () => {
    vi.mocked(fetchProducts).mockResolvedValue(sampleProducts);
    renderCategoryPage("women");

    expect(screen.getByText("Shop the collection")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Women" })).toBeInTheDocument();
    expect(
      screen.getByText("Dresses, tops & everyday essentials"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "← Back to home" }),
    ).toHaveAttribute("href", "/");
    await screen.findByRole("heading", { name: "Silk Wrap Dress" });
  });

  it("fetches products for the resolved category label", async () => {
    vi.mocked(fetchProducts).mockResolvedValue(sampleProducts);
    renderCategoryPage("men");

    await screen.findByRole("heading", { name: "Men" });
    expect(fetchProducts).toHaveBeenCalledWith("Men");
  });

  it("shows the loading state before products resolve", async () => {
    vi.mocked(fetchProducts).mockReturnValue(new Promise(() => {}));
    renderCategoryPage("women");

    expect(
      await screen.findByText(/loading women products/i),
    ).toBeInTheDocument();
  });

  it("renders the product grid once products load", async () => {
    vi.mocked(fetchProducts).mockResolvedValue(sampleProducts);
    renderCategoryPage("women");

    expect(
      await screen.findByRole("heading", { name: "Silk Wrap Dress" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Linen Blazer" }),
    ).toBeInTheDocument();
  });

  it("shows the empty state when no products are returned", async () => {
    vi.mocked(fetchProducts).mockResolvedValue([]);
    renderCategoryPage("women");

    expect(
      await screen.findByText(/no women products found/i),
    ).toBeInTheDocument();
  });

  it("shows the error state when the request fails", async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error("Network error"));
    renderCategoryPage("women");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong while loading products/i,
    );
  });

  it("falls back to a generic title and tagline for an unknown category", async () => {
    vi.mocked(fetchProducts).mockResolvedValue([]);
    renderCategoryPage("sneakers");

    expect(
      screen.getByRole("heading", { name: "Sneakers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Browse our latest picks in this category."),
    ).toBeInTheDocument();
    await screen.findByText(/no sneakers products found/i);
  });
});
