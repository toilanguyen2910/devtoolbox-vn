/* ============================================================================
   DevToolboxVN - Base64 Converter (Encode/Decode)
   ============================================================================ */

function initBase64Converter() {
    console.log('Base64 Converter initialized');

    // DOM elements - Tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // DOM elements - Encode Tab
    const encodeText = document.getElementById('encode-text');
    const encodeFile = document.getElementById('encode-file');
    const encodeBtn = document.getElementById('encode-btn');
    const encodeClearBtn = document.getElementById('encode-clear');
    const encodeOutput = document.getElementById('encode-output');
    const encodeCopyBtn = document.getElementById('encode-copy');
    const encodeMessage = document.getElementById('encode-message');

    // DOM elements - Decode Tab
    const decodeText = document.getElementById('decode-text');
    const decodeBtn = document.getElementById('decode-btn');
    const decodeClearBtn = document.getElementById('decode-clear');
    const decodeOutput = document.getElementById('decode-output');
    const decodeCopyBtn = document.getElementById('decode-copy');
    const decodeMessage = document.getElementById('decode-message');

    // Example button
    const loadExampleBtn = document.getElementById('load-example-btn');

    // Event listeners - Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    // Event listeners - Encode
    encodeBtn.addEventListener('click', handleEncode);
    encodeClearBtn.addEventListener('click', () => {
        encodeText.value = '';
        encodeFile.value = '';
        encodeOutput.textContent = '';
        encodeMessage.innerHTML = '';
    });
    encodeCopyBtn.addEventListener('click', () => {
        window.copyToClipboard(encodeOutput.textContent, encodeCopyBtn);
    });

    // Event listeners - Decode
    decodeBtn.addEventListener('click', handleDecode);
    decodeClearBtn.addEventListener('click', () => {
        decodeText.value = '';
        decodeOutput.textContent = '';
        decodeMessage.innerHTML = '';
    });
    decodeCopyBtn.addEventListener('click', () => {
        window.copyToClipboard(decodeOutput.textContent, decodeCopyBtn);
    });

    // Event listener - File upload
    encodeFile.addEventListener('change', handleFileUpload);

    // Event listener - Example
    loadExampleBtn.addEventListener('click', loadExample);

    // Tab switching
    function handleTabClick(e) {
        const tabId = e.target.dataset.tab;

        // Update tab buttons
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        // Update tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    }

    // Handle Encode
    function handleEncode() {
        const text = encodeText.value.trim();

        if (!text) {
            showEncodeMessage('Please enter text or upload a file to encode', 'warning');
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            encodeOutput.textContent = encoded;
            showEncodeMessage('✓ Text encoded to Base64 successfully!', 'success');
        } catch (error) {
            showEncodeMessage(`Error encoding: ${error.message}`, 'error');
        }
    }

    // Handle File Upload
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showEncodeMessage('File is too large. Maximum size is 10MB.', 'error');
            encodeFile.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                // Get the base64 data URL and extract just the base64 part
                const dataUrl = event.target.result;
                const base64Data = dataUrl.split(',')[1];

                encodeText.value = base64Data;
                encodeOutput.textContent = base64Data;
                showEncodeMessage(
                    `✓ File "${file.name}" encoded to Base64 (${formatFileSize(file.size)})`,
                    'success'
                );
            } catch (error) {
                showEncodeMessage(`Error reading file: ${error.message}`, 'error');
            }
        };

        reader.onerror = function() {
            showEncodeMessage('Error reading file', 'error');
            encodeFile.value = '';
        };

        reader.readAsDataURL(file);
    }

    // Handle Decode
    function handleDecode() {
        const text = decodeText.value.trim();

        if (!text) {
            showDecodeMessage('Please enter a Base64 string to decode', 'warning');
            return;
        }

        try {
            // Validate Base64 format
            if (!isValidBase64(text)) {
                showDecodeMessage(
                    'Invalid Base64 format. Base64 strings contain only A-Z, a-z, 0-9, +, /, and = padding.',
                    'error'
                );
                return;
            }

            const decoded = decodeURIComponent(escape(atob(text)));
            decodeOutput.textContent = decoded;
            showDecodeMessage('✓ Base64 decoded successfully!', 'success');
        } catch (error) {
            showDecodeMessage(
                `Error decoding: ${error.message}. Make sure the Base64 string is valid.`,
                'error'
            );
        }
    }

    // Validate Base64 string
    function isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch {
            return false;
        }
    }

    // Load Example
    function loadExample() {
        const exampleText = 'Hello, DevToolboxVN! 🧰';
        encodeText.value = exampleText;
        showEncodeMessage('Example text loaded! Click "Encode to Base64" to see the magic.', 'info');
    }

    // Show Encode Message
    function showEncodeMessage(text, type = 'info') {
        const icons = {
            success: '✓',
            error: '⚠️',
            warning: '⚠️',
            info: 'ℹ️'
        };

        encodeMessage.innerHTML = `
            <div class="message ${type}">
                <span class="message-icon">${icons[type]}</span>
                <div class="message-content">${text}</div>
            </div>
        `;
    }

    // Show Decode Message
    function showDecodeMessage(text, type = 'info') {
        const icons = {
            success: '✓',
            error: '⚠️',
            warning: '⚠️',
            info: 'ℹ️'
        };

        decodeMessage.innerHTML = `
            <div class="message ${type}">
                <span class="message-icon">${icons[type]}</span>
                <div class="message-content">${text}</div>
            </div>
        `;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}
