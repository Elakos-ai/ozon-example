let cart = [];
let allProducts = []; // сохраняем все товары для фильтрации

async function loadProducts() {
  const res = await fetch("../js/ozon.json");
  const products = await res.json();
  allProducts = products; // сохраняем все товары
  renderProducts(products);
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `product-${p.id}`;

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p><b>${p.price}₽</b></p>
      <div>
        <button class="detail">Detail</button>
        <button class="cart">Add to Cart</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Detail
    card.querySelector(".detail").addEventListener("click", () => {
      showModal(p);
    });

    // Add to Cart
    card.querySelector(".cart").addEventListener("click", () => {
      if (!cart.includes(p)) {
        cart.push(p);
        card.classList.add("in-cart");
        updateCart();
      }
    });

    // Delete
    card.querySelector(".delete").addEventListener("click", () => {
      card.remove();
      cart = cart.filter(item => item.id !== p.id);
      updateCart();
    });

    container.appendChild(card);
  });
}

// Фильтр по категории
document.getElementById("category-filter").addEventListener("change", (e) => {
  const value = e.target.value;
  if (value === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === value);
    renderProducts(filtered);
  }
});

function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} - ${item.price}₽`;
    cartList.appendChild(li);
  });
}

// Модальное окно Detail
function showModal(product) {
  const modal = document.getElementById("modal");
  document.getElementById("modal-title").textContent = product.title;
  document.getElementById("modal-img").src = product.image;
  document.getElementById("modal-price").textContent = `Price: ${product.price}₽`;
  document.getElementById("modal-category").textContent = `Category: ${product.category}`;
  document.getElementById("modal-description").textContent = product.description || "No description available.";
  modal.style.display = "flex";

  document.getElementById("modal-close").onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
}

// Показ/скрытие корзины
document.querySelector(".cart").addEventListener("click", () => {
  const cartBox = document.getElementById("cart-list");
  cartBox.style.display = cartBox.style.display === "block" ? "none" : "block";
});

loadProducts();
