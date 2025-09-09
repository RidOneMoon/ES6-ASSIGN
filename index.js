const categoriesEl = document.getElementById("categories");
const plantsEl = document.getElementById("plants");
const cartListEl = document.getElementById("cartList");
const cartTotalEl = document.getElementById("cartTotal");

//cart store
let cart = [];

// Load Categories
async function loadCategories() {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  categoriesEl.innerHTML = `
    <li><button onclick="loadPlants()" class="w-full text-left px-3 py-2 rounded bg-green-700 text-white font-medium">All Trees</button></li>
  `;
  data.categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="loadCategory(${cat.id}, this)" class="w-full text-left px-3 py-2 rounded hover:bg-green-100">${cat.category_name}</button>
    `;
    categoriesEl.appendChild(li);
  });
}

// Load All Plants
async function loadPlants() {
  plantsEl.innerHTML = `<span class="loading loading-spinner text-success mx-auto"></span>`;
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants);
}

// Load Plants by Category
async function loadCategory(id, btn) {
  [...categoriesEl.querySelectorAll("button")].forEach(b => b.classList.remove("bg-green-700", "text-white"));
  btn.classList.add("bg-green-700", "text-white");

  plantsEl.innerHTML = `<span class="loading loading-spinner text-success mx-auto"></span>`;
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  if (data.plants) {
    displayPlants(data.plants);
  } else {
    plantsEl.innerHTML = `<p class="text-center text-gray-500 col-span-3">No plants found in this category</p>`;
  }
}

// Display Plants
function displayPlants(plants) {
  plantsEl.innerHTML = "";
  plants.forEach(plant => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow flex flex-col";
    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="h-40 w-full object-cover rounded mb-4">
      <h3 class="font-semibold cursor-pointer" onclick="showPlantDetail(${plant.id})">${plant.name}</h3>
      <p class="text-sm text-gray-600 line-clamp-3">${plant.description}</p>
      <div class="flex justify-between items-center mt-3">
        <span class="text-xs bg-green-100 text-[#15803d] px-2 py-1 rounded-full font-bold">${plant.category}</span>
        <span class="font-semibold"><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plant.price}</span>
      </div>
      <button onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price})" 
              class="mt-3 bg-green-700 text-white py-2 rounded-full hover:bg-green-800">
        Add to Cart
      </button>
    `;
    plantsEl.appendChild(card);
  });
}

// Show Plant Detail in Modal
async function showPlantDetail(id) {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plants;

    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
      <h2 class="text-2xl font-bold mb-3">${plant.name}</h2>
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover rounded mb-4">
      <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
      <p class="mb-2"><strong>Price:</strong> <i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plant.price}</p>
      <p class="text-gray-700"><strong>Description:</strong> ${plant.description}</p>
    `;

    // Open the modal
    document.getElementById("plantModal").checked = true;
  } catch (err) {
    console.error("Error loading plant details:", err);
  }
}

// Cart Functions
function addToCart(id, name, price) {
  alert(`${name} added to cart!`);

  // Check if item already exists
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1; // increase quantity
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  cartListEl.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-green-50 p-3 rounded";
    li.innerHTML = `
      <span>
    <span class="font-bold">${item.name}</span><br>
    <span class="text-sm text-gray-500">
      <i class="fa-solid fa-bangladeshi-taka-sign"></i> ${item.price} x ${item.quantity}
    </span>
  </span>
  <button onclick="removeFromCart(${item.id})" class="text-gray-500 hover:text-red-600 text-lg">✕</button>
`;
    cartListEl.appendChild(li);
  });
  cartTotalEl.innerHTML = `<i class="fa-solid fa-bangladeshi-taka-sign"></i>${total}`;
}

// Init
loadCategories();
loadPlants();
