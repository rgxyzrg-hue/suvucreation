// ===== Settings: Suvu can change these =====
const SHOP = {
  instagram: "suvucreation",
  whatsapp: "", // e.g. "919876543210" — when filled, orders go to WhatsApp with the full list pre-typed
};

// Prices are placeholders for the sample — replace with real ones.
const PRODUCTS = [
  { id: "bouquet",   name: "Pretty Handmade Bouquet",   cat: "Bouquets",  price: 499, img: "p03.jpg", badge: "Bestseller", desc: "Soft pink and orange handmade flowers wrapped in pastel paper with a satin bow. A gift that never wilts." },
  { id: "sunflower", name: "Crochet Sunflower Stick",   cat: "Bouquets",  price: 249, img: "p05.jpg", badge: "Crochet",    desc: "Hand-crocheted sunflower on a long green stem. Buy one, or make a bunch of sunshine." },
  { id: "dome",      name: "Flower Dome Gift Box",      cat: "Gifts",     price: 699, img: "p06.jpg", badge: "Premium",    desc: "Mini handmade bouquet inside a clear dome with a pearl handle. Perfect birthday or anniversary gift." },
  { id: "kittybag",  name: "Fluffy Kitty Plush Bag",    cat: "Bags",      price: 599, img: "p04.jpg", badge: "New",        desc: "Super soft black-and-white kitty bag with a lace collar. Cute enough to hug." },
  { id: "korean",    name: "Korean Style Tote Bag",     cat: "Bags",      price: 349, img: "p02.jpg", badge: "Trending",   desc: "Pastel Korean-style tote in lilac and print designs. Fits books, makeup and everything in between." },
  { id: "clutcher",  name: "Handmade Hair Clutcher",    cat: "Hair",      price: 149, img: "p10.jpg", badge: "Handmade",   desc: "Pastel butterfly-style claw clip with dangling pearls. Holds a bun all day." },
  { id: "scrunchie", name: "Rose Scrunchie Set",        cat: "Hair",      price: 199, img: "p11.jpg", badge: "Set of 3",   desc: "Satin and velvet scrunchies with rose details in deep wine, black and blue." },
  { id: "luckypack", name: "Pick-Any-5 Lucky Pack",     cat: "Gifts",     price: 399, img: "p09.jpg", badge: "Value pack", desc: "Choose any 5 small pieces from the stall (bows, clips, scrunchies, charms) packed in a cute pouch. Tell us your colours." },
  { id: "evileye",   name: "Evil Eye Wall Hanging",     cat: "Charms",    price: 179, img: "p08.jpg", badge: "Nazar 🧿",   desc: "Blue evil-eye charm with tassels to hang at your door, car mirror or bag." },
  { id: "namebow",   name: "Custom Name Bow",           cat: "Custom",    price: 299, img: "p07.jpg", badge: "Personalised", desc: "Big black bow with names in gold, made for shaadi, haldi and photo moments. Tell us the names." },
  { id: "flower",    name: "Crochet Flower Mirror Charm", cat: "Charms",  price: 199, img: "p01.jpg", badge: "",           desc: "A little crochet sunflower to hang on your scooty mirror or bag. Sunshine on every ride." },
];

const REELS = [
  { img: "p01.jpg", t: "Day 23 · stall timing", url: "https://www.instagram.com/suvucreation/reel/DgMDFQMgiu2/" },
  { img: "p02.jpg", t: "Day 22 · Korean bags",  url: "https://www.instagram.com/suvucreation/reel/DgG2zJLgvcN/" },
  { img: "p03.jpg", t: "Day 21 · bouquets",     url: "https://www.instagram.com/suvucreation/reel/DgEXHdagdL8/" },
  { img: "p04.jpg", t: "Day 20 · kitty bag",    url: "https://www.instagram.com/suvucreation/reel/DgB0jinAkGG/" },
  { img: "p05.jpg", t: "Day 19 · sunflowers",   url: "https://www.instagram.com/suvucreation/reel/Df_IPSiAexx/" },
  { img: "p06.jpg", t: "Day 18 · premium gifts",url: "https://www.instagram.com/suvucreation/reel/Df8lcyVgTd2/" },
  { img: "p07.jpg", t: "Day 17 · name bows",    url: "https://www.instagram.com/suvucreation/reel/Df59GfCAjWr/" },
  { img: "p08.jpg", t: "Day 16 · evil eye",     url: "https://www.instagram.com/suvucreation/reel/DfyRcVmgq1o/" },
  { img: "p09.jpg", t: "Day 15 · the stall",    url: "https://www.instagram.com/suvucreation/reel/DfvtWUeAx3S/" },
  { img: "p11.jpg", t: "Day 14 · scrunchies",   url: "https://www.instagram.com/suvucreation/reel/DftDe3nAWkZ/" },
];

// ===== State =====
const $ = s => document.querySelector(s);
const rupee = n => "₹" + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("suvu-cart") || "{}");
let likes = new Set(JSON.parse(localStorage.getItem("suvu-likes") || "[]"));
let filter = "All";
let current = null;

const save = () => {
  localStorage.setItem("suvu-cart", JSON.stringify(cart));
  localStorage.setItem("suvu-likes", JSON.stringify([...likes]));
};

