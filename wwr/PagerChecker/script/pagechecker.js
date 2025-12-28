// ============================================
// CORE CHECKLIST DATA (unchanged)
// ============================================

const checklistData = {
    "html-structure": {
        title: "HTML — Structure & Semantics",
        essential: true,
        items: [
            { id: "html1", text: "HTML5 doctype", checked: false },
            { id: "html2", text: "<html lang=''> set correctly", checked: false },
            { id: "html3", text: "<head> before <body>", checked: false },
            { id: "html4", text: "<header>, <main>, <footer> used correctly", checked: false },
            { id: "html5", text: "One <h1> per page", checked: false },
            { id: "html6", text: "Proper heading hierarchy (h1 → h2 → h3)", checked: false },
            { id: "html7", text: "Semantic elements (nav, section, article) where appropriate", checked: false },
            { id: "html8", text: "Basic HTML structure", checked: false }
        ],
        note: "If this is wrong, everything else suffers."
    },
    "metadata": {
        title: "Metadata — Core",
        essential: true,
        items: [
            { id: "meta1", text: "<meta charset='UTF-8'>", checked: false },
            { id: "meta2", text: "<meta name='viewport'>", checked: false },
            { id: "meta3", text: "<title> that describes the page", checked: false },
            { id: "meta4", text: "<meta description> present", checked: false }
        ]
    },
    "navigation": {
        title: "Navigation & Layout",
        essential: true,
        items: [
            { id: "nav1", text: "Clear navigation structure", checked: false },
            { id: "nav2", text: "<nav> inside <header>", checked: false },
            { id: "nav3", text: "<header> at the top", checked: false },
            { id: "nav4", text: "<main> contains the primary content", checked: false },
            { id: "nav5", text: "<footer> at the bottom", checked: false }
        ]
    },
    "css": {
        title: "CSS — Styling",
        essential: false,
        items: []
    },
    "javascript": {
        title: "JavaScript — Behavior",
        essential: true,
        items: [
            { id: "js1", text: "External JS files used (not inline, unless tiny)", checked: false },
            { id: "js2", text: "No inline onclick", checked: false },
            { id: "js3", text: "No document.write()", checked: false },
            { id: "js4", text: "No jQuery", checked: false },
            { id: "js5", text: "Scripts loaded with defer", checked: false }
        ]
    },
    "accessibility": {
        title: "Accessibility",
        essential: true,
        items: [
            { id: "a11y1", text: "Semantic HTML instead of div soup", checked: false },
            { id: "a11y2", text: "Forms and buttons labeled", checked: false },
            { id: "a11y3", text: "Keyboard navigation works", checked: false },
            { id: "a11y4", text: "lang attribute set on <html>", checked: false }
        ]
    },
    "performance": {
        title: "Performance — Basic",
        essential: false,
        items: [
            { id: "perf1", text: "No blocking JS in <head>", checked: false }
        ]
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================

let auditState = {
    totalItems: 0,
    completedItems: 0,
    essentialItems: 0,
    nonEssentialItems: 0,
    completedEssential: 0,
    completedNonEssential: 0,
    grade: "-",
    progress: 0,
    lastUpdated: new Date().toLocaleDateString(),
    extractedSourceCode: null,
    currentUrl: null,
    currentSourceCode: null
};

// ============================================
// DOM ELEMENTS
// ============================================

// Summary elements
const totalChecksEl = document.getElementById('totalChecks');
const completedChecksEl = document.getElementById('completedChecks');
const essentialItemsEl = document.getElementById('essentialItems');
const nonEssentialItemsEl = document.getElementById('nonEssentialItems');
const lastUpdatedEl = document.getElementById('lastUpdated');
const gradeEl = document.getElementById('gradeValue');
const progressFillEl = document.getElementById('progressFill');

// URL elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const auditBtn = document.getElementById('auditBtn');
const errorMsg = document.getElementById('errorMsg');
const urlExamples = document.querySelectorAll('.url-example');

// Code section elements
const copyBtn = document.getElementById('copyBtn');
const extractBtn = document.getElementById('extractBtn');
const downloadBtn = document.getElementById('downloadBtn');
const codeDisplay = document.getElementById('codeDisplay');
const uploadLink = document.getElementById('uploadLink');

// Validator buttons
const htmlValidatorBtn = document.getElementById('htmlValidatorBtn');
const cssValidatorBtn = document.getElementById('cssValidatorBtn');
const accessibilityBtn = document.getElementById('accessibilityBtn');
const performanceBtn = document.getElementById('performanceBtn');

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    console.log('🎯 Front-End Designer Audit Tool Initializing...');
    
    // Load saved state from localStorage
    loadSavedState();
    
    // Initialize checklist counters
    calculateInitialCounts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize sections
    initializeSections();
    
    // Initialize validator buttons
    initializeValidatorButtons();
    
    // Check for Opera Mini and adjust copy button
    setupCopyButtonForOperaMini();
    
    // Update UI with initial state
    updateSummary();
    
    console.log('✅ Audit Tool Ready!');
}

function detectOperaMini() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for Opera Mini
    if (userAgent.includes('Opera Mini') || 
        userAgent.includes('OPiOS') || 
        userAgent.includes('OPR/')) {
        return true;
    }
    
    // Check for older mobile browsers
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        // Check for limited browser support
        return !navigator.clipboard;
    }
    
    return false;
}

