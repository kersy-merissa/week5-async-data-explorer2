const BASE = "https://dummyjson.com";

export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

export const getProducts = () => getJSON(`${BASE}/products?limit=100`);
export const getProduct = (id) => getJSON(`${BASE}/products/${id}`);

export const getCategoriesAndProducts = async () => {
  return await Promise.all([
    getJSON(`${BASE}/products/categories`),
    getJSON(`${BASE}/products?limit=100`)
  ]);
}; 