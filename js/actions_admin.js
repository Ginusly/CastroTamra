// --- Admin Panel Actions ---
function switchAdminPage(page) {
    if (!STORE.uiState) STORE.uiState = { adminPage: 'overview' };
    STORE.uiState.adminPage = page;
    saveStore();
    render();
    if (page === 'influence') fetchInfluenceReports();
}

function toggleAdminSidebar() {
    const sb = document.getElementById('ap-sidebar');
    const bd = document.getElementById('ap-sidebar-backdrop');
    if (sb) sb.classList.toggle('active');
    if (bd) bd.classList.toggle('active');
}

/**
 * Presence Heartbeat
 */
setInterval(async () => {
    if (STORE.adminUser && window.castroDb) {
        try {
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await updateDoc(doc(window.castroDb, "admins", STORE.adminUser.uid), {
                lastSeen: Date.now(),
                isOnline: true
            });
        } catch (e) {}
    }
}, 30000); // Every 30 seconds

/**
 * Log Action to Development Log
 */
async function logAction(action, details = {}) {
    if (!STORE.adminUser || !window.castroDb) return;
    try {
        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        await addDoc(collection(window.castroDb, "logs"), {
            action: action,
            userName: STORE.adminUser.name || 'مجهول',
            userPhoto: STORE.adminUser.photo || '',
            userId: STORE.adminUser.uid,
            timestamp: Date.now(),
            ...details
        });
    } catch (e) {
        console.error("Failed to log action:", e);
    }
}

let syncTimer = null;
function showSyncModal() {
    const modal = document.getElementById('sync-confirm-modal');
    const btn = document.getElementById('sync-confirm-btn');
    const countSpan = document.getElementById('sync-countdown');
    if (!modal) return;

    modal.style.display = 'flex';
    let count = 10;
    countSpan.textContent = count;
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';

    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(() => {
        count--;
        countSpan.textContent = count;
        if (count <= 0) {
            clearInterval(syncTimer);
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.textContent = 'تأكيد المزامنة الآن';
            btn.onclick = () => {
                closeSyncModal();
                loadDataFromFirebase().then(() => {
                    render();
                    showToast('تمت المزامنة بنجاح!');
                });
            };
        }
    }, 1000);
}

function closeSyncModal() {
    const modal = document.getElementById('sync-confirm-modal');
    if (modal) modal.style.display = 'none';
    if (syncTimer) clearInterval(syncTimer);
    if (STORE.renderPending) render(true);
}

function openAddProductModal() {
    const catSelect = document.getElementById('p-category');
    if (catSelect) {
        catSelect.innerHTML = (STORE.categories || []).filter(c => c.slug !== 'all').map(c => `<option value="${c.slug}">${c.label}</option>`).join('');
    }
    document.getElementById('modal-title').textContent = 'إضافة منتج جديد';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    
    document.getElementById('product-modal').style.display = 'flex';

    // Persist State
    if (!STORE.uiState) STORE.uiState = {};
    STORE.uiState.activeModalId = 'product-modal';
    STORE.uiState.modalData = { title: 'إضافة منتج جديد', fields: {} };
    saveStore();
    bindModalPersistence('product-modal');
}