// Update the copy button text/behavior if Opera Mini is detected
function setupCopyButtonForOperaMini() {
    if (detectOperaMini()) {
        copyBtn.setAttribute('title', 'May require manual copy in Opera Mini');
        copyBtn.style.border = '1px dashed var(--warning)';
    }
}

function calculateInitialCounts() {
    auditState.totalItems = 0;
    auditState.essentialItems = 0;
    auditState.nonEssentialItems = 0;
    auditState.completedItems = 0;
    auditState.completedEssential = 0;
    auditState.completedNonEssential = 0;
    
    Object.values(checklistData).forEach(section => {
        auditState.totalItems += section.items.length;
        if (section.essential) {
            auditState.essentialItems += section.items.length;
        } else {
            auditState.nonEssentialItems += section.items.length;
        }
        
        // Count completed items
        section.items.forEach(item => {
            if (item.checked) {
                auditState.completedItems++;
                if (section.essential) {
                    auditState.completedEssential++;
                } else {
                    auditState.completedNonEssential++;
                }
            }
        });
    });
    
    totalChecksEl.textContent = auditState.totalItems;
    essentialItemsEl.textContent = auditState.essentialItems;
    nonEssentialItemsEl.textContent = auditState.nonEssentialItems;
    completedChecksEl.textContent = auditState.completedItems;
}

function initializeSections() {
    // Set up section toggling
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', toggleSection);
    });
    
    // Initialize checkboxes with saved state
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        const sectionId = Object.keys(checklistData)[index];
        const sectionData = checklistData[sectionId];
        
        if (section && sectionData) {
            const checkboxes = section.querySelectorAll('.checkbox');
            const items = sectionData.items;
            
            checkboxes.forEach((checkbox, itemIndex) => {
                if (itemIndex < items.length) {
                    const item = items[itemIndex];
                    
                    // Set initial checked state
                    if (item.checked) {
                        checkbox.classList.add('checked');
                    }
                    
                    // Add click handler
                    checkbox.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleCheckbox(checkbox, sectionId, itemIndex);
                    });
                }
            });
            
            // Update section progress indicator
            updateSectionProgress(sectionId);
        }
    });
}

function initializeValidatorButtons() {
    // Initially disable validator buttons
    updateValidatorButtons();
    
    // Set up click handlers
    htmlValidatorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openValidator('html');
    });
    
    cssValidatorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openValidator('css');
    });
    
    accessibilityBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openValidator('accessibility');
    });
    
    performanceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openValidator('performance');
    });
}

// ============================================
// CORE FUNCTIONALITY
// ============================================

