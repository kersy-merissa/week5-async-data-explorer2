export const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);

export function render(state, handlers) {
  const app = document.querySelector("#app");

  if (state.status === "loading") {
    app.innerHTML = `
      <div class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-pulse text-xl font-semibold text-blue-600">Loading products...</div>
      </div>
    `;
    return;
  }

  if (state.status === "error") {
    app.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-4" aria-live="polite">
        <p class="text-red-600 text-lg font-medium mb-4">Error: ${escapeHTML(state.error)}</p>
        <button id="retry-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Retry Request
        </button>
      </div>
    `;
    document.querySelector("#retry-btn").addEventListener("click", handlers.onRetry);
    return;
  }

  app.innerHTML = `
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <header class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-800">Kigali Data Explorer</h1>
        <p class="text-gray-500 mt-1">Async Data Fetching Practice Assignment</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search products..." 
          value="${escapeHTML(state.query)}"
          class="border border-gray-300 p-3 rounded-lg bg-white"
          aria-label="Search products"
        />
        
        <select id="filter-select" class="border border-gray-300 p-3 rounded-lg bg-white" aria-label="Filter by category">
          <option value="all">All Categories</option>
          ${state.categories.map(cat => `<option value="${cat}" ${state.filter === cat ? 'selected' : ''}>${cat}</option>`).join('')}
        </select>

        <select id="sort-select" class="border border-gray-300 p-3 rounded-lg bg-white" aria-label="Sort products">
          <option value="default">Default Sort</option>
          <option value="price-asc" ${state.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-desc" ${state.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
          <option value="name" ${state.sort === 'name' ? 'selected' : ''}>Name: A–Z</option>
        </select>
      </div>

      <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex justify-around text-gray-700 font-medium">
        <div>Total Shown: <span class="font-bold text-blue-700">${state.visibleCount}</span></div>
        <div>Average Price: <span class="font-bold text-blue-700">$${state.avgPrice}</span></div>
      </div>

      ${state.visibleItems.length === 0 ? `
        <div class="text-center py-16 text-gray-500 bg-white rounded-xl shadow-sm border" aria-live="polite">
          <p class="text-lg font-medium">No products found matching your search or filter.</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${state.visibleItems.map(({ id, title, price, thumbnail, category }) => `
            <button data-id="${id}" class="product-card border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition text-left flex flex-col justify-between">
              <div>
                <img src="${escapeHTML(thumbnail)}" alt="${escapeHTML(title)}" class="w-full h-40 object-cover rounded-lg mb-3 bg-gray-100" />
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">${escapeHTML(category)}</span>
                <h3 class="font-bold text-base mt-2 text-gray-800 line-clamp-1">${escapeHTML(title)}</h3>
              </div>
              <div class="mt-4 flex justify-between items-center w-full">
                <span class="text-green-600 font-bold text-lg">$${price}</span>
                <span class="text-blue-600 text-sm font-medium underline">Details</span>
              </div>
            </button>
          `).join('')}
        </div>
      `}
    </div>

    <dialog id="details-modal" class="p-6 rounded-2xl shadow-2xl max-w-lg w-full backdrop:bg-black/40">
      <div id="modal-content"></div>
      <button id="close-modal" class="mt-6 w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium">Close</button>
    </dialog>
  `;

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => handlers.onSelectProduct(card.dataset.id));
  });

  const modal = document.querySelector("#details-modal");
  document.querySelector("#close-modal")?.addEventListener("click", () => modal.close());

  if (state.selectedProduct) {
    document.querySelector("#modal-content").innerHTML = `
      <h2 class="text-2xl font-bold mb-2 text-gray-800">${escapeHTML(state.selectedProduct.title)}</h2>
      <p class="text-gray-600 mb-4">${escapeHTML(state.selectedProduct.description)}</p>
      <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <span class="font-bold text-xl text-green-600">$${state.selectedProduct.price}</span>
        <span class="text-sm font-semibold text-gray-500">Rating: ${state.selectedProduct.rating} / 5</span>
      </div>
    `;
    modal.showModal();
  }
}
