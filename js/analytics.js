const ANALYTICS = {
    // Unique Session Key (Pseudo-fingerprint)
    getSessionKey: () => {
        let key = localStorage.getItem('castro_session_key');
        if (!key) {
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset(),
                Math.random().toString(36).substring(2, 15)
            ].join('|');
            key = btoa(unescape(encodeURIComponent(fingerprint))).substring(0, 48);
            localStorage.setItem('castro_session_key', key);
        }
        return key;
    },

    // 🛡️ ANTI-CHEAT: Behavioral Validation
    validateBehavior: (productId) => {
        const now = Date.now();
        const stats = JSON.parse(sessionStorage.getItem('castro_analytics_behavior') || '{"actions":0, "products":{}}');
        
        // Check for overall spam
        stats.actions++;
        if (stats.actions > 100) return { valid: false, reason: 'Exceeded Session Cap' };

        // Check for per-product spam (Cooldown)
        const lastAction = stats.products[productId] || 0;
        if (now - lastAction < 180000) { // 3 minute cooldown for same product
            return { valid: false, reason: 'Cooldown active' };
        }

        stats.products[productId] = now;
        sessionStorage.setItem('castro_analytics_behavior', JSON.stringify(stats));
        return { valid: true };
    },

    track: async (productId, productName, type) => {
        try {
            const validation = ANALYTICS.validateBehavior(productId);
            if (!validation.valid) {
                if (validation.reason !== 'Cooldown active') console.warn(`[Analytics] Suspicious behavior: ${validation.reason}`);
                return;
            }

            const sessionKey = ANALYTICS.getSessionKey();
            const payload = {
                productId,
                productName,
                type, // 'view' | 'click'
                timestamp: Date.now(),
                sessionKey,
                v: '2.0-AE', // Algorithm Version
                verified: true
            };

            if (window.castroDb) {
                const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                await addDoc(collection(window.castroDb, "interactions"), payload);
            }
        } catch (err) { /* Silent fail to not affect UX */ }
    }
};

window.trackProductInterest = (id, name) => ANALYTICS.track(id, name, 'click');
window.trackProductView = (id, name) => ANALYTICS.track(id, name, 'view');
