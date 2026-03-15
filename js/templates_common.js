// --- Common Layout Templates ---
const TEMPLATES = {
    navbar: () => `
        <div class="header-main">
            <div class="container header-container-main">
                <a href="#home" class="logo">
                    <img src="assets/logo.png" alt="Logo" style="height: 48px; width: auto; object-fit: contain;">
                    <div style="display: flex; flex-direction: column; justify-content: center;">
                        <span style="font-size: 1.4rem; line-height: 0.9;">CASTRO</span>
                        <span style="font-size: 0.65rem; letter-spacing: 3px; font-weight: 400; opacity: 0.9;">store</span>
                    </div>
                </a>
                <div class="search-wrapper">
                    <i class="ph ph-magnifying-glass search-icon"></i>
                    <input type="text" class="search-bar" placeholder="البحث في المتجر..." oninput="handleSearch(this.value)" onclick="if(!STORE.isSearchOpen) toggleSearch()">
                </div>
                <div class="nav-actions">
                    ${sessionStorage.getItem('castro_dev_mode') === 'true' ? `
                    <a href="#admin" class="icon-btn-premium">
                        <i class="ph ph-user"></i>
                    </a>` : ''}
                    <button class="burger-btn" onclick="toggleMobileNav()"><i class="ph ph-list"></i></button>
                </div>
            </div>
        </div>
        <div class="header-nav">
            <div class="container" style="display: flex; height: 100%; align-items: center; justify-content: center; width: 100%;">
                <ul class="nav-links-row">
                    <li><a href="#home" class="${STORE.currentView === 'home' ? 'active' : ''}">الرئيسية</a></li>
                    ${(STORE.categories || []).filter(c => c.slug !== 'all').slice(0, 3).map(cat => `
                        <li><a href="#category/${cat.slug}" class="${STORE.currentParams.slug === cat.slug ? 'active' : ''}">${cat.label}</a></li>
                    `).join('')}
                    ${(() => {
            const activeDeals = (STORE.deals || []).filter(d => { const e = d.endDate ? new Date(d.endDate).getTime() : null; return !e || e > Date.now(); });
            return activeDeals.length > 0 ? `<li><a href="#home" class="nav-deals-link ${STORE.currentView === 'deal' ? 'active' : ''}" onclick="navigate('home');setTimeout(()=>document.querySelector('.deals-showcase')?.scrollIntoView({behavior:'smooth'}),100)"><i class="ph ph-tag" style="color:var(--color-primary)"></i> العروض <span class="nav-deal-badge">${activeDeals.length}</span></a></li>` : '';
        })()}
                    <li><a href="#custom-order" class="${STORE.currentView === 'custom-order' ? 'active' : ''}">طلب خاص</a></li>
                    <li><a href="#about" class="${STORE.currentView === 'about' ? 'active' : ''}">من نحن</a></li>
                    <li><a href="#contact" class="${STORE.currentView === 'contact' ? 'active' : ''}">اتصل بنا</a></li>
                </ul>
            </div>
        </div>
    `,


    footer: () => `
        <div class="footer-grid container">
            <div class="footer-col">
                <div class="logo" style="color: white; margin-bottom: 1rem;">
                    <img src="assets/logo.png" alt="Logo" style="height: 48px; width: auto; object-fit: contain; filter: brightness(0) invert(1);">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 1.4rem; line-height: 0.9; color: white; font-weight: 800;">CASTRO</span>
                        <span style="font-size: 0.65rem; letter-spacing: 3px; font-weight: 400; opacity: 0.8; color: white;">store</span>
                    </div>
                </div>
                <p style="color: #888; line-height: 1.8; font-size: 0.95rem;">فخامة المنسوجات والأثاث بلمسة عصرية تروي قصة ذوقك الرفيع. كاسترو للأثاث، فن اختيار التفاصيل.</p>
                <div class="social-links">
                    <a href="https://www.facebook.com/p/%D9%85%D8%B9%D8%B1%D8%B6-%D9%83%D8%A7%D8%B3%D8%AA%D8%B1%D9%88-%D8%B7%D9%85%D8%B1%D8%A9-100068551868384/?locale=ar_AR" target="_blank" class="social-icon-btn"><i class="ph ph-facebook-logo"></i></a>
                    <a href="#" class="social-icon-btn"><i class="ph ph-instagram-logo"></i></a>
                    <a href="#" class="social-icon-btn"><i class="ph ph-tiktok-logo"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h4>روابط سريعة</h4>
                <ul class="footer-links">
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#category/all">كل المنتجات</a></li>
                    <li><a href="#about">من نحن</a></li>
                    <li><a href="#contact">اتصل بنا</a></li>
                    <li><a href="javascript:void(0)" onclick="requestDevAccess()" style="opacity:0.2; font-size:0.75rem; margin-top:10px; display:block;">دخول المطورين</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>الأقسام</h4>
                <ul class="footer-links">
                    ${(STORE.categories || []).slice(0, 4).map(c => `
                        <li><a href="#category/${c.slug}">${c.label}</a></li>
                    `).join('')}
                </ul>
            </div>
            <div class="footer-col">
                <h4>تواصل معنا</h4>
                <ul class="footer-links">
                    <li><a href="javascript:void(0)"><i class="ph ph-map-pin"></i> طمرة - شارع القدس</a></li>
                    <li><a href="tel:${STORE.settings.phone}"><i class="ph ph-phone"></i> ${displayPhone(STORE.settings.phone)}</a></li>
                    <li><a href="https://wa.me/${STORE.settings.phone.replace(/[^0-9]/g, '')}"><i class="ph ph-whatsapp-logo"></i> واتساب مباشر</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom container">
            <div class="copy-text">&copy; ${new Date().getFullYear()} ${STORE.settings.storeName || 'كاسترو للأثاث'}. جميع الحقوق محفوظة.</div>
            <div class="dev-credits" style="font-size: 0.8rem; opacity: 0.7;">
                برمجة وتطوير <a href="https://ginusly.github.io/Adamnhar/" target="_blank" style="color: var(--color-primary); text-decoration: none;">Adam Nhar</a>
            </div>
        </div>
    `,

    floatingActions: () => `
        <div class="floating-actions">
            <!-- WhatsApp Button -->
            <a href="${formatWhatsAppLink(STORE.settings.phone)}" target="_blank" class="float-btn whatsapp-float" title="تواصل معنا عبر واتساب">
                <i class="ph-fill ph-whatsapp-logo"></i>
                <span class="float-tooltip">تواصل معنا</span>
                <span class="pulse"></span>
            </a>
            
            <!-- Scroll to Top (Improved ID and Event) -->
            <button class="float-btn scroll-top-btn" id="scrollTopBtn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                <i class="ph ph-caret-up"></i>
            </button>
        </div>
    `,

    about: () => `
        <div class="about-hero" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=2000'); background-size: cover; background-position: center; color: white; text-align: center; padding: 100px 0;">
            <div class="container animate-up">
                <h1 style="font-size: 3.5rem; margin-bottom: 20px;">قصة كاسترو للأثاث</h1>
                <p style="font-size: 1.2rem;">نحن هنا لنحول بيوتكم إلى مساحات من الجمال والراحة.</p>
            </div>
        </div>
        <div class="container animate-up section-padding">
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; align-items: center;">
                <div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px;">من نحن؟</h2>
                    <p style="font-size: 1.1rem; color: var(--color-text-light);">منذ تأسيسنا، ونحن نسعى جاهدين لتقديم أفضل حلول الأثاث المكتبي والمنزلي التي تجمع بين الجودة العالية والتصميم المبتكر.</p>
                    <p style="font-size: 1.1rem; color: var(--color-text-light); margin-top: 20px;">نحرص على استخدام أجود أنواع الأخشاب والأقمشة، ومع فريق من المصممين والحرفيين المهرة.</p>
                </div>
                <div>
                    <div style="background: white; padding: 30px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md); text-align: center;">
                        <i class="ph ph-users" style="font-size: 3rem; color: var(--color-primary);"></i>
                        <h3 style="font-size: 2.5rem; margin: 10px 0;">+500</h3>
                        <p>عميل سعيد</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    contact: () => `
        <div class="container animate-up section-padding" style="padding-top: var(--spacing-xl);">
            <div class="section-header">
                <h1>تواصل معنا</h1>
                <p>نحن هنا للمساعدة. أرسل لنا رسالة وسنقوم بالرد عليك.</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div class="admin-card">
                    <form onsubmit="event.preventDefault(); showToast('تم استلام رسالتك، شكراً لك!');">
                        <div class="form-group"><label>الاسم بالكامل</label><input type="text" required></div>
                        <div class="form-group"><label>رقم الهاتف</label><input type="tel" required></div>
                        <div class="form-group"><label>الرسالة</label><textarea rows="5" required></textarea></div>
                        <button type="submit" class="cta-button" style="width: 100%; justify-content: center;">إرسال الرسالة</button>
                    </form>
                </div>
            </div>
        </div>
    `,

    faq: () => `
        <div class="container animate-up section-padding">
            <div class="section-header"><h1>الأسئلة الشائعة</h1></div>
            <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
                ${[{ q: "ما هي المقاسات؟", a: "نوفر مقاسات قياسية وخاصة." }, { q: "الضمان؟", a: "ضمان 5 سنوات." }].map(item => `
                    <div class="admin-card" onclick="this.querySelector('.faq-a').style.display = this.querySelector('.faq-a').style.display === 'none' ? 'block' : 'none'">
                        <h4>${item.q}</h4><p class="faq-a" style="display: none;">${item.a}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    customOrder: () => `
        <div class="container animate-up section-padding">
            <div class="section-header"><h1>طلب تصميم خاص</h1></div>
            <div class="admin-card" style="max-width: 600px; margin: 0 auto;">
                <form onsubmit="event.preventDefault(); showToast('تم إرسال طلبك!');">
                    <div class="form-group"><label>الاسم</label><input type="text" required></div>
                    <div class="form-group"><label>التفاصيل</label><textarea rows="6" required></textarea></div>
                    <button type="submit" class="cta-button" style="width: 100%; justify-content: center;">إرسال الطلب</button>
                </form>
            </div>
        </div>
    `,

    bottomNav: () => `
        <div class="bottom-nav-container">
            <a href="#home" class="bn-item ${STORE.currentView === 'home' ? 'active' : ''}">
                <i class="ph${STORE.currentView === 'home' ? '-fill' : ''} ph-house-line"></i>
                <span>الرئيسية</span>
            </a>
            <a href="#category/all" class="bn-item ${STORE.currentView === 'category' ? 'active' : ''}">
                <i class="ph${STORE.currentView === 'category' ? '-fill' : ''} ph-grid-four"></i>
                <span>الأقسام</span>
            </a>
            <a href="javascript:void(0)" onclick="toggleSearch()" class="bn-item bn-search-item">
                <div class="bn-search-icon">
                    <i class="ph ph-magnifying-glass"></i>
                </div>
                <span>البحث</span>
            </a>
            <a href="#deal" onclick="navigate('home');setTimeout(()=>document.querySelector('.deals-showcase')?.scrollIntoView({behavior:'smooth'}),100)" class="bn-item">
                <i class="ph ph-tag"></i>
                <span>العروض</span>
                ${(() => {
            const count = (STORE.deals || []).length;
            return count > 0 ? `<span class="bn-badge">${count}</span>` : '';
        })()}
            </a>
            <a href="javascript:void(0)" onclick="toggleMobileNav()" class="bn-item">
                <i class="ph ph-dots-three-outline"></i>
                <span>المزيد</span>
            </a>
        </div>
    `,

    devBadge: () => `
        <div class="dev-badge">
            <a href="https://ginusly.github.io/Adamnhar/" target="_blank" class="dev-badge-link" title="تطوير وبرمجة">
                <i class="ph-bold ph-code"></i>
                <span class="dev-badge-text">ADAMNHAR</span>
            </a>
        </div>
    `,

    devNotification: () => `
        <a href="https://ginusly.github.io/Adamnhar/" target="_blank" class="dev-notification" id="dev-entry-notice">
            <div class="dev-notification-icon">
                <i class="ph-fill ph-sketch-logo"></i>
            </div>
            <div class="dev-notification-content">
                <p>صُمم بواسطة <strong>Adam Nhar</strong></p>
                <span>انقر لمعرفة المزيد حول المبرمج</span>
            </div>
            <button class="dev-notification-close" onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('dev-entry-notice').classList.remove('show');"><i class="ph ph-x"></i></button>
        </a>
    `
};
