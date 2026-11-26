// ===== Settings: Suvu can change these =====
const SHOP = {
  instagram: "suvucreation",
  whatsapp: "", // e.g. "919876543210": when filled, orders go to WhatsApp with the full list typed in
};

// Prices are placeholders for the sample. Replace with real ones.
const PRODUCTS = [
  { id: "bouquet",     name: "Blush Handmade Bouquet",    cat: "Bouquets", price: 499, tag: "Bestseller",   desc: "Soft pink handmade flowers wrapped in pastel paper and tied with a satin bow. A bouquet that never wilts." },
  { id: "sunflower",   name: "Crochet Sunflower Stem",     cat: "Bouquets", price: 249, tag: "Crochet",      desc: "A hand-crocheted sunflower on a long green stem. Gift one, or gather a bunch of sunshine." },
  { id: "dome",        name: "Bloom Dome Gift Box",        cat: "Gifts",    price: 699, tag: "Gift ready",   desc: "A mini handmade bouquet sealed in a clear dome with a pearl handle. Made for birthdays and anniversaries." },
  { id: "catbag",      name: "Persian Cat Plush Bag",      cat: "Bags",     price: 649, tag: "3 colours",    desc: "A realistic fluffy cat you can wear. Soft, roomy, and available in white, grey and black." },
  { id: "kittybag",    name: "Tuxedo Kitty Backpack",      cat: "Bags",     price: 599, tag: "New",          desc: "Black-and-white plush kitty with a lace collar and backpack straps. Cute enough to hug." },
  { id: "korean",      name: "Hello Kitty Korean Tote",    cat: "Bags",     price: 349, tag: "Trending",     desc: "A soft Korean-style tote for books, makeup and everything in between." },
  { id: "spacebag",    name: "Moon & Stars Kids Backpack", cat: "Bags",     price: 549, tag: "For kids",     desc: "A sturdy pastel blue backpack with a moon motif and a roomy inside. School days, sorted." },
  { id: "charmbag",    name: "Lilac Charm Handbag",        cat: "Bags",     price: 399, tag: "",             desc: "A structured lilac handbag with playful charms. Small, sweet and easy to carry." },
  { id: "clutcher",    name: "Satin Bow Clutcher",         cat: "Hair",     price: 149, tag: "Handmade",     desc: "Handmade satin bow on a claw clip with dangling pearls. Holds a bun all day, looks pretty from every side." },
  { id: "bowset",      name: "Pastel Bow Clip Set",        cat: "Hair",     price: 179, tag: "Set",          desc: "A card of mini bow clips in pastel shades, perfect for braids and little ones." },
  { id: "bowclip",     name: "Ivory Satin Hair Bow",       cat: "Hair",     price: 129, tag: "",             desc: "A big ivory satin bow on a clip, the softest finish for a half-up look." },
  { id: "scrunchie",   name: "Cloud Satin Scrunchie",      cat: "Hair",     price: 99,  tag: "",             desc: "Extra-full satin scrunchies that are gentle on hair. Ivory, blush and more." },
  { id: "namebow",     name: "Custom Name Bow",            cat: "Custom",   price: 299, tag: "Personalised", desc: "A statement bow with names in gold, made for shaadi, haldi and photo moments. Tell us the names." },
  { id: "evileye",     name: "Evil Eye Wall Hanging",      cat: "Charms",   price: 179, tag: "Nazar",        desc: "A blue evil-eye charm with tassels for your door, car mirror or bag." },
  { id: "evilkey",     name: "Evil Eye Bell Keychain",     cat: "Charms",   price: 99,  tag: "",             desc: "A small evil-eye keychain with a tiny bell. Protection that jingles." },
  { id: "hammer",      name: "Squeaky Hammer Keychain",    cat: "Charms",   price: 149, tag: "Trending",     desc: "A colourful squeaky hammer keychain with cartoon faces. Everyone wants one." },
  { id: "crochetdoll", name: "Crochet Doll Keychain",      cat: "Charms",   price: 199, tag: "Crochet",      desc: "A tiny hand-crocheted keychain to hang on your bag or keys." },
  { id: "pouch",       name: "Heart Glasses Case",         cat: "Gifts",    price: 199, tag: "",             desc: "A soft pastel case with a heart patch for glasses, pens or makeup." },
];
const HAS_ALT = new Set(["bouquet","dome","catbag","kittybag","korean","spacebag","clutcher","bowset","bowclip","scrunchie","namebow","evileye","hammer","crochetdoll","pouch"]);
const INSTA = ["ig1","ig2","ig3","ig4","ig5","ig6"];

