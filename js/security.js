// --- Advanced Identity & Security System ---
import {
    auth, db, provider, signInWithPopup, onAuthStateChanged, signOut,
    doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs
} from './firebase.js';

// Configuration (Sensitive info from .env handled by build tool)
let SUPER_ADMIN_EMAIL = "adamnhar2011@gmail.com";
let REGISTER_SECRET = "castro_secret_2026";

try {
    SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || SUPER_ADMIN_EMAIL;
} catch (e) { }

try {
    REGISTER_SECRET = import.meta.env.VITE_DEV_REGISTER_SECRET || REGISTER_SECRET;
} catch (e) { }

/**
 * Initialize Identity Session
 */
onAuthStateChanged(auth, async (user) => {
    // Reveal body once security check is active
    document.getElementById('security-layer')?.remove();
    if (user) {
        console.log("👤 User Logged In:", user.email);

        // Fetch Admin Profile from Firestore
        const adminRef = doc(db, "admins", user.uid);
        const snap = await getDoc(adminRef);

        if (snap.exists()) {
            const data = snap.data();
            STORE.adminUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
                status: data.status, // 'pending' or 'active'
                permissions: data.permissions || {},
                isSuper: user.email === SUPER_ADMIN_EMAIL
            };

            // Auto-grant all permissions to Super Admin
            if (STORE.adminUser.isSuper) {
                STORE.adminUser.status = 'active';
                STORE.adminUser.permissions = {
                    manage_products: true,
                    manage_categories: true,
                    manage_deals: true,
                    manage_admins: true,
                    approve_devs: true,
                    view_sales: true,
                    full_access: true
                };
            }

            sessionStorage.setItem('castro_admin_verified', (STORE.adminUser.status === 'active') ? 'true' : 'false');
            sessionStorage.setItem('castro_dev_mode', 'true');
        } else {
            // New User or non-admin
            STORE.adminUser = null;
            sessionStorage.removeItem('castro_admin_verified');
        }
    } else {
        STORE.adminUser = null;
        sessionStorage.clear();
    }

    // If Super Admin, pre-fetch all admins
    if (STORE.adminUser && STORE.adminUser.isSuper) {
        window.fetchAdmins();
    }

    render();
});

/**
 * Developer Mode Activation
 */
window.activateDevMode = function () {
    sessionStorage.setItem('castro_dev_mode', 'true');
    navigate('admin');
};

/**
 * Developer Registration Logic
 */
window.requestDevAccess = async function () {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const isSuper = user.email === SUPER_ADMIN_EMAIL;

        // Check if already exists
        const adminRef = doc(db, "admins", user.uid);
        const snap = await getDoc(adminRef);

        if (snap.exists()) {
            const data = snap.data();
            if (data.status === 'active' || isSuper) {
                showToast('أهلاً بك', 'success');
                sessionStorage.setItem('castro_admin_verified', 'true');
                sessionStorage.setItem('castro_dev_mode', 'true');
                navigate('admin');
                setTimeout(() => location.reload(), 500);
            } else {
                showToast('طلبك قيد المراجعة من الإدارة', 'info');
                navigate('home');
            }
            return;
        }

        // Create Request if doesn't exist
        if (isSuper) {
            await setDoc(adminRef, {
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
                status: 'active',
                requestedAt: new Date().toISOString(),
                permissions: {
                    manage_products: true,
                    manage_categories: true,
                    manage_deals: true,
                    manage_admins: true,
                    approve_devs: true,
                    view_sales: true,
                    full_access: true
                }
            });
            showToast('تم تفعيل حساب المدير الأكبر بنجاح', 'success');
            sessionStorage.setItem('castro_admin_verified', 'true');
            sessionStorage.setItem('castro_dev_mode', 'true');
            navigate('admin');
            setTimeout(() => location.reload(), 500);
        } else {
            await setDoc(adminRef, {
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
                status: 'pending',
                requestedAt: new Date().toISOString(),
                permissions: {
                    manage_products: false,
                    manage_categories: false,
                    manage_deals: false,
                    manage_admins: false,
                    view_sales: false
                }
            });
            showToast('تم إرسال طلبك بنجاح! بانتظار موافقة المدير', 'success');
            setTimeout(() => { location.reload() }, 2000);
        }
    } catch (error) {
        console.error("Reg Error:", error);
        if (error.code === 'auth/unauthorized-domain') {
            const currentDomain = window.location.hostname;
            showFirebaseSetupGuide(currentDomain);
        } else {
            showToast('فشل تسجيل الدخول: تأكد من اتصالك أو إعدادات المتصفح', 'error');
        }
    }
};

