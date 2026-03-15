// --- Site-wide Actions ---
function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    STORE.isSearchOpen = !STORE.isSearchOpen;
    
    if (STORE.isSearchOpen) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="search-overlay-close" onclick="toggleSearch()"><i class="ph ph-x"></i></div>
            <div class="search-overlay-input-group">
                <input type="text" id="search-input" class="search-overlay-input" placeholder="ما الذي تبحث عنه؟" oninput="handleSearch(this.value)">
                <div class="search-overlay-hint">ابدأ الكتابة للبحث عن الأثاث، الموديلات، أو الأقسام</div>
            </div>
            <div class="container" style="margin-top: 50px; width: 100%; overflow-y: auto;">
                <div id="search-results-grid" class="products-grid"></div>
            </div>
        `;
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            document.getElementById('search-input').focus();
        });
    } else {
        overlay.classList.remove('active');
        setTimeout(() => {
            if (!STORE.isSearchOpen) overlay.style.display = 'none';
        }, 400);
    }
}

function handleSearch(query) {
    const grid = document.getElementById('search-results-grid');
    if (!grid) return;
    if (!query.trim()) { grid.innerHTML = ''; return; }
    const filtered = STORE.products.filter(p => p.name.includes(query) || p.category.includes(query));
    grid.innerHTML = filtered.map(p => TEMPLATES.productCard(p)).join('');
}

function nextSlide() {
    STORE.currentSlide = (STORE.currentSlide + 1) % STORE.banners.length;
    updateSlider();
}

function prevSlide() {
    STORE.currentSlide = (STORE.currentSlide - 1 + STORE.banners.length) % STORE.banners.length;
    updateSlider();
}

function goToSlide(index) {
    STORE.currentSlide = index;
    updateSlider();
}

/**
 * updateSlider — updates the CSS transform on the wrapper AND refreshes the dots
 * WITHOUT doing a full render() (which would destroy the slider DOM)
 */
function updateSlider() {
    const wrapper = document.getElementById('slider-wrapper');
    if (wrapper) {
        // RTL: slide to the RIGHT for next = positive direction for translateX
        wrapper.style.transform = `translateX(${STORE.currentSlide * 100}%)`;
    }
    // Update dots
    document.querySelectorAll('.dot-premium').forEach((dot, i) => {
        dot.classList.toggle('active', i === STORE.currentSlide);
    });
    // Update counter
    const counter = document.querySelector('.slider-counter');
    if (counter) {
        counter.textContent = `${STORE.currentSlide + 1} / ${STORE.banners.length}`;
    }
}


sliderInterval = setInterval(nextSlide, 5000);

function changeProductMainImage(element, url) {
    const viewport = document.getElementById('main-product-viewport');
    if (!viewport) return;

    // Update active thumb
    document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Update viewport
    viewport.innerHTML = ImageWithLoader(url, "Product view", "main-view-img");
}

function selectProductVariant(productId, variantIdx, element) {
    const product = STORE.products.find(p => p.id === productId);
    if (!product || !product.variants[variantIdx]) return;

    const variant = product.variants[variantIdx];

    // Update active variant UI
    document.querySelectorAll('.variant-item-ali').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Change main image to variant image
    const viewport = document.getElementById('main-product-viewport');
    if (viewport) {
        viewport.innerHTML = ImageWithLoader(variant.image, variant.name, "main-view-img");
    }

    // Also update thumbnail strip to show we are on this image
    document.querySelectorAll('.thumb-item').forEach(el => {
        const img = el.querySelector('img');
        if (img && img.src === variant.image) el.classList.add('active');
        else el.classList.remove('active');
    });
}