// ===== Helpers & state =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const rupee = n => "₹" + n.toLocaleString("en-IN");
const byId = id => PRODUCTS.find(p => p.id === id);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let cart = load("suvu-cart", {});
let likes = new Set(load("suvu-likes", []));
let filter = "All";
let current = null;
const save = () => { localStorage.setItem("suvu-cart", JSON.stringify(cart)); localStorage.setItem("suvu-likes", JSON.stringify([...likes])); };
const heart = `<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.7 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>`;

// ===== Render =====
function renderTabs() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat)), "Wishlist"];
  $("#tabs").innerHTML = cats.map(c => `<button class="tab ${c === filter ? "on" : ""}" data-tab="${c}">${c}${c === "Wishlist" && likes.size ? ` (${likes.size})` : ""}</button>`).join("");
}

function renderGrid() {
  let list = PRODUCTS;
  if (filter === "Wishlist") list = PRODUCTS.filter(p => likes.has(p.id));
  else if (filter !== "All") list = PRODUCTS.filter(p => p.cat === filter);
  $("#grid").innerHTML = list.length ? list.map((p, i) => `
    <article class="card" style="animation-delay:${Math.min(i, 8) * 60}ms">
      <div class="pic" data-open="${p.id}">
        <img src="img/${p.id}.jpg" alt="${p.name}" loading="lazy">
        ${HAS_ALT.has(p.id) ? `<img class="alt" src="img/${p.id}-2.jpg" alt="" loading="lazy">` : ""}
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <button class="like ${likes.has(p.id) ? "on" : ""}" data-like="${p.id}" aria-label="Save to wishlist">${heart}</button>
        <button class="quick" data-add="${p.id}">Quick add</button>
      </div>
      <div class="info">
        <div><h3>${p.name}</h3><p class="sub">${p.cat === "Custom" ? "Made to order" : "Handmade"}</p></div>
        <span class="price">${rupee(p.price)}</span>
      </div>
    </article>`).join("")
    : `<p class="empty">Tap the heart on any piece to save it here.</p>`;
}

function renderInsta() {
  $("#insta").innerHTML = INSTA.map(n => `<a href="https://www.instagram.com/suvucreation/" target="_blank" rel="noopener" aria-label="Open Instagram"><img src="img/${n}.jpg" alt="" loading="lazy"></a>`).join("");
}

function renderCart(bump) {
  const ids = Object.keys(cart);
  const n = ids.reduce((a, id) => a + cart[id], 0);
  const total = ids.reduce((a, id) => a + cart[id] * byId(id).price, 0);
  $("#cartCount").textContent = n;
  $("#cartTotal").textContent = rupee(total);
  $("#cartItems").innerHTML = ids.length ? ids.map(id => {
    const p = byId(id);
    return `<div class="line">
      <img src="img/${p.id}.jpg" alt="">
      <div><b>${p.name}</b><small>${rupee(p.price)}</small></div>
      <div class="qty"><button data-dec="${id}" aria-label="Less">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="More">+</button></div>
    </div>`;
  }).join("") : `<p class="d-empty">Your bag is empty.</p>`;
}

