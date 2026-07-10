export async function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`/api/products${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
}
