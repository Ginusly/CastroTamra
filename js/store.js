// --- State Management ---
const STORE = {
    products: [],
    categories: JSON.parse(localStorage.getItem('castro_categories')) || INITIAL_CATEGORIES.map(c => ({ ...c, id: c.slug })),
    deals: JSON.parse(localStorage.getItem('castro_deals')) || [], // Promotional deals/offers
    announcement: JSON.parse(localStorage.getItem('castro_announcement')) || null, // Top banner announcement
    INITIAL_SETTINGS: INITIAL_SETTINGS, // Reference to default
    INITIAL_PRODUCTS: INITIAL_PRODUCTS, // Reference to default
    settings: JSON.parse(localStorage.getItem('castro_settings')) || INITIAL_SETTINGS,
    currentView: 'home', // home, category, product, admin, about, contact, faq, custom-order, deal
    currentParams: {},
    uiState: JSON.parse(localStorage.getItem('castro_ui_state')) || {
        activeModalId: null,
        modalData: null,
        adminPage: 'overview'
    },
    renderPending: false, // Flag to defer renders while modals are open
    theme: (() => {
        const defaultTheme = {
            colors: {
                primary: '#d32f2f',
                secondary: '#ffd700',
                success: '#2e7d32',
                info: '#0288d1',
                warning: '#f57c00',
                background: '#ffffff',
                text: '#1a1a1a'
            },
            fonts: {
                heading: 'Almarai',
                body: 'Tajawal',
                sizes: {
                    h1: '3rem',
                    h2: '2.25rem',
                    h3: '1.75rem',
                    body: '1rem'
                }
            },
            spacing: {
                sm: '0.5rem',
                md: '1rem',
                lg: '2rem',
                xl: '3rem'
            },
            borderRadius: {
                sm: '6px',
                md: '12px',
                lg: '20px'
            },
            shadows: {
                sm: '0 2px 4px rgba(0,0,0,0.1)',
                md: '0 4px 8px rgba(0,0,0,0.1)',
                lg: '0 8px 16px rgba(0,0,0,0.1)'
            },
            opacity: {
                overlay: '0.5',
                disabled: '0.6'
            }
        };
        const saved = JSON.parse(localStorage.getItem('castro_theme'));
        if (!saved) return defaultTheme;
        // Ensure new properties exist
        if (!saved.opacity) saved.opacity = defaultTheme.opacity;
        if (!saved.fonts.sizes) saved.fonts.sizes = defaultTheme.fonts.sizes;
        return { ...defaultTheme, ...saved };
    })(),
    themePresets: {
        classic: {
            name: 'كلاسيك (أحمر)',
            colors: { primary: '#d32f2f', secondary: '#ffd700', background: '#ffffff', text: '#1a1a1a' }
        },
        luxury: {
            name: 'فخامة (ذهبي وأسود)',
            colors: { primary: '#b8860b', secondary: '#ffffff', background: '#1a1a1a', text: '#ffffff' }
        },
        modern: {
            name: 'مودرن (أزرق)',
            colors: { primary: '#0288d1', secondary: '#e1f5fe', background: '#ffffff', text: '#263238' }
        },
        nature: {
            name: 'طبيعة (أخضر)',
            colors: { primary: '#2e7d32', secondary: '#f1f8e9', background: '#ffffff', text: '#1b5e20' }
        }
    },
    isSearchOpen: false,
    currentSlide: 0,
    allAdmins: [], // All registered developers
    devLogs: [], // History of actions
    banners: JSON.parse(localStorage.getItem('castro_banners')) || [
        {
            id: 'b1',
            image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=2000',
            title: 'خـصـومات الـشـتـاء',
            text: 'وفـّر حتى 40% على أطقم الكنب الفاخرة',
            ctaText: 'اكتشف الآن',
            dealId: null,
            featuredProductIds: []
        },
        {
            id: 'b2',
            image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000',
            title: 'تـصامـيم عـصـرية',
            text: 'أجمل غرف النوم الإيطالية بأسعار لا تُقاوم',
            ctaText: 'تسوق الآن',
            dealId: null,
            featuredProductIds: []
        },
        {
            id: 'b3',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000',
            title: 'جـودة تـدوم',
            text: 'أثاث مكتبي مريح يرفع إنتاجيتك',
            ctaText: 'شاهد المجموعة',
            dealId: null,
            featuredProductIds: []
        }
    ]
};

function saveStore() {
    localStorage.setItem('castro_ui_state', JSON.stringify(STORE.uiState || {}));
    localStorage.setItem('castro_products', JSON.stringify(STORE.products));
    localStorage.setItem('castro_categories', JSON.stringify(STORE.categories));
    localStorage.setItem('castro_settings', JSON.stringify(STORE.settings));
    localStorage.setItem('castro_deals', JSON.stringify(STORE.deals));
    localStorage.setItem('castro_banners', JSON.stringify(STORE.banners));
    if (STORE.announcement) localStorage.setItem('castro_announcement', JSON.stringify(STORE.announcement));
    else localStorage.removeItem('castro_announcement');
}

// Track Firestore unsubscribe functions
let _unsubProducts = null;
let _unsubCategories = null;
let _unsubSettings = null;
let _unsubDeals = null;
let _unsubBanners = null;
let _unsubAnn = null;
let _unsubAdmins = null;
let _unsubLogs = null;

/**
 * Load initial data from localStorage cache (instant, no network wait)
 */
