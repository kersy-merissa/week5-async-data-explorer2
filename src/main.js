JavaScript
import { getProducts, getProduct, getCategoriesAndProducts } from "./api.js";
import { render } from "./render.js";

const state = {
  items: [],
  categories: [],
  status: "loading",
  error: null,
  query: "",
  filter: "all",
  sort: "default",
  visibleItems: [],
  visibleCount: 0,
  avgPrice: "0.00",
  selectedProduct: null
};

export function getVisibleItems({ items, query, filter, sort }) {
  const q = query.trim().toLowerCase();
  const filtered = items
    .filter(({ title }) => title.toLowerCase().includes(q))
    .filter(({ category }) => filter === "all" || category === filter);

  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "name": (a, b) => a.title.localeCompare(b.title),
  };

  return sorters[sort] ? filtered.toSorted(sorters[sort]) : filtered;
}

function updateComputedState() {
  state.visibleItems = getVisibleItems(state);
  state.visibleCount = state.visibleItems.length;

  if (state.visibleCount > 0) {
    const totalPrice = state.visibleItems.reduce((sum, item) => sum + item.price, 0);
    state.avgPrice = (totalPrice / state.visibleCount).toFixed(2);
  } else {
    state.avgPrice = "0.00";
  }
}

function updateUI() {
  updateComputedState();
  render(state, {
    onRetry: loadData,
    onSelectProduct: async (id) => {
      try {
        state.selectedProduct = await getProduct(id);
        updateUI();
      } catch (err) {
        console.error("Failed to load details", err);
      }
    }
  });
}

async function loadData() {
  state.status = "loading";
  updateUI();
  try {
    const [categoriesData, productsData] = await getCategoriesAndProducts();
    state.categories = categoriesData;
    state.items = productsData.products;
    state.status = "success";
  } catch (err) {
    state.status = "error";
    state.error = err.message;
  }
  updateUI();
}

document.addEventListener("input", (e) => {
  if (e.target.id === "search-input") {
    state.query = e.target.value;
    updateUI();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "filter-select") {
    state.filter = e.target.value;
    updateUI();
  }
  if (e.target.id === "sort-select") {
    state.sort = e.target.value;
    updateUI();
  }
});

loadData();