function editProduct(id) {
    const product = STORE.products.find(p => p.id === id);
    if (!product) return;

    const catSelect = document.getElementById('p-category');
    if (catSelect) {
        catSelect.innerHTML = (STORE.categories || []).filter(c => c.slug !== 'all').map(c => `<option value="${c.slug}">${c.label}</option>`).join('');
    }

    document.getElementById('modal-title').textContent = 'تعديل المنتج';
    document.getElementById('product-id').value = product.id;
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-image').value = product.image || '';
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-description').value = product.description || '';
    const oldPriceField = document.getElementById('p-old-price');
    if (oldPriceField) oldPriceField.value = product.oldPrice || '';
    const inStockField = document.getElementById('p-instock');
    if (inStockField) inStockField.value = product.inStock !== false ? 'true' : 'false';
    const isFlashField = document.getElementById('p-isflash');
    if (isFlashField) isFlashField.checked = product.isFlashSale || false;
    // Update image preview
    const preview = document.getElementById('p-img-preview');
    if (preview) preview.src = product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400';
    document.getElementById('product-modal').style.display = 'flex';

    // Persist State
    if (!STORE.uiState) STORE.uiState = {};
    STORE.uiState.activeModalId = 'product-modal';
    STORE.uiState.modalData = { title: 'تعديل المنتج', productId: id, fields: {} };
    // Snapshot current values immediately
    const form = document.querySelector('#product-modal form');
    if (form) {
        Array.from(form.elements).forEach(el => {
            if (el.id) STORE.uiState.modalData.fields[el.id] = el.type === 'checkbox' ? el.checked : el.value;
        });
    }
    saveStore();
    bindModalPersistence('product-modal');
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    if (STORE.uiState) {
        STORE.uiState.activeModalId = null;
        STORE.uiState.modalData = null;
        saveStore();
    }
    if (STORE.renderPending) render(true);
}

async function saveProduct() {
    // ⚠️ IMPORTANT: Read ALL form values FIRST, before any async or render calls
    // The modal DOM gets destroyed by render(), so we must snapshot the data upfront
    const formId = document.getElementById('product-id');
    const formName = document.getElementById('p-name');
    const formPrice = document.getElementById('p-price');
    const formImage = document.getElementById('p-image');
    const formCategory = document.getElementById('p-category');
    const formDesc = document.getElementById('p-description');

    if (!formName || !formPrice || !formImage || !formCategory) {
        console.error("Form elements not found in DOM");
        showToast('خطأ: لم يتم العثور على بيانات النموذج', 'error');
        return;
    }

    const id = (formId && formId.value) ? formId.value : Date.now().toString();
    const imageUrl = formImage.value;

    const formOldPrice = document.getElementById('p-old-price');
    const formInStock = document.getElementById('p-instock');

    const productData = {
        id: id,
        name: formName.value,
        price: Number(formPrice.value),
        oldPrice: formOldPrice && formOldPrice.value ? Number(formOldPrice.value) : null,
        image: imageUrl,
        category: formCategory.value,
        description: (formDesc && formDesc.value) ? formDesc.value : '',
        inStock: formInStock ? formInStock.value === 'true' : true,
        isFlashSale: document.getElementById('p-isflash')?.checked || false,
        images: [imageUrl]
    };

    // Close modal & update UI immediately (sync)
    const index = STORE.products.findIndex(p => p.id === id);
    if (index !== -1) {
        STORE.products[index] = productData;
    } else {
        STORE.products.push(productData);
    }
    saveStore();
    closeProductModal();
    render(true);
    showToast('تم حفظ المنتج بنجاح!');
    logAction(index !== -1 ? 'تعديل منتج' : 'إضافة منتج جديد', { 
        targetName: productData.name, 
        targetId: productData.id,
        targetImage: productData.image
    });

    // Sync with Firestore in background (async, after DOM is free)
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "products", id), productData);
            console.log("✅ Firestore synced: Product saved:", id);
        } catch (error) {
            console.error("Firestore sync failed:", error);
        }
    }
}

async function handleDeleteProduct(id) {
    if (!confirm('حذف هذا المنتج؟')) return;

    try {
        // Update Local Store
        STORE.products = STORE.products.filter(p => p.id !== id);

        // Delete from Firestore
        if (window.castroDb) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await deleteDoc(doc(window.castroDb, "products", id));
            console.log("Firestore synced: Product deleted.");
        }

        saveStore();
        render(true);
        showToast('تم حذف المنتج!');
        logAction('حذف منتج', { targetId: id });
    } catch (error) {
        console.error("Delete failed:", error);
        showToast('فشل حذف المنتج من السيرفر', 'error');
    }
}

