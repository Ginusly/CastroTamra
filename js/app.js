// --- Main Application Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Load from localStorage cache INSTANTLY (zero flicker)
    loadCachedData();

    // Step 2: Render immediately with cached data
    updateMeta();
    handleHashChange();

    // Step 3: Start Firestore real-time listener in background (non-blocking)
    // When data arrives, onSnapshot will call render() automatically
    loadDataFromFirebase();

    // Step 4: Start slider if on home
    if (STORE.currentView === 'home') {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    }

    // Scroll Effects (Progress, Header, Back-to-Top)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const scrollBar = document.getElementById('scroll-bar');
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        
        // Header Glass Effect
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + "%";

        // Back to Top Visibility
        if (window.scrollY > 500) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    });

    // Welcome Message
    setTimeout(() => {
        if (typeof showToast === 'function') {
            showToast('مرحباً بك في كاسترو - نتمنى لك تجربة تسوق ممتعة', 'info');
        }
    }, 1500);

    console.log('Castro App Initialized ✅');
});
