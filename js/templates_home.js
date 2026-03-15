// --- Home & Category Templates ---
Object.assign(TEMPLATES, {
    productCard: (product, isFlash = false) => {
        const hasDiscount = product.oldPrice && product.oldPrice > product.price;
        const discountPercent = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

        return `
        <div class="product-card animate-up ${isFlash ? 'flash-card' : ''}">
            <div class="product-img-wrapper" onclick="navigate('product', { id: '${product.id}' }); if(window.trackProductInterest) window.trackProductInterest('${product.id}', '${product.name}')">
                ${ImageWithLoader(product.image, product.name)}
                <div class="badge-container-hover">
                    ${hasDiscount ? `<span class="badge-promo">-${discountPercent}%</span>` : ''}
                    ${product.isNew ? `<span class="badge-new">NEW</span>` : ''}
                </div>
                <div class="overlay-hover">
                    <button class="btn-quick-view"><i class="ph ph-eye"></i> عرض سريع</button>
                </div>
            </div>
            <div class="product-info-premium">
                <div class="category-label">${product.category}</div>
                <h3 onclick="navigate('product', { id: '${product.id}' }); if(window.trackProductInterest) window.trackProductInterest('${product.id}', '${product.name}')">${product.name}</h3>
                <div class="price-row">
                    <span class="current-price">${(product.price || 0).toLocaleString()} ₪</span>
                    ${hasDiscount ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₪</span>` : ''}
                </div>
                <div class="card-footer-status"><i class="ph ph-check-circle"></i> متوفر في المعرض</div>
            </div>
        </div>
    `;
    },

    home: () => {
        const banners = STORE.banners || [];
        const activeDeals = (STORE.deals || []).filter(d => {
            const e = d.endDate ? new Date(d.endDate).getTime() : null;
            return !e || e > Date.now();
        });

        // Safe current slide
        const safeSlide = Math.min(STORE.currentSlide || 0, Math.max(0, banners.length - 1));

        return `
        <!-- ════ HERO SLIDER — Full Width ════ -->
        <section class="ads-slider" id="hero-slider" aria-label="عروض كاسترو">
            <div class="slider-track" id="slider-wrapper" style="transform:translateX(${safeSlide * 100}%)">
                ${banners.map((b, idx) => {
            // Featured products in this banner slide
            const featProds = STORE.products.filter(p => (b.featuredProductIds || []).includes(p.id)).slice(0, 3);
            const navTarget = b.dealId
                ? `navigate('deal', {id:'${b.dealId}'})`
                : `navigate('category', {slug:'all'})`;

            return `
                    <div class="slide" role="group" aria-label="شريحة ${idx + 1}">
                        <!-- Background image -->
                        <div class="slide-bg" style="background-image:url('${b.image || ''}')"></div>
                        <div class="slide-overlay"></div>

                        <!-- Content -->
                        <div class="slide-inner">
                            <div class="slide-content-premium">
                                <span class="slide-label">مجموعة حصرية</span>
                                <h2>${b.title || ''}</h2>
                                <p>${b.text || ''}</p>
                                <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:8px">
                                    <button class="btn-premium-cta" onclick="${navTarget}">
                                        <i class="ph ph-storefront"></i> ${b.ctaText || 'اكتشف الآن'}
                                    </button>
                                    ${activeDeals.length > 0 ? `
                                    <button class="btn-premium-cta btn-ghost-cta" onclick="navigate('deal',{id:'${activeDeals[idx % activeDeals.length]?.id}'})">
                                        <i class="ph ph-tag"></i> ${activeDeals[idx % activeDeals.length]?.title || 'عروضنا'}
                                    </button>` : ''}
                                </div>
                            </div>

                            <!-- Featured products pills (if any) -->
                            ${featProds.length > 0 ? `
                            <div class="slide-featured-products">
                                <div class="slide-fp-label"><i class="ph ph-star"></i> منتجات مميزة</div>
                                <div class="slide-fp-cards">
                                    ${featProds.map(p => `
                                    <div class="slide-fp-card" onclick="navigate('product',{id:'${p.id}'}); if(window.trackProductInterest) window.trackProductInterest('${p.id}', '${p.name}')">
                                        <img src="${p.image || ''}" alt="${p.name}" onerror="this.src='https://placehold.co/80x80/1a1a2e/fff?text=صورة'">
                                        <div class="slide-fp-info">
                                            <div class="slide-fp-name">${p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name}</div>
                                            <div class="slide-fp-price">${(p.price || 0).toLocaleString()} ₪</div>
                                        </div>
                                    </div>`).join('')}
                                </div>
                            </div>` : ''}
                        </div>
                    </div>`;
        }).join('')}
            </div>

            <!-- Navigation arrows -->
            <button class="slider-arrow slider-arrow-prev" onclick="prevSlide()" aria-label="السابق">
                <i class="ph ph-caret-right"></i>
            </button>
            <button class="slider-arrow slider-arrow-next" onclick="nextSlide()" aria-label="التالي">
                <i class="ph ph-caret-left"></i>
            </button>

            <!-- Dots -->
            <div class="slider-dots-premium" role="tablist">
                ${banners.map((_, i) => `
                <button class="dot-premium ${i === safeSlide ? 'active' : ''}"
                    onclick="goToSlide(${i})" aria-label="شريحة ${i + 1}" role="tab" aria-selected="${i === safeSlide}">
                </button>`).join('')}
            </div>

            <!-- Slide counter -->
            <div class="slider-counter">${safeSlide + 1} / ${banners.length}</div>
        </section>

        <!-- ════ Main Content Container ════ -->
        <div class="container">

            <!-- Category Circles -->
            <section class="category-strip animate-up">
                ${(STORE.categories || []).map(cat => `
                    <div class="cat-circle-item" onclick="navigate('category',{slug:'${cat.slug}'})">
                        <div class="cat-circle-icon"><i class="${cat.icon || 'ph ph-grid-four'}"></i></div>
                        <span>${cat.label || cat.slug}</span>
                    </div>`).join('')}
            </section>

            <!-- Active Deals -->
            ${activeDeals.length > 0 ? `
            <section class="deals-showcase animate-up">
                <div class="deals-header">
                    <div>
                        <h2><i class="ph ph-tag" style="color:var(--color-primary)"></i> العروض والخصومات</h2>
                        <p>اكتشف أفضل العروض المتاحة الآن</p>
                    </div>
                </div>
                <div class="deals-grid">
                    ${activeDeals.map(deal => {
            const endTime = deal.endDate ? new Date(deal.endDate).getTime() : null;
            const timeLeft = endTime ? endTime - Date.now() : null;
            const hoursLeft = timeLeft ? Math.floor(timeLeft / 3600000) : null;
            const daysLeft = hoursLeft !== null ? Math.floor(hoursLeft / 24) : null;
            const productCount = (deal.productIds || []).length;
            return `
                        <div class="deal-card" style="--d-color:${deal.color || '#e60012'};--d-color-end:${deal.colorEnd || '#1a0000'}" onclick="navigate('deal',{id:'${deal.id}'})">
                            <div class="deal-card-bg"></div>
                            <div class="deal-card-content">
                                <div class="deal-card-badge"><i class="ph ph-tag"></i> ${deal.discountText || 'عرض خاص'}</div>
                                <h3>${deal.title}</h3>
                                <p>${deal.description || ''}</p>
                                <div class="deal-card-footer">
                                    <span class="deal-products-count"><i class="ph ph-package"></i> ${productCount} منتج</span>
                                    ${daysLeft !== null ? `
                                    <span class="deal-timer ${daysLeft < 1 ? 'urgent' : ''}">
                                        <i class="ph ph-clock"></i> ${daysLeft > 0 ? daysLeft + ' يوم' : hoursLeft + ' ساعة'} متبقية
                                    </span>` : `<span class="deal-timer permanent"><i class="ph ph-infinity"></i> عرض دائم</span>`}
                                </div>
                                <button class="deal-cta-btn"><i class="ph ph-arrow-left"></i> اكتشف العرض</button>
                            </div>
                        </div>`;
        }).join('')}
                </div>
            </section>` : ''}

            <!-- Flash Sales -->
            ${(() => {
                const flashProducts = STORE.products.filter(p => p.isFlashSale);
                if (flashProducts.length === 0) return '';
                return `
                <section class="flash-sales-section animate-up">
                    <div class="flash-header">
                        <h2><i class="ph ph-lightning" style="color:var(--color-primary)"></i> عروض فلاش خاطفة</h2>
                        <a href="#category/all">عرض الكل →</a>
                    </div>
                    <div class="horizontal-scroll">
                        ${flashProducts.map(p => TEMPLATES.productCard(p, true)).join('')}
                    </div>
                </section>
                `;
            })()}

            <!-- All Products -->
            <section class="section-padding animate-up">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
                    <h2 style="font-size:1.5rem;font-weight:900;color:#1a1a2e">جميع المنتجات</h2>
                    <a href="#category/all" style="color:var(--color-primary);font-weight:700;text-decoration:none;font-size:0.9rem">عرض الكل →</a>
                </div>
                <div class="products-grid">
                    ${STORE.products.map(p => TEMPLATES.productCard(p)).join('')}
                </div>
            </section>

            <!-- End of content -->
        </div>`;
    },


    // ── Category Page ──
    category: (slug) => {
        const filtered = slug === 'all' ? STORE.products : STORE.products.filter(p => p.category === slug);
        const catObj = (STORE.categories || []).find(c => c.slug === slug);
        const pageTitle = catObj ? catObj.label : (slug === 'all' ? 'كل المنتجات' : slug);
        return `
            <div class="container animate-up" style="padding-top:32px;padding-bottom:40px">
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px">
                    <button onclick="navigate('home')" style="background:none;border:none;cursor:pointer;font-size:1.3rem;color:#aaa"><i class="ph ph-arrow-right"></i></button>
                    <h1 style="font-size:1.7rem;font-weight:900;color:#1a1a2e">${pageTitle}</h1>
                    <span style="background:#f0f2f8;color:#888;font-size:0.8rem;font-weight:700;padding:4px 12px;border-radius:20px">${filtered.length} منتج</span>
                </div>
                <div class="products-grid">
                    ${filtered.length ? filtered.map(p => TEMPLATES.productCard(p)).join('') : `
                        <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:#aaa">
                            <i class="ph ph-package" style="font-size:4rem;display:block;margin-bottom:18px;opacity:0.25"></i>
                            <p style="font-size:1.1rem;margin-bottom:20px">لا توجد منتجات في هذا القسم حالياً</p>
                            <button onclick="navigate('home')" style="background:var(--color-primary);color:white;border:none;padding:12px 28px;border-radius:30px;font-weight:700;cursor:pointer">العودة للرئيسية</button>
                        </div>`}
                </div>
            </div>`;
    },


    // ── Deal Page ──
    deal: (id) => {
        const deal = (STORE.deals || []).find(d => d.id === id);
        if (!deal) return `<div class="container" style="padding:80px 20px;text-align:center;color:#aaa"><i class="ph ph-tag" style="font-size:4rem;display:block;margin-bottom:16px"></i><p>هذا العرض غير موجود</p><button onclick="navigate('home')" style="background:var(--color-primary);color:white;border:none;padding:12px 28px;border-radius:30px;font-weight:700;cursor:pointer;margin-top:16px">العودة للرئيسية</button></div>`;
        const dealProducts = STORE.products.filter(p => (deal.productIds || []).includes(p.id));
        const endTime = deal.endDate ? new Date(deal.endDate).getTime() : null;
        const isActive = !endTime || endTime > Date.now();
        return `
        <div class="animate-up">
            <div style="background:linear-gradient(135deg,${deal.color || '#e60012'} 0%,${deal.colorEnd || '#1a0000'} 100%);padding:60px 40px;text-align:center;color:white;position:relative;overflow:hidden">
                <div style="position:absolute;inset:0;opacity:0.06" aria-hidden="true"></div>
                <div style="position:relative;max-width:700px;margin:0 auto">
                    <span style="background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);color:white;font-size:0.8rem;font-weight:800;letter-spacing:2px;padding:5px 18px;border-radius:20px;display:inline-block;margin-bottom:16px">
                        ${isActive ? '🔥 عرض نشط' : '⏰ انتهى العرض'}
                    </span>
                    <h1 style="font-size:3rem;font-weight:900;margin-bottom:14px;text-shadow:0 2px 20px rgba(0,0,0,0.3)">${deal.title}</h1>
                    <p style="font-size:1.1rem;opacity:0.88;max-width:600px;margin:0 auto 24px">${deal.description || ''}</p>
                    ${deal.discountText ? `<div style="display:inline-block;background:white;color:${deal.color || '#e60012'};font-size:2rem;font-weight:900;padding:10px 30px;border-radius:50px;box-shadow:0 8px 30px rgba(0,0,0,0.2);margin-bottom:24px">${deal.discountText}</div>` : ''}
                    ${endTime && isActive ? `
                    <div style="margin-top:20px;display:flex;gap:8px;justify-content:center">
                        ${['d', 'h', 'm', 's'].map((t, i) => `<div style="background:rgba(0,0,0,0.3);padding:8px 16px;border-radius:10px;min-width:64px;text-align:center"><div id="dc-${t}" style="font-size:1.6rem;font-weight:900">00</div><div style="font-size:0.65rem;opacity:0.7;margin-top:2px">${['يوم', 'ساعة', 'دقيقة', 'ثانية'][i]}</div></div>`).join('')}
                    </div>
                    <script>(function(){const end=${endTime};const f=n=>String(n).padStart(2,'0');function tick(){const diff=end-Date.now();if(diff<=0)return;const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);const dEl=document.getElementById('dc-d');if(!dEl)return clearInterval(iv);document.getElementById('dc-d').textContent=f(d);document.getElementById('dc-h').textContent=f(h);document.getElementById('dc-m').textContent=f(m);document.getElementById('dc-s').textContent=f(s);}tick();const iv=setInterval(tick,1000);})();<\/script>` : ''}
                </div>
            </div>
            <div class="container" style="padding-top:36px;padding-bottom:40px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
                    <div style="display:flex;align-items:center;gap:14px">
                        <button onclick="navigate('home')" style="background:none;border:none;cursor:pointer;font-size:1.3rem;color:#aaa"><i class="ph ph-arrow-right"></i></button>
                        <h2 style="font-size:1.4rem;font-weight:900;color:#1a1a2e">منتجات هذا العرض</h2>
                    </div>
                    <span style="color:#aaa;font-size:0.85rem">${dealProducts.length} منتج</span>
                </div>
                ${dealProducts.length > 0 ? `<div class="products-grid">${dealProducts.map(p => TEMPLATES.productCard({ ...p, discount: deal.discount || null })).join('')}</div>` : `
                <div style="text-align:center;padding:60px;color:#aaa">
                    <i class="ph ph-tag" style="font-size:3.5rem;display:block;margin-bottom:16px;opacity:0.3"></i>
                    <p>لم يتم إضافة منتجات لهذا العرض بعد</p>
                    <button onclick="navigate('home')" style="background:var(--color-primary);color:white;border:none;padding:12px 28px;border-radius:30px;font-weight:700;cursor:pointer;margin-top:16px">العودة للرئيسية</button>
                </div>`}
            </div>
        </div>`;
    }
});
