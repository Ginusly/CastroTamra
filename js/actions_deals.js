// ════════════════════════════════════════════════════════════════
//  DEALS + BANNERS + ANNOUNCEMENT ACTIONS  (v2)
// ════════════════════════════════════════════════════════════════

// ── DEAL Modal ───────────────────────────────────────────────────

function openDealModal(id) {
    const modal = document.getElementById('deal-modal');
    if (!modal) return;

    if (id) {
        const deal = (STORE.deals || []).find(d => d.id === id);
        if (!deal) return;
        document.getElementById('deal-modal-title').innerHTML = '<i class="ph ph-pencil-simple" style="color:#e60012;margin-left:8px"></i> تعديل العرض';
        document.getElementById('deal-id').value = deal.id;
        document.getElementById('deal-title').value = deal.title || '';
        document.getElementById('deal-desc').value = deal.description || '';
        document.getElementById('deal-discount-text').value = deal.discountText || '';
        document.getElementById('deal-discount').value = deal.discount || '';
        document.getElementById('deal-end-date').value = deal.endDate || '';
        document.getElementById('deal-color').value = deal.color || '#e60012';
        document.getElementById('deal-color-end').value = deal.colorEnd || '#1a0000';
        document.querySelectorAll('.deal-product-check').forEach(cb => {
            cb.checked = (deal.productIds || []).includes(cb.value);
        });
    } else {
        document.getElementById('deal-modal-title').innerHTML = '<i class="ph ph-tag" style="color:#e60012;margin-left:8px"></i> إنشاء عرض جديد';
        document.getElementById('deal-id').value = '';
        ['deal-title', 'deal-desc', 'deal-discount-text', 'deal-discount', 'deal-end-date'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('deal-color').value = '#e60012';
        document.getElementById('deal-color-end').value = '#1a0000';
        document.querySelectorAll('.deal-product-check').forEach(cb => cb.checked = false);
    }

    modal.style.display = 'flex';
}

function closeDealModal() {
    const m = document.getElementById('deal-modal');
    if (m) m.style.display = 'none';
}

async function saveDeal() {
    const titleEl = document.getElementById('deal-title');
    if (!titleEl || !titleEl.value.trim()) {
        showToast('يجب إدخال عنوان للعرض', 'error');
        return;
    }
    const idEl = document.getElementById('deal-id');
    const id = (idEl && idEl.value) ? idEl.value : 'deal_' + Date.now();

    const selectedProductIds = [];
    document.querySelectorAll('.deal-product-check:checked').forEach(cb => selectedProductIds.push(cb.value));

    const discountVal = document.getElementById('deal-discount').value;
    const dealData = {
        id,
        title: document.getElementById('deal-title').value.trim(),
        description: document.getElementById('deal-desc').value.trim(),
        discountText: document.getElementById('deal-discount-text').value.trim(),
        discount: discountVal ? Number(discountVal) : null,
        endDate: document.getElementById('deal-end-date').value || null,
        color: document.getElementById('deal-color').value,
        colorEnd: document.getElementById('deal-color-end').value,
        productIds: selectedProductIds,
        createdAt: Date.now()
    };

    if (!STORE.deals) STORE.deals = [];
    const idx = STORE.deals.findIndex(d => d.id === id);
    if (idx !== -1) STORE.deals[idx] = dealData;
    else STORE.deals.push(dealData);

    saveStore();
    closeDealModal();
    render();
    showToast('✅ تم حفظ العرض بنجاح!', 'success');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "deals", id), dealData);
        } catch (e) { console.error("Deal sync failed:", e); }
    }
}

async function handleDeleteDeal(id) {
    if (!confirm('هل تريد حذف هذا العرض نهائياً؟')) return;
    STORE.deals = (STORE.deals || []).filter(d => d.id !== id);
    if (STORE.announcement && STORE.announcement.dealId === id) STORE.announcement.dealId = null;
    saveStore();
    render();
    showToast('تم حذف العرض');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await deleteDoc(doc(window.castroDb, "deals", id));
        } catch (e) { console.error("Deal delete sync failed:", e); }
    }
}

// ── BANNER (Slider Slide) Modal ──────────────────────────────────

