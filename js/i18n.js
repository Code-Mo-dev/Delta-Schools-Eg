/**
 * i18n.js — Delta Schools Portal
 * Internationalization module (EN ↔ AR).
 * Adapted from the DAS i18n system.
 *
 * Usage in HTML:
 *   data-i18n="hero.headline"          → sets textContent
 *   data-i18n-placeholder="cta.placeholder" → sets placeholder attribute
 *   data-i18n-html="hero.deck"         → sets innerHTML (use sparingly)
 *
 * JS API:
 *   I18N.init()                        → call once on DOMContentLoaded (auto-called)
 *   I18N.setLang('ar')                 → switch language
 *   I18N.t('hero.headline')            → resolve a key manually
 *   I18N.currentLang()                 → returns 'en' | 'ar'
 *   I18N.onLangChange(fn)              → register re-render callback
 */

const I18N = (function () {

    const STORAGE_KEY  = 'delta-portal-lang';
    const DEFAULT_LANG = 'en';
    const LOCALES_PATH = '/locales';          // folder containing en.json / ar.json

    let currentLang   = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    let translations  = {};
    const _callbacks  = [];                  // registered re-render functions

    // ── Load JSON file for a given language ───────────────────────────────────
    async function loadTranslations(lang) {
        try {
            const res = await fetch(`${LOCALES_PATH}/${lang}.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
        } catch (err) {
            console.error(`[I18N] Failed to load "${lang}.json":`, err);
        }
    }

    // ── Resolve dot-notation key e.g. "nav.cta" ───────────────────────────────
    function resolve(key) {
        const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
        if (value === undefined) {
            console.warn(`[I18N] Missing key: "${key}"`);
            return key;                      // fall back to the key itself
        }
        return value;
    }

    // ── Apply all translations to the current page ────────────────────────────
    function applyTranslations() {

        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = resolve(el.dataset.i18n);
        });

        // Placeholder attributes (inputs)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = resolve(el.dataset.i18nPlaceholder);
        });

        // innerHTML (use only for content that needs markup)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            el.innerHTML = resolve(el.dataset.i18nHtml);
        });

        // Document direction + lang attribute
        const isRTL = currentLang === 'ar';
        document.documentElement.setAttribute('lang', currentLang);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', isRTL);

        // Language toggle button label
        document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
            btn.innerHTML = isRTL
                ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> EN'
                : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> عربي';
        });

        // Run all registered re-render callbacks
        _callbacks.forEach(fn => {
            try { fn(currentLang); } catch (e) { console.error('[I18N] Callback error:', e); }
        });
    }

    // ── Public: switch language ───────────────────────────────────────────────
    async function setLang(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        await loadTranslations(lang);
        applyTranslations();
    }

    // ── Public: initialise on page load ───────────────────────────────────────
    async function init() {
        await loadTranslations(currentLang);
        applyTranslations();
    }

    // ── Public: manually resolve a translation key ────────────────────────────
    function t(key) {
        return resolve(key);
    }

    // ── Public: register a callback for language changes ─────────────────────
    function onLangChange(fn) {
        _callbacks.push(fn);
    }

    return {
        init,
        setLang,
        t,
        currentLang: () => currentLang,
        onLangChange
    };

})();

// Auto-init when the DOM is ready
document.addEventListener('DOMContentLoaded', () => I18N.init());
