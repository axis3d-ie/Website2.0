// === GDPR COOKIE BANNER COMPONENT (Self-Contained) ===
// To use: Link this script at the end of the <body> tag of any existing page.

(function() {
    // 1. Load Tailwind CSS (required for styling)
    function loadTailwind() {
        if (document.querySelector('script[src*="cdn.tailwindcss.com"]')) return;

        // Define custom theme colors for the banner
        window.tailwind = {
            config: {
                theme: {
                    extend: {
                        fontFamily: {
                            mono: ['JetBrains Mono', 'monospace'],
                            sans: ['Inter', 'sans-serif'],
                        },
                        colors: {
                            'axis-charcoal': '#1E2029',
                            'axis-white': '#F5F5F7',
                            'axis-orange': '#FF4D00',
                            'axis-light-grey': '#E0E0E0',
                        },
                    }
                }
            }
        };

        const script = document.createElement('script');
        script.src = "https://cdn.tailwindcss.com";
        document.head.appendChild(script);
    }

    // 2. HTML Content (Banner, Modal, Reopen Button)
    const COOKIE_HTML = `
        <!-- 1. The Main Banner (Initially hidden by JS, transforms into view) -->
        <div id="cookie-banner" class="fixed inset-x-0 bottom-0 z-[100] bg-axis-charcoal text-axis-white border-t border-axis-orange/50 shadow-2xl p-4 md:p-6 transition-transform duration-500 transform translate-y-full">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                <!-- Text & Policy Link -->
                <div class="flex-grow">
                    <h4 class="font-bold text-lg mb-1">Cookie Preferences</h4>
                    <p class="font-mono text-xs text-gray-400">
                        We use cookies for site functionality and analytics. Click 'Accept All' to agree or 'Manage Preferences' to choose your settings. 
                        <a href="#cookie-policy-page" class="text-axis-orange underline hover:text-white transition-colors">Read our full policy.</a>
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button id="btn-manage" onclick="axis3d_toggleCookieModal(true)" class="bg-white text-axis-charcoal font-mono text-xs px-4 py-2 hover:bg-axis-light-grey transition-colors border border-transparent">
                        Manage Preferences
                    </button>
                    <button id="btn-accept" onclick="axis3d_acceptAllCookies()" class="bg-axis-orange text-white font-mono text-xs px-4 py-2 hover:bg-axis-charcoal transition-colors border border-transparent">
                        Accept All
                    </button>
                </div>
            </div>
        </div>

        <!-- 2. Preferences Modal (Initially hidden) -->
        <div id="cookie-preferences-modal" class="fixed inset-0 z-[110] bg-axis-charcoal/95 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-axis-white text-axis-charcoal p-6 md:p-8 w-full max-w-lg border border-axis-charcoal shadow-2xl">
                <h3 class="text-2xl font-bold mb-4 border-b pb-2">Cookie Settings</h3>

                <div class="space-y-4">
                    <!-- Essential -->
                    <div class="flex justify-between items-center border-b pb-2">
                        <div>
                            <span class="font-bold">Essential Cookies</span>
                            <p class="text-xs text-gray-600">Required for basic site function (e.g., security, consent storage).</p>
                        </div>
                        <span class="font-mono text-xs text-green-600">ALWAYS ON</span>
                    </div>

                    <!-- Analytics/Performance -->
                    <div class="flex justify-between items-center border-b pb-2">
                        <div>
                            <span class="font-bold">Analytics & Performance</span>
                            <p class="text-xs text-gray-600">Helps us understand how the site is used to improve performance.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cookie-analytics" checked class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-axis-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axis-orange"></div>
                        </label>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 mt-6">
                     <button onclick="axis3d_rejectAllCookies()" class="flex-grow bg-axis-charcoal text-white font-mono text-xs px-4 py-2 hover:bg-red-600 transition-colors">
                        Save & Reject All
                    </button>
                    <button onclick="axis3d_savePreferences()" class="flex-grow bg-axis-orange text-white font-mono text-xs px-4 py-2 hover:bg-axis-charcoal transition-colors">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>

        <!-- 3. Re-open Button (Appears after consent is given) -->
        <button id="reopen-preferences" onclick="axis3d_toggleCookieModal(true)" class="fixed bottom-4 right-4 z-[99] hidden w-16 h-10 bg-axis-charcoal text-white rounded-full items-center justify-center shadow-lg hover:bg-axis-orange transition-colors">
            <h6 class="font-mono text-[10px]">COOKIES</h6>
        </button>
    `;

    function injectHtmlContent() {
        const wrapper = document.createElement('div');
        wrapper.id = 'axis3d-cookie-module';
        wrapper.innerHTML = COOKIE_HTML;
        document.body.appendChild(wrapper);
    }

    // 3. Cookie Consent Logic
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setConsentCookie(value, days = 365) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        // Use a unique cookie name to prevent conflicts
        document.cookie = `axis3d_consent=${value};${expires};path=/;SameSite=Lax;`;
    }

    let banner, modal, reopenBtn;

    function getElements() {
        banner = document.getElementById('cookie-banner');
        modal = document.getElementById('cookie-preferences-modal');
        reopenBtn = document.getElementById('reopen-preferences');
    }

    function hideBanner() {
        if (!banner || !reopenBtn) return;
        banner.classList.add('translate-y-full');
        setTimeout(() => {
            banner.style.display = 'none';
            reopenBtn.style.display = 'flex';
        }, 500);
    }

    // Expose functions globally for use in the HTML's onclick handlers
    window.axis3d_toggleCookieModal = function(show) {
        if (!modal) return;
        modal.style.display = show ? 'flex' : 'none';
    }

    window.axis3d_acceptAllCookies = function() {
        setConsentCookie('all');
        hideBanner();
        window.axis3d_toggleCookieModal(false);
        console.log("Cookie Consent: All accepted.");
    }

    window.axis3d_rejectAllCookies = function() {
        setConsentCookie('essential');
        hideBanner();
        window.axis3d_toggleCookieModal(false);
        console.log("Cookie Consent: Only essential accepted.");
    }

    window.axis3d_savePreferences = function() {
        const analyticsChecked = document.getElementById('cookie-analytics').checked;
        const consentValue = analyticsChecked ? 'analytics' : 'essential';
        setConsentCookie(consentValue);
        hideBanner();
        window.axis3d_toggleCookieModal(false);
        console.log(`Cookie Consent: Preferences saved. Analytics: ${analyticsChecked ? 'ON' : 'OFF'}`);
    }


    // --- Initialization ---
    function checkConsentAndInitialize() {
        getElements();
        const consent = getCookie('axis3d_consent');

        if (consent) {
            // Consent exists, keep banner hidden and show re-open button
            if (banner) banner.style.display = 'none';
            if (reopenBtn) reopenBtn.style.display = 'flex';
            console.log(`Cookie Consent: Previously accepted as '${consent}'.`);
        } else {
            // No consent, show the banner
            if (banner) {
                banner.style.display = 'flex';
                setTimeout(() => {
                    banner.classList.remove('translate-y-full');
                }, 50);
            }
        }
    }

    // Run the full initialization sequence
    document.addEventListener('DOMContentLoaded', () => {
        loadTailwind();
        injectHtmlContent();

        // Wait a brief moment for Tailwind to load and process classes
        setTimeout(checkConsentAndInitialize, 100);
    });
})();

