/* Grahmé storefront — products + gallery (no cart) */

const PRODUCTS = [
  {
    id: "classic",
    name: "Classic Graham Balls",
    price: 8,
    badge: "Bestseller",
    img: "P11.jpg",
    desc: "Ang orihinal na soft, chewy graham balls — crushed grahams, condensed milk, at konting magic. Perfect for everyday cravings.",
    details: ["1 pcs", "No preservatives", "Best chilled"],
  },
  {
    id: "cocoa",
    name: "Cocoa Coated",
    price: 10,
    badge: "",
    img: "P13.jpg",
    desc: "Classic graham balls na pinahiran ng rich cocoa powder. Slightly bitter, super addictive.",
    details: ["1 pcs", "Cocoa dusted", "Made fresh daily"],
  },
  {
    id: "assorted",
    name: "Grahmé Gift Box",
    price: 35,
    badge: "For sharing",
    img: "As.jpg",
    desc: "Assorted flavors in a ready-to-gift box. Ideal for parties, baon, o pasyal.",
    details: [
      "~4 pcs mixed",
      "Gift-ready packaging",
      "Mix of classic, cocoa & milk",
    ],
  },
  {
    id: "milk",
    name: "Milk Coated",
    price: 10,
    badge: "",
    img: "P12.jpg",
    desc: "Creamy milk powder coating over soft graham centers. Kid-favorite and super soft.",
    details: ["1 pcs", "Milk powder coat", "Mild & sweet"],
  },
  {
    id: "nest",
    name: "Graham Nest",
    price: 12,
    badge: "",
    img: "p15.jpg",
    desc: "Graham balls arranged like a little nest — fun shape, same soft chew. Great for photos and gifting.",
    details: ["1 pcs", "Hand-shaped", "Limited batches"],
  },
  {
    id: "premium",
    name: "Premium Box",
    price: 85,
    badge: "Premium",
    img: "ss.jpg",
    desc: "Our biggest box — premium packaging, mixed flavors, and extra care. Perfect for celebrations or corporate gifts.",
    details: [
      "8 pcs assorted",
      "Premium gift box",
      "Includes classic, cocoa, milk & nest",
    ],
  },
];

const peso = (n) => "₱" + n.toLocaleString("en-PH");

const $ = (id) => document.getElementById(id);
const on = (id, ev, fn) => {
  const el = $(id);
  if (el) el.addEventListener(ev, fn);
};

/* ---- Products ---- */
function renderProducts() {
  const grid = $("productGrid");
  if (!grid) return;
  const lim = Number(grid.dataset.limit) || PRODUCTS.length;
  grid.innerHTML = PRODUCTS.slice(0, lim)
    .map(
      (p) => `
    <article class="card reveal" data-product="${p.id}" role="button" tabindex="0">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="price-row">
          <span class="price">${peso(p.price)}</span>
        </div>
      </div>
    </article>`,
    )
    .join("");
  // re-observe new cards for reveal
  grid.querySelectorAll(".reveal").forEach((el) => io && io.observe(el));
}

/* ---- Product detail modal ---- */
function ensureProductModal() {
  if ($("productModal")) return;
  const mod = document.createElement("div");
  mod.id = "productModal";
  mod.className = "product-modal hidden";
  mod.setAttribute("role", "dialog");
  mod.setAttribute("aria-modal", "true");
  mod.innerHTML = `
    <div class="product-modal-backdrop" data-close-product></div>
    <div class="product-modal-card" id="productModalCard">
      <button class="icon-btn product-modal-close" data-close-product aria-label="Close">✕</button>
      <div class="product-modal-img" id="productModalImg"></div>
      <div class="product-modal-body">
        <p class="eyebrow" id="productModalBadge"></p>
        <h2 id="productModalName"></h2>
        <p class="product-modal-desc" id="productModalDesc"></p>
        <ul class="product-modal-details" id="productModalDetails"></ul>
        <div class="product-modal-foot">
          <span class="price" id="productModalPrice"></span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(mod);
}

function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  ensureProductModal();
  const imgBox = $("productModalImg");
  imgBox.innerHTML = p.img
    ? `<img src="${p.img}" alt="${p.name}" />`
    : `<div class="product-img-placeholder" aria-hidden="true"></div>`;
  $("productModalBadge").textContent = p.badge || "Grahmé treat";
  $("productModalName").textContent = p.name;
  $("productModalDesc").textContent = p.desc || "";
  $("productModalDetails").innerHTML = (p.details || [])
    .map((d) => `<li>✦ ${d}</li>`)
    .join("");
  $("productModalPrice").textContent = peso(p.price);
  $("productModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    $("productModalCard").classList.add("open");
  });
}

function closeProduct() {
  const card = $("productModalCard");
  if (card) card.classList.remove("open");
  const mod = $("productModal");
  if (mod) {
    setTimeout(() => {
      mod.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }, 220);
  }
}

/* ---- Events ---- */
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.closest && t.closest("[data-close-product]")) {
    closeProduct();
    return;
  }
  const card = t.closest && t.closest("[data-product]");
  if (card) {
    openProduct(card.dataset.product);
    return;
  }
});

/* ---- Reveal on scroll ---- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach(
      (en) => en.isIntersecting && en.target.classList.add("visible"),
    );
  },
  { threshold: 0.12 },
);

renderProducts();
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// keyboard: Enter on product card / Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProduct();
  if (e.key === "Enter" && e.target.dataset && e.target.dataset.product) {
    openProduct(e.target.dataset.product);
  }
});

/* ---- Mobile menu ---- */
on("menuBtn", "click", () => {
  const open = $("mainNav").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", open);
  $("menuBtn").textContent = open ? "✕" : "☰";
});

/* ---- Gallery lightbox (simple) ---- */
document.addEventListener("click", (e) => {
  const fig = e.target.closest && e.target.closest(".gallery-item");
  if (fig) {
    const img = fig.querySelector("img");
    if (!img) return;
    openLightbox(img.src, img.alt || "Grahmé photo");
  }
  if (e.target.closest && e.target.closest("[data-close-lightbox]")) {
    closeLightbox();
  }
});

function ensureLightbox() {
  if ($("lightbox")) return;
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.className = "lightbox hidden";
  lb.innerHTML = `
    <div class="lightbox-backdrop" data-close-lightbox></div>
    <div class="lightbox-content">
      <button class="icon-btn lightbox-close" data-close-lightbox aria-label="Close">✕</button>
      <img id="lightboxImg" src="" alt="" />
      <p id="lightboxCaption" class="lightbox-caption"></p>
    </div>`;
  document.body.appendChild(lb);
}

function openLightbox(src, caption) {
  ensureLightbox();
  $("lightboxImg").src = src;
  $("lightboxImg").alt = caption;
  $("lightboxCaption").textContent = caption;
  $("lightbox").classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  const lb = $("lightbox");
  if (lb) {
    lb.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
