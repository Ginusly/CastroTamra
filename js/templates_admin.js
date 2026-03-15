// --- Admin Layout & Shell Template ---
Object.assign(TEMPLATES, {
    admin: () => {
        const pages = {
            overview: TEMPLATES.adminOverview,
            products: TEMPLATES.adminProducts,
            categories: TEMPLATES.adminCategories,
            settings: TEMPLATES.adminSettings,
            admins: TEMPLATES.adminAdmins,
            banners: () => TEMPLATES.adminDeals ? TEMPLATES.adminDeals() : `<div class='ap-panel' style='padding:40px;text-align:center;color:#aaa'><i class="ph ph-tag" style='font-size:3rem'></i><p style='margin-top:12px'>قسم العروض قيد التحميل</p></div>`,
            dev_logs: TEMPLATES.adminDevLogs,
            influence: TEMPLATES.adminInfluence
        };

        const nav = [
            { id: 'overview', icon: 'ph-squares-four', label: 'لوحة التحكم' },
            { id: 'products', icon: 'ph-package', label: 'المنتجات', badge: STORE.products.length },
            { id: 'categories', icon: 'ph-grid-four', label: 'الأقسام' },
            { id: 'banners', icon: 'ph-tag', label: 'العروض', badge: (STORE.deals || []).length || null },
            { id: 'influence', icon: 'ph-magic-wand', label: 'التأثير (Analytics)' },
            { id: 'dev_logs', icon: 'ph-scroll', label: 'سجل التطوير' },
        ];

        if (STORE.adminUser && STORE.adminUser.isSuper) {
            nav.push({ id: 'admins', icon: 'ph-users-three', label: 'المطورين' });
        }

        nav.push({ id: 'settings', icon: 'ph-gear', label: 'الإعدادات' });

        const pageTitle = {
            overview: 'لوحة التحكم',
            products: 'إدارة المنتجات',
            categories: 'الأقسام',
            banners: 'العروض والإعلانات',
            settings: 'الإعدادات',
            admins: 'إدارة المطورين والصلاحيات',
            dev_logs: 'سجل نشاط التطوير',
            influence: 'مركز تحليل التأثير (Premium AI)'
        };

        return `
            <div class="admin-layout">
                
                <!-- Sidebar Backdrop (Mobile) -->
                <div class="ap-sidebar-backdrop" id="ap-sidebar-backdrop" onclick="toggleAdminSidebar()"></div>

                <!-- ═══ SIDEBAR ═══ -->
                <aside class="ap-sidebar" id="ap-sidebar">
                    <div class="ap-sidebar-brand">
                        <div class="ap-brand-logo"><i class="ph ph-armchair"></i></div>
                        <div class="ap-brand-text">
                            <h3>CASTRO</h3>
                            <span>لوحة الإدارة</span>
                        </div>
                    </div>

                    <nav class="ap-nav">
                        <span class="ap-nav-section-title">الرئيسية</span>
                        ${nav.map(item => `
                            <div class="ap-nav-item ${STORE.adminPage === item.id ? 'active' : ''}"
                                 onclick="switchAdminPage('${item.id}')">
                                <i class="ph ${item.icon}"></i>
                                <span>${item.label}</span>
                                ${item.badge ? `<span class="ap-nav-badge">${item.badge}</span>` : ''}
                            </div>
                        `).join('')}

                        <span class="ap-nav-section-title">أخرى</span>
                        <div class="ap-nav-item" onclick="navigate('home')">
                            <i class="ph ph-storefront"></i>
                            <span>زيارة المتجر</span>
                        </div>
                        <div class="ap-nav-item" onclick="showSyncModal()">
                            <i class="ph ph-cloud-arrow-down"></i>
                            <span>مزامنة Firebase</span>
                        </div>
                    </nav>

                    <div class="ap-sidebar-footer">
                        <div class="ap-user-card">
                            <img src="${JSON.parse(sessionStorage.getItem('castro_admin_user'))?.photo || 'https://ui-avatars.com/api/?name=' + (JSON.parse(sessionStorage.getItem('castro_admin_user'))?.name || 'Admin')}" class="ap-user-avatar" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                            <div class="ap-user-info">
                                <div class="ap-user-name">${JSON.parse(sessionStorage.getItem('castro_admin_user'))?.name || 'المدير العام'}</div>
                                <div class="ap-user-role">Admin</div>
                            </div>
                        </div>
                        <button class="ap-btn-ghost" onclick="sessionStorage.clear(); location.reload();" style="width:100%; margin-top:15px; border-color:rgba(255,255,255,0.1); color:rgba(255,255,255,0.6)">
                            <i class="ph ph-sign-out"></i> خروج آمن
                        </button>
                    </div>
                </aside>

                <!-- ═══ MAIN ═══ -->
                <div class="ap-main">
                    <!-- Topbar -->
                    <div class="ap-topbar">
                        <div style="display:flex;align-items:center;gap:12px">
                            <button class="ap-sidebar-toggle" onclick="toggleAdminSidebar()">
                                <i class="ph ph-list"></i>
                            </button>
                            <div class="ap-topbar-title">${pageTitle[STORE.adminPage] || 'لوحة التحكم'}</div>
                        </div>
                        <div class="ap-topbar-right">
                            <div class="ap-search">
                                <i class="ph ph-magnifying-glass"></i>
                                <input placeholder="بحث سريع..." oninput="adminQuickSearch(this.value)">
                            </div>
                            <button class="ap-topbar-btn" title="الإشعارات">
                                <i class="ph ph-bell"></i>
                                <span class="ap-notif-dot"></span>
                            </button>
                            <button class="ap-sync-btn active" title="اتصال مباشر نشط">
                                <span class="sync-dot"></span> متصل مباشر
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="ap-content">
                        ${(pages[STORE.adminPage] || pages.overview)()}
                    </div>
                </div>

            </div>

            <!-- ═══ PRODUCT MODAL ═══ -->
            <div id="product-modal" class="ap-modal-overlay" style="display:none" onclick="if(event.target===this)closeProductModal()">
                <div class="ap-modal">
                    <div class="ap-modal-header">
                        <h3 id="modal-title">إضافة منتج جديد</h3>
                        <button class="ap-modal-close" onclick="closeProductModal()"><i class="ph ph-x"></i></button>
                    </div>
                    <div class="ap-modal-body">
                        <form id="product-form" onsubmit="event.preventDefault(); saveProduct();">
                            <input type="hidden" id="product-id">
                            <div class="ap-form-grid">
                                <div class="ap-form-group full">
                                    <label class="ap-form-label"><i class="ph ph-tag"></i> اسم المنتج</label>
                                    <input type="text" id="p-name" class="ap-form-input" placeholder="مثال: طقم كنب إيطالي فاخر" required>
                                </div>
                                <div class="ap-form-group">
                                    <label class="ap-form-label"><i class="ph ph-currency-dollar"></i> السعر</label>
                                    <input type="number" id="p-price" class="ap-form-input" placeholder="0" required>
                                </div>
                                <div class="ap-form-group">
                                    <label class="ap-form-label"><i class="ph ph-currency-dollar"></i> السعر القديم</label>
                                    <input type="number" id="p-old-price" class="ap-form-input" placeholder="اختياري">
                                </div>
                                <div class="ap-form-group full">
                                    <label class="ap-form-label"><i class="ph ph-image"></i> صورة المنتج (رابط أو رفع من الجهاز)</label>
                                    <div style="display:flex;gap:10px">
                                        <input type="text" id="p-image" class="ap-form-input" placeholder="رابط الصورة أو ارفع من جهازك..." style="flex:1"
                                               oninput="document.getElementById('p-img-preview').src=this.value||'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400'">
                                        <button type="button" class="ap-btn-ghost" onclick="document.getElementById('p-file-input').click()" style="width:100px;justify-content:center">
                                            <i class="ph ph-upload-simple"></i> رفع
                                        </button>
                                        <input type="file" id="p-file-input" style="display:none" accept="image/*" 
                                               onchange="encodeImageFileAsURL(this, (res)=>{ document.getElementById('p-image').value=res; document.getElementById('p-img-preview').src=res; })">
                                    </div>
                                    <img id="p-img-preview" class="ap-img-preview" src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100'" style="margin-top:10px;border:1px solid #efefef">
                                </div>
                                <div class="ap-form-group">
                                    <label class="ap-form-label"><i class="ph ph-grid-four"></i> القسم</label>
                                    <select id="p-category" class="ap-form-select">
                                        <option value="living-rooms">غرف معيشة</option>
                                        <option value="bedrooms">غرف نوم</option>
                                        <option value="dining">غرف طعام</option>
                                        <option value="office">مكاتب</option>
                                        <option value="accessories">إكسسوارات</option>
                                    </select>
                                </div>
                                <div class="ap-form-group">
                                    <label class="ap-form-label"><i class="ph ph-check-circle"></i> الحالة</label>
                                    <select id="p-instock" class="ap-form-select">
                                        <option value="true">متوفر</option>
                                        <option value="false">غير متوفر</option>
                                    </select>
                                </div>
                                <div class="ap-form-group">
                                    <label class="ap-form-label"><i class="ph ph-lightning"></i> عرض فلاش؟</label>
                                    <label class="ap-switch">
                                        <input type="checkbox" id="p-isflash">
                                        <span class="ap-slider"></span>
                                    </label>
                                </div>
                                <div class="ap-form-group full">
                                    <label class="ap-form-label"><i class="ph ph-text-align-right"></i> الوصف</label>
                                    <textarea id="p-description" class="ap-form-textarea" placeholder="أدخل تفاصيل المنتج هنا..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="ap-modal-footer">
                        <button class="ap-btn-ghost" onclick="closeProductModal()">إلغاء</button>
                        <button class="ap-btn-primary" onclick="saveProduct()">
                            <i class="ph ph-floppy-disk"></i> حفظ المنتج
                        </button>
                    </div>
                </div>
            </div>
            <!-- ═══ SYNC CONFIRMATION MODAL ═══ -->
            <div id="sync-confirm-modal" class="ap-modal-overlay" style="display:none;z-index:10000">
                <div class="ap-modal" style="max-width:400px;text-align:center">
                    <div style="padding:40px 30px">
                        <div style="width:70px;height:70px;background:rgba(230,0,18,0.1);color:#e60012;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto 24px">
                            <i class="ph ph-warning-octagon"></i>
                        </div>
                        <h2 style="margin-bottom:12px;font-size:1.4rem;font-weight:900">تنبيه: مزامنة البيانات</h2>
                        <p style="color:#666;line-height:1.6;font-size:0.95rem;margin-bottom:24px">
                             أنت على وشك تحميل البيانات من السيرفر. 
                            <br>
                            <strong style="color:#e60012">سيتم حذف أي تعديلات محلية لم يتم حفظها!</strong>
                        </p>
                        
                        <div style="display:flex;gap:12px">
                            <button id="sync-confirm-btn" class="ap-btn-primary" disabled style="flex:1;justify-content:center;opacity:0.5;cursor:not-allowed">
                                موافق (<span id="sync-countdown">10</span>)
                            </button>
                            <button class="ap-btn-ghost" onclick="closeSyncModal()" style="flex:1;justify-content:center">إلغاء</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});