// ===== Render =====
function renderChips() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat)), "♡ Wishlist"];
  $("#chips").innerHTML = cats.map(c => `<button class="chip ${c === filter ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
}

function renderGrid() {
  let list = PRODUCTS;
  if (filter === "♡ Wishlist") list = PRODUCTS.filter(p => likes.has(p.id));
  else if (filter !== "All") list = PRODUCTS.filter(p => p.cat === filter);
  $("#grid").innerHTML = list.length ? list.map((p, i) => `
    <article class="card" style="animation-delay:${i * 50}ms">
      <div class="pic" data-open="${p.id}">
        <img src="images/${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="heart ${likes.has(p.id) ? "on" : ""}" data-like="${p.id}" aria-label="Add to wishlist">${likes.has(p.id) ? "♥" : "♡"}</button>
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <span class="cat">${p.cat} · handmade</span>
        <div class="row">
          <span class="price">${rupee(p.price)}</span>
          <button class="add" data-add="${p.id}">+ Add</button>
        </div>
      </div>
    </article>`).join("")
    : `<p class="empty" style="grid-column:1/-1"><span style="font-size:2rem">♡</span><br>Tap the heart on a product to save it here.</p>`;
}

function renderReels() {
  $("#reels").innerHTML = REELS.map(r => `
    <a class="reel" href="${r.url}" target="_blank" rel="noopener">
      <img src="images/${r.img}" alt="${r.t}" loading="lazy"><span>${r.t}</span>
    </a>`).join("");
}

function renderCart() {
  const ids = Object.keys(cart);
  const n = ids.reduce((a, id) => a + cart[id], 0);
  const total = ids.reduce((a, id) => a + cart[id] * byId(id).price, 0);
  const c = $("#cartCount");
  c.textContent = n;
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  $("#cartTotal").textContent = rupee(total);
  $("#cartItems").innerHTML = ids.length ? ids.map(id => {
    const p = byId(id);
    return `<div class="line">
      <img src="images/${p.img}" alt="">
      <div class="meta"><b>${p.name}</b><small>${rupee(p.price)}</small></div>
      <div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div>
    </div>`;
  }).join("") : `<div class="empty"><div>🛍️</div>Your bag is empty.<br>Go find something pretty!</div>`;
}

const byId = id => PRODUCTS.find(p => p.id === id);

// ===== Actions =====
function add(id) {
  cart[id] = (cart[id] || 0) + 1;
  save(); renderCart();
  toast(`🎀 ${byId(id).name} added to your bag`);
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2200);
}
function openCart(on = true) {
  $("#drawer").classList.toggle("on", on);
  $("#overlay").classList.toggle("on", on);
}
function openModal(id) {
  const p = byId(id); current = id;
  $("#mImg").src = "images/" + p.img; $("#mImg").alt = p.name;
  $("#mCat").textContent = p.cat + " · handmade";
  $("#mName").textContent = p.name;
  $("#mPrice").textContent = rupee(p.price);
  $("#mDesc").textContent = p.desc;
  $("#modal").classList.add("on");
}

function orderText() {
  const ids = Object.keys(cart);
  const total = ids.reduce((a, id) => a + cart[id] * byId(id).price, 0);
  const name = $("#custName").value.trim();
  return [
    `Hi Suvu Creation 🎀, I'd like to order:`,
    ...ids.map(id => `• ${byId(id).name} × ${cart[id]} = ${rupee(cart[id] * byId(id).price)}`),
    `Total: ${rupee(total)}`,
    `Mode: ${$("#custMode").value}`,
    name ? `Name: ${name}` : "",
  ].filter(Boolean).join("\n");
}

async function checkout() {
  if (!Object.keys(cart).length) return toast("Your bag is empty 🙈");
  const text = orderText();
  if (SHOP.whatsapp) {
    window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
    return;
  }
  try { await navigator.clipboard.writeText(text); } catch (e) {}
  toast("Order copied 💌 Paste it in the Instagram chat");
  setTimeout(() => window.open(`https://ig.me/m/${SHOP.instagram}`, "_blank"), 900);
}

// ===== Events =====
document.addEventListener("click", e => {
  const t = e.target.closest("[data-c],[data-add],[data-like],[data-open],[data-inc],[data-dec]");
  if (!t) return;
  const d = t.dataset;
  if (d.c) { filter = d.c; renderChips(); renderGrid(); }
  else if (d.add) add(d.add);
  else if (d.like) {
    e.stopPropagation();
    likes.has(d.like) ? likes.delete(d.like) : (likes.add(d.like), toast("♥ Saved to wishlist"));
    save(); renderGrid();
  }
  else if (d.open) openModal(d.open);
  else if (d.inc) { cart[d.inc]++; save(); renderCart(); }
  else if (d.dec) { if (--cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
});
document.querySelectorAll(".wa-link").forEach(a => {
  if (SHOP.whatsapp) {
    a.href = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent("Hi Suvu Creation 🎀")}`;
    a.target = "_blank"; a.rel = "noopener";
  } else {
    a.onclick = e => { e.preventDefault(); toast("WhatsApp number coming soon 💚 For now, DM us on Instagram"); };
  }
});
$("#openCart").onclick = () => openCart(true);
$("#closeCart").onclick = () => openCart(false);
$("#overlay").onclick = () => openCart(false);
$("#checkout").onclick = checkout;
$("#modalClose").onclick = () => $("#modal").classList.remove("on");
$("#modal").onclick = e => { if (e.target.id === "modal") $("#modal").classList.remove("on"); };
$("#mAdd").onclick = () => { add(current); $("#modal").classList.remove("on"); };
document.addEventListener("keydown", e => { if (e.key === "Escape") { openCart(false); $("#modal").classList.remove("on"); } });

renderChips(); renderGrid(); renderReels(); renderCart();
