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
        <div class="about-premium-hero" style="position: relative; overflow: hidden; padding: 160px 0 100px; background: #0a0a0b; color: white; text-align: center;">
            <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=2000'); background-size: cover; background-position: center; opacity: 0.25; filter: grayscale(1) contrast(1.2);"></div>
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #0a0a0b 100%);"></div>
            <div class="container" style="position: relative; z-index: 2;">
                <span class="label-txt" style="color: #ff4d4f; letter-spacing: 6px; font-size: 0.8rem; margin-bottom: 15px;">الفخامة بلمسة عصرية</span>
                <h1 style="font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; margin-bottom: 25px; line-height: 1.1;">قصة كاسترو <span style="color: #ff4d4f;">للمفروشات</span></h1>
                <p style="font-size: 1.25rem; max-width: 700px; margin: 0 auto; line-height: 1.8; color: rgba(255,255,255,0.7);">منذ اللحظة الأولى، وضعنا نُصب أعيننا تعريفاً جديداً للفخامة والراحة في كل منزل وكل مكتب.</p>
            </div>
        </div>

        <div class="section-padding" style="background: #0a0a0b; color: white;">
            <div class="container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div class="glass-card-premium" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 40px; border-radius: 30px; backdrop-filter: blur(10px);">
                        <i class="ph ph-crown" style="font-size: 3rem; color: #ff4d4f; margin-bottom: 20px;"></i>
                        <h3 style="font-size: 1.8rem; margin-bottom: 15px;">رؤيتنا</h3>
                        <p style="color: rgba(255,255,255,0.6); line-height: 1.7;">أن نكون الوجهة الأولى لكل من يبحث عن التميز والفرادة في عالم الأثاث، واضعين معايير عالمية للجودة بلمسة محلية.</p>
                    </div>
                    <div class="glass-card-premium" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 40px; border-radius: 30px; backdrop-filter: blur(10px);">
                        <i class="ph ph-sketch-logo" style="font-size: 3rem; color: #ff4d4f; margin-bottom: 20px;"></i>
                        <h3 style="font-size: 1.8rem; margin-bottom: 15px;">احترافية التصميم</h3>
                        <p style="color: rgba(255,255,255,0.6); line-height: 1.7;">كل قطعة ننتجها تمر بسلسلة من مراحل التدقيق الفني والجمالي، لضمان توازن مثالي بين الشكل والوظيفة.</p>
                    </div>
                    <div class="glass-card-premium" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 40px; border-radius: 30px; backdrop-filter: blur(10px);">
                        <i class="ph ph-hand-heart" style="font-size: 3rem; color: #ff4d4f; margin-bottom: 20px;"></i>
                        <h3 style="font-size: 1.8rem; margin-bottom: 15px;">ثقة العملاء</h3>
                        <p style="color: rgba(255,255,255,0.6); line-height: 1.7;">أكثر من 500 عميل سعيد حول المنطقة يضعون ثقتهم بنا، ونحن نعتبر كل عميل شريكاً في قصة نجاحنا المستمرة.</p>
                    </div>
                </div>
                
                <div style="margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
                    <div style="position: relative;">
                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" style="width: 100%; border-radius: 40px; box-shadow: 0 50px 100px rgba(0,0,0,0.5);">
                        <div style="position: absolute; bottom: -30px; left: -30px; background: #ff4d4f; padding: 30px; border-radius: 25px; box-shadow: 0 15px 30px rgba(230,0,18,0.3);">
                            <h4 style="font-size: 2.5rem; color: white;">+12</h4>
                            <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; font-weight: 700;">عاماً من الخبرة</span>
                        </div>
                    </div>
                    <div>
                        <h2 style="font-size: 2.8rem; margin-bottom: 25px;">لمسة فنية في كل <span style="color: #ff4d4f;">ركن</span></h2>
                        <p style="color: rgba(255,255,255,0.6); line-height: 1.8; font-size: 1.1rem; margin-bottom: 30px;">نحن نؤمن أن الأثاث ليس مجرد قطع خشبية، بل هو روح المكان. لذلك نكرس جهودنا لاختيار المواد التي تعمر طويلاً وتعكس ذوقك الفخم.</p>
                        <div style="display: flex; gap: 20px;">
                            <button class="cta-button" onclick="navigate('category/all')">اكتشف المجموعة</button>
                            <button class="icon-btn-premium" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: white;" onclick="navigate('contact')">تواصل معنا</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    contact: () => `
        <div class="section-padding" style="padding-top: 150px; background: #f8fafc;">
            <div class="container animate-up">
                <div class="section-header">
                    <h1>تواصل مع النخبة</h1>
                    <p>فريقنا مستعد لتلبية طلباتكم الخاصة والإجابة على كافة استفساراتكم.</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 50px; margin-top: 50px;">
                    <div style="background: white; padding: 50px; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 1.8rem; margin-bottom: 30px; font-weight: 900;">أرسل استفسارك</h3>
                        <form onsubmit="event.preventDefault(); showToast('تم استلام رسالتك، شكراً لك!'); this.reset();">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-group"><label class="ap-form-label">الاسم بالكامل</label><input type="text" class="ap-form-input" style="background:#f1f5f9" required></div>
                                <div class="form-group"><label class="ap-form-label">رقم الهاتف</label><input type="tel" class="ap-form-input" style="background:#f1f5f9" required></div>
                            </div>
                            <div class="form-group" style="margin-top:20px"><label class="ap-form-label">الموضوع</label><input type="text" class="ap-form-input" style="background:#f1f5f9"></div>
                            <div class="form-group" style="margin-top:20px"><label class="ap-form-label">الرسالة</label><textarea rows="5" class="ap-form-textarea" style="background:#f1f5f9" required></textarea></div>
                            <button type="submit" class="cta-button" style="width: 100%; justify-content: center; margin-top: 30px; height: 60px; font-size: 1.1rem; border-radius: 18px;">
                                <i class="ph ph-paper-plane-tilt" style="margin-left: 10px;"></i> إرسال رسالتك الآن
                            </button>
                        </form>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 25px;">
                        <div class="contact-card-premium" style="background: #1a1a2e; color: white; padding: 40px; border-radius: 40px; box-shadow: 0 25px 50px rgba(26,26,46,0.25);">
                            <i class="ph ph-map-pin-line" style="font-size: 2.5rem; color: #ff4d4f; margin-bottom: 20px;"></i>
                            <h4 style="font-size: 1.4rem; margin-bottom: 10px;">موقعنا</h4>
                            <p style="opacity: 0.7;">طمرة، شارع القدس - مجمع كاسترو للأثاث</p>
                            <a href="https://maps.google.com" target="_blank" style="display: inline-block; margin-top: 15px; color: #ff4d4f; font-weight: 800; text-decoration: none;">عرض على الخريطة <i class="ph ph-arrow-left"></i></a>
                        </div>
                        <div class="contact-card-premium" style="background: white; padding: 40px; border-radius: 40px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
                            <i class="ph ph-chats-circle" style="font-size: 2.5rem; color: #07c160; margin-bottom: 20px;"></i>
                            <h4 style="font-size: 1.4rem; margin-bottom: 10px;">دعم المبيعات</h4>
                            <p style="color: #64748b;">تحدث مباشرة مع فريق المبيعات عبر واتساب لطلب صور حقيقية.</p>
                            <a href="tel:${STORE.settings.phone}" style="display: flex; align-items: center; gap: 10px; margin-top: 15px; font-size: 1.3rem; font-weight: 900; color: #1a1a2e; text-decoration: none;">
                                <i class="ph ph-phone"></i> ${displayPhone(STORE.settings.phone)}
                            </a>
                        </div>
                        <div class="contact-card-premium" style="background: white; padding: 40px; border-radius: 40px; border: 1px solid #f1f5f9;">
                            <i class="ph ph-clock" style="font-size: 2.5rem; color: #64748b; margin-bottom: 20px;"></i>
                            <h4 style="font-size: 1.4rem; margin-bottom: 10px;">ساعات العمل</h4>
                            <p style="color: #64748b;">يومياً من 9:00 صباحاً وحتى 10:00 مساءً<br>الجمعة: عطلة أسبوعية</p>
                        </div>
                    </div>
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
