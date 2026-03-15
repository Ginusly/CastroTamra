// ════════════════════════════════════════════════════════════════
//  ADMIN DEALS + BANNERS — Full Management Page (v2)
// ════════════════════════════════════════════════════════════════
Object.assign(TEMPLATES, {

    adminDeals: () => {
        const deals = STORE.deals || [];
        const banners = STORE.banners || [];
        const ann = STORE.announcement || {};
        const now = Date.now();

        return `
        <!-- ═══ TAB SWITCHER ═══ -->
        <div class="ap-tabs">
            <button class="ap-tab active" id="tab-banners" onclick="switchDealsTab('banners')">
                <i class="ph ph-images"></i> شرائح البانر
            </button>
            <button class="ap-tab" id="tab-deals" onclick="switchDealsTab('deals')">
                <i class="ph ph-tag"></i> العروض والخصومات
            </button>
            <button class="ap-tab" id="tab-announcement" onclick="switchDealsTab('announcement')">
                <i class="ph ph-megaphone"></i> الإعلان العلوي
                ${ann.active ? '<span class="ap-tab-dot"></span>' : ''}
            </button>
        </div>

        <!-- ═══ BANNERS TAB ═══ -->
        <div id="dtab-banners" class="ap-tab-content">
            <div class="ap-panel">
                <div class="ap-panel-header">
                    <h2><i class="ph ph-images" style="color:#e60012;margin-left:8px"></i> شرائح البانر الرئيسي (${banners.length})</h2>
                    <button class="ap-panel-action" onclick="openBannerModal()">
                        <i class="ph ph-plus"></i> إضافة شريحة
                    </button>
                </div>
                <div style="padding:20px">
                    ${banners.length > 0 ? `
                    <div style="display:flex;flex-direction:column;gap:12px">
                        ${banners.map((b, idx) => `
                        <div class="ap-banner-row" style="animation-delay:${idx * 0.05}s">
                            <div class="ap-banner-thumb">
                                <img src="${b.image || ''}" onerror="this.src='https://placehold.co/120x70/f0f2f8/888?text=صورة'" alt="">
                                <div class="ap-banner-num">${idx + 1}</div>
                            </div>
                            <div class="ap-banner-info">
                                <div class="ap-banner-title">${b.title || 'بدون عنوان'}</div>
                                <div class="ap-banner-sub">${b.text || ''}</div>
                                <div class="ap-banner-tags">
                                    ${b.ctaText ? `<span class="ap-mini-chip"><i class="ph ph-cursor-click"></i>${b.ctaText}</span>` : ''}
                                    ${b.dealId ? `<span class="ap-mini-chip deal"><i class="ph ph-tag"></i>مرتبط بعرض</span>` : ''}
                                    ${(b.featuredProductIds || []).length > 0 ? `<span class="ap-mini-chip products"><i class="ph ph-package"></i>${b.featuredProductIds.length} منتج</span>` : ''}
                                </div>
                            </div>
                            <div class="ap-banner-actions">
                                ${idx > 0 ? `<button class="ap-action-btn" title="تحريك لأعلى" onclick="moveBanner(${idx}, -1)"><i class="ph ph-arrow-up"></i></button>` : '<div style="width:32px"></div>'}
                                ${idx < banners.length - 1 ? `<button class="ap-action-btn" title="تحريك لأسفل" onclick="moveBanner(${idx}, 1)"><i class="ph ph-arrow-down"></i></button>` : '<div style="width:32px"></div>'}
                                <button class="ap-action-btn edit" title="تعديل" onclick="openBannerModal('${b.id}')"><i class="ph ph-pencil-simple"></i></button>
                                <button class="ap-action-btn danger" title="حذف" onclick="handleDeleteBanner('${b.id}')"><i class="ph ph-trash"></i></button>
                            </div>
                        </div>
                        `).join('')}
                    </div>` : `
                    <div style="padding:50px;text-align:center;color:#aaa">
                        <i class="ph ph-images" style="font-size:3.5rem;display:block;margin-bottom:14px;opacity:0.2"></i>
                        <p>لا توجد شرائح. اضغط "إضافة شريحة" لإضافة أول بانر.</p>
                    </div>`}
                </div>
            </div>
        </div>

        <!-- ═══ DEALS TAB ═══ -->
        <div id="dtab-deals" class="ap-tab-content" style="display:none">
            <div class="ap-panel">
                <div class="ap-panel-header">
                    <h2><i class="ph ph-tag" style="color:#e60012;margin-left:8px"></i> العروض والخصومات (${deals.length})</h2>
                    <button class="ap-panel-action" onclick="openDealModal()">
                        <i class="ph ph-plus"></i> إنشاء عرض جديد
                    </button>
                </div>
                ${deals.length > 0 ? `
                <div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
                    ${deals.map(deal => {
            const endTime = deal.endDate ? new Date(deal.endDate).getTime() : null;
            const isActive = !endTime || endTime > now;
            const productCount = (deal.productIds || []).length;
            return `
                        <div class="ap-deal-card" style="--deal-color:${deal.color || '#e60012'}">
                            <div class="ap-deal-card-header">
                                <div class="ap-deal-icon"><i class="ph ph-tag"></i></div>
                                <div class="ap-deal-status ${isActive ? 'active' : 'ended'}">
                                    ${isActive ? '<i class="ph ph-circle" style="font-size:8px"></i> نشط' : '<i class="ph ph-circle" style="font-size:8px"></i> منتهي'}
                                </div>
                            </div>
                            <div class="ap-deal-card-body">
                                <h3>${deal.title}</h3>
                                <p>${deal.description || 'لا يوجد وصف'}</p>
                                <div class="ap-deal-meta">
                                    <span><i class="ph ph-package"></i> ${productCount} منتج</span>
                                    ${deal.discountText ? `<span><i class="ph ph-percent"></i> ${deal.discountText}</span>` : ''}
                                    ${deal.endDate ? `<span><i class="ph ph-clock"></i> ${new Date(deal.endDate).toLocaleDateString('ar-SA')}</span>` : '<span><i class="ph ph-infinity"></i> دائم</span>'}
                                </div>
                            </div>
                            <div class="ap-deal-card-footer">
                                <button class="ap-action-btn edit" title="تعديل" onclick="openDealModal('${deal.id}')"><i class="ph ph-pencil-simple"></i></button>
                                <button class="ap-btn-ghost" style="height:32px;padding:0 12px;font-size:0.8rem" onclick="navigate('deal',{id:'${deal.id}'})">
                                    <i class="ph ph-eye"></i> معاينة
                                </button>
                                <button class="ap-btn-ghost" style="height:32px;padding:0 12px;font-size:0.8rem;border-color:#faad14;color:#d48806" onclick="setAnnouncementFromDeal('${deal.id}');switchDealsTab('announcement')">
                                    <i class="ph ph-megaphone"></i> إعلان
                                </button>
                                <button class="ap-action-btn danger" title="حذف" onclick="handleDeleteDeal('${deal.id}')"><i class="ph ph-trash"></i></button>
                            </div>
                        </div>`;
        }).join('')}
                </div>` : `
                <div style="padding:60px;text-align:center;color:#aaa">
                    <i class="ph ph-tag" style="font-size:4rem;display:block;margin-bottom:16px;opacity:0.2"></i>
                    <h3 style="color:#555;margin-bottom:8px">لا توجد عروض حتى الآن</h3>
                    <button class="ap-btn-primary" style="margin-top:16px" onclick="openDealModal()"><i class="ph ph-plus"></i> إنشاء عرض جديد</button>
                </div>`}
            </div>
        </div>

        <!-- ═══ ANNOUNCEMENT TAB ═══ -->
        <div id="dtab-announcement" class="ap-tab-content" style="display:none">
            <div class="ap-panel" style="border-top:3px solid #faad14">
                <div class="ap-panel-header">
                    <h2><i class="ph ph-megaphone" style="color:#faad14;margin-left:8px"></i> الإعلان العلوي في الهيدر</h2>
                    <span class="ap-badge ${ann.active ? 'ap-badge-success' : 'ap-badge-danger'}">
                        <i class="ph ph-circle" style="font-size:8px"></i>${ann.active ? 'نشط' : 'معطّل'}
                    </span>
                </div>
                <div style="padding:28px">
                    <div class="ap-form-grid">
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-toggle-right"></i> حالة الإعلان</label>
                            <select id="ann-active" class="ap-form-select" onchange="updateAnnPreview()">
                                <option value="true" ${ann.active ? 'selected' : ''}>✅ نشط ومرئي في الهيدر</option>
                                <option value="false" ${!ann.active ? 'selected' : ''}>❌ معطّل ومخفي</option>
                            </select>
                        </div>
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-text-t"></i> نص الإعلان المتحرك</label>
                            <input type="text" id="ann-text" class="ap-form-input" value="${ann.text || ''}"
                                placeholder="مثال: 🔥 عروض نهاية الموسم — خصم حتى 50%! | اكتشف أحدث التشكيلات الآن"
                                oninput="updateAnnPreview()">
                            <small style="color:#aaa;font-size:0.75rem;margin-top:4px;display:block">
                                <i class="ph ph-info"></i> يمكنك استخدام | للفصل بين رسائل متعددة في الشريط المتحرك
                            </small>
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-cursor-click"></i> نص الزر</label>
                            <input type="text" id="ann-btn" class="ap-form-input" value="${ann.btnLabel || ''}"
                                placeholder="مثال: اكتشف الآن" oninput="updateAnnPreview()">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-link"></i> توجيه إلى عرض</label>
                            <select id="ann-deal-id" class="ap-form-select" onchange="updateAnnPreview()">
                                <option value="">— الذهاب للمتجر</option>
                                ${(STORE.deals || []).map(d => `<option value="${d.id}" ${ann.dealId === d.id ? 'selected' : ''}>${d.title}</option>`).join('')}
                            </select>
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-palette"></i> لون الخلفية</label>
                            <input type="color" id="ann-bg" value="${ann.bg || '#e60012'}"
                                style="width:100%;height:40px;border:none;border-radius:10px;cursor:pointer;border:1.5px solid #eee"
                                oninput="updateAnnPreview()">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-palette"></i> لون النص</label>
                            <input type="color" id="ann-text-color" value="${ann.textColor || '#ffffff'}"
                                style="width:100%;height:40px;border:none;border-radius:10px;cursor:pointer;border:1.5px solid #eee"
                                oninput="updateAnnPreview()">
                        </div>

                        <!-- Live Preview -->
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-eye"></i> معاينة مباشرة (الشريط في الهيدر)</label>
                            <div style="border:2px dashed #e8eaf0;border-radius:12px;overflow:hidden">
                                <div id="ann-preview-bar" style="background:${ann.bg || '#e60012'};color:${ann.textColor || 'white'};padding:10px 20px;display:flex;align-items:center;gap:12px;font-size:0.88rem;font-weight:700;overflow:hidden;position:relative">
                                    <i class="ph ph-megaphone" style="flex-shrink:0;font-size:1.1rem"></i>
                                    <div style="overflow:hidden;flex:1">
                                        <div id="ann-preview-text" style="white-space:nowrap">${ann.text || 'نص الإعلان يظهر هنا'}</div>
                                    </div>
                                    ${ann.btnLabel ? `<span id="ann-preview-btn" style="background:rgba(255,255,255,0.22);padding:4px 14px;border-radius:20px;font-size:0.8rem;white-space:nowrap;flex-shrink:0">${ann.btnLabel} →</span>` : `<span id="ann-preview-btn" style="display:none"></span>`}
                                    <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;opacity:0.6;flex-shrink:0">×</button>
                                </div>
                                <div style="padding:12px 18px;background:#f8f9fc;font-size:0.75rem;color:#aaa;border-top:1px dashed #e8eaf0">
                                    <i class="ph ph-info"></i> هكذا سيظهر الإعلان أعلى الصفحة للزوار
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px;padding-top:20px;border-top:1px solid #f0f2f8">
                        <button class="ap-btn-ghost" style="border-color:#e60012;color:#e60012" onclick="clearAnnouncement()">
                            <i class="ph ph-trash"></i> مسح الإعلان
                        </button>
                        <button class="ap-btn-primary" onclick="saveAnnouncement()">
                            <i class="ph ph-floppy-disk"></i> حفظ الإعلان
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══ BANNER MODAL ═══ -->
        <div id="banner-modal" class="ap-modal-overlay" style="display:none" onclick="if(event.target===this)closeBannerModal()">
            <div class="ap-modal" style="width:700px">
                <div class="ap-modal-header">
                    <h3 id="banner-modal-title"><i class="ph ph-image" style="color:#e60012;margin-left:8px"></i> إضافة شريحة بانر</h3>
                    <button class="ap-modal-close" onclick="closeBannerModal()"><i class="ph ph-x"></i></button>
                </div>
                <div class="ap-modal-body">
                    <input type="hidden" id="banner-id">
                    <div class="ap-form-grid">

                        <!-- Image URL + Preview -->
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-image"></i> صورة الخلفية (رابط أو رفع)</label>
                            <div style="display:flex;gap:10px">
                                <input type="text" id="banner-image" class="ap-form-input" 
                                    placeholder="رابط الصورة أو ارفع من جهازك..." style="flex:1"
                                    oninput="updateBannerPreview()">
                                <button type="button" class="ap-btn-ghost" onclick="document.getElementById('banner-file-input').click()" style="width:100px;justify-content:center">
                                    <i class="ph ph-upload-simple"></i> رفع
                                </button>
                                <input type="file" id="banner-file-input" style="display:none" accept="image/*" 
                                    onchange="encodeImageFileAsURL(this, (res)=>{ document.getElementById('banner-image').value=res; updateBannerPreview(); })">
                            </div>
                            <div id="banner-img-preview" style="margin-top:10px;width:100%;height:160px;border-radius:12px;background:#f5f5f5;overflow:hidden;border:1.5px dashed #eee;position:relative">
                                <img id="banner-img-el" src="" style="width:100%;height:100%;object-fit:cover;display:none" onerror="this.style.display='none';document.getElementById('banner-img-placeholder').style.display='flex'">
                                <div id="banner-img-placeholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ccc;gap:8px">
                                    <i class="ph ph-image" style="font-size:2.5rem"></i>
                                    <span style="font-size:0.78rem">أدخل رابط الصورة لمعاينتها</span>
                                </div>
                                <!-- Overlay preview text -->
                                <div id="banner-overlay-preview" style="position:absolute;inset:0;background:linear-gradient(to left,rgba(0,0,0,0.6) 0%,transparent 60%);display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding:20px;color:white;display:none">
                                    <div id="bp-label" style="background:#e60012;font-size:0.65rem;font-weight:800;padding:3px 10px;border-radius:20px;margin-bottom:8px">مجموعة حصرية</div>
                                    <div id="bp-title" style="font-size:1.3rem;font-weight:900;line-height:1.2;margin-bottom:6px;text-align:right"></div>
                                    <div id="bp-text" style="font-size:0.78rem;opacity:0.85;margin-bottom:10px;text-align:right"></div>
                                    <div id="bp-btn" style="background:white;color:#e60012;font-size:0.75rem;font-weight:800;padding:6px 16px;border-radius:24px;display:inline-block"></div>
                                </div>
                            </div>
                        </div>

                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-text-h-one"></i> العنوان الرئيسي</label>
                            <input type="text" id="banner-title" class="ap-form-input"
                                placeholder="مثال: خـصـومات الـشـتـاء" oninput="updateBannerPreview()">
                        </div>
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-text-align-right"></i> النص التفصيلي</label>
                            <input type="text" id="banner-text" class="ap-form-input"
                                placeholder="مثال: وفّر حتى 40% على أطقم الكنب الفاخرة" oninput="updateBannerPreview()">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-cursor-click"></i> نص زر الـ CTA</label>
                            <input type="text" id="banner-cta" class="ap-form-input"
                                placeholder="مثال: اكتشف الآن" value="اكتشف الآن" oninput="updateBannerPreview()">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-link"></i> الانتقال عند الضغط</label>
                            <select id="banner-deal-link" class="ap-form-select">
                                <option value="">— الذهاب لكل المنتجات</option>
                                ${(STORE.deals || []).map(d => `<option value="${d.id}">${d.title}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Featured Products -->
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-package"></i> منتجات مميزة في البانر <span style="color:#aaa;font-weight:400;font-size:0.75rem">(اختياري — تظهر على يمين الشريحة)</span></label>
                            <div style="border:1.5px solid #e8eaf0;border-radius:10px;max-height:200px;overflow-y:auto;background:#fafbfc">
                                ${STORE.products.length > 0 ? `
                                <div style="padding:10px">
                                    ${STORE.products.slice(0, 20).map(p => `
                                    <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;cursor:pointer;transition:background 0.15s" onmouseenter="this.style.background='#f0f2f8'" onmouseleave="this.style.background='transparent'">
                                        <input type="checkbox" class="banner-product-check" value="${p.id}" style="width:15px;height:15px;accent-color:#e60012;cursor:pointer;flex-shrink:0">
                                        <img src="${p.image || ''}" onerror="this.src='https://placehold.co/36x36/f0f2f8/888'" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #eee;flex-shrink:0">
                                        <div style="flex:1;min-width:0">
                                            <div style="font-weight:700;font-size:0.85rem;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                                            <div style="font-size:0.75rem;color:#aaa">${(p.price || 0).toLocaleString()} ₪</div>
                                        </div>
                                    </label>`).join('')}
                                </div>` : `<div style="padding:20px;text-align:center;color:#aaa;font-size:0.85rem">لا توجد منتجات مضافة بعد.</div>`}
                            </div>
                            <div style="font-size:0.75rem;color:#aaa;margin-top:5px"><i class="ph ph-info"></i> يُظهر أفضل 3 منتجات مختارة كمصغّرات داخل الشريحة</div>
                        </div>
                    </div>
                </div>
                <div class="ap-modal-footer">
                    <button class="ap-btn-ghost" onclick="closeBannerModal()">إلغاء</button>
                    <button class="ap-btn-primary" onclick="saveBanner()">
                        <i class="ph ph-floppy-disk"></i> حفظ الشريحة
                    </button>
                </div>
            </div>
        </div>

        <!-- ═══ DEAL MODAL ═══ -->
        <div id="deal-modal" class="ap-modal-overlay" style="display:none" onclick="if(event.target===this)closeDealModal()">
            <div class="ap-modal" style="width:640px">
                <div class="ap-modal-header">
                    <h3 id="deal-modal-title"><i class="ph ph-tag" style="color:#e60012;margin-left:8px"></i> إنشاء عرض جديد</h3>
                    <button class="ap-modal-close" onclick="closeDealModal()"><i class="ph ph-x"></i></button>
                </div>
                <div class="ap-modal-body">
                    <input type="hidden" id="deal-id">
                    <div class="ap-form-grid">
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-tag"></i> عنوان العرض</label>
                            <input type="text" id="deal-title" class="ap-form-input" placeholder="مثال: تخفيضات نهاية الموسم" required>
                        </div>
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-text-align-right"></i> وصف العرض</label>
                            <textarea id="deal-desc" class="ap-form-textarea" placeholder="وصف مختصر للعرض..."></textarea>
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-percent"></i> نص الخصم (اختياري)</label>
                            <input type="text" id="deal-discount-text" class="ap-form-input" placeholder="مثال: وفّر 40%">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-percent"></i> نسبة الخصم (%)</label>
                            <input type="number" id="deal-discount" class="ap-form-input" placeholder="مثال: 40" min="0" max="100">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-calendar"></i> تاريخ انتهاء العرض</label>
                            <input type="datetime-local" id="deal-end-date" class="ap-form-input">
                        </div>
                        <div class="ap-form-group">
                            <label class="ap-form-label"><i class="ph ph-palette"></i> الألوان</label>
                            <div style="display:flex;gap:10px;align-items:center">
                                <input type="color" id="deal-color" value="#e60012" style="width:48px;height:38px;border:none;border-radius:8px;cursor:pointer;padding:2px">
                                <input type="color" id="deal-color-end" value="#1a0000" style="width:48px;height:38px;border:none;border-radius:8px;cursor:pointer;padding:2px">
                                <span style="font-size:0.78rem;color:#aaa">بداية ← نهاية</span>
                            </div>
                        </div>
                        <div class="ap-form-group full">
                            <label class="ap-form-label"><i class="ph ph-package"></i> منتجات العرض</label>
                            <div style="border:1.5px solid #e8eaf0;border-radius:10px;max-height:200px;overflow-y:auto;background:#fafbfc">
                                ${STORE.products.length > 0 ? `
                                <div style="padding:10px">
                                    ${STORE.products.map(p => `
                                    <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;cursor:pointer;transition:background 0.15s" onmouseenter="this.style.background='#f0f2f8'" onmouseleave="this.style.background='transparent'">
                                        <input type="checkbox" class="deal-product-check" value="${p.id}" style="width:15px;height:15px;accent-color:#e60012;cursor:pointer;flex-shrink:0">
                                        <img src="${p.image || ''}" onerror="this.src='https://placehold.co/36x36/f0f2f8/888'" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #eee;flex-shrink:0">
                                        <div style="flex:1;min-width:0">
                                            <div style="font-weight:700;font-size:0.85rem;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                                            <div style="font-size:0.75rem;color:#aaa">${(p.price || 0).toLocaleString()} ₪</div>
                                        </div>
                                    </label>`).join('')}
                                </div>` : `<div style="padding:20px;text-align:center;color:#aaa;font-size:0.85rem">لا توجد منتجات. أضف منتجات أولاً.</div>`}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ap-modal-footer">
                    <button class="ap-btn-ghost" onclick="closeDealModal()">إلغاء</button>
                    <button class="ap-btn-primary" onclick="saveDeal()">
                        <i class="ph ph-floppy-disk"></i> حفظ العرض
                    </button>
                </div>
            </div>
        </div>
        `;
    }
});

// ── Tab switcher ──────────────────────────────────────────────
function switchDealsTab(name) {
    ['banners', 'deals', 'announcement'].forEach(t => {
        const tab = document.getElementById('dtab-' + t);
        const btn = document.getElementById('tab-' + t);
        if (tab) tab.style.display = t === name ? 'block' : 'none';
        if (btn) btn.classList.toggle('active', t === name);
    });
}