async function saveSettings() {
    STORE.settings.storeName = document.getElementById('store-name').value;
    STORE.settings.phone = document.getElementById('store-phone').value;
    STORE.settings.welcomeMessage = document.getElementById('store-welcome').value;
    Object.assign(STORE.settings, { primaryColor: document.getElementById('store-color').value });

    saveStore();
    updateMeta();
    render(true);
    showToast('تم حفظ الإعدادات!');

    // Sync to Firestore
    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "settings", "global"), STORE.settings);
            console.log("✅ Firestore synced: Settings saved");
        } catch (e) {
            console.error("Firebase settings save error:", e);
        }
    }
}

// ── Category Actions ──
function openCategoryModal() {
    document.getElementById('cat-modal-title').textContent = 'إضافة قسم جديد';
    document.getElementById('category-form').reset();
    document.getElementById('cat-id').value = '';

    // Reset Icon Picker
    document.getElementById('cat-icon').value = 'ph ph-tag';
    document.getElementById('cat-icon-preview').className = 'ph ph-tag';
    document.querySelectorAll('.ap-icon-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('i').className === 'ph ph-tag') item.classList.add('active');
    });

    document.getElementById('category-modal').style.display = 'flex';

    // Persist State
    if (!STORE.uiState) STORE.uiState = {};
    STORE.uiState.activeModalId = 'category-modal';
    STORE.uiState.modalData = { title: 'إضافة قسم جديد', fields: { 'cat-icon': 'ph ph-tag' } };
    saveStore();
    bindModalPersistence('category-modal');
}

function editCategory(id) {
    const cat = STORE.categories.find(c => c.id === id);
    if (!cat) return;
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-label').value = cat.label;
    document.getElementById('cat-slug').value = cat.slug;

    // Update Icon Picker State
    const iconName = cat.icon || 'ph ph-tag';
    document.getElementById('cat-icon').value = iconName;
    document.getElementById('cat-icon-preview').className = iconName;

    // Highlight in grid
    document.querySelectorAll('.ap-icon-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('i').className === iconName) item.classList.add('active');
    });

    document.getElementById('cat-modal-title').textContent = 'تعديل القسم';
    document.getElementById('category-modal').style.display = 'flex';

    // Persist State
    if (!STORE.uiState) STORE.uiState = {};
    STORE.uiState.activeModalId = 'category-modal';
    STORE.uiState.modalData = { title: 'تعديل القسم', categoryId: id, fields: {} };
    // Snapshot
    const form = document.querySelector('#category-modal form');
    if (form) {
        Array.from(form.elements).forEach(el => {
            if (el.id) STORE.uiState.modalData.fields[el.id] = el.value;
        });
    }
    saveStore();
    bindModalPersistence('category-modal');
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
    if (STORE.uiState) {
        STORE.uiState.activeModalId = null;
        STORE.uiState.modalData = null;
        saveStore();
    }
    if (STORE.renderPending) render(true);
}

async function saveCategory() {
    const formId = document.getElementById('cat-id');
    const formLabel = document.getElementById('cat-label');
    const formSlug = document.getElementById('cat-slug');
    const formIcon = document.getElementById('cat-icon');

    if (!formLabel.value || !formSlug.value) return;

    const id = formId.value || Date.now().toString();
    const catData = {
        id: id,
        label: formLabel.value,
        slug: formSlug.value,
        icon: formIcon.value || 'ph ph-tag'
    };

    const idx = STORE.categories.findIndex(c => c.id === id);
    if (idx !== -1) STORE.categories[idx] = catData;
    else STORE.categories.push(catData);

    saveStore();
    closeCategoryModal();
    render(true);
    showToast('تم حفظ القسم بنجاح!');

    if (window.castroDb) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.castroDb, "categories", id), catData);
        } catch (e) { console.error("Firebase category save error:", e); }
    }
}

