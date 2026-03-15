// --- Theme & Style Logic ---
function updateThemeColor(key, value) {
    STORE.theme.colors[key] = value;
    const preview = document.getElementById('theme-preview');
    if (preview) preview.style.setProperty(`--theme-${key}`, value);
}

function updateThemeFont(type, value) {
    STORE.theme.fonts[type] = value;
    const preview = document.getElementById('theme-preview');
    if (preview) preview.style.setProperty(`--theme-${type}-font`, value);
}

function updateFontSize(key, value) {
    STORE.theme.fonts.sizes[key] = `${value}rem`;
    const preview = document.getElementById('theme-preview');
    if (preview) preview.style.setProperty(`--theme-${key}-size`, `${value}rem`);
}

function applyTheme() {
    localStorage.setItem('castro_theme', JSON.stringify(STORE.theme));
    const root = document.documentElement;
    root.style.setProperty('--color-primary', STORE.theme.colors.primary);
    root.style.setProperty('--color-secondary', STORE.theme.colors.secondary);
    showToast('✅ تم تطبيق الثيم بنجاح!');
}

function resetTheme() {
    if (confirm('إعادة تعيين الثيم؟')) {
        localStorage.removeItem('castro_theme');
        location.reload();
    }
}