function openBannerModal(id) {
    const modal = document.getElementById('banner-modal');
    if (!modal) return;

    if (id) {
        const banner = (STORE.banners || []).find(b => b.id === id);
        if (!banner) return;
        document.getElementById('banner-modal-title').innerHTML = '<i class="ph ph-image" style="color:#e60012;margin-left:8px"></i> تعديل شريحة البانر';
        document.getElementById('banner-id').value = banner.id;
        document.getElementById('banner-image').value = banner.image || '';
        document.getElementById('banner-title').value = banner.title || '';
        document.getElementById('banner-text').value = banner.text || '';
        document.getElementById('banner-cta').value = banner.ctaText || 'اكتشف الآن';
        const dealSel = document.getElementById('banner-deal-link');
        if (dealSel) dealSel.value = banner.dealId || '';
        document.querySelectorAll('.banner-product-check').forEach(cb => {
            cb.checked = (banner.featuredProductIds || []).includes(cb.value);
        });
        updateBannerPreview();
    } else {
        document.getElementById('banner-modal-title').innerHTML = '<i class="ph ph-image" style="color:#e60012;margin-left:8px"></i> إضافة شريحة بانر';
        document.getElementById('banner-id').value = '';
        ['banner-image', 'banner-title', 'banner-text'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('banner-cta').value = 'اكتشف الآن';
        const dealSel = document.getElementById('banner-deal-link');
        if (dealSel) dealSel.value = '';
        document.querySelectorAll('.banner-product-check').forEach(cb => cb.checked = false);
        updateBannerPreview();
    }

    modal.style.display = 'flex';
}

function closeBannerModal() {
    const m = document.getElementById('banner-modal');
    if (m) m.style.display = 'none';
}

function updateBannerPreview() {
    const imgUrl = document.getElementById('banner-image')?.value || '';
    const title = document.getElementById('banner-title')?.value || '';
    const text = document.getElementById('banner-text')?.value || '';
    const cta = document.getElementById('banner-cta')?.value || '';

    const imgEl = document.getElementById('banner-img-el');
    const placeholder = document.getElementById('banner-img-placeholder');
    const overlay = document.getElementById('banner-overlay-preview');

    if (imgEl && imgUrl) {
        imgEl.src = imgUrl;
        imgEl.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    } else if (imgEl) {
        imgEl.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    }

    if (overlay && (title || text)) {
        overlay.style.display = 'flex';
        const bpTitle = document.getElementById('bp-title');
        const bpText = document.getElementById('bp-text');
        const bpBtn = document.getElementById('bp-btn');
        if (bpTitle) bpTitle.textContent = title;
        if (bpText) bpText.textContent = text;
        if (bpBtn) bpBtn.textContent = cta;
    } else if (overlay) {
        overlay.style.display = 'none';
    }
}

async function saveBanner() {
    const imageEl = document.getElementById('banner-image');
    if (!imageEl || !imageEl.value.trim()) {
        showToast('يجب إدخال رابط صورة للشريحة', 'error');
        return;
    }
    const idEl = document.getElementById('banner-id');
    const id = (idEl && idEl.value) ? idEl.value : 'banner_' + Date.now();

    const selectedProductIds = [];
    document.querySelectorAll('.banner-product-check:checked').forEach(cb => selectedProductIds.push(cb.value));

    const dealSel = document.getElementById('banner-deal-link');

    const bannerData = {
        id,
        image: document.getElementById('banner-image').value.trim(),
        title: document.getElementById('banner-title').value.trim(),
        text: document.getElementById('banner-text').value.trim(),
        ctaText: document.getElementById('banner-cta').value.trim() || 'اكتشف الآن',
        dealId: dealSel ? (dealSel.value || null) : null,
        featuredProductIds: selectedProductIds
    };

    if (!STORE.banners) STORE.banners = [];
    const idx = STORE.banners.findIndex(b => b.id === id);
    if (idx !== -1) STORE.banners[idx] = bannerData;
    else STORE.banners.push(bannerData);

    saveStore();
    closeBannerModal();
    render();
    showToast('✅ تم حفظ الشريحة بنجاح!', 'success');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "banners", id), bannerData);
        } catch (e) { console.error("Banner sync failed:", e); }
    }
}