function toggleSection(event) {
    const header = event.currentTarget;
    const section = header.parentElement;
    
    // Close all other sections
    document.querySelectorAll('.section.active').forEach(activeSection => {
        if (activeSection !== section) {
            activeSection.classList.remove('active');
        }
    });
    
    // Toggle current section
    section.classList.toggle('active');
}

function toggleCheckbox(checkbox, sectionId, itemIndex) {
    const section = checklistData[sectionId];
    
    if (!section || !section.items[itemIndex]) {
        console.error('Invalid section or item index');
        return;
    }
    
    const item = section.items[itemIndex];
    const wasChecked = checkbox.classList.contains('checked');
    
    // Toggle visual state
    checkbox.classList.toggle('checked');
    
    // Update data model
    item.checked = !wasChecked;
    
    // Update counters
    if (!wasChecked) {
        auditState.completedItems++;
        if (section.essential) {
            auditState.completedEssential++;
        } else {
            auditState.completedNonEssential++;
        }
    } else {
        auditState.completedItems--;
        if (section.essential) {
            auditState.completedEssential--;
        } else {
            auditState.completedNonEssential--;
        }
    }
    
    // Update progress and grade
    updateProgress();
    updateGrade();
    updateSummary();
    
    // Save state
    saveState();
    
    // Update section completion indicator
    updateSectionProgress(sectionId);
}

function updateSectionProgress(sectionId) {
    const sectionIndex = Object.keys(checklistData).indexOf(sectionId);
    if (sectionIndex === -1) return;
    
    const sections = document.querySelectorAll('.section');
    const sectionElement = sections[sectionIndex];
    if (!sectionElement) return;
    
    const section = checklistData[sectionId];
    const totalItems = section.items.length;
    const completedItems = section.items.filter(item => item.checked).length;
    
    // Update section visual indicator
    const sectionNumber = sectionElement.querySelector('.section-number');
    if (sectionNumber) {
        if (completedItems === totalItems && totalItems > 0) {
            sectionNumber.style.background = 'linear-gradient(135deg, var(--success), var(--success-light))';
            sectionNumber.textContent = '✓';
        } else {
            sectionNumber.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
            sectionNumber.textContent = (sectionIndex + 1).toString();
        }
    }
}

function updateProgress() {
    const progress = Math.round((auditState.completedItems / auditState.totalItems) * 100);
    auditState.progress = progress;
    progressFillEl.style.width = `${progress}%`;
}

function updateGrade() {
    let grade = "-";
    
    if (auditState.completedItems > 0) {
        const percentage = (auditState.completedItems / auditState.totalItems) * 100;
        
        if (percentage >= 90) grade = "A";
        else if (percentage >= 80) grade = "B";
        else if (percentage >= 70) grade = "C";
        else if (percentage >= 60) grade = "D";
        else if (percentage >= 50) grade = "E";
        else grade = "F";
    }
    
    auditState.grade = grade;
    gradeEl.textContent = grade;
}

function updateSummary() {
    completedChecksEl.textContent = auditState.completedItems;
    auditState.lastUpdated = new Date().toLocaleDateString();
    lastUpdatedEl.textContent = auditState.lastUpdated;
}

// ============================================
// URL AUDIT FUNCTIONALITY
// ============================================

function setupUrlAuditHandlers() {
    // URL form submission
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await runUrlAudit(urlInput.value.trim());
    });
    
    // Example URL clicks
    urlExamples.forEach(example => {
        example.addEventListener('click', () => {
            const url = example.getAttribute('data-url');
            urlInput.value = url;
            runUrlAudit(url);
        });
    });
}

