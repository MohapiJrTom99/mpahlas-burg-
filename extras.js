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