function loadCachedData() {
    try {
        const cachedUiString = localStorage.getItem('castro_ui_state');
        if (cachedUiString) {
            const cachedUi = JSON.parse(cachedUiString);
            if (cachedUi) STORE.uiState = { ...STORE.uiState, ...cachedUi };
        }
    } catch(e) { console.warn('Corrupted UI state in localStorage', e); }

    try {
        const cachedProductsString = localStorage.getItem('castro_products');
        if (cachedProductsString) {
            const cachedProducts = JSON.parse(cachedProductsString);
            if (cachedProducts && cachedProducts.length > 0) {
                STORE.products = cachedProducts;
            }
        }
    } catch(e) {}

    try {
        const cachedCatsString = localStorage.getItem('castro_categories');
        if (cachedCatsString) {
            const cachedCats = JSON.parse(cachedCatsString);
            if (cachedCats && cachedCats.length > 0) {
                STORE.categories = cachedCats;
            }
        }
    } catch(e) {}
}

/**
 * Subscribe to Firestore with real-time onSnapshot.
 * This keeps the store permanently in sync — no more stale data on HMR.
 */
async function loadDataFromFirebase() {
    if (!window.castroDb) {
        console.warn('[Firebase] castroDb not ready. Waiting...');
        await new Promise(r => setTimeout(r, 600));
        if (!window.castroDb) {
            console.error('[Firebase] Still not ready. Using cache only.');
            loadCachedData();
            return;
        }
    }

    const db = window.castroDb;

    try {
        const { collection, onSnapshot, doc } = await import(
            "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
        );

        // ── Unsubscribe any previous listeners ──
        if (_unsubProducts) _unsubProducts();
        if (_unsubCategories) _unsubCategories();
        if (_unsubSettings) _unsubSettings();
        if (_unsubDeals) _unsubDeals();
        if (_unsubBanners) _unsubBanners();
        if (_unsubAnn) _unsubAnn();
        if (_unsubAdmins) _unsubAdmins();
        if (_unsubLogs) _unsubLogs();

        const safeOnSnapshot = (ref, callback, label) => {
            return onSnapshot(ref, callback, (err) => {
                if (err.code === 'permission-denied') {
                    console.warn(`[Firebase] Permission Denied for ${label}. Check Security Rules.`);
                } else {
                    console.error(`[Firebase] Listener Error for ${label}:`, err);
                }
            });
        };

        // ── Subscribe with individual error boundaries ──
        _unsubProducts = safeOnSnapshot(collection(db, "products"), (snapshot) => {
            const products = [];
            snapshot.forEach(doc => products.push({ ...doc.data(), id: doc.id }));
            if (products.length > 0) {
                STORE.products = products;
                localStorage.setItem('castro_products', JSON.stringify(products));
            }
            if (typeof render === 'function') render();
        }, "products");

        _unsubCategories = safeOnSnapshot(collection(db, "categories"), (snapshot) => {
            const cats = [];
            snapshot.forEach(doc => cats.push({ ...doc.data(), id: doc.id }));
            if (cats.length > 0) {
                STORE.categories = cats;
                localStorage.setItem('castro_categories', JSON.stringify(cats));
            }
            if (typeof render === 'function') render();
        }, "categories");

        _unsubSettings = safeOnSnapshot(doc(db, "settings", "global"), (snapshot) => {
            if (snapshot.exists()) {
                STORE.settings = snapshot.data();
                localStorage.setItem('castro_settings', JSON.stringify(STORE.settings));
                if (typeof updateMeta === 'function') updateMeta();
                if (typeof render === 'function') render();
            }
        }, "settings/global");

        _unsubDeals = safeOnSnapshot(collection(db, "deals"), (snapshot) => {
            const deals = [];
            snapshot.forEach(doc => deals.push({ ...doc.data(), id: doc.id }));
            STORE.deals = deals;
            localStorage.setItem('castro_deals', JSON.stringify(deals));
            if (typeof render === 'function') render();
        }, "deals");

        _unsubBanners = safeOnSnapshot(collection(db, "banners"), (snapshot) => {
            const banners = [];
            snapshot.forEach(doc => banners.push({ ...doc.data(), id: doc.id }));
            if (banners.length > 0) {
                STORE.banners = banners;
                localStorage.setItem('castro_banners', JSON.stringify(banners));
            }
            if (typeof render === 'function') render();
        }, "banners");

        _unsubAnn = safeOnSnapshot(doc(db, "settings", "announcement"), (snapshot) => {
            if (snapshot.exists()) {
                STORE.announcement = snapshot.data();
                localStorage.setItem('castro_announcement', JSON.stringify(STORE.announcement));
            } else {
                STORE.announcement = null;
                localStorage.removeItem('castro_announcement');
            }
            if (typeof render === 'function') render();
        }, "settings/announcement");

        _unsubAdmins = safeOnSnapshot(collection(db, "admins"), (snapshot) => {
            const adms = [];
            snapshot.forEach(doc => adms.push({ ...doc.data(), uid: doc.id }));
            STORE.allAdmins = adms.sort((a,b) => (b.lastSeen || 0) - (a.lastSeen || 0));
            if (typeof render === 'function') render();
        }, "admins");

        _unsubLogs = safeOnSnapshot(collection(db, "logs"), (snapshot) => {
            const logs = [];
            snapshot.forEach(doc => logs.push({ ...doc.data(), id: doc.id }));
            STORE.devLogs = logs.sort((a, b) => b.timestamp - a.timestamp);
            if (typeof render === 'function') render();
        }, "logs");

    } catch (err) {
        console.error('[Firebase] Fatal setup error:', err);
        loadCachedData();
    }
}

let sliderInterval;
