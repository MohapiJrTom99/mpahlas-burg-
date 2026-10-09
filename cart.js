// ===== Mpahlas-Burg cart + WhatsApp checkout =====
// Add before </body>:  <script src="cart.js"></script>

// 1) CHANGE THIS to your WhatsApp number: country code, no + and no leading 0
//    e.g. 082 123 4567  ->  "27821234567"
const WHATSAPP_NUMBER = "27633629179";

const SIZES = ["S", "M", "L", "XL", "XXL"];
// Colours shown on every product. To change them for ONE product, add
// data-colors="Blue,Black" to that product-card in index.html
const COLORS = ["Blue", "White", "Black", "Pink", "Brown", "Red"];
// The circle colour for each name (add more if you add new colours)
const COLOR_HEX = { Blue: "#1b2cc1", White: "#ffffff", Black: "#111111", Pink: "#f48fb1", Brown: "#6e5a55", Red: "#e10613" };
const CART_KEY = "mpahlas_cart";
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

const money = n => {
    n = Number(n) || 0;
    return "R" + (Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2));
};
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} };

// ---- Build the cart drawer (no extra HTML needed) ----
document.body.insertAdjacentHTML("beforeend", `
  <div class="cart-overlay" id="cart-overlay"></div>
  <aside class="cart-drawer" id="cart-drawer" aria-label="Shopping cart">
    <div class="cart-head">
      <h3>Your Cart</h3>
      <button class="cart-close" id="cart-close" aria-label="Close cart">&times;</button>
    </div>
    <div class="cart-items" id="cart-items"></div>
    <div class="cart-total"><span>Total</span><span id="cart-total">R0</span></div>
    <input class="cart-field" id="cust-name" placeholder="Your name">
    <input class="cart-field" id="cust-area" placeholder="Delivery area / address">
    <button class="checkout-btn" id="checkout-btn">ORDER VIA WHATSAPP</button>
  </aside>
  <div class="toast" id="toast">Added to cart</div>
`);

const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");
const itemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const countEl = document.getElementById("cart-count");
const toastEl = document.getElementById("toast");

function openCart() { drawer.classList.add("open"); overlay.classList.add("open"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("open"); }

function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 1500);
}

function render() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    if (countEl) countEl.textContent = count;
    totalEl.textContent = money(total);
    document.getElementById("checkout-btn").disabled = cart.length === 0;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        return;
    }
    itemsEl.innerHTML = cart.map((i, idx) => `
        <div class="cart-row">
            <div class="meta">${i.name}<br><small>${i.color ? i.color + " · " : ""}Size ${i.size} · ${money(i.price)}</small></div>
            <div class="qty">
                <button data-act="minus" data-i="${idx}">−</button>
                <span>${i.qty}</span>
                <button data-act="plus" data-i="${idx}">+</button>
            </div>
        </div>`).join("");
}

function mbAddToCart(name, price, size, color) {
    const existing = cart.find(i => i.name === name && i.size === size && i.color === color);
    if (existing) existing.qty++;
    else cart.push({ name, price: Number(price), size, color, qty: 1 });
    saveCart(); render(); toast("Added to cart");
}

// ---- Hook up every product card (works with your existing cards) ----
document.querySelectorAll(".product-card").forEach(card => {
    const btn = card.querySelector("button");
    if (!btn) return;

    // Remove the old onclick="addToCart(...)" so it can't clash
    btn.removeAttribute("onclick");

    // Add a size dropdown if the card doesn't have one
    let select = card.querySelector(".size-select");
    if (!select) {
        select = document.createElement("select");
        select.className = "size-select";
        select.innerHTML = SIZES.map(s => `<option>${s}</option>`).join("");
        const bottom = card.querySelector(".product-bottom");
        if (bottom && bottom.parentNode) bottom.parentNode.insertBefore(select, bottom);
        else btn.parentNode.insertBefore(select, btn);
    }

    // Add colour circles (before the size dropdown)
    const list = card.dataset.colors
        ? card.dataset.colors.split(",").map(c => c.trim()).filter(Boolean)
        : COLORS;
    let selectedColor = list[0];

    const swatchWrap = document.createElement("div");
    swatchWrap.className = "color-swatches";
    swatchWrap.innerHTML =
        `<span class="color-label">Colour: <b>${selectedColor}</b></span>` +
        `<div class="swatch-row">` +
        list.map((c, idx) =>
            `<button type="button" class="swatch${idx === 0 ? " active" : ""}" ` +
            `data-color="${c}" aria-label="${c}" ` +
            `style="background:${COLOR_HEX[c] || c.toLowerCase()}"></button>`
        ).join("") + `</div>`;
    select.parentNode.insertBefore(swatchWrap, select);

    swatchWrap.addEventListener("click", e => {
        const s = e.target.closest(".swatch");
        if (!s) return;
        selectedColor = s.dataset.color;
        swatchWrap.querySelectorAll(".swatch").forEach(x => x.classList.toggle("active", x === s));
        swatchWrap.querySelector(".color-label b").textContent = selectedColor;
    });

    btn.addEventListener("click", () => {
        // Name: data-name, else the product title
        const titleEl = card.querySelector("h3");
        const name = card.dataset.name || (titleEl ? titleEl.textContent.trim() : "Product");
        // Price: data-price, else read it from the <strong> (e.g. "R849.99")
        let price = card.dataset.price;
        if (!price) {
            const priceEl = card.querySelector("strong, .price");
            price = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, "") : 0;
        }
        mbAddToCart(name, price, select.value, selectedColor);
    });
});

itemsEl.addEventListener("click", e => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const i = Number(b.dataset.i);
    if (b.dataset.act === "plus") cart[i].qty++;
    else { cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); }
    saveCart(); render();
});

const cartIcon = document.querySelector(".cart");
if (cartIcon) cartIcon.addEventListener("click", openCart);
overlay.addEventListener("click", closeCart);
document.getElementById("cart-close").addEventListener("click", closeCart);

document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return;
    const name = document.getElementById("cust-name").value.trim();
    const area = document.getElementById("cust-area").value.trim();
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

    let msg = "Hi Mpahlas-Burg! I'd like to order:\n\n";
    cart.forEach(i => { msg += `• ${i.qty}x ${i.name} (${i.color ? i.color + ", " : ""}Size ${i.size}) - ${money(i.price * i.qty)}\n`; });
    msg += `\nTotal: ${money(total)}`;
    if (name) msg += `\nName: ${name}`;
    if (area) msg += `\nDelivery: ${area}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

// Contact button link (if you have one)
const cw = document.getElementById("contact-whatsapp");
if (cw) cw.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Mpahlas-Burg!")}`;

// Clear any broken items saved from the earlier test (price missing)
cart = cart.filter(i => i.price > 0 && i.size && i.size !== "undefined");
saveCart();
render();


// ===== Mpahlas-Burg drop countdown =====
// Add before </body> (after cart.js): 

document.querySelectorAll("[data-drop-end]").forEach(el => {
    const end = new Date(el.dataset.dropEnd).getTime();
    if (isNaN(end)) { el.style.display = "none"; return; }

    function tick() {
        const left = end - Date.now();
        if (left <= 0) {
            el.textContent = "THIS DROP HAS ENDED";
            clearInterval(timer);
            return;
        }
        const d = Math.floor(left / 86400000);
        const h = Math.floor(left / 3600000) % 24;
        const m = Math.floor(left / 60000) % 60;
        const s = Math.floor(left / 1000) % 60;
        el.textContent = `ENDS IN ${d}d ${h}h ${m}m ${s}s`;
    }

    const timer = setInterval(tick, 1000);
    tick();
});