async function handleDeleteCategory(id) {
    if (!confirm('سيتم حذف هذا القسم وتعديل المنتجات التابعة له لـ "غير مصنف"، هل أنت متأكد؟')) return;

    STORE.categories = STORE.categories.filter(c => c.id !== id);
    saveStore();
    render(true);
    showToast('تم حذف القسم!');

    if (window.castroDb) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await deleteDoc(doc(window.castroDb, "categories", id));
        } catch (e) { console.error("Firebase category delete error:", e); }
    }
}

/**
 * INFLUENCE & ANALYTICS ENGINE
 * Premium Anti-Fraud Analytics Processing
 */
async function fetchInfluenceReports() {
    if (!window.castroDb) return { topInterests: [], anomalies: [], totalUniqueSessions: 0 };
    STORE.loadingInfluence = true;
    try {
        const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        const q = query(collection(window.castroDb, "interactions"), orderBy("timestamp", "desc"), limit(2000));
        const snap = await getDocs(q);
        const raw = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const results = processInteractions(raw);
        STORE.influenceData = results;
        STORE.loadingInfluence = false;
        render(); // Refresh page to show data
        return results;
    } catch (e) {
        console.error("Influence fetch error:", e);
        STORE.loadingInfluence = false;
        return { topInterests: [], anomalies: [], totalUniqueSessions: 0 };
    }
}

function processInteractions(data) {
    const products = {};
    const sessionStats = {};
    const anomalies = [];
    
    // 🛡️ ANTI-FRAUD PARAMETERS
    const MAX_ACTIONS_PER_SESSION = 60;
    const RAPID_ACTION_THRESHOLD_MS = 1200;
    const MAX_RAPID_ACTIONS = 12;

    data.forEach(item => {
        const sKey = item.sessionKey || 'unknown';
        if (!sessionStats[sKey]) {
            sessionStats[sKey] = { 
                count: 0, 
                products: new Set(), 
                lastTime: 0, 
                rapidSequences: 0,
                isFlagged: false,
                reason: ''
            };
        }
        
        const s = sessionStats[sKey];
        if (s.isFlagged) return; // Ignore flagged session data

        s.count++;
        s.products.add(item.productId);
        
        // Check for rapid automated activity
        if (s.lastTime && (item.timestamp - s.lastTime < RAPID_ACTION_THRESHOLD_MS)) {
            s.rapidSequences++;
        }
        s.lastTime = item.timestamp;

        // Evaluate Fraud Status
        if (s.count > MAX_ACTIONS_PER_SESSION) {
            s.isFlagged = true;
            s.reason = 'نشاط مفرط (تخطي الحد المسموح)';
        } else if (s.rapidSequences > MAX_RAPID_ACTIONS) {
            s.isFlagged = true;
            s.reason = 'رصد نقرات سريعة (اشتباه بوتات)';
        }

        if (s.isFlagged) {
            anomalies.push({ sessionKey: sKey, reason: s.reason, timestamp: item.timestamp });
            return;
        }

        // Calculate Influence Weight (Complex Algorithm)
        if (!products[item.productId]) {
            products[item.productId] = { 
                id: item.productId,
                name: item.productName || 'منتج غير معروف', 
                views: 0, 
                clicks: 0, 
                uniqueAttractors: new Set(),
                influenceScore: 0 
            };
        }
        
        const p = products[item.productId];
        p.uniqueAttractors.add(sKey);
        
        if (item.type === 'view') {
            p.views++;
            p.influenceScore += 1.5; // View weight
        } else if (item.type === 'click') {
            p.clicks++;
            p.influenceScore += 4.5; // Click weight (high intent)
        }
    });

    // Final calculations and sorting
    const topInterests = Object.values(products)
        .map(p => ({
            ...p,
            uniqueVisitors: p.uniqueAttractors.size,
            // Bonus for unique attractiveness
            influenceScore: Number((p.influenceScore * (1 + (p.uniqueAttractors.size / 100))).toFixed(1))
        }))
        .sort((a, b) => b.influenceScore - a.influenceScore)
        .slice(0, 15);

    return {
        topInterests,
        anomalies: anomalies.slice(0, 10),
        totalUniqueSessions: Object.keys(sessionStats).length,
        flaggedSessions: Object.values(sessionStats).filter(s => s.isFlagged).length
    };
}

