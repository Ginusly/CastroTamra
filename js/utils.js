// --- Image Loading & UI Helpers ---
function ImageWithLoader(src, alt, className = "") {
    const id = 'img-' + Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
        const img = new Image();
        img.src = src;
        img.alt = alt;
        img.className = className + " img-loading";
        img.onload = () => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '';
                container.appendChild(img);
                setTimeout(() => img.classList.add('img-loaded'), 50);
            }
        };
        img.onerror = () => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '<div class="error-placeholder"><i class="ph ph-image-break"></i></div>';
            }
        };
    }, 0);
    return `<div id="${id}" class="skeleton skeleton-box"></div>`;
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="ph ${type === 'success' ? 'ph-check-circle' : 'ph-warning-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateMeta() {
    const siteName = STORE.settings.storeName || 'كاسترو للأثاث';
    const welcome = STORE.settings.welcomeMessage || 'فخامة بلمسة عصرية';

    // Determine absolute base URL for sharing
    const isGithub = window.location.hostname.includes('github.io');
    const path = isGithub ? '/CastroTamra' : '';
    const baseUrl = window.location.origin + path;
    const currentUrl = window.location.href;

    let title = `${siteName} | ${welcome.split('-')[0].trim()}`;
    let description = "كاسترو للأثاث - فخامة بلمسة عصرية. اكتشف تفاصيل الأثاث الراقي المصمم بعناية ليناسب ذوقك الرفيع.";
    let image = `${baseUrl}/assets/logo.png`;

    if (STORE.currentView === 'product' && STORE.currentParams.id) {
        const product = STORE.products.find(p => p.id === STORE.currentParams.id);
        if (product) {
            title = `${product.name} | ${siteName}`;
            description = product.description || description;
            image = product.image || image;
        }
    } else if (STORE.currentView === 'category' && STORE.currentParams.slug) {
        const category = STORE.categories.find(c => c.slug === STORE.currentParams.slug);
        if (category) {
            title = `${category.label} | ${siteName}`;
            description = `تصفح أرقى تشكيلة من ${category.label} في متجر ${siteName}.`;
        }
    } else if (STORE.currentView === 'deal' && STORE.currentParams.id) {
        const deal = STORE.deals.find(d => d.id === STORE.currentParams.id);
        if (deal) {
            title = `${deal.title} | ${siteName}`;
            description = deal.description || deal.text || description;
            image = null; // No image for deals as requested
        }
    }

    // Update Browser/DOM
    document.title = title;

    // Meta Helper
    const setMeta = (property, value, isProperty = true) => {
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${property}"]`);

        if (value) {
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        } else if (el) {
            el.remove();
        }
    };

    setMeta('description', description, false);
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', currentUrl);
    setMeta('og:image', image);

    setMeta('twitter:title', title, false);
    setMeta('twitter:description', description, false);
    setMeta('twitter:url', currentUrl, false);
    setMeta('twitter:image', image, false);
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary', false);
}

/**
 * Utility to convert file input to Base64 string
 */
function encodeImageFileAsURL(element, callback) {
    const file = element.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = function () {
        callback(reader.result);
    }
    reader.readAsDataURL(file);
}

/**
 * Formats a WhatsApp link from either a raw phone number or a full URL
 */
function formatWhatsAppLink(phone, message = "") {
    if (!phone) return "#";
    const cleanPhone = phone.trim();

    // If it's already a link, return it as is
    if (cleanPhone.startsWith('http')) return cleanPhone;

    // Remove non-digit characters for standard wa.me
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    const msg = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${digitsOnly}${msg}`;
}

/**
 * Extracts a readable phone number from a raw number or WhatsApp link
 */
function displayPhone(phone) {
    if (!phone) return "";
    const clean = phone.trim();
    if (!clean.startsWith('http')) return clean;

    // If it's a WhatsApp link, try to extract the phone number
    try {
        const url = new URL(clean);
        return url.searchParams.get('phone') || url.pathname.split('/').pop() || clean;
    } catch (e) {
        return clean;
    }
}

/**
 * Checks if any modal is currently visible on screen.
 * This is used to prevent background background renders from closing active edit sessions.
 */
function isAnyModalOpen() {
    const modals = document.querySelectorAll('.ap-modal-overlay');
    return Array.from(modals).some(m => m.style.display === 'flex' || m.classList.contains('active'));
}
