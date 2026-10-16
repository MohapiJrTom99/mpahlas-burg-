// ===== Mpahlas-Burg extras =====
// Add AFTER cart.js, before </body>:  <script src="extras.js"></script>

(function () {

    // --- Settings you can change ---
    const TICKER_ITEMS = ["NEW DROP", "LIMITED EDITION", "FROM POORTJIE", "EMPAHLENI TO THE WORLD", "STREETWEAR WITH ATTITUDE"];
    const WA = (typeof WHATSAPP_NUMBER !== "undefined") ? WHATSAPP_NUMBER : "27633629179";

    // 1) RED TICKER STRIP right after the hero
    const hero = document.querySelector(".hero");
    if (hero) {
        const line = TICKER_ITEMS.map(t => `<span>${t}</span><span>•</span>`).join("");
        const strip = document.createElement("div");
        strip.className = "ticker";
        strip.innerHTML = `<div class="ticker-track">${line}${line}</div>`;
        hero.insertAdjacentElement("afterend", strip);
    }

    // 2) SCROLL REVEAL (things fade up as you scroll)
    const revealEls = document.querySelectorAll(
        ".product-card, .intro, .section-heading, .new-releases .shop-title, .info, .story, footer"
    );
    revealEls.forEach(el => el.classList.add("reveal"));
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("in"));
    }

    // 3) CART COUNT BUMP when something is added
    const countEl = document.getElementById("cart-count");
    if (countEl && "MutationObserver" in window) {
        new MutationObserver(() => {
            countEl.classList.remove("bump");
            void countEl.offsetWidth;
            countEl.classList.add("bump");
        }).observe(countEl, { childList: true, characterData: true, subtree: true });
    }

    // 4) SOLD OUT: add data-soldout to a product-card in index.html
    document.querySelectorAll(".product-card[data-soldout]").forEach(card => {
        card.classList.add("soldout");
        const badge = document.createElement("span");
        badge.className = "sold-badge";
        badge.textContent = "SOLD OUT";
        card.appendChild(badge);
        const btn = card.querySelector("button:not(.swatch)");
        if (btn) { btn.disabled = true; btn.textContent = "SOLD OUT"; }
    });

    // 5) FLOATING WHATSAPP BUTTON
    const wa = document.createElement("a");
    wa.className = "float-wa";
    wa.href = `https://wa.me/${WA}?text=${encodeURIComponent("Hi Mpahlas-Burg!")}`;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat on WhatsApp");
    wa.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/></svg>`;
    document.body.appendChild(wa);

    // 6) BACK TO TOP
    const top = document.createElement("button");
    top.className = "to-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = "&uarr;";
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(top);
    window.addEventListener("scroll", () => {
        top.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });

    // 7) IMAGE LIGHTBOX: tap a product photo to see it full screen
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img alt="">`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector("img");
    document.addEventListener("click", e => {
        const img = e.target.closest(".product-image img");
        if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("open"); }
    });
    lb.addEventListener("click", () => lb.classList.remove("open"));
    document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });

})();
// ===== Multiple designs per product =====
// On a product-card add: data-images="images/a.jpg,images/b.jpg"
// Optional names:        data-labels="Black design,White design"
document.querySelectorAll(".product-card[data-images]").forEach(card => {
    const imgs = card.dataset.images.split(",").map(s => s.trim()).filter(Boolean);
    const labels = (card.dataset.labels || "").split(",").map(s => s.trim());
    const main = card.querySelector(".product-image img");
    const holder = card.querySelector(".product-image");
    if (!main || imgs.length < 2) return;

    const titleEl = card.querySelector("h3");
    const baseName = titleEl ? titleEl.textContent.trim() : "Product";

    const row = document.createElement("div");
    row.className = "design-thumbs";
    row.innerHTML = imgs.map((src, i) =>
        `<img src="${src}" class="${i === 0 ? "active" : ""}" data-i="${i}" alt="Design ${i + 1}">`
    ).join("");
    holder.insertAdjacentElement("afterend", row);

    function pick(i) {
        main.src = imgs[i];
        row.querySelectorAll("img").forEach((t, n) => t.classList.toggle("active", n === i));
        // the cart picks up the design name automatically
        card.dataset.name = labels[i] ? `${baseName} (${labels[i]})` : baseName;
    }
    row.addEventListener("click", e => {
        const t = e.target.closest("img");
        if (t) pick(Number(t.dataset.i));
    });
    pick(0);
});
// ===== Street gallery (auto-built, tap to enlarge) =====
(function () {
    const grid = document.getElementById("streetGrid");
    if (!grid) return;
    const total = Number(grid.dataset.count) || 39;

    for (let i = 1; i <= total; i++) {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = "Mpahlasburg street fit " + i;
        img.src = "fits/fit-" + i + ".jpg";
        img.onerror = function () {
            if (!img.dataset.triedPng) {
                img.dataset.triedPng = "1";
                img.src = "fits/fit-" + i + ".png";
            } else {
                img.remove();
            }
        };
        img.addEventListener("click", () => {
            const box = document.createElement("div");
            box.className = "street-zoom";
            box.innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '">';
            box.addEventListener("click", () => box.remove());
            document.body.appendChild(box);
        });
        grid.appendChild(img);
    }
})();
// ===== Announcement bar rotation =====
(function () {
    const bar = document.getElementById("announce");
    if (!bar) return;
    const msgs = [
        "ORDER EASILY ON WHATSAPP",
        "2 FOR R600 · LIMITED TEES",
        "MPAHLASBURG · EMPAHLENI TO THE WORLD"
    ];
    let i = 0;
    setInterval(() => {
        bar.style.opacity = 0;
        setTimeout(() => {
            i = (i + 1) % msgs.length;
            bar.textContent = msgs[i];
            bar.style.opacity = 1;
        }, 300);
    }, 4000);
})();