// ===== Actions =====
function add(id) { cart[id] = (cart[id] || 0) + 1; save(); renderCart(); toast(`${byId(id).name} added to your bag`); }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2400); }
function openCart(on = true) { $("#drawer").classList.toggle("on", on); $("#overlay").classList.toggle("on", on); }
function closeModal() { $("#modal").classList.remove("on"); }
function openModal(id) {
  const p = byId(id); current = id;
  $("#mImg").src = `img/${p.id}.jpg`; $("#mImg").alt = p.name;
  $("#mCat").textContent = p.cat;
  $("#mName").textContent = p.name;
  $("#mPrice").textContent = rupee(p.price);
  $("#mDesc").textContent = p.desc;
  $("#modal").classList.add("on");
}
function setFilter(c) { filter = c; renderTabs(); renderGrid(); }

function orderText() {
  const ids = Object.keys(cart);
  const total = ids.reduce((a, id) => a + cart[id] * byId(id).price, 0);
  const name = $("#custName").value.trim();
  return [
    "Hi Suvu Creation, I'd like to order:",
    ...ids.map(id => `- ${byId(id).name} x ${cart[id]} = ${rupee(cart[id] * byId(id).price)}`),
    `Total: ${rupee(total)}`,
    `Delivery: ${$("#custMode").value}`,
    name ? `Name: ${name}` : "",
  ].filter(Boolean).join("\n");
}
async function checkout() {
  if (!Object.keys(cart).length) return toast("Your bag is empty");
  const text = orderText();
  if (SHOP.whatsapp) return window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  try { await navigator.clipboard.writeText(text); } catch (e) {}
  toast("Order copied. Paste it in the Instagram chat");
  setTimeout(() => window.open(`https://ig.me/m/${SHOP.instagram}`, "_blank"), 900);
}

// ===== Events =====
document.addEventListener("click", e => {
  const t = e.target.closest("[data-tab],[data-add],[data-like],[data-open],[data-inc],[data-dec],[data-filter]");
  if (!t) return;
  const d = t.dataset;
  if (d.filter) { setFilter(d.filter); $("#mobileMenu").classList.remove("on"); $("#menuBtn").classList.remove("on"); }
  else if (d.tab) setFilter(d.tab);
  else if (d.add) { e.stopPropagation(); add(d.add); }
  else if (d.like) {
    e.stopPropagation();
    if (likes.has(d.like)) likes.delete(d.like); else { likes.add(d.like); toast("Saved to your wishlist"); }
    save(); renderTabs(); renderGrid();
  }
  else if (d.open) openModal(d.open);
  else if (d.inc) { cart[d.inc]++; save(); renderCart(); }
  else if (d.dec) { if (--cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
});
$$(".wa-link").forEach(a => {
  if (SHOP.whatsapp) { a.href = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent("Hi Suvu Creation")}`; a.target = "_blank"; a.rel = "noopener"; }
  else a.addEventListener("click", e => { e.preventDefault(); toast("WhatsApp coming soon. For now, message us on Instagram"); });
});
$("#menuBtn").onclick = () => { $("#menuBtn").classList.toggle("on"); $("#mobileMenu").classList.toggle("on"); };
$$("#mobileMenu a").forEach(a => a.addEventListener("click", () => { $("#mobileMenu").classList.remove("on"); $("#menuBtn").classList.remove("on"); }));
$("#openCart").onclick = () => openCart(true);
$("#closeCart").onclick = () => openCart(false);
$("#overlay").onclick = () => openCart(false);
$("#checkout").onclick = checkout;
$("#modalClose").onclick = closeModal;
$("#modal").onclick = e => { if (e.target.id === "modal") closeModal(); };
$("#mAdd").onclick = () => { add(current); closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") { openCart(false); closeModal(); } });
addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 10), { passive: true });

// reveal sections as they scroll in
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
$$(".section-head,.cat,.ed-copy,.story-copy,.story-img,.visit-copy,.values div").forEach(el => { el.classList.add("reveal"); io.observe(el); });

renderTabs(); renderGrid(); renderInsta(); renderCart();
