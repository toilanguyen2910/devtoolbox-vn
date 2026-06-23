/* ============================================================================
   DevToolboxVN - Main Navigation & Routing
   ============================================================================ */

(function() {
    'use strict';

    // State
    const state = {
        currentRoute: '',
        loadedTools: new Set(),
    };

    // Tool configurations
    const tools = {
        'json-formatter': {
            name: 'JSON Formatter',
            htmlPath: 'tools/json-formatter.html',
            scriptPath: 'js/tools/json-formatter.js'
        },
        'base64-converter': {
            name: 'Base64 Converter',
            htmlPath: 'tools/base64-converter.html',
            scriptPath: 'js/tools/base64-converter.js'
        }
    };

    // Initialize app
    function init() {
        console.log('DevToolboxVN initialized');

        // Handle hash change events
        window.addEventListener('hashchange', handleRouteChange);

        // Handle initial load
        handleRouteChange();

        // Update active nav link
        updateActiveNavLink();
    }

    // Handle route changes
    function handleRouteChange() {
        const hash = window.location.hash.slice(1); // Remove '#'
        const route = hash || 'home';

        console.log('Route change:', route);

        if (route === 'home' || route === '') {
            showLandingPage();
        } else if (tools[route]) {
            loadTool(route);
        } else {
            console.warn('Unknown route:', route);
            showLandingPage();
        }

        state.currentRoute = route;
        updateActiveNavLink();
    }

    // Show landing page
    function showLandingPage() {
        const landingPage = document.getElementById('landing-page');
        const toolContainer = document.getElementById('tool-container');

        if (landingPage) {
            landingPage.classList.add('active');
        }

        if (toolContainer) {
            toolContainer.innerHTML = '';
            toolContainer.classList.remove('active');
        }

        document.title = 'DevToolboxVN 🧰 - Essential Tools for Vietnamese Developers';
    }

    // Load a tool
    async function loadTool(toolId) {
        const tool = tools[toolId];
        if (!tool) {
            console.error('Tool not found:', toolId);
            return;
        }

        // Hide landing page
        const landingPage = document.getElementById('landing-page');
        if (landingPage) {
            landingPage.classList.remove('active');
        }

        const toolContainer = document.getElementById('tool-container');
        if (!toolContainer) {
            console.error('Tool container not found');
            return;
        }

        try {
            // Show loading state
            toolContainer.innerHTML = '<div class="tool-page"><p>Loading...</p></div>';
            toolContainer.classList.add('active');

            // Load HTML content
            const htmlResponse = await fetch(tool.htmlPath);
            if (!htmlResponse.ok) {
                throw new Error(`Failed to load ${tool.htmlPath}`);
            }
            const htmlContent = await htmlResponse.text();
            toolContainer.innerHTML = htmlContent;

            // Load and execute script if not already loaded
            if (!state.loadedTools.has(toolId)) {
                await loadScript(tool.scriptPath);
                state.loadedTools.add(toolId);
            }

            // Initialize tool if it has an init function
            const initFunctionName = `init${toPascalCase(toolId)}`;
            if (typeof window[initFunctionName] === 'function') {
                window[initFunctionName]();
            }

            // Update page title
            document.title = `${tool.name} - DevToolboxVN`;

            console.log('Tool loaded:', toolId);
        } catch (error) {
            console.error('Error loading tool:', error);
            toolContainer.innerHTML = `
                <div class="tool-page">
                    <div class="message error">
                        <span class="message-icon">⚠️</span>
                        <div class="message-content">
                            <strong>Failed to load tool</strong>
                            <p>${error.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Load external script dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    // Update active nav link
    function updateActiveNavLink() {
        const currentHash = window.location.hash;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkHash = new URL(link.href).hash;
            if (linkHash === currentHash || (currentHash === '' && link.href.endsWith('/'))) {
                link.style.color = 'var(--color-primary)';
                link.style.fontWeight = '600';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    }

    // Utility: Convert kebab-case to PascalCase
    function toPascalCase(str) {
        return str
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    // Utility: Copy to clipboard
    window.copyToClipboard = async function(text, button) {
        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            if (button) {
                const originalText = button.textContent;
                button.textContent = '✓ Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }

            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy to clipboard. Please copy manually.');
            return false;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