/**
 * Binds input listeners to a modal to save progress to STORE.uiState.
 * This ensures that if the page re-renders or reloads, the user's progress is kept.
 */
function bindModalPersistence(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const inputs = modal.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const handler = () => {
            if (!STORE.uiState) STORE.uiState = {};
            if (!STORE.uiState.modalData) STORE.uiState.modalData = { fields: {} };
            if (!STORE.uiState.modalData.fields) STORE.uiState.modalData.fields = {};
            
            if (input.classList.contains('deal-product-check')) {
                const checked = Array.from(modal.querySelectorAll('.deal-product-check:checked')).map(cb => cb.value);
                STORE.uiState.modalData.fields['deal-product-checks'] = checked;
            } else {
                const val = input.type === 'checkbox' ? input.checked : input.value;
                STORE.uiState.modalData.fields[input.id || input.name] = val;
            }

            saveStore();
            
            // Sync image preview if it's the product image
            if (input.id === 'p-image') {
                const preview = document.getElementById('p-img-preview');
                if (preview) preview.src = input.value || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400';
            }
        };

        input.oninput = handler;
        if (input.type === 'checkbox') input.onchange = handler;
    });
}

/**
 * Restores the admin interface state (open modals and form data)
 * Called after render() finishes rebuilding the admin DOM.
 */
function restoreAdminState() {
    if (!STORE.uiState || !STORE.uiState.activeModalId) {
        console.log('[Persistence] No active modal to restore.');
        return;
    }

    const modalId = STORE.uiState.activeModalId;
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`[Persistence] Could not find modal ${modalId} to restore.`);
        return;
    }

    console.log(`[Persistence] Restoring modal: ${modalId}`);
    
    // 1. Re-populate categories if it's the product modal
    if (modalId === 'product-modal') {
        const catSelect = document.getElementById('p-category');
        if (catSelect) {
            catSelect.innerHTML = (STORE.categories || []).filter(c => c.slug !== 'all').map(c => `<option value="${c.slug}">${c.label}</option>`).join('');
        }
    }

    // 2. Restore Form Data
    if (STORE.uiState.modalData && STORE.uiState.modalData.fields) {
        const data = STORE.uiState.modalData;
        const fields = data.fields;
        
        for (const [id, value] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') el.checked = !!value;
                else el.value = value;
            }
        }
        
        // Restore title
        const titleEl = modal.querySelector('h3');
        if (titleEl && data.title) titleEl.textContent = data.title;
        
        // Restore Image Preview if it exists
        const preview = document.getElementById('p-img-preview');
        if (preview && fields['p-image']) preview.src = fields['p-image'];

        // Restore Icon Preview if it exists
        const iconPreview = document.getElementById('cat-icon-preview');
        if (iconPreview && fields['cat-icon']) {
            iconPreview.className = fields['cat-icon'];
            document.querySelectorAll('.ap-icon-item').forEach(item => {
                item.classList.remove('active');
                if (item.querySelector('i').className === fields['cat-icon']) item.classList.add('active');
            });
        }

        // 3. Restore Deal Products (Special Case for Checkboxes)
        if (modalId === 'deal-modal' && fields['deal-product-checks']) {
            const checks = fields['deal-product-checks'];
            document.querySelectorAll('.deal-product-check').forEach(cb => {
                cb.checked = (checks || []).includes(cb.value);
            });
        }
    }

    // 3. Show Modal
    modal.style.display = 'flex';
    
    // 4. Re-bind listeners so they keep saving changes
    bindModalPersistence(modalId);
}

// Map globally for router.js accessibility
window.restoreAdminState = restoreAdminState;
window.bindModalPersistence = bindModalPersistence;