function showFirebaseSetupGuide(domain) {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 99999;
        display: flex; align-items: center; justify-content: center; padding: 20px;
        color: white; font-family: 'Tajawal', sans-serif; text-align: center;
    `;
    overlay.innerHTML = `
        <div style="background: #1a1a1a; padding: 40px; border-radius: 20px; border: 1px solid #333; max-width: 600px;">
            <i class="ph ph-warning-circle" style="font-size: 4rem; color: #e60012; margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 20px;">خطأ: النطاق غير مصرح به</h2>
            <p style="font-size: 1.1rem; line-height: 1.6; color: #ccc;">عذراً "آدم"، نظام الحماية في Firebase يمنع تسجيل الدخول من هذا العنوان حالياً.</p>
            <div style="background: #2a2a2a; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: left; direction: ltr;">
                <p style="color: #888; margin-bottom: 10px; font-size: 0.8rem;">How to fix this:</p>
                <ol style="color: #fff; font-size: 0.9rem;">
                    <li>Open <b>Firebase Console</b></li>
                    <li>Go to <b>Authentication</b> → <b>Settings</b></li>
                    <li>Open <b>Authorized domains</b> tab</li>
                    <li>Click <b>Add domain</b> and enter: <code style="background: #e60012; padding: 2px 6px; border-radius: 4px;">${domain}</code></li>
                </ol>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: 1px solid #444; color: #888; padding: 10px 20px; border-radius: 50px; cursor: pointer;">أغلق هذه النافذة</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Sign Out Logic
 */
window.adminLogout = async function () {
    await signOut(auth);
    sessionStorage.clear();
    location.reload();
};

/**
 * Check if current user has a specific permission
 */
window.hasPermission = function (perm) {
    if (!STORE.adminUser) return false;
    if (STORE.adminUser.isSuper) return true;
    return STORE.adminUser.status === 'active' && STORE.adminUser.permissions[perm] === true;
};
/**
 * Admin Management Logic (Super Admin Only)
 */
window.fetchAdmins = async function () {
    if (!STORE.adminUser?.isSuper) return;
    try {
        const q = query(collection(db, "admins"));
        const snap = await getDocs(q);
        STORE.allAdmins = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        render(); // Re-render to show data
    } catch (e) {
        console.error("Fetch Admins Error:", e);
    }
};

window.handleApproveAdmin = async function (uid) {
    if (!STORE.adminUser?.isSuper) return;
    try {
        await updateDoc(doc(db, "admins", uid), { status: 'active' });
        showToast('تمت الموافقة على المطور بنجاح', 'success');
        window.fetchAdmins();
    } catch (e) {
        showToast('فشل تفعيل الحساب', 'error');
    }
};

window.handleDeleteAdmin = async function (uid) {
    if (!STORE.adminUser?.isSuper) return;
    if (!confirm('هل أنت متأكد من حذف هذا المطور نهائياً؟')) return;
    try {
        // Note: This only deletes Firestore record, not Auth user
        await deleteDoc(doc(db, "admins", uid));
        showToast('تم حذف المطور بنجاح', 'success');
        window.fetchAdmins();
    } catch (e) {
        showToast('فشل حذف المطور', 'error');
    }
};

window.openAdminEditModal = function (uid) {
    const adm = STORE.allAdmins.find(a => a.uid === uid);
    if (!adm) return;

    const modal = document.getElementById('admin-edit-modal');
    document.getElementById('edit-admin-uid').value = uid;
    document.getElementById('edit-admin-photo').src = adm.photo || '';
    document.getElementById('edit-admin-name').innerText = adm.name || '';
    document.getElementById('edit-admin-email').innerText = adm.email || '';

    // Set Checkboxes
    const p = adm.permissions || {};
    document.getElementById('perm-products').checked = !!p.manage_products;
    document.getElementById('perm-categories').checked = !!p.manage_categories;
    document.getElementById('perm-deals').checked = !!p.manage_deals;
    document.getElementById('perm-sales').checked = !!p.view_sales;
    document.getElementById('perm-super').checked = false;

    modal.style.display = 'flex';
};

window.closeAdminEditModal = function () {
    document.getElementById('admin-edit-modal').style.display = 'none';
};

window.saveAdminPermissions = async function () {
    const uid = document.getElementById('edit-admin-uid').value;
    const isNewSuper = document.getElementById('perm-super').checked;

    const newPerms = {
        manage_products: document.getElementById('perm-products').checked,
        manage_categories: document.getElementById('perm-categories').checked,
        manage_deals: document.getElementById('perm-deals').checked,
        view_sales: document.getElementById('perm-sales').checked,
    };

    try {
        if (isNewSuper) {
            if (!confirm('تحذير: أنت على وشك نقل ملكية "المدير الأكبر" لهذا الحساب. لن تعد تملك الصلاحية للتحكم فيه لاحقاً. هل أنت متأكد؟')) return;
            // Transfer SUPER_ADMIN_EMAIL would require .env update or DB fallback
            // For now, we just grant full access in DB
            newPerms.manage_admins = true;
            newPerms.approve_devs = true;
            newPerms.full_access = true;
        }

        await updateDoc(doc(db, "admins", uid), { permissions: newPerms });
        showToast('تم تحديث الصلاحيات بنجاح', 'success');
        window.closeAdminEditModal();
        window.fetchAdmins();
    } catch (e) {
        showToast('فشل تحديث الصلاحيات', 'error');
    }
};
