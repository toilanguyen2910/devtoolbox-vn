/* ============================================================================
   DevToolboxVN - JSON Formatter & Validator
   ============================================================================ */

function initJsonFormatter() {
    console.log('JSON Formatter initialized');

    // DOM elements
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const messageArea = document.getElementById('message-area');
    const outputSection = document.getElementById('output-section');
    const statsArea = document.getElementById('stats-area');
    const statsContent = document.getElementById('stats-content');

    const formatBtn = document.getElementById('format-btn');
    const minifyBtn = document.getElementById('minify-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const loadExampleBtn = document.getElementById('load-example-btn');

    // Event listeners
    formatBtn.addEventListener('click', handleFormat);
    minifyBtn.addEventListener('click', handleMinify);
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);
    loadExampleBtn.addEventListener('click', loadExample);

    // Handle Format
    function handleFormat() {
        const inputText = input.value.trim();

        if (!inputText) {
            showMessage('Please paste some JSON to format', 'warning');
            return;
        }

        try {
            // Parse JSON
            const parsed = JSON.parse(inputText);

            // Format with indentation
            const formatted = JSON.stringify(parsed, null, 2);

            // Apply syntax highlighting
            const highlighted = syntaxHighlight(formatted);

            // Display output
            output.innerHTML = highlighted;
            outputSection.style.display = 'block';

            // Show statistics
            const stats = calculateStats(parsed);
            displayStats(stats);

            // Clear any error messages
            messageArea.innerHTML = '';

            showMessage('✓ JSON is valid and formatted!', 'success');
        } catch (error) {
            handleJsonError(error, inputText);
        }
    }

    // Handle Minify
    function handleMinify() {
        const inputText = input.value.trim();

        if (!inputText) {
            showMessage('Please paste some JSON to minify', 'warning');
            return;
        }

        try {
            // Parse JSON
            const parsed = JSON.parse(inputText);

            // Minify (no spaces)
            const minified = JSON.stringify(parsed);

            // Display output (no syntax highlighting for minified)
            output.textContent = minified;
            outputSection.style.display = 'block';
            statsArea.style.display = 'none';

            // Clear any error messages
            messageArea.innerHTML = '';

            showMessage('✓ JSON minified successfully!', 'success');
        } catch (error) {
            handleJsonError(error, inputText);
        }
    }

    // Handle Clear
    function handleClear() {
        input.value = '';
        output.textContent = '';
        messageArea.innerHTML = '';
        outputSection.style.display = 'none';
        statsArea.style.display = 'none';
        input.focus();
    }

    // Handle Copy
    function handleCopy() {
        const text = output.textContent;
        if (!text) {
            showMessage('Nothing to copy', 'warning');
            return;
        }

        window.copyToClipboard(text, copyBtn);
    }

    // Load Example
    function loadExample() {
        const exampleJson = {
            name: "DevToolboxVN",
            version: "1.0.0",
            description: "Essential tools for Vietnamese developers",
            tools: [
                {
                    id: "json-formatter",
                    name: "JSON Formatter",
                    icon: "📋",
                    features: ["format", "validate", "minify"]
                },
                {
                    id: "base64-converter",
                    name: "Base64 Converter",
                    icon: "🔐",
                    features: ["encode", "decode"]
                }
            ],
            metadata: {
                author: "Your Name",
                license: "MIT",
                active: true,
                downloads: 1337,
                rating: 4.9
            }
        };

        input.value = JSON.stringify(exampleJson, null, 2);
        showMessage('Example JSON loaded! Click "Format & Validate" to see it formatted.', 'info');
    }

    // Syntax Highlighting
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Calculate Statistics
    function calculateStats(obj) {
        const stats = {
            type: Array.isArray(obj) ? 'Array' : typeof obj,
            keys: 0,
            depth: 0,
            size: 0
        };

        // Count keys recursively
        function countKeys(o, currentDepth = 1) {
            if (currentDepth > stats.depth) {
                stats.depth = currentDepth;
            }

            if (typeof o === 'object' && o !== null) {
                const keys = Object.keys(o);
                stats.keys += keys.length;

                keys.forEach(key => {
                    countKeys(o[key], currentDepth + 1);
                });
            }
        }

        countKeys(obj);

        // Calculate size
        stats.size = JSON.stringify(obj).length;

        return stats;
    }

    // Display Statistics
    function displayStats(stats) {
        statsContent.innerHTML = `
            <strong>Statistics:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                <li><strong>Type:</strong> ${stats.type}</li>
                <li><strong>Keys:</strong> ${stats.keys}</li>
                <li><strong>Depth:</strong> ${stats.depth}</li>
                <li><strong>Size:</strong> ${stats.size} characters</li>
            </ul>
        `;
        statsArea.style.display = 'flex';
    }

    // Handle JSON Parse Error
    function handleJsonError(error, inputText) {
        outputSection.style.display = 'none';
        statsArea.style.display = 'none';

        // Try to find error position
        let errorPosition = '';
        const match = error.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            const lines = inputText.substring(0, pos).split('\n');
            const line = lines.length;
            const col = lines[lines.length - 1].length + 1;
            errorPosition = ` at line ${line}, column ${col}`;
        }

        showMessage(
            `<strong>Invalid JSON${errorPosition}</strong><br>${escapeHtml(error.message)}`,
            'error'
        );
    }

    // Show Message
    function showMessage(text, type = 'info') {
        const icons = {
            success: '✓',
            error: '⚠️',
            warning: '⚠️',
            info: 'ℹ️'
        };

        messageArea.innerHTML = `
            <div class="message ${type}">
                <span class="message-icon">${icons[type]}</span>
                <div class="message-content">${text}</div>
            </div>
        `;
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
