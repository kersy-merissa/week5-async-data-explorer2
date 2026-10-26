# Kigali Data Explorer

- **Student Name:** Imanishimwe Kersy Merissa
- **API Used:** [DummyJSON Products API](https://dummyjson.com/products)
- **Live Deployed Link:** [View Live App](#)
- **Video Walkthrough Link:** [Watch Video Demonstration](#)

## Features Included
1. **Fetch on Load:** Automatically loads products using `async/await`.
2. **Reusable Helper:** `getJSON(url)` checks `response.ok`.
3. **UI States:** Loading, Error with Retry, Empty state, and Success.
4. **Search, Filter & Sort:** Live search, category filter, and sorting with `toSorted`.
5. **Details & Stats:** Interactive modal and average price computed with `reduce`.
6. **Parallel Requests:** Uses `Promise.all` to fetch categories and products together.

## How to Run Locally
1. `npm install`
2. `npm run dev`