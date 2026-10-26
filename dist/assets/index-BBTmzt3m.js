(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function l(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(o){if(o.ep)return;o.ep=!0;const t=l(o);fetch(o.href,t)}})();const p="https://dummyjson.com";async function g(e){const r=await fetch(e);if(!r.ok)throw new Error(`Request failed (${r.status})`);return r.json()}const b=e=>g(`${p}/products/${e}`),v=async()=>await Promise.all([g(`${p}/products/categories`),g(`${p}/products?limit=100`)]),d=e=>String(e).replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r]);function y(e,r){var o;const l=document.querySelector("#app");if(e.status==="loading"){l.innerHTML=`
      <div class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-pulse text-xl font-semibold text-blue-600">Loading products...</div>
      </div>
    `;return}if(e.status==="error"){l.innerHTML=`
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-4" aria-live="polite">
        <p class="text-red-600 text-lg font-medium mb-4">Error: ${d(e.error)}</p>
        <button id="retry-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Retry Request
        </button>
      </div>
    `,document.querySelector("#retry-btn").addEventListener("click",r.onRetry);return}l.innerHTML=`
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
          value="${d(e.query)}"
          class="border border-gray-300 p-3 rounded-lg bg-white"
          aria-label="Search products"
        />
        
        <select id="filter-select" class="border border-gray-300 p-3 rounded-lg bg-white" aria-label="Filter by category">
          <option value="all">All Categories</option>
          ${e.categories.map(t=>`<option value="${t}" ${e.filter===t?"selected":""}>${t}</option>`).join("")}
        </select>

        <select id="sort-select" class="border border-gray-300 p-3 rounded-lg bg-white" aria-label="Sort products">
          <option value="default">Default Sort</option>
          <option value="price-asc" ${e.sort==="price-asc"?"selected":""}>Price: Low to High</option>
          <option value="price-desc" ${e.sort==="price-desc"?"selected":""}>Price: High to Low</option>
          <option value="name" ${e.sort==="name"?"selected":""}>Name: A–Z</option>
        </select>
      </div>

      <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex justify-around text-gray-700 font-medium">
        <div>Total Shown: <span class="font-bold text-blue-700">${e.visibleCount}</span></div>
        <div>Average Price: <span class="font-bold text-blue-700">$${e.avgPrice}</span></div>
      </div>

      ${e.visibleItems.length===0?`
        <div class="text-center py-16 text-gray-500 bg-white rounded-xl shadow-sm border" aria-live="polite">
          <p class="text-lg font-medium">No products found matching your search or filter.</p>
        </div>
      `:`
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${e.visibleItems.map(({id:t,title:c,price:i,thumbnail:n,category:f})=>`
            <button data-id="${t}" class="product-card border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition text-left flex flex-col justify-between">
              <div>
                <img src="${d(n)}" alt="${d(c)}" class="w-full h-40 object-cover rounded-lg mb-3 bg-gray-100" />
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">${d(f)}</span>
                <h3 class="font-bold text-base mt-2 text-gray-800 line-clamp-1">${d(c)}</h3>
              </div>
              <div class="mt-4 flex justify-between items-center w-full">
                <span class="text-green-600 font-bold text-lg">$${i}</span>
                <span class="text-blue-600 text-sm font-medium underline">Details</span>
              </div>
            </button>
          `).join("")}
        </div>
      `}
    </div>

    <dialog id="details-modal" class="p-6 rounded-2xl shadow-2xl max-w-lg w-full backdrop:bg-black/40">
      <div id="modal-content"></div>
      <button id="close-modal" class="mt-6 w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium">Close</button>
    </dialog>
  `,document.querySelectorAll(".product-card").forEach(t=>{t.addEventListener("click",()=>r.onSelectProduct(t.dataset.id))});const a=document.querySelector("#details-modal");(o=document.querySelector("#close-modal"))==null||o.addEventListener("click",()=>a.close()),e.selectedProduct&&(document.querySelector("#modal-content").innerHTML=`
      <h2 class="text-2xl font-bold mb-2 text-gray-800">${d(e.selectedProduct.title)}</h2>
      <p class="text-gray-600 mb-4">${d(e.selectedProduct.description)}</p>
      <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <span class="font-bold text-xl text-green-600">$${e.selectedProduct.price}</span>
        <span class="text-sm font-semibold text-gray-500">Rating: ${e.selectedProduct.rating} / 5</span>
      </div>
    `,a.showModal())}JavaScript;const s={items:[],categories:[],status:"loading",error:null,query:"",filter:"all",sort:"default",visibleItems:[],visibleCount:0,avgPrice:"0.00",selectedProduct:null};function x({items:e,query:r,filter:l,sort:a}){const o=r.trim().toLowerCase(),t=e.filter(({title:i})=>i.toLowerCase().includes(o)).filter(({category:i})=>l==="all"||i===l),c={"price-asc":(i,n)=>i.price-n.price,"price-desc":(i,n)=>n.price-i.price,name:(i,n)=>i.title.localeCompare(n.title)};return c[a]?t.toSorted(c[a]):t}function h(){if(s.visibleItems=x(s),s.visibleCount=s.visibleItems.length,s.visibleCount>0){const e=s.visibleItems.reduce((r,l)=>r+l.price,0);s.avgPrice=(e/s.visibleCount).toFixed(2)}else s.avgPrice="0.00"}function u(){h(),y(s,{onRetry:m,onSelectProduct:async e=>{try{s.selectedProduct=await b(e),u()}catch(r){console.error("Failed to load details",r)}}})}async function m(){s.status="loading",u();try{const[e,r]=await v();s.categories=e,s.items=r.products,s.status="success"}catch(e){s.status="error",s.error=e.message}u()}document.addEventListener("input",e=>{e.target.id==="search-input"&&(s.query=e.target.value,u())});document.addEventListener("change",e=>{e.target.id==="filter-select"&&(s.filter=e.target.value,u()),e.target.id==="sort-select"&&(s.sort=e.target.value,u())});m();
