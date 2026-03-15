// --- Admin Pages Content Templates ---
Object.assign(TEMPLATES, {

    // ════════════════════════════════════════
    //  OVERVIEW / DASHBOARD
    // ════════════════════════════════════════
    adminOverview: () => {
        const totalProducts = STORE.products.length;
        const inStockCount = STORE.products.filter(p => p.inStock !== false).length;
        const categories = (STORE.categories || []).filter(c => c.slug !== 'all');
        const catNames = {};
        STORE.categories.forEach(c => catNames[c.slug] = c.label);

        const avgPrice = totalProducts > 0
            ? Math.round(STORE.products.reduce((s, p) => s + (p.price || 0), 0) / totalProducts)
            : 0;
        const recentProducts = [...STORE.products].reverse().slice(0, 5);

        // CSS bar heights from data (relative)
        const maxP = Math.max(...STORE.products.map(p => p.price || 0), 1);
        const barData = STORE.products.slice(-7);
        const bars = barData.map((p, i) => {
            const h = Math.round((p.price / maxP) * 55) + 5;
            return `<div class="ap-mini-bar ${i === barData.length - 1 ? 'accent' : ''}" style="height:${h}px" title="${p.name}: ${p.price} ₪"></div>`;
        }).join('');

        return `
        <!-- KPI CARDS -->
        <div class="ap-stats-grid">
            <div class="ap-stat-card" style="--stat-color:#e60012;--stat-bg:rgba(230,0,18,0.06)">
                <div class="ap-stat-icon"><i class="ph-fill ph-package"></i></div>
                <div class="ap-stat-info">
                    <div class="ap-stat-label">المخزون الكلي</div>
                    <div class="ap-stat-value">${totalProducts}</div>
                    <div class="ap-stat-change"><i class="ph ph-trend-up"></i><span>${inStockCount} متوفر حالياً</span></div>
                </div>
            </div>
            <div class="ap-stat-card" style="--stat-color:#0ea5e9;--stat-bg:rgba(14,165,233,0.06)">
                <div class="ap-stat-icon"><i class="ph-fill ph-grid-four"></i></div>
                <div class="ap-stat-info">
                    <div class="ap-stat-label">الأقسام</div>
                    <div class="ap-stat-value">${categories.length}</div>
                    <div class="ap-stat-change"><i class="ph ph-check-circle"></i><span>جميعها نشطة</span></div>
                </div>
            </div>
            <div class="ap-stat-card" style="--stat-color:#22c55e;--stat-bg:rgba(34,197,94,0.06)">
                <div class="ap-stat-icon"><i class="ph-fill ph-shopping-bag-open"></i></div>
                <div class="ap-stat-info">
                    <div class="ap-stat-label">حالة التوفر</div>
                    <div class="ap-stat-value">${Math.round((inStockCount / totalProducts) * 100) || 0}%</div>
                    <div class="ap-stat-change"><span>نسبة التوفر في المتجر</span></div>
                </div>
            </div>
            <div class="ap-stat-card" style="--stat-color:#f59e0b;--stat-bg:rgba(245,158,11,0.06)">
                <div class="ap-stat-icon"><i class="ph-fill ph-wallet"></i></div>
                <div class="ap-stat-info">
                    <div class="ap-stat-label">متوسط الأسعار</div>
                    <div class="ap-stat-value">${avgPrice.toLocaleString()} ₪</div>
                    <div class="ap-stat-change"><span>داخل المتجر</span></div>
                </div>
            </div>
        </div>


        <div class="ap-main-grid">
            <!-- Mini Chart (Updated) -->
            <div class="ap-panel">
                <div class="ap-panel-header">
                    <h2><i class="ph-fill ph-chart-line-up" style="color:#e60012;margin-left:8px"></i> تحليل الأسعار</h2>
                    <span style="font-size:0.75rem; color:#94a3b8">أحدث ${barData.length} منتجات</span>
                </div>
                <div style="padding:24px;">
                    <div style="display:flex; align-items:flex-end; gap:12px; height:100px; padding-bottom:10px; border-bottom:1px solid #f1f5f9; margin-bottom:15px">
                        ${STORE.products.length > 0 ? bars : '<p style="color:#aaa;font-size:0.85rem">لا توجد منتجات بعد</p>'}
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; font-weight:600">
                        ${barData.map(p => `<span style="width:14%; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${p.name.split(' ')[0]}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="ap-panel">
                <div class="ap-panel-header"><h2>إجراءات سريعة</h2></div>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; padding:20px;">
                    <div class="ap-quick-card" onclick="switchAdminPage('products');openAddProductModal()">
                        <div class="ap-quick-icon-new" style="background:rgba(230,0,18,0.1); color:#e60012"><i class="ph-fill ph-plus-circle"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">إضافة منتج</span>
                    </div>
                    <div class="ap-quick-card" onclick="switchAdminPage('categories')">
                        <div class="ap-quick-icon-new" style="background:rgba(14,165,233,0.1); color:#0ea5e9"><i class="ph-fill ph-grid-four"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">الأقسام</span>
                    </div>
                    <div class="ap-quick-card" onclick="showSyncModal()">
                        <div class="ap-quick-icon-new" style="background:rgba(34,197,94,0.1); color:#22c55e"><i class="ph-fill ph-cloud-arrow-down"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">مزامنة</span>
                    </div>
                    <div class="ap-quick-card" onclick="navigate('home')">
                        <div class="ap-quick-icon-new" style="background:rgba(100,116,139,0.1); color:#64748b"><i class="ph-fill ph-storefront"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">المتجر</span>
                    </div>
                    <div class="ap-quick-card" onclick="switchAdminPage('settings')">
                        <div class="ap-quick-icon-new" style="background:rgba(148,163,184,0.1); color:#94a3b8"><i class="ph-fill ph-gear"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">الإعدادات</span>
                    </div>
                    <div class="ap-quick-card" onclick="switchAdminPage('banners')">
                        <div class="ap-quick-icon-new" style="background:rgba(245,158,11,0.1); color:#f59e0b"><i class="ph-fill ph-tag"></i></div>
                        <span style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:8px">العروض</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Products Table -->
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-clock-countdown" style="color:#e60012;margin-left:8px"></i> آخر المنتجات المضافة</h2>
                <button class="ap-panel-action-ghost" onclick="switchAdminPage('products')">
                    <i class="ph ph-arrow-left"></i> عرض الكل
                </button>
            </div>
            ${recentProducts.length > 0 ? `
            <div style="overflow-x:auto">
                <table class="ap-table">
                    <thead><tr>
                        <th style="padding-right:30px">المنتج</th>
                        <th>التصنيف</th>
                        <th>السعر</th>
                        <th>الحالة</th>
                        <th style="text-align:center">الإجراءات</th>
                    </tr></thead>
                    <tbody>
                        ${recentProducts.map(p => `
                        <tr>
                            <td style="padding-right:30px">
                                <div class="ap-product-cell">
                                    <div style="position:relative">
                                        <img class="ap-product-thumb" src="${p.image || ''}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100'" style="width:50px; height:50px; border-radius:12px; border:1px solid #e2e8f0">
                                    </div>
                                    <div>
                                        <div class="ap-product-name" style="font-size:0.95rem; margin-bottom:2px">${p.name}</div>
                                        <div class="ap-product-cat" style="font-family:monospace; color:#64748b">ID: ${p.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="ap-badge" style="background:#f1f5f9; color:#475569; border:1px solid #e2e8f0"><i class="ph-fill ph-tag" style="font-size:10px"></i> ${catNames[p.category] || p.category}</span></td>
                            <td><span class="ap-price" style="font-weight:900; color:#1e293b">${(p.price || 0).toLocaleString()} ₪</span></td>
                            <td>${p.inStock !== false
                                ? '<span class="ap-badge ap-badge-success" style="background:rgba(34,197,94,0.1); color:#16a34a"><i class="ph-fill ph-circle-wavy-check"></i> متوفر</span>'
                                : '<span class="ap-badge ap-badge-danger" style="background:rgba(230,0,18,0.1); color:#e60012"><i class="ph-fill ph-circle-wavy-warning"></i> نافد</span>'
                            }</td>
                            <td style="text-align:center">
                                <button class="ap-action-btn edit" style="background:#fff; border-color:#e2e8f0" onclick="switchAdminPage('products');editProduct('${p.id}')"><i class="ph ph-pencil-simple"></i></button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>` : `
            <div style="padding:40px;text-align:center;color:#aaa">
                <i class="ph ph-package" style="font-size:3rem;display:block;margin-bottom:12px"></i>
                لا توجد منتجات حتى الآن. <a href="#" onclick="openAddProductModal()" style="color:#e60012">أضف أول منتج!</a>
            </div>`}
        </div>
        `;
    },

    // ════════════════════════════════════════
    //  PRODUCTS PAGE
    // ════════════════════════════════════════
    adminProducts: () => {
        const catNames = {};
        (STORE.categories || []).forEach(c => catNames[c.slug] = c.label);
        return `
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-package" style="color:#e60012;margin-left:8px"></i> كل المنتجات (${STORE.products.length})</h2>
                <div style="display:flex;gap:10px;align-items:center">
                    <div class="ap-search">
                        <i class="ph ph-magnifying-glass"></i>
                        <input placeholder="بحث في المنتجات..." id="product-search-input" oninput="filterProductsTable(this.value)">
                    </div>
                    <button class="ap-panel-action" onclick="openAddProductModal()">
                        <i class="ph ph-plus"></i> إضافة منتج
                    </button>
                </div>
            </div>

            ${STORE.products.length > 0 ? `
            <div style="overflow-x:auto">
                <table class="ap-table" id="products-table">
                    <thead><tr>
                        <th style="padding-right:24px">المنتج</th>
                        <th>التصنيف</th>
                        <th>السعر الحالي</th>
                        <th>السعر القديم</th>
                        <th>الحالة</th>
                        <th style="text-align:center">الإجراءات</th>
                    </tr></thead>
                    <tbody id="products-tbody">
                        ${STORE.products.map(p => `
                        <tr data-product-name="${p.name.toLowerCase()}">
                            <td style="padding-right:24px">
                                <div class="ap-product-cell">
                                    <img class="ap-product-thumb" src="${p.image || ''}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100'" style="width:44px; height:44px; border-radius:10px; border:1px solid #f1f5f9">
                                    <div>
                                        <div class="ap-product-name" style="font-size:0.9rem">${p.name}</div>
                                        <div class="ap-product-cat" style="font-family:monospace">ID: ${p.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="ap-badge" style="background:#f8fafc; color:#475569; border:1px solid #e2e8f0; border-radius:8px"><i class="ph-fill ph-tag" style="font-size:10px"></i> ${catNames[p.category] || p.category}</span></td>
                            <td><span class="ap-price" style="font-weight:900; color:#1e293b">${(p.price || 0).toLocaleString()} ₪</span></td>
                            <td style="color:#94a3b8; text-decoration:line-through; font-size:0.8rem">${p.oldPrice ? p.oldPrice.toLocaleString() + ' ₪' : '—'}</td>
                            <td>${p.inStock !== false
                ? '<span class="ap-badge ap-badge-success" style="background:rgba(34,197,94,0.1); color:#16a34a; border-radius:8px"><i class="ph-fill ph-check-circle"></i> متوفر</span>'
                : '<span class="ap-badge ap-badge-danger" style="background:rgba(230,0,18,0.1); color:#e60012; border-radius:8px"><i class="ph-fill ph-warning-circle"></i> نافد</span>'
            }</td>
                            <td>
                                <div style="display:flex; gap:8px; justify-content:center">
                                    <button class="ap-action-btn edit" title="تعديل" onclick="editProduct('${p.id}')"><i class="ph ph-pencil-simple"></i></button>
                                    <button class="ap-action-btn danger" title="حذف" onclick="handleDeleteProduct('${p.id}')"><i class="ph ph-trash"></i></button>
                                </div>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>` : `
            <div style="padding:60px;text-align:center;color:#aaa">
                <i class="ph ph-package" style="font-size:4rem;display:block;margin-bottom:16px;color:#ddd"></i>
                <h3 style="color:#555;margin-bottom:8px">لا توجد منتجات</h3>
                <p>ابدأ بإضافة أول منتج للمتجر</p>
                <button class="ap-btn-primary" style="margin-top:16px" onclick="openAddProductModal()">
                    <i class="ph ph-plus"></i> إضافة منتج
                </button>
            </div>`}
        </div>
        `;
    },

    // ════════════════════════════════════════
    //  CATEGORIES PAGE
    // ════════════════════════════════════════
    adminCategories: () => {
        const cats = STORE.categories || [];
        return `
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-grid-four" style="color:#e60012;margin-left:8px"></i> إدارة الأقسام (${cats.length})</h2>
                <button class="ap-panel-action" onclick="openCategoryModal()">
                    <i class="ph ph-plus"></i> إضافة قسم
                </button>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;padding:24px">
                ${cats.map(cat => {
            const count = STORE.products.filter(p => p.category === cat.slug).length;
            return `
                    <div class="ap-category-card" style="background:white;border:1.5px solid #eef0f5;border-radius:16px;padding:20px;transition:0.2s">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
                            <div style="width:48px;height:48px;border-radius:12px;background:rgba(230,0,18,0.1);color:var(--color-primary);display:flex;align-items:center;justify-content:center;font-size:1.4rem">
                                <i class="${cat.icon || 'ph ph-tag'}"></i>
                            </div>
                            <div style="display:flex;gap:6px">
                                <button class="ap-action-btn edit" onclick="editCategory('${cat.id}')"><i class="ph ph-pencil-simple"></i></button>
                                ${cat.slug !== 'all' ? `<button class="ap-action-btn danger" onclick="handleDeleteCategory('${cat.id}')"><i class="ph ph-trash"></i></button>` : ''}
                            </div>
                        </div>
                        <div style="font-weight:900;font-size:1.1rem;color:#1a1a2e;margin-bottom:4px">${cat.label}</div>
                        <div style="font-size:0.8rem;color:#9aa0b0;font-family:monospace;margin-bottom:12px">SLUG: ${cat.slug}</div>
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #f0f2f8">
                            <span style="font-size:0.85rem;color:#888;font-weight:700">${count} منتج</span>
                            <button class="ap-panel-action-ghost" style="font-size:0.75rem" onclick="navigate('category',{slug:'${cat.slug}'})">معاينة <i class="ph ph-eye"></i></button>
                        </div>
                    </div>`;
        }).join('')}
            </div>
        </div>

        <!-- Category Progress Breakdown -->
        <div class="ap-panel" style="margin-top:24px">
            <div class="ap-panel-header"><h2>توزيع المنتجات</h2></div>
            <div style="padding:24px">
                ${cats.filter(c => c.slug !== 'all').map(cat => {
            const count = STORE.products.filter(p => p.category === cat.slug).length;
            const pct = STORE.products.length > 0 ? Math.round((count / STORE.products.length) * 100) : 0;
            return `
                    <div style="margin-bottom:16px">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.88rem;font-weight:700">
                            <span>${cat.label}</span>
                            <span style="color:#aaa">${count} منتج (${pct}%)</span>
                        </div>
                        <div style="height:8px;background:#f0f2f8;border-radius:10px;overflow:hidden">
                            <div style="height:100%;width:${pct}%;background:var(--color-primary);transition:width 0.6s ease"></div>
                        </div>
                    </div>`;
        }).join('')}
            </div>
        </div>

        <!-- ═══ CATEGORY MODAL ═══ -->
        <div id="category-modal" class="ap-modal-overlay" style="display:none" onclick="if(event.target===this)closeCategoryModal()">
            <div class="ap-modal" style="max-width:440px">
                <div class="ap-modal-header">
                    <h3 id="cat-modal-title">إضافة قسم جديد</h3>
                    <button class="ap-modal-close" onclick="closeCategoryModal()"><i class="ph ph-x"></i></button>
                </div>
                <div class="ap-modal-body">
                    <form id="category-form" onsubmit="event.preventDefault(); saveCategory();">
                        <input type="hidden" id="cat-id">
                        <div class="ap-form-group" style="margin-bottom:16px">
                            <label class="ap-form-label">اسم القسم (بالعربي)</label>
                            <input type="text" id="cat-label" class="ap-form-input" placeholder="مثال: غرف معيشة" required>
                        </div>
                        <div class="ap-form-group" style="margin-bottom:16px">
                            <label class="ap-form-label">المعرف (Slug - English)</label>
                            <input type="text" id="cat-slug" class="ap-form-input" placeholder="مثال: living-rooms" required>
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-heart"></i> اختر أيقونة للقسم</label>
                            <div class="ap-icon-picker-grid">
                                ${[
                'ph-armchair', 'ph-couch', 'ph-bed', 'ph-table', 'ph-lamp',
                'ph-door', 'ph-house', 'ph-package', 'ph-grid-four', 'ph-tag',
                'ph-heart', 'ph-star', 'ph-shopping-cart', 'ph-clock', 'ph-briefcase',
                'ph-stack', 'ph-television', 'ph-shower', 'ph-cooking-pot', 'ph-coat-hanger',
                'ph-plant', 'ph-paint-roller', 'ph-frame-corners', 'ph-rug', 'ph-window'
            ].map(icon => `
                                    <div class="ap-icon-item ${'ph ' + icon === (STORE.categories.find(c => c.id === document.getElementById('cat-id')?.value)?.icon || 'ph ph-tag') ? 'active' : ''}" 
                                         onclick="selectCategoryIcon('ph ${icon}', this)">
                                        <i class="ph ${icon}"></i>
                                    </div>
                                `).join('')}
                            </div>
                            <input type="hidden" id="cat-icon" value="ph ph-tag">
                            <div style="display:flex;align-items:center;gap:10px;margin-top:12px;padding:10px;background:#f8f9fc;border-radius:10px">
                                <div id="cat-icon-preview-box" style="width:40px;height:40px;background:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--color-primary);box-shadow:0 2px 8px rgba(0,0,0,0.05)">
                                    <i id="cat-icon-preview" class="ph ph-tag"></i>
                                </div>
                                <span style="font-size:0.85rem;color:#666;font-weight:700">الأيقونة المختارة ستظهر للزبائن</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="ap-modal-footer">
                    <button class="ap-btn-ghost" onclick="closeCategoryModal()">إلغاء</button>
                    <button class="ap-btn-primary" onclick="saveCategory()">حفظ القسم</button>
                </div>
            </div>
        </div>
        `;
    },

    // ════════════════════════════════════════
    //  SETTINGS PAGE
    // ════════════════════════════════════════
    adminSettings: () => `
    <div class="ap-main-grid">

        <!-- Store Info -->
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-info" style="color:#e60012;margin-left:8px"></i> معلومات المتجر</h2>
            </div>
            <div style="padding:24px">
                <form onsubmit="event.preventDefault(); saveSettings();">
                    <div class="ap-form-group" style="margin-bottom:16px">
                        <label class="ap-form-label">اسم المتجر</label>
                        <input type="text" id="store-name" class="ap-form-input" value="${STORE.settings.storeName || ''}" required>
                    </div>
                    <div class="ap-form-group" style="margin-bottom:16px">
                        <label class="ap-form-label">رقم الواتساب</label>
                        <input type="text" id="store-phone" class="ap-form-input" value="${STORE.settings.phone || ''}" required>
                    </div>
                    <div class="ap-form-group" style="margin-bottom:24px">
                        <label class="ap-form-label">رسالة الترحيب</label>
                        <textarea id="store-welcome" class="ap-form-textarea">${STORE.settings.welcomeMessage || ''}</textarea>
                    </div>
                    <button type="submit" class="ap-btn-primary">
                        <i class="ph ph-floppy-disk"></i> حفظ الإعدادات
                    </button>
                </form>
            </div>
        </div>

        <!-- Theme Colors -->
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-palette" style="color:#e60012;margin-left:8px"></i> هوية المتجر</h2>
            </div>
            <div style="padding:24px">
                <div class="ap-form-group" style="margin-bottom:16px">
                    <label class="ap-form-label">اللون الرئيسي</label>
                    <div style="display:flex;gap:10px;align-items:center">
                        <input type="color" id="store-color" value="${STORE.settings.primaryColor || '#e60012'}"
                               style="width:48px;height:38px;border:none;border-radius:8px;cursor:pointer;padding:2px">
                        <span style="font-size:0.85rem;color:#aaa">يؤثر على الأزرار والروابط</span>
                    </div>
                </div>
                <div style="margin-top:24px;padding:16px;background:#f8f9fc;border-radius:12px">
                    <div style="font-size:0.8rem;font-weight:700;color:#555;margin-bottom:10px">معلومات Firebase</div>
                    <div style="font-size:0.78rem;color:#aaa;direction:ltr;background:#1a1a2e;padding:10px;border-radius:8px;color:#7ee787;font-family:monospace;line-height:1.8">
                        Project: castro-92ccf<br>
                        DB: Firestore<br>
                        Status: <span style="color:#52c41a">● متصل</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Danger Zone -->
        <div class="ap-panel" style="grid-column:1/-1;border:1px solid #ffe0e0">
            <div class="ap-panel-header" style="background:#fff8f8">
                <h2 style="color:#e60012"><i class="ph ph-warning" style="margin-left:8px"></i> منطقة الخطر</h2>
            </div>
            <div style="padding:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
                <div>
                    <div style="font-weight:700;margin-bottom:4px">مزامنة البيانات من Firebase</div>
                    <div style="font-size:0.82rem;color:#aaa">إعادة تحميل كل البيانات من السيرفر (سيتم الكتابة فوق البيانات المحلية)</div>
                </div>
                <button class="ap-btn-primary" onclick="showSyncModal()">
                    <i class="ph ph-cloud-arrow-down"></i> مزامنة الآن
                </button>
            </div>
        </div>

        </div>
    `,

    // ════════════════════════════════════════
    //  DEVELOPMENT LOGS PAGE
    // ════════════════════════════════════════
    adminDevLogs: () => {
        const logs = STORE.devLogs || [];
        return `
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-scroll" style="color:#e60012;margin-left:8px"></i> سجل النشاط والتطوير</h2>
                <span style="font-size:0.8rem; color:#aaa">${logs.length} عملية مسجلة</span>
            </div>
            
            <div style="padding:24px">
                ${logs.length === 0 ? `
                    <div style="text-align:center; padding:60px; color:#aaa;">
                        <i class="ph ph-note-blank" style="font-size:4rem; margin-bottom:15px;"></i>
                        <p>لا يوجد نشاط مسجل حتى الآن</p>
                    </div>
                ` : `
                    <div class="dev-log-timeline">
                        ${logs.map(log => `
                            <div class="dev-log-item" style="display:flex; gap:16px; margin-bottom:24px; position:relative; padding-bottom:24px; border-bottom:1px solid #f4f6f9">
                                <div class="dev-log-user">
                                    <img src="${log.userPhoto || 'https://via.placeholder.com/32'}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.1)">
                                </div>
                                <div class="dev-log-content" style="flex:1">
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px">
                                        <div>
                                            <span style="font-weight:900; color:#1a1a2e; font-size:0.95rem">${log.userName}</span>
                                            <span style="font-size:0.82rem; color:var(--color-primary); background:rgba(230,0,18,0.06); padding:2px 8px; border-radius:6px; margin-right:8px; font-weight:700">${log.action}</span>
                                        </div>
                                        <div style="font-size:0.75rem; color:#aaa; font-weight:600">
                                            <i class="ph ph-clock" style="vertical-align:middle; margin-left:4px"></i>
                                            ${new Date(log.timestamp).toLocaleString('ar-EG', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    
                                    <div style="background:#f8f9fd; border-radius:12px; padding:12px; display:flex; align-items:center; gap:15px">
                                        ${log.targetImage ? `<img src="${log.targetImage}" style="width:50px; height:50px; border-radius:8px; object-fit:cover; background:#fff">` : `<div style="width:50px; height:50px; background:#eef0f5; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#9aa0b0"><i class="ph ph-cube" style="font-size:1.5rem"></i></div>`}
                                        <div>
                                            <div style="font-weight:700; color:#444; font-size:0.9rem">${log.targetName || 'هدف غير مسمى'}</div>
                                            <div style="font-size:0.75rem; color:#888; font-family:monospace">ID: ${log.targetId || '—'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
        `;
    },

    // ════════════════════════════════════════
    //  ADMINS MANAGEMENT (Super Admin Only)
    // ════════════════════════════════════════
    adminAdmins: () => {
        const admins = STORE.allAdmins || [];
        return `
        <div class="ap-panel">
            <div class="ap-panel-header">
                <h2><i class="ph ph-users-three" style="color:#e60012;margin-left:8px"></i> طلبات المطورين والمستخدمين</h2>
                <button class="ap-panel-action-ghost" onclick="window.fetchAdmins()">
                    <i class="ph ph-arrows-clockwise"></i> تحديث القائمة
                </button>
            </div>
            
            <div style="padding:24px">
                ${admins.length === 0 ? `
                    <div style="text-align:center; padding:60px; color:#aaa;">
                        <i class="ph ph-user-circle-plus" style="font-size:4rem; margin-bottom:15px;"></i>
                        <p>لا يوجد طلبات أو مطورين مسجلين حالياً</p>
                    </div>
                ` : `
                    <div style="overflow-x:auto">
                        <table class="ap-table">
                            <thead>
                                <tr>
                                    <th>المطور</th>
                                    <th>الحالة</th>
                                    <th>تاريخ الطلب</th>
                                    <th>الصلاحيات</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${admins.map(adm => {
            const isOnline = adm.lastSeen && (Date.now() - adm.lastSeen < 120000); // Online if seen in last 2 mins
            return `
                                    <tr style="${adm.email === 'adamnhar2011@gmail.com' ? 'background:rgba(230,0,18,0.02)' : ''}">
                                        <td>
                                            <div style="display:flex; align-items:center; gap:12px;">
                                                <div style="position:relative">
                                                    <img src="${adm.photo || 'https://via.placeholder.com/40'}" style="width:40px; height:40px; border-radius:10px; border:2px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                                                    <span class="status-indicator ${isOnline ? 'online' : 'offline'}" style="position:absolute; bottom:-2px; left:-2px; border:2px solid #fff"></span>
                                                </div>
                                                <div>
                                                    <div style="font-weight:900; color:#1a1a2e; display:flex; align-items:center; gap:6px">
                                                        ${adm.name}
                                                        ${isOnline ? '<span style="font-size:0.65rem; color:#52c41a; font-weight:800">متصل الآن</span>' : ''}
                                                    </div>
                                                    <div style="font-size:0.8rem; color:#888;">${adm.email}</div>
                                                    ${adm.email === 'adamnhar2011@gmail.com' ? '<span class="ap-badge ap-badge-success" style="font-size:0.65rem; padding:2px 8px; margin-top:4px;">المبرمج الرئيسي</span>' : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            ${isOnline 
                                                ? '<span class="ap-badge ap-badge-success">نشط حالياً</span>' 
                                                : `<span style="font-size:0.75rem; color:#888">آخر ظهور: ${adm.lastSeen ? new Date(adm.lastSeen).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) : 'منذ وقت طويل'}</span>`
                                            }
                                        </td>
                                        <td style="font-size:0.85rem; color:#666;">${adm.requestedAt ? new Date(adm.requestedAt).toLocaleDateString('ar-EG') : '—'}</td>
                                        <td>
                                            <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:200px;">
                                                ${(() => {
                const permMap = {
                    manage_products: 'المنتجات',
                    manage_categories: 'الأقسام',
                    manage_deals: 'العروض',
                    view_sales: 'المبيعات',
                    manage_admins: 'المطورين',
                    approve_devs: 'الموافقة',
                    full_access: 'كل الوصول'
                };
                return Object.entries(adm.permissions || {})
                    .filter(([k, v]) => v)
                    .map(([k]) => `
                                                            <span style="font-size:0.65rem; background:#f0f2f8; padding:2px 6px; border-radius:4px; color:#555;">${permMap[k] || k}</span>
                                                        `).join('');
            })()}
                                            </div>
                                        </td>
                                        <td>
                                            ${adm.email === 'adamnhar2011@gmail.com' ? '<span style="font-size:0.75rem; color:#e60012; font-weight:700">لا يمكن تعديل المبرمج</span>' : `
                                                <div style="display:flex; gap:8px;">
                                                    <button class="ap-action-btn edit" onclick="window.openAdminEditModal('${adm.uid}')" title="تعديل الصلاحيات"><i class="ph ph-key"></i></button>
                                                    ${adm.status === 'pending' ? `
                                                        <button class="ap-action-btn success" onclick="window.handleApproveAdmin('${adm.uid}')" title="موافقة"><i class="ph ph-check"></i></button>
                                                    ` : ''}
                                                    <button class="ap-action-btn danger" onclick="window.handleDeleteAdmin('${adm.uid}')" title="حذف بالكامل"><i class="ph ph-trash"></i></button>
                                                </div>
                                            `}
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>

    <div id="admin-edit-modal" class="ap-modal-overlay" style="display:none" onclick="if(event.target===this)window.closeAdminEditModal()">
        <div class="ap-modal" style="max-width:480px">
            <div class="ap-modal-header">
                <h3>تعديل صلاحيات المطور</h3>
                <button class="ap-modal-close" onclick="window.closeAdminEditModal()"><i class="ph ph-x"></i></button>
            </div>
            <div class="ap-modal-body">
                <form id="admin-perms-form" onsubmit="event.preventDefault();">
                    <input type="hidden" id="edit-admin-uid" />

                    <div style="margin-bottom:20px; padding:15px; background:#f8f9fc; border-radius:12px; display:flex; align-items:center; gap:12px;">
                        <img id="edit-admin-photo" src="" style="width:48px; height:48px; border-radius:12px;" alt="" />
                        <div>
                            <div id="edit-admin-name" style="font-weight:900;"></div>
                            <div id="edit-admin-email" style="font-size:0.85rem; color:#888;"></div>
                        </div>
                    </div>

                    <div class="ap-form-group">
                        <p class="ap-form-label" style="display:block; margin-bottom:15px;">الصلاحيات المتاحة:</p>

                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:10px; border:1px solid #eee; border-radius:10px;">
                            <input type="checkbox" id="perm-products" style="width:18px; height:18px;" />
                            <div>
                                <div style="font-weight:700; font-size:0.95rem;">إدارة المنتجات</div>
                                <div style="font-size:0.75rem; color:#aaa;">إضافة، تعديل، وحذف المنتجات</div>
                            </div>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:10px; border:1px solid #eee; border-radius:10px;">
                            <input type="checkbox" id="perm-categories" style="width:18px; height:18px;" />
                            <div>
                                <div style="font-weight:700; font-size:0.95rem;">إدارة الأقسام</div>
                                <div style="font-size:0.75rem; color:#aaa;">إدارة تصنيفات المتجر</div>
                            </div>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:10px; border:1px solid #eee; border-radius:10px;">
                            <input type="checkbox" id="perm-deals" style="width:18px; height:18px;" />
                            <div>
                                <div style="font-weight:700; font-size:0.95rem;">إدارة العروض</div>
                                <div style="font-size:0.75rem; color:#aaa;">تعديل الخصومات والبنرات</div>
                            </div>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:10px; border:1px solid #eee; border-radius:10px;">
                            <input type="checkbox" id="perm-sales" style="width:18px; height:18px;" />
                            <div>
                                <div style="font-weight:700; font-size:0.95rem;">مراقب مبيعات</div>
                                <div style="font-size:0.75rem; color:#aaa;">رؤية الطلبات والتحليلات فقط</div>
                            </div>
                        </label>

                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:10px; border:1px solid #eee; border-radius:10px; background:rgba(230,0,18,0.02); border-color:rgba(230,0,18,0.1);">
                            <input type="checkbox" id="perm-super" style="width:18px; height:18px;" />
                            <div>
                                <div style="font-weight:900; font-size:0.95rem; color:#e60012;">نقل ملكية الصلاحيات (مدير أكبر)</div>
                                <div style="font-size:0.75rem; color:#e60012; opacity:0.7;">احذر: هذا الشخص سيصبح لديه كل الصلاحيات بما فيها إدارة المطورين</div>
                            </div>
                        </label>
                    </div>
                </form>
            </div>
            <div class="ap-modal-footer">
                <button class="ap-btn-ghost" onclick="window.closeAdminEditModal()">إلغاء</button>
                <button class="ap-btn-primary" onclick="window.saveAdminPermissions()">حفظ التغييرات</button>
            </div>
        </div>
    </div>
        `;
    },

    // ════════════════════════════════════════
    //  INFLUENCE ANALYTICS (PREMIUM)
    // ════════════════════════════════════════
    adminInfluence: () => {
        const data = STORE.influenceData || { topInterests: [], anomalies: [], totalUniqueSessions: 0, flaggedSessions: 0 };
        const isLoading = STORE.loadingInfluence;

        return `
        <div class="ap-influence-header animate-up" style="background: white; padding: 25px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 30px -15px rgba(0,0,0,0.05)">
            <div style="display:flex; gap:30px">
                <div class="ap-inf-stat">
                    <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">إجمالي الجلسات</div>
                    <div style="font-size: 1.8rem; font-weight: 950; color: #1e293b; line-height: 1;">${data.totalUniqueSessions}</div>
                </div>
                <div class="ap-inf-stat">
                    <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">محاولات مشبوهة محجوبة</div>
                    <div style="font-size: 1.8rem; font-weight: 950; color: #e60012; line-height: 1;">${data.flaggedSessions}</div>
                </div>
            </div>
            <button class="ap-btn-primary" onclick="fetchInfluenceReports()" ${isLoading ? 'disabled' : ''} style="height: 50px; padding: 0 25px;">
                <i class="ph ph-arrows-counter-clockwise ${isLoading ? 'animate-spin' : ''}" style="margin-left: 8px"></i> 
                ${isLoading ? 'جاري التحليل...' : 'تحديث البيانات'}
            </button>
        </div>

        <div class="ap-grid" style="display:grid; grid-template-columns: 2fr 1fr; gap:25px;">
            <!-- Top Attractive Products -->
            <div class="ap-panel animate-up" style="delay: 0.1s">
                <div class="ap-panel-header">
                    <h2><i class="ph-fill ph-magic-wand" style="color:#e60012; margin-left:8px"></i> المنتجات الأكثر جذباً (تأثير حقيقي)</h2>
                    <span class="ap-badge" style="background:rgba(230,0,18,0.1); color:#e60012; border:none; font-weight:900">AI Verified Impact</span>
                </div>
                
                ${isLoading ? `
                    <div style="padding:120px 20px; text-align:center">
                        <i class="ph ph-circle-notch animate-spin" style="font-size:4rem; color:#e60012; opacity:0.3; margin-bottom:20px"></i>
                        <h3 style="color:#1e293b; font-weight:900">جاري قراءة سلوك العملاء...</h3>
                        <p style="color:#64748b">الخوارزمية تقوم حالياً بتصفية البيانات الوهمية وحساب قوة التأثير</p>
                    </div>
                ` : `
                <div class="ap-table-wrapper" style="overflow-x:auto">
                    <table class="ap-table">
                        <thead>
                            <tr>
                                <th style="padding-right:24px">المنتج</th>
                                <th>مرات الظهور</th>
                                <th>مرات الاهتمام</th>
                                <th>الزوار الفريدين</th>
                                <th>مؤشر التأثير</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.topInterests.length === 0 ? `<tr><td colspan="5" style="text-align:center; padding:100px; color:#aaa">لا توجد بيانات كافية للتحليل حالياً</td></tr>` : 
                            data.topInterests.map(p => `
                            <tr>
                                <td style="padding-right:24px">
                                    <div style="font-weight:900; color:#1e293b">${p.name}</div>
                                    <div style="font-size:0.75rem; color:#94a3b8; font-family:monospace">${p.id}</div>
                                </td>
                                <td><span style="font-weight:700">${p.views}</span></td>
                                <td><span style="font-weight:700">${p.clicks}</span></td>
                                <td><span class="ap-badge" style="background:#f1f5f9; color:#475569; border:none">${p.uniqueVisitors} زائر</span></td>
                                <td>
                                    <div style="display:flex; align-items:center; gap:12px; min-width:140px">
                                        <div style="flex:1; height:10px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0">
                                            <div style="width:${Math.min(100, (p.influenceScore / (data.topInterests[0].influenceScore || 1)) * 100)}%; height:100%; background:linear-gradient(90deg, #ff4d4f, #e60012); border-radius:10px; box-shadow: 0 0 10px rgba(230,0,18,0.2)"></div>
                                        </div>
                                        <span style="font-weight:950; color:#e60012; font-size:1rem">${p.influenceScore}</span>
                                    </div>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>

            <!-- Fraud & Anomalies -->
            <div class="ap-panel animate-up" style="delay: 0.2s">
                <div class="ap-panel-header">
                    <h2><i class="ph-fill ph-shield-check" style="color:#16a34a; margin-left:8px"></i> أمان الخوارزمية</h2>
                </div>
                <div style="padding:24px">
                    <div style="background:#0f172a; color:white; border-radius:16px; padding:20px; margin-bottom:25px; box-shadow: 0 10px 20px rgba(15,23,42,0.15)">
                        <div style="display:flex; align-items:center; gap:10px; color:#94a3b8; font-size:0.8rem; margin-bottom:12px; text-transform:uppercase; letter-spacing:1px">
                            <i class="ph ph-cpu"></i> Advanced AI Processing
                        </div>
                        <div style="font-weight:800; font-size:1.1rem; line-height:1.4">تصفية "Weighted Influence" نشطة</div>
                        <p style="font-size:0.85rem; color:#94a3b8; margin-top:8px; line-height:1.5">يتم حذف أي بيانات ناتجة عن تكرار الدخول بنفس الجهاز أو النقرات السريعة المتتالية لضمان دقة "مؤشر التأثير".</p>
                    </div>

                    <h4 style="margin-bottom:18px; font-size:0.95rem; font-weight:900; color:#1e293b; display:flex; align-items:center">
                        <i class="ph-fill ph-warning" style="color:#e60012; margin-left:8px"></i> سجل الرصد والحماية
                    </h4>
                    
                    <div style="display:flex; flex-direction:column; gap:12px">
                        ${data.anomalies.length === 0 ? `
                            <div style="text-align:center; padding:40px 20px; color:#cbd5e1; border:2px dashed #f1f5f9; border-radius:16px">
                                <i class="ph ph-check-circle" style="font-size:2.5rem; margin-bottom:10px"></i>
                                <p style="font-weight:700">لا يوجد تلاعب حالياً</p>
                            </div>
                        ` : data.anomalies.map(a => `
                        <div style="background:#fff5f5; border:1px solid #fee2e2; border-right:4px solid #e60012; padding:15px; border-radius:12px">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px">
                                <div style="font-size:0.9rem; font-weight:900; color:#e60012">${a.reason}</div>
                                <span style="font-size:0.7rem; color:#94a3b8">${new Date(a.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div style="font-size:0.75rem; color:#64748b; font-family:monospace; word-break:break-all">TOKEN: ${a.sessionKey.substring(0,24)}...</div>
                        </div>
                        `).join('')}
                    </div>

                    <div style="margin-top:25px; padding:15px; background:#f8fafc; border-radius:12px; font-size:0.8rem; color:#64748b">
                        <i class="ph-fill ph-lightbulb" style="color:#f59e0b; margin-left:5px"></i>
                        نصيحة: ركز على المنتجات ذات <strong>مؤشر التأثير</strong> المرتفع لأنها الأكثر جذباً للاهتمام الفعلي من الزوار الفريدين.
                    </div>
                </div>
            </div>
        </div>
        `;
    },
});

// Helper: filter products table
function filterProductsTable(val) {
    const rows = document.querySelectorAll('#products-tbody tr');
    if (!rows.length) return;
    rows.forEach(row => {
        const name = row.getAttribute('data-product-name') || '';
        row.style.display = name.includes(val.toLowerCase()) ? '' : 'none';
    });
}

// Helper: admin quick search
function adminQuickSearch(val) {
    if (STORE.adminPage === 'products') filterProductsTable(val);
}
// Helper: select category icon
function selectCategoryIcon(iconName, el) {
    document.getElementById('cat-icon').value = iconName;
    document.getElementById('cat-icon-preview').className = iconName;

    // UI Feedback
    document.querySelectorAll('.ap-icon-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
}
