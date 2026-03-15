// --- Identity Templates ---
Object.assign(TEMPLATES, {
    devRegister: (secret) => {
        const isValid = secret === "castro_secret_2026";

        if (!isValid) {
            return `
                <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0b; color:white; font-family:'Tajawal', sans-serif; text-align:center;">
                    <div style="max-width:400px; padding:20px;">
                        <i class="ph ph-warning-circle" style="font-size:4rem; color:#e60012;"></i>
                        <h1 style="margin-top:20px;">رابط غير صالح</h1>
                        <p style="color:#888; margin-top:10px;">عذراً، الرابط السرّي الذي استخدمته غير صحيح أو انتهت صلاحيته.</p>
                        <button class="ap-btn-primary" style="margin-top:30px; width:100%; border-radius:12px;" onclick="navigate('home')">العودة للرئيسية</button>
                    </div>
                </div>
            `;
        }

        return `
            <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #1a1a2e 0%, #0a0a0b 100%); font-family:'Tajawal', sans-serif; direction:rtl;">
                <div class="login-glass-panel" style="max-width:500px; width:100%; padding:60px 40px; text-align:center; background:rgba(255,255,255,0.03); backdrop-filter:blur(25px); border:1px solid rgba(255,255,255,0.1); border-radius:40px; box-shadow:0 35px 100px rgba(0,0,0,0.5);">
                    <div style="width:90px; height:90px; background:rgba(230,0,18,0.1); color:#e60012; border-radius:30px; display:flex; align-items:center; justify-content:center; font-size:3rem; margin:0 auto 30px; transform:rotate(-10deg);">
                        <i class="ph ph-user-plus"></i>
                    </div>
                    <h1 style="color:white; font-size:2.2rem; font-weight:900; margin-bottom:15px;">انضم لفريق التطوير</h1>
                    <p style="color:rgba(255,255,255,0.5); line-height:1.7; margin-bottom:40px;">أنت تستخدم رابطاً سرياً للتسجيل. سيتم إرسال طلبك للمدير الأكبر للموافقة عليه وتحديد صلاحياتك.</p>
                    
                    <button class="ap-btn-primary" style="width:100%; height:60px; font-size:1.1rem; border-radius:18px; background:#fff; color:#000;" onclick="requestDevAccess()">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:20px; margin-left:12px;">
                        المتابعة مع جوجل وإرسال الطلب
                    </button>
                    
                    <p style="margin-top:25px; font-size:0.85rem; color:rgba(255,255,255,0.3);">بالنقر أعلاه، أنت توافق على شروط سياسة الخصوصية للمطورين.</p>
                </div>
            </div>
        `;
    },

    adminPending: () => {
        return `
            <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0b; color:white; font-family:'Tajawal', sans-serif; direction:rtl; text-align:center;">
                <div class="login-glass-panel" style="max-width:480px; width:100%; padding:60px; background:rgba(255,255,255,0.02); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.05); border-radius:40px;">
                    <div class="loader-ring" style="width:80px; height:80px; border:4px solid rgba(255,255,255,0.1); border-top-color:#e60012; border-radius:50%; margin:0 auto 30px; animation: spin 1s linear infinite;"></div>
                    <h2 style="font-size:2rem; font-weight:900; margin-bottom:15px;">طلبك قيد المراجعة</h2>
                    <p style="color:#888; line-height:1.8; margin-bottom:40px;">تم استلام طلب الانضمام الخاص بك. سيقوم <span style="color:#fff; font-weight:700;">المدير الأكبر (آدم)</span> بمراجعة حسابك وتفعيل الصلاحيات المناسبة قريباً.</p>
                    
                    <button class="ap-btn-ghost" style="width:100%; border-radius:15px;" onclick="navigate('home')">العودة للمتجر</button>
                    <button class="ap-btn-ghost" style="width:100%; margin-top:15px; border:none; opacity:0.5;" onclick="adminLogout()">تسجيل الخروج</button>
                </div>
            </div>
            <style> @keyframes spin { to { transform: rotate(360deg); } } </style>
        `;
    }
});