async function handleDeleteBanner(id) {
    if (!confirm('هل تريد حذف هذه الشريحة؟')) return;
    STORE.banners = (STORE.banners || []).filter(b => b.id !== id);
    if (STORE.currentSlide >= STORE.banners.length) STORE.currentSlide = 0;
    saveStore();
    render();
    showToast('تم حذف الشريحة');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await deleteDoc(doc(window.castroDb, "banners", id));
        } catch (e) { console.error("Banner delete sync failed:", e); }
    }
}

async function moveBanner(idx, direction) {
    const banners = STORE.banners || [];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= banners.length) return;

    // Swap locally
    [banners[idx], banners[newIdx]] = [banners[newIdx], banners[idx]];
    STORE.banners = banners;
    saveStore();
    render();

    // Re-save both to Firestore to preserve order (if you had an order field, but here we use the list)
    // Actually, Firestore collections don't guarantee order unless we have a 'sort' field.
    // For now we'll just re-push them if needed, or we rely on the client-side swap which is then rendered.
    // To be truly sync, we'd need an 'order' field. Let's add it.
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            // Basic fix: update both swapped ones with their new relative order if we had that field.
            // Since we don't have an order field, the onSnapshot might re-order them wrongly next time.
            // Let's add 'order' field to our banner data silently.
            banners.forEach(async (b, i) => {
                b.order = i;
                await setDoc(doc(window.castroDb, "banners", b.id), b);
            });
        } catch (e) { console.error("Banner move sync failed:", e); }
    }
}

// ── ANNOUNCEMENT ─────────────────────────────────────────────────

function updateAnnPreview() {
    const text = document.getElementById('ann-text')?.value || '';
    const btn = document.getElementById('ann-btn')?.value || '';
    const bg = document.getElementById('ann-bg')?.value || '#e60012';
    const tc = document.getElementById('ann-text-color')?.value || '#ffffff';
    const bar = document.getElementById('ann-preview-bar');
    const textEl = document.getElementById('ann-preview-text');
    const btnEl = document.getElementById('ann-preview-btn');

    if (bar) { bar.style.background = bg; bar.style.color = tc; }
    if (textEl) textEl.textContent = text || 'نص الإعلان يظهر هنا';
    if (btnEl) {
        if (btn) {
            btnEl.textContent = btn + ' →';
            btnEl.style.display = 'inline-block';
            btnEl.style.background = 'rgba(255,255,255,0.22)';
            btnEl.style.padding = '4px 14px';
            btnEl.style.borderRadius = '20px';
            btnEl.style.fontSize = '0.8rem';
            btnEl.style.flexShrink = '0';
        } else {
            btnEl.style.display = 'none';
        }
    }
}

async function saveAnnouncement() {
    const annData = {
        active: document.getElementById('ann-active')?.value === 'true',
        text: document.getElementById('ann-text')?.value?.trim() || '',
        btnLabel: document.getElementById('ann-btn')?.value?.trim() || '',
        bg: document.getElementById('ann-bg')?.value || '#e60012',
        textColor: document.getElementById('ann-text-color')?.value || '#ffffff',
        dealId: document.getElementById('ann-deal-id')?.value || null
    };
    STORE.announcement = annData;
    saveStore();
    render();
    showToast('✅ تم حفظ الإعلان!', 'success');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "settings", "announcement"), annData);
        } catch (e) { console.error("Announcement sync failed:", e); }
    }
}

async function clearAnnouncement() {
    STORE.announcement = null;
    saveStore();
    render();
    showToast('تم مسح الإعلان');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await deleteDoc(doc(window.castroDb, "settings", "announcement"));
        } catch (e) { console.error("Announcement clear sync failed:", e); }
    }
}

async function setAnnouncementFromDeal(dealId) {
    const deal = (STORE.deals || []).find(d => d.id === dealId);
    if (!deal) return;
    const annData = {
        active: true,
        text: `🔥 ${deal.title}${deal.discountText ? ' — ' + deal.discountText : ''}`,
        btnLabel: 'اكتشف العرض',
        bg: deal.color || '#e60012',
        textColor: '#ffffff',
        dealId: deal.id
    };
    STORE.announcement = annData;
    saveStore();
    showToast(`✅ تم تفعيل الإعلان: ${deal.title}`, 'success');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "settings", "announcement"), annData);
        } catch (e) { console.error("Announcement deal sync failed:", e); }
    }
}

function openAnnouncementModal() { /* legacy compat */ }
function closeAnnouncementModal() { /* legacy compat */ }