// ===== Product search =====
(function () {
    const panel = document.getElementById("searchPanel");
    const input = document.getElementById("searchInput");
    const empty = document.getElementById("searchEmpty");
    if (!panel || !input) return;

    const icon = function (color) {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + color +
               '" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    };

    // small pill search box
    panel.style.cssText = "background:transparent;padding:8px 16px;text-align:center;";
    input.style.cssText = "width:100%;max-width:260px;height:36px;box-sizing:border-box;padding:0 16px 0 38px;" +
        "font-size:0.9rem;color:#000;border:1.5px solid #000;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.15);";
    input.style.background = '#fff url("data:image/svg+xml,' + encodeURIComponent(icon("#000")) +
        '") no-repeat 13px center / 16px';
    empty.style.color = "#000";

    // small black round button with white magnifier
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", "Search");
    btn.innerHTML = icon("#fff");
    btn.style.cssText = "width:36px;height:36px;border-radius:50%;background:#000;border:0;cursor:pointer;" +
        "display:inline-flex;align-items:center;justify-content:center;padding:0;margin-left:10px;";

    const header = document.querySelector("header") || document.querySelector("nav");
    if (header) {
        header.appendChild(btn);
    } else {
        btn.style.position = "fixed";
        btn.style.top = "70px";
        btn.style.right = "12px";
        btn.style.zIndex = "9999";
        document.body.appendChild(btn);
    }

    btn.addEventListener("click", function () {
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) input.focus();
    });

    input.addEventListener("input", function () {
        const q = input.value.trim().toLowerCase();
        let shown = 0;
        document.querySelectorAll(".product-card").forEach(function (card) {
            const match = !q || (card.textContent || "").toLowerCase().includes(q);
            card.style.display = match ? "" : "none";
            if (match) shown++;
        });
        empty.style.display = (q && shown === 0) ? "block" : "none";
        if (q) {
            const shop = document.getElementById("shop");
            if (shop) shop.scrollIntoView({ behavior: "smooth" });
        }
    });
})();
// ===== Footer "Track my order" jumps to the order tracker =====
(function () {
    const box = document.querySelector('input[placeholder*="order no" i]');
    if (!box) return;
    const holder = box.closest("section") || box.parentElement;
    if (!holder.id) holder.id = "track";

    document.querySelectorAll(".site-footer a").forEach(function (a) {
        if (a.textContent.trim().toLowerCase() === "track my order") {
            a.setAttribute("href", "#" + holder.id);
            a.removeAttribute("target");
            a.addEventListener("click", function () {
                setTimeout(function () { box.focus(); }, 600);
            });
        }
    });
})();