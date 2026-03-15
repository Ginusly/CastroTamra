// --- Admin Panel Actions ---
function switchAdminPage(page) {
    STORE.adminPage = page;
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
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
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
    render();
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
        render();
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
    render();
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
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
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
    render();
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
    render();
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
