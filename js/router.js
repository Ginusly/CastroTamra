// --- Application Navigation & Rendering ---
function navigate(view, params = {}) {
    STORE.currentView = view;
    STORE.currentParams = params;
    window.location.hash = `#${view}${params.id ? `/${params.id}` : ''}${params.slug ? `/${params.slug}` : ''}`;
    render(true);
    window.scrollTo(0, 0);
}

function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    const view = parts[0] || 'home';

    if (view === 'product') {
        navigate('product', { id: parts[1] });
    } else if (view === 'category') {
        navigate('category', { slug: parts[1] });
    } else if (view === 'deal') {
        navigate('deal', { id: parts[1] });
    } else if (view === 'dev-register') {
        navigate('dev-register', { secret: parts[1] });
    } else {
        STORE.currentView = view;
        render();
    }
}

function toggleMobileNav() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    if (overlay && backdrop) {
        overlay.classList.toggle('active');
        backdrop.classList.toggle('active');
        document.body.classList.toggle('no-scroll', overlay.classList.contains('active'));
    }
}

function render(force = false) {
    // 🛡️ Reveal body IMMEDIATELY on first render attempt
    document.getElementById('security-layer')?.remove();

    const app = document.getElementById('app');

    // 🛡️ Prevent render from closing open modals UNLESS the app is currently empty (initial load)
    // This allows us to restore a modal state safely on refresh without getting stuck on a white screen.
    const appIsEmpty = !app || app.innerHTML.trim() === "";
    if (!force && !appIsEmpty && typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
        STORE.renderPending = true;
        console.log('[Render] Deferring render while modal is open.');
        return;
    }
    STORE.renderPending = false;

    try {
        updateMeta();
    const app = document.getElementById('app');
    const header = document.querySelector('header');

    if (!document.querySelector('.mobile-nav-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.innerHTML = `
            <div class="mobile-nav-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <img src="assets/logo.png" alt="${STORE.settings.storeName}" style="height:40px; object-fit:contain;">
                    <button class="icon-btn" onclick="toggleMobileNav()"><i class="ph ph-x" style="font-size: 2rem;"></i></button>
                </div>
            </div>
            <div class="mobile-nav-links">
                <a href="#home" onclick="toggleMobileNav()">الرئيسية <i class="ph ph-house"></i></a>
                <a href="#category/all" onclick="toggleMobileNav()">المتجر <i class="ph ph-storefront"></i></a>
                <a href="#deals" onclick="navigate('home');toggleMobileNav();setTimeout(()=>document.querySelector('.deals-showcase')?.scrollIntoView({behavior:'smooth'}),200)">العروض <i class="ph ph-tag"></i></a>
                <a href="#custom-order" onclick="toggleMobileNav()">طلب خاص <i class="ph ph-palette"></i></a>
                <a href="#about" onclick="toggleMobileNav()">من نحن <i class="ph ph-info"></i></a>
                <a href="${formatWhatsAppLink(STORE.settings.phone)}" target="_blank" onclick="toggleMobileNav()">اتصل بنا <i class="ph ph-phone"></i></a>
                ${sessionStorage.getItem('castro_dev_mode') === 'true' ? `<a href="#admin" onclick="toggleMobileNav()">لوحة التحكم <i class="ph ph-fingerprint"></i></a>` : ''}
            </div>
            <div class="mobile-nav-footer">
                <div class="mobile-nav-info">
                    <p>للطلب والاستفسار تواصل معنا:</p>
                    <p style="font-weight:800; color:var(--color-text-main); margin-top:5px;">${displayPhone(STORE.settings.phone)}</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav-backdrop';
        backdrop.onclick = toggleMobileNav;
        document.body.appendChild(backdrop);
    }

    const footer = document.getElementById('footer');
    footer.innerHTML = TEMPLATES.footer();

    // ── Mobile Bottom Nav ──
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        if (window.innerWidth <= 768 && STORE.currentView !== 'admin') {
            bottomNav.style.display = 'block';
            bottomNav.innerHTML = TEMPLATES.bottomNav();
        } else {
            bottomNav.style.display = 'none';
        }
    }

    // ── Global Floating Actions ──
    if (!document.querySelector('.floating-actions')) {
        const floatCont = document.createElement('div');
        floatCont.innerHTML = TEMPLATES.floatingActions();
        document.body.appendChild(floatCont.firstElementChild);

        // Add scroll listener for ScrollTop button
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('scrollTopBtn');
            if (btn) btn.classList.toggle('visible', window.scrollY > 400);
        });
    }

    // ── Developer Badge ──
    if (!document.querySelector('.dev-badge')) {
        const devCont = document.createElement('div');
        devCont.innerHTML = TEMPLATES.devBadge();
        document.body.appendChild(devCont.firstElementChild);
    }

    // ── Developer Entry Notification ──
    if (!document.querySelector('.dev-notification') && !sessionStorage.getItem('dev_notified')) {
        const notifCont = document.createElement('div');
        notifCont.innerHTML = TEMPLATES.devNotification();
        const notifEl = notifCont.firstElementChild;
        document.body.appendChild(notifEl);
        
        // Trigger animation after a short delay
        setTimeout(() => {
            notifEl.classList.add('show');
            sessionStorage.setItem('dev_notified', 'true');
        }, 2000);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notifEl) notifEl.classList.remove('show');
        }, 12000);
    }
    const floatWrap = document.querySelector('.floating-actions');

    if (STORE.currentView === 'dev-register') {
        header.style.display = 'none';
        footer.style.display = 'none';
        if (floatWrap) floatWrap.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'none';
        const devBadge = document.querySelector('.dev-badge');
        if (devBadge) devBadge.style.display = 'none';
        const devNotif = document.querySelector('.dev-notification');
        if (devNotif) devNotif.style.display = 'none';
        app.style.marginTop = '0';
        app.style.paddingTop = '0';
        app.innerHTML = TEMPLATES.devRegister(STORE.currentParams.secret);
        requestAnimationFrame(() => app.classList.add('loaded'));
        return;
    }

    if (STORE.currentView === 'admin') {
        header.style.display = 'none';
        footer.style.display = 'none';
        if (floatWrap) floatWrap.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'none';
        const devBadge = document.querySelector('.dev-badge');
        if (devBadge) devBadge.style.display = 'none';
        const devNotif = document.querySelector('.dev-notification');
        if (devNotif) devNotif.style.display = 'none';
        app.style.marginTop = '0';
        app.style.paddingTop = '0';
        document.body.style.overflow = 'hidden';

        // 1. Not Logged In
        if (!STORE.adminUser) {
            app.innerHTML = `
                <div class="admin-login-wrapper" style="height:100vh; width:100vw; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #1a1a2e 0%, #0a0a0b 100%); font-family:'Tajawal',sans-serif; direction:rtl; padding:20px; position:fixed; inset:0; z-index:999999;">
                    <div class="login-glass-panel" id="admin-login-card" style="max-width:480px; width:100%; padding:60px 45px; text-align:center; background:rgba(255,255,255,0.03); backdrop-filter:blur(25px); border:1px solid rgba(255,255,255,0.1); border-radius:35px; box-shadow:0 35px 100px rgba(0,0,0,0.6); animation:apSlideUp 0.6s ease;">
                        <div class="login-icon-box" style="width:90px; height:90px; background:rgba(230,0,18,0.12); color:#e60012; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.6rem; margin:0 auto 28px; box-shadow:0 0 40px rgba(230,0,18,0.25);">
                            <i class="ph-fill ph-lock-keyhole"></i>
                        </div>
                        <h2 style="color:white; margin-bottom:14px; font-weight:900; font-size:2rem;">دخول المطورين</h2>
                        <p style="color:rgba(255,255,255,0.55); font-size:1.05rem; margin-bottom:40px;">يرجى تسجيل الدخول بحسابك المعتمد</p>
                        
                        <button class="ap-btn-primary" style="width:100%; height:55px; font-size:1.1rem; border-radius:15px; background:#fff; color:#000;" onclick="window.requestDevAccess()">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:20px; margin-left:10px;">
                            المتابعة باستخدام جوجل
                        </button>
                    </div>
                </div>
            `;
            requestAnimationFrame(() => app.classList.add('loaded'));
            return;
        }

        // 2. Pending Approval
        if (STORE.adminUser.status === 'pending') {
            app.innerHTML = TEMPLATES.adminPending();
            requestAnimationFrame(() => app.classList.add('loaded'));
            return;
        }

        // 3. Active Admin
        app.innerHTML = TEMPLATES.admin();
        if (typeof restoreAdminState === 'function') {
            requestAnimationFrame(restoreAdminState);
        }
        requestAnimationFrame(() => app.classList.add('loaded'));
        return;
    } else {
        footer.style.display = 'block';
        if (floatWrap) floatWrap.style.display = 'flex';
        const devBadge = document.querySelector('.dev-badge');
        if (devBadge) devBadge.style.display = 'flex';
        const devNotif = document.querySelector('.dev-notification');
        if (devNotif) devNotif.style.display = 'flex';
        document.body.style.overflow = '';

        // Refresh floating buttons content (for dynamic phone update)
        if (floatWrap) floatWrap.innerHTML = TEMPLATES.floatingActions().replace('<div class="floating-actions">', '').replace('</div>', '');

        // Adjust floating actions bottom position if bottom nav is visible
        if (floatWrap) {
            floatWrap.style.bottom = (window.innerWidth <= 768) ? '90px' : '30px';
        }

        // ── Announcement Bar — injected INSIDE the header ──
        const ann = STORE.announcement;
        let annBar = '';
        if (ann && ann.active && ann.text) {
            const target = ann.dealId
                ? `navigate('deal',{id:'${ann.dealId}'})`
                : `navigate('category',{slug:'all'})`;

            // Support multiple messages separated by |
            const messages = ann.text.split('|').map(m => m.trim()).filter(Boolean);
            const content = messages.map(m => `<span class="ann-ticker-item">${m}</span>`).join('<span class="ann-ticker-sep">✦</span>');
            const tickerContent = (content + '<span class="ann-ticker-sep">✦</span>').repeat(4);

            annBar = `
                <div id="site-announcement" class="ann-bar" style="background:${ann.bg || '#e60012'};color:${ann.textColor || '#fff'}" onclick="${target}">
                    <div class="ann-bar-inner">
                        <div class="ann-ticker-nowrap">
                            <div class="ann-ticker">
                                ${tickerContent}
                            </div>
                        </div>
                        ${ann.btnLabel ? `<div class="ann-btn-wrap"><span class="ann-cta-btn" style="background:rgba(255,255,255,0.22);color:inherit">${ann.btnLabel} <i class="ph ph-arrow-left"></i></span></div>` : ''}
                    </div>
                    <button class="ann-close" onclick="event.stopPropagation();document.getElementById('site-announcement').remove();adjustHeaderHeight()" title="إغلاق">
                        <i class="ph ph-x"></i>
                    </button>
                </div>`;
        }

        header.innerHTML = annBar + TEMPLATES.navbar();
        header.style.display = 'block';

        // Adjust page top offset
        const headerH = header.offsetHeight;
        app.style.paddingTop = headerH + 'px';
        app.style.marginTop = '0';

        const views = {
            home: TEMPLATES.home,
            category: () => TEMPLATES.category(STORE.currentParams.slug || 'all'),
            product: () => TEMPLATES.product(STORE.currentParams.id),
            deal: () => TEMPLATES.deal ? TEMPLATES.deal(STORE.currentParams.id) : '',
            about: TEMPLATES.about,
            contact: TEMPLATES.contact,
            faq: TEMPLATES.faq,
            'custom-order': TEMPLATES.customOrder
        };
        app.innerHTML = (views[STORE.currentView] || views.home)();
        
        // Trigger reveal
        requestAnimationFrame(() => app.classList.add('loaded'));
    } // end else
} catch (err) {
    console.error('[Render Error]', err);
    // Ensure even in error, the security layer is gone
    document.getElementById('security-layer')?.remove();
}
}

function adjustHeaderHeight() {
    const header = document.querySelector('header');
    const app = document.getElementById('app');
    if (header && app) app.style.paddingTop = header.offsetHeight + 'px';
}

window.addEventListener('hashchange', () => {
    handleHashChange();
    if (sliderInterval) clearInterval(sliderInterval);
    if (STORE.currentView === 'home') {
        sliderInterval = setInterval(nextSlide, 5000);
    }
});
