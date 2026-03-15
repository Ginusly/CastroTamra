// --- Product Page Template ---
Object.assign(TEMPLATES, {
    product: (id) => {
        const p = STORE.products.find(prod => prod.id === id);
        if (!p) return '<div class="container" style="padding: 100px;">المنتج غير موجود</div>';

        const gallery = p.images || [p.image];
        const variants = p.variants || [];

        return `
            <div class="container animate-up" style="padding-top: var(--spacing-lg); padding-bottom: var(--spacing-lg);">
                <div class="product-ali-container">
                    <!-- Left: Gallery & Main Image -->
                    <div class="product-gallery-side">
                        <div class="main-image-viewport" id="main-product-viewport">
                            ${ImageWithLoader(p.image, p.name, "main-view-img")}
                        </div>
                        <div class="thumbnail-strip">
                            ${gallery.map((img, idx) => `
                                <div class="thumb-item ${img === p.image ? 'active' : ''}" onclick="changeProductMainImage(this, '${img}')">
                                    <img src="${img}" alt="thumbnail ${idx}">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Right: Info & Variants -->
                    <div class="product-info-side">
                        <div class="p-breadcrumb">الأقسام / ${p.category}</div>
                        <h1 class="p-title-main">${p.name}</h1>
                        
                        <div class="p-price-box">
                            <span class="p-current-price">${p.price.toLocaleString()} ₪</span>
                            ${p.oldPrice ? `<span class="p-old-price">${p.oldPrice.toLocaleString()} ₪</span>` : ''}
                            ${p.oldPrice ? `<span class="p-discount-badge">خصم ${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
                        </div>

                        <div class="p-variants-section">
                            <h4 class="section-label">الأنواع المتوفرة:</h4>
                            <div class="variant-grid">
                                ${variants.map((v, idx) => `
                                    <div class="variant-item-ali ${v.image === p.image ? 'active' : ''}" 
                                         onclick="selectProductVariant('${p.id}', ${idx}, this)"
                                         title="${v.name}">
                                        <img src="${v.image}" alt="${v.name}">
                                        <span>${v.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="p-description-box">
                            <h4 class="section-label">وصف المنتج:</h4>
                            <p>${p.description || 'تصميم عصري يجمع بين الراحة والفخامة.'}</p>
                        </div>

                        <div class="p-actions-row">
                            <a href="${formatWhatsAppLink(STORE.settings.phone, "استفسار عن " + p.name)}" target="_blank" class="ali-cta-btn whatsapp">
                                <i class="ph ph-whatsapp-logo"></i> اطلب عبر واتساب
                            </a>
                        </div>

                        <div class="p-trust-badges">
                            <div class="badge-item"><i class="ph ph-shield-check"></i> ضمان جودة كاسترو</div>
                            <div class="badge-item"><i class="ph ph-arrows-counter-clockwise"></i> إرجاع سهل</div>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                if (window.trackProductView) {
                    window.trackProductView('${p.id}', '${p.name}');
                }
            </script>
        `;
    }
});