async function runUrlAudit(url) {
    try {
        // Validate URL
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Show loading state
        auditState.currentUrl = url;
        auditBtn.disabled = true;
        auditBtn.innerHTML = `
            <svg class="url-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
            </svg>
            Auditing...
        `;
        
        hideError();
        
        // Fetch the URL content
        showNotification(`Fetching ${url}...`, 'info');
        
        const response = await fetchWithCorsProxy(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status}`);
        }
        
        const html = await response.text();
        auditState.currentSourceCode = html;
        
        // Parse and analyze the HTML
        analyzeHTML(html);
        
        showNotification('URL audit completed!', 'success');
        
        // Enable extract button since we now have source code
        extractBtn.disabled = false;
        extractBtn.textContent = 'Extract';
        
        // Enable validator buttons
        updateValidatorButtons();
        
        // Save URL to history
        saveUrlToHistory(url);
        
    } catch (error) {
        console.error('URL audit failed:', error);
        showError(`Failed to audit URL: ${error.message}. Please check the URL and try again.`);
    } finally {
        auditBtn.disabled = false;
        auditBtn.innerHTML = `
            <svg class="url-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Audit URL
        `;
    }
}

async function fetchWithCorsProxy(url) {
    try {
        // Try direct fetch first
        const response = await fetch(url, {
            mode: 'cors',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return response;
    } catch (error) {
        console.log('Direct fetch failed, trying CORS proxy:', error);
        
        // Fallback to CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        const data = await proxyResponse.json();
        
        // Create a mock Response object
        return {
            ok: true,
            text: () => Promise.resolve(data.contents),
            status: 200
        };
    }
}

function analyzeHTML(html) {
    // Reset all checkboxes
    resetAllCheckboxes();
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Analyze each section
        analyzeHTMLStructure(doc, html);
        analyzeMetadata(doc);
        analyzeNavigation(doc);
        analyzeJavaScript(doc, html);
        analyzeAccessibility(doc);
        analyzePerformance(doc);
        
        // Update UI
        updateAllSectionProgress();
        updateProgress();
        updateGrade();
        updateSummary();
        saveState();
        
    } catch (error) {
        console.error('HTML analysis failed:', error);
        showNotification('HTML analysis completed with some errors', 'warning');
    }
}

// HTML analysis functions (unchanged from original)
function analyzeHTMLStructure(doc, html) {
    // Check 1: HTML5 doctype
    if (html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>')) {
        checkItem("html-structure", 0, true);
    }
    
    // Check 2: <html lang=""> set correctly
    if (doc.documentElement.lang && doc.documentElement.lang.length > 0) {
        checkItem("html-structure", 1, true);
    }
    
    // Check 3: <head> before <body>
    const head = doc.querySelector('head');
    const body = doc.querySelector('body');
    if (head && body) {
        checkItem("html-structure", 2, true);
    }
    
    // Check 4: <header>, <main>, <footer> used correctly
    if (doc.querySelector('header') && doc.querySelector('main') && doc.querySelector('footer')) {
        checkItem("html-structure", 3, true);
    }
    
    // Check 5: One <h1> per page
    const h1Count = doc.querySelectorAll('h1').length;
    checkItem("html-structure", 4, h1Count === 1);
    
    // Check 6: Proper heading hierarchy (simplified check)
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
        checkItem("html-structure", 5, true);
    }
    
    // Check 7: Semantic elements used
    if (doc.querySelector('nav, section, article, aside, figure, figcaption')) {
        checkItem("html-structure", 6, true);
    }
    
    // Check 8: Basic HTML structure
    if (html.includes('</html>') && html.includes('</head>') && html.includes('</body>')) {
        checkItem("html-structure", 7, true);
    }
}

function analyzeMetadata(doc) {
    // Check 1: <meta charset="UTF-8">
    const charsetMeta = doc.querySelector('meta[charset="UTF-8"], meta[charset="utf-8"]');
    checkItem("metadata", 0, !!charsetMeta);
    
    // Check 2: <meta name="viewport">
    const viewportMeta = doc.querySelector('meta[name="viewport"]');
    checkItem("metadata", 1, !!viewportMeta);
    
    // Check 3: <title> that describes the page
    const title = doc.querySelector('title');
    checkItem("metadata", 2, !!title && title.textContent.trim().length > 0);
    
    // Check 4: <meta description>
    const descriptionMeta = doc.querySelector('meta[name="description"]');
    checkItem("metadata", 3, !!descriptionMeta);
}

function analyzeNavigation(doc) {
    // Check 1: Clear navigation structure
    const navLinks = doc.querySelector('nav a, [role="navigation"] a, header a');
    checkItem("navigation", 0, !!navLinks);
    
    // Check 2: <nav> inside <header>
    const header = doc.querySelector('header');
    const navInHeader = header && header.querySelector('nav');
    checkItem("navigation", 1, !!navInHeader);
    
    // Check 3: <header> at the top
    const firstElement = doc.body.firstElementChild;
    checkItem("navigation", 2, firstElement && (firstElement.tagName === 'HEADER' || firstElement.querySelector('header')));
    
    // Check 4: <main> contains the primary content
    const main = doc.querySelector('main');
    checkItem("navigation", 3, !!main);
    
    // Check 5: <footer> at the bottom
    const footer = doc.querySelector('footer');
    checkItem("navigation", 4, !!footer);
}

function analyzeJavaScript(doc, html) {
    // Check 1: External JS files
    const externalScripts = doc.querySelectorAll('script[src]');
    const inlineScripts = doc.querySelectorAll('script:not([src])');
    checkItem("javascript", 0, externalScripts.length > 0 || inlineScripts.length === 0);
    
    // Check 2: No inline onclick
    const inlineOnclick = doc.querySelectorAll('[onclick]');
    checkItem("javascript", 1, inlineOnclick.length === 0);
    
    // Check 3: No document.write()
    checkItem("javascript", 2, !html.includes('document.write('));
    
    // Check 4: No jQuery
    const scripts = doc.querySelectorAll('script[src]');
    let hasjQuery = false;
    scripts.forEach(script => {
        if (script.src.includes('jquery')) hasjQuery = true;
    });
    checkItem("javascript", 3, !hasjQuery);
    
    // Check 5: Scripts loaded with defer
    const nonDeferScripts = doc.querySelectorAll('script[src]:not([defer]):not([async])');
    checkItem("javascript", 4, nonDeferScripts.length === 0);
}

function analyzeAccessibility(doc) {
    // Check 1: Semantic HTML
    const divs = doc.querySelectorAll('div').length;
    const semantic = doc.querySelectorAll('header, nav, main, section, article, aside, footer, figure, figcaption, time').length;
    checkItem("accessibility", 0, semantic > 0);
    
    // Check 2: Forms and buttons labeled
    const inputs = doc.querySelectorAll('input, textarea, select');
    const buttons = doc.querySelectorAll('button, [role="button"]');
    let labeledCount = 0;
    inputs.forEach(input => {
        if (input.labels && input.labels.length > 0 || 
            input.id && doc.querySelector(`label[for="${input.id}"]`) ||
            input.hasAttribute('aria-label') || 
            input.hasAttribute('aria-labelledby') ||
            input.placeholder) {
            labeledCount++;
        }
    });
    checkItem("accessibility", 1, inputs.length === 0 || labeledCount > 0);
    
    // Check 3: Keyboard navigation
    const focusable = doc.querySelectorAll('a[href], button, input, textarea, select, [tabindex]');
    checkItem("accessibility", 2, focusable.length > 0);
    
    // Check 4: lang attribute (already checked in HTML structure)
    checkItem("accessibility", 3, !!doc.documentElement.lang);
}

function analyzePerformance(doc) {
    // Check 1: No blocking JS in <head>
    const headScripts = doc.head.querySelectorAll('script:not([async]):not([defer])');
    checkItem("performance", 0, headScripts.length === 0);
}

function checkItem(sectionId, itemIndex, isChecked) {
    const section = checklistData[sectionId];
    if (!section || !section.items[itemIndex]) return;
    
    const item = section.items[itemIndex];
    item.checked = isChecked;
    
    if (isChecked) {
        auditState.completedItems++;
        if (section.essential) {
            auditState.completedEssential++;
        } else {
            auditState.completedNonEssential++;
        }
    }
    
    // Update checkbox in UI
    const sections = document.querySelectorAll('.section');
    const sectionIndex = Object.keys(checklistData).indexOf(sectionId);
    if (sectionIndex !== -1 && sections[sectionIndex]) {
        const checkboxes = sections[sectionIndex].querySelectorAll('.checkbox');
        if (itemIndex < checkboxes.length) {
            const checkbox = checkboxes[itemIndex];
            checkbox.classList.toggle('checked', isChecked);
        }
    }
}

function resetAllCheckboxes() {
    // Reset audit state
    auditState.completedItems = 0;
    auditState.completedEssential = 0;
    auditState.completedNonEssential = 0;
    
    // Reset all items in checklistData
    Object.values(checklistData).forEach(section => {
        section.items.forEach(item => {
            item.checked = false;
        });
    });
    
    // Reset all checkboxes in UI
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.classList.remove('checked');
    });
}

function updateAllSectionProgress() {
    Object.keys(checklistData).forEach(sectionId => {
        updateSectionProgress(sectionId);
    });
}

function saveUrlToHistory(url) {
    try {
        const history = JSON.parse(localStorage.getItem('auditHistory') || '[]');
        history.unshift({
            url: url,
            timestamp: new Date().toISOString(),
            score: auditState.progress,
            grade: auditState.grade
        });
        
        // Keep only last 10 entries
        if (history.length > 10) {
            history.pop();
        }
        
        localStorage.setItem('auditHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save URL history:', error);
    }
}

// ============================================
// SOURCE CODE EXTRACTION, DOWNLOAD & COPY FUNCTIONS
// ============================================

function setupSourceCodeHandlers() {
    // Copy button
    copyBtn.addEventListener('click', () => {
        copySourceCode();
    });
    
    // Extract button - extracts from the current URL
    extractBtn.addEventListener('click', () => {
        extractSourceFromCurrentUrl();
    });
    
    // Download button - downloads the extracted source code
    downloadBtn.addEventListener('click', () => {
        downloadSourceCode();
    });
    
    // Initially disable extract and download buttons
    extractBtn.disabled = true;
    downloadBtn.disabled = true;
}

function extractSourceFromCurrentUrl() {
    if (!auditState.currentUrl || !auditState.currentSourceCode) {
        showError('Please audit a URL first before extracting source code');
        return;
    }
    
    showNotification('Extracting source code...', 'info');
    
    try {
        auditState.extractedSourceCode = auditState.currentSourceCode;
        
        // Display in code viewer
        displaySourceCode(auditState.extractedSourceCode);
        
        // Enable download button
        downloadBtn.disabled = false;
        
        // Update extract button
        const originalText = extractBtn.textContent;
        extractBtn.textContent = 'Extracted!';
        extractBtn.style.background = 'var(--success)';
        
        showNotification('Source code extracted successfully!', 'success');
        
        setTimeout(() => {
            extractBtn.textContent = originalText;
            extractBtn.style.background = '';
        }, 2000);
        
    } catch (error) {
        console.error('Extraction failed:', error);
        showNotification('Failed to extract source code', 'error');
    }
}

function copySourceCode() {
    if (!auditState.extractedSourceCode) {
        showNotification('No source code to copy. Extract source first.', 'warning');
        return;
    }
    
    const sourceText = auditState.extractedSourceCode;
    
    // Method 1: Modern Clipboard API (works in most modern browsers)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(sourceText).then(() => {
            showCopySuccess();
        }).catch(() => {
            // If Clipboard API fails, try fallback method
            useFallbackCopyMethod(sourceText);
        });
    } else {
        // Use fallback method for older browsers/Opera Mini
        useFallbackCopyMethod(sourceText);
    }
}

function useFallbackCopyMethod(text) {
    try {
        // Method 2: Use a temporary textarea element (most reliable cross-browser)
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea invisible but still focusable
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Try execCommand (deprecated but works in many older browsers)
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.warn('execCommand failed:', err);
        }
        
        document.body.removeChild(textArea);
        
        if (success) {
            showCopySuccess();
        } else {
            // Method 3: Show the text for manual copy (last resort)
            showTextForManualCopy(text);
        }
        
    } catch (error) {
        console.error('Fallback copy failed:', error);
        showTextForManualCopy(text);
    }
}

function showTextForManualCopy(text) {
    // Create a modal or dialog with the source code for manual copying
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'var(--card-bg)';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.maxHeight = '80%';
    modalContent.style.overflow = 'auto';
    
    const title = document.createElement('h3');
    title.textContent = 'Copy Source Code Manually';
    title.style.marginBottom = '15px';
    title.style.color = 'var(--text-primary)';
    
    const instructions = document.createElement('p');
    instructions.innerHTML = 'Select all text below (Ctrl+A or long press) and copy (Ctrl+C):';
    instructions.style.marginBottom = '10px';
    instructions.style.color = 'var(--text-secondary)';
    
    const codeDisplay = document.createElement('textarea');
    codeDisplay.value = text;
    codeDisplay.style.width = '100%';
    codeDisplay.style.height = '300px';
    codeDisplay.style.fontFamily = 'monospace';
    codeDisplay.style.fontSize = '12px';
    codeDisplay.style.padding = '10px';
    codeDisplay.style.backgroundColor = '#f5f5f5';
    codeDisplay.style.border = '1px solid #ddd';
    codeDisplay.style.borderRadius = '5px';
    codeDisplay.style.resize = 'none';
    codeDisplay.readOnly = true;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '15px';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.backgroundColor = 'var(--primary)';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        showNotification('Please copy the text manually from the dialog', 'warning');
    };
    
    modalContent.appendChild(title);
    modalContent.appendChild(instructions);
    modalContent.appendChild(codeDisplay);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Auto-select the text
    codeDisplay.focus();
    codeDisplay.select();
}

function showCopySuccess() {
    showNotification('Source code copied to clipboard!', 'success');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = 'var(--success)';
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

function downloadSourceCode() {
    if (!auditState.extractedSourceCode) {
        showNotification('No source code to download. Extract source first.', 'warning');
        return;
    }
    
    try {
        // Get current URL for filename
        let filename = 'source-code.html';
        if (auditState.currentUrl) {
            const url = new URL(auditState.currentUrl);
            filename = `${url.hostname}-${new Date().getTime()}.html`;
        }
        
        // Create blob and download link
        const blob = new Blob([auditState.extractedSourceCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Source code downloaded successfully!', 'success');
        
        // Visual feedback for download button
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Downloaded!';
        downloadBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);
        
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Failed to download source code', 'error');
    }
}

function displaySourceCode(source) {
    if (!source) return;
    
    // Format the source code with line numbers
    const lines = source.split('\n');
    let formattedCode = '';
    
    lines.forEach((line, index) => {
        const escapedLine = escapeHtml(line);
        formattedCode += `<code class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${escapedLine}</span></code>\n`;
    });
    
    codeDisplay.innerHTML = formattedCode;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// VALIDATOR FUNCTIONS
// ============================================

function updateValidatorButtons() {
    const hasUrl = auditState.currentUrl && auditState.currentUrl.trim() !== '';
    
    // Enable/disable buttons based on whether we have a URL
    [htmlValidatorBtn, cssValidatorBtn, accessibilityBtn, performanceBtn].forEach(btn => {
        if (hasUrl) {
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            btn.style.pointerEvents = "auto";
        } else {
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
            btn.style.pointerEvents = "none";
        }
    });
}

function openValidator(validatorType) {
    if (!auditState.currentUrl) {
        showNotification('Please enter and audit a URL first', 'warning');
        return;
    }
    
    const validatorNames = {
        html: 'HTML Validator',
        css: 'CSS Validator',
        accessibility: 'Accessibility Checker',
        performance: 'Performance Test'
    };
    
    const validatorUrls = {
        html: `https://validator.w3.org/nu/?doc=${encodeURIComponent(auditState.currentUrl)}`,
        css: `https://jigsaw.w3.org/css-validator/validator?uri=${encodeURIComponent(auditState.currentUrl)}`,
        accessibility: `https://wave.webaim.org/report#/${encodeURIComponent(auditState.currentUrl)}`,
        performance: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(auditState.currentUrl)}`
    };
    
    try {
        const url = validatorUrls[validatorType];
        if (!url) {
            showNotification('Invalid validator type', 'error');
            return;
        }
        
        // Open in new tab
        window.open(url, '_blank');
        showNotification(`Opening ${validatorNames[validatorType]}...`, 'success');
        
    } catch (error) {
        console.error(`Failed to open ${validatorType} validator:`, error);
        showNotification(`Failed to open validator: ${error.message}`, 'error');
    }
}

// ============================================
// STATE PERSISTENCE
// ============================================

function saveState() {
    try {
        const stateToSave = {
            checklistData: checklistData,
            auditState: auditState,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('frontEndAuditState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('frontEndAuditState');
        if (!saved) return;
        
        const parsed = JSON.parse(saved);
        
        // Restore checklist data
        if (parsed.checklistData) {
            Object.keys(parsed.checklistData).forEach(sectionKey => {
                if (checklistData[sectionKey] && parsed.checklistData[sectionKey]) {
                    checklistData[sectionKey].items.forEach((item, index) => {
                        if (parsed.checklistData[sectionKey].items[index]) {
                            item.checked = parsed.checklistData[sectionKey].items[index].checked;
                        }
                    });
                }
            });
        }
        
        // Restore audit state
        if (parsed.auditState) {
            Object.keys(auditState).forEach(key => {
                if (parsed.auditState[key] !== undefined) {
                    auditState[key] = parsed.auditState[key];
                }
            });
        }
        
        // If we have extracted source code, display it
        if (auditState.extractedSourceCode) {
            displaySourceCode(auditState.extractedSourceCode);
            downloadBtn.disabled = false;
        }
        
        // If we have a current URL, enable validator buttons
        if (auditState.currentUrl) {
            updateValidatorButtons();
        }
        
        console.log('📂 Saved state loaded');
    } catch (error) {
        console.error('Failed to load saved state:', error);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // URL audit handlers
    setupUrlAuditHandlers();
    
    // Source code handlers
    setupSourceCodeHandlers();
}

function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveState();
        showNotification('Progress saved!', 'success');
    }
    
    // Ctrl+Enter to run URL audit
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (urlInput.value.trim()) {
            urlForm.dispatchEvent(new Event('submit'));
        }
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set icon based on type
    let icon = 'ℹ️';
    let bgColor = 'var(--primary)';
    
    switch(type) {
        case 'success':
            icon = '✅';
            bgColor = 'var(--success)';
            break;
        case 'error':
            icon = '❌';
            bgColor = 'var(--danger)';
            break;
        case 'warning':
            icon = '⚠️';
            bgColor = 'var(--warning)';
            break;
    }
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Apply styles
    notification.style.background = bgColor;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

function hideError() {
    errorMsg.classList.remove('show');
}

// ============================================
// INITIALIZE THE APPLICATION
// ============================================

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make useful functions available globally for debugging
window.auditTool = {
    getState: () => auditState,
    getChecklist: () => checklistData,
    saveState: saveState,
    loadState: loadSavedState
};

console.log('🚀 Front-End Designer Audit Tool JavaScript Loaded');



// Add this to your pagechecker.js or create a reset button
function resetAllCheckboxes() {
    // Reset all checkboxes in the UI
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.classList.remove('checked');
    });
    
    // Reset the data model
    Object.values(checklistData).forEach(section => {
        section.items.forEach(item => {
            item.checked = false;
        });
    });
    
    // Reset audit state
    auditState.completedItems = 0;
    auditState.completedEssential = 0;
    auditState.completedNonEssential = 0;
    auditState.progress = 0;
    auditState.grade = "-";
    
    // Update UI
    updateAllSectionProgress();
    updateProgress();
    updateGrade();
    updateSummary();
    
    // Clear localStorage
    localStorage.removeItem('frontEndAuditState');
    
    showNotification('All checkboxes reset!', 'success');
}

// Add a reset button to your HTML
// <button class="reset-btn" onclick="resetAllCheckboxes()">🔄 Reset All</button>

// Or run this in browser console
// resetAllCheckboxes();