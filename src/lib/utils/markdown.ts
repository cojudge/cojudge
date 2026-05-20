import { marked, Renderer } from 'marked';

function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}

function getStorageKey(codeText: string): string {
    return `md-code-collapsed-${simpleHash(codeText)}`;
}

function isCollapsed(codeText: string): boolean {
    try {
        return localStorage.getItem(getStorageKey(codeText)) === 'true';
    } catch {
        return false;
    }
}

function initCollapseState(wrapper: HTMLElement) {
    const codeEl = wrapper.querySelector('code');
    if (!codeEl) return;
    const codeText = codeEl.textContent || '';
    const preEl = wrapper.querySelector('pre');
    const expandLabel = wrapper.querySelector('.code-block-lang-label');
    const collapseBtn = wrapper.querySelector('.collapse-code-button');
    if (!preEl || !collapseBtn) return;

    const collapsed = isCollapsed(codeText);
    if (collapsed) {
        applyCollapsedState(wrapper, preEl, expandLabel, collapseBtn);
    } else {
        applyExpandedState(wrapper, preEl, expandLabel, collapseBtn);
    }
}

function applyCollapsedState(wrapper: HTMLElement, preEl: Element, expandLabel: Element | null, collapseBtn: Element) {
    preEl.style.display = 'none';
    wrapper.classList.add('collapsed');
    collapseBtn.setAttribute('aria-label', 'Expand code');
    collapseBtn.setAttribute('title', 'Expand code');
    collapseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    if (expandLabel) expandLabel.style.display = '';
}

function applyExpandedState(wrapper: HTMLElement, preEl: Element, expandLabel: Element | null, collapseBtn: Element) {
    preEl.style.display = '';
    wrapper.classList.remove('collapsed');
    collapseBtn.setAttribute('aria-label', 'Collapse code');
    collapseBtn.setAttribute('title', 'Collapse code');
    collapseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    if (expandLabel) expandLabel.style.display = 'none';
}

// Attach click handler globally
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('.collapse-code-button') as HTMLElement | null;
        if (!btn) return;
        e.preventDefault();
        const wrapper = btn.closest('.code-block-wrapper') as HTMLElement | null;
        if (!wrapper) return;
        const codeEl = wrapper.querySelector('code');
        if (!codeEl) return;
        const codeText = codeEl.textContent || '';
        const preEl = wrapper.querySelector('pre');
        const expandLabel = wrapper.querySelector('.code-block-lang-label');
        if (!preEl) return;

        const isCurrentlyCollapsed = wrapper.classList.contains('collapsed');
        if (isCurrentlyCollapsed) {
            applyExpandedState(wrapper, preEl, expandLabel, btn);
            try { localStorage.removeItem(getStorageKey(codeText)); } catch {}
        } else {
            applyCollapsedState(wrapper, preEl, expandLabel, btn);
            try { localStorage.setItem(getStorageKey(codeText), 'true'); } catch {}
        }
    });

    // Initialize collapse state for all code blocks after render
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    const wrappers = node.classList?.contains('code-block-wrapper')
                        ? [node]
                        : node.querySelectorAll('.code-block-wrapper');
                    for (const wrapper of wrappers) {
                        initCollapseState(wrapper as HTMLElement);
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

export function getMarkdownRenderer() {
    const renderer = new Renderer();
    renderer.code = (token: any) => {
        const text = token.text;
        const lang = (token.lang || '').split(/\s+/)[0];
        let escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Basic syntax highlighting for common languages using a single-pass regex
        if (['cpp', 'java', 'csharp', 'python', 'javascript', 'typescript', 'rust', 'c', 'go', 'swift', 'ruby', 'php', 'bash', 'sh'].includes(lang.toLowerCase())) {
            const regex = /\/\/(.*)|#(.*)|"(.*?)"|'(.*?)'|\b(int|float|double|char|void|if|else|while|for|return|class|public|private|protected|static|new|import|from|def|fn|let|mut|using|namespace|include|cout|endl|String|args|console|log|var|const|type|interface|bool|boolean|true|false|self|Self|None|nil|range|in|is|yield|async|await|try|except|catch|finally|throw|raise|break|continue|case|switch|default|package|func|go|chan|defer|struct|interface|type|map|select|pub|use|mod|trait|impl|enum|where|match)\b/g;
            escapedText = escapedText.replace(regex, (match, c1, c2, s1, s2, k) => {
                if (c1) return `<span class="hl-comment">//${c1}</span>`;
                if (c2) return `<span class="hl-comment">#${c2}</span>`;
                if (s1) return `<span class="hl-string">"${s1}"</span>`;
                if (s2) return `<span class="hl-string">'${s2}'</span>`;
                if (k) {
                    const builtins = ['cout', 'endl', 'String', 'args', 'console', 'log', 'print', 'self', 'Self', 'None', 'nil', 'true', 'false', 'range', 'len', 'append', 'make', 'new', 'panic', 'recover'];
                    if (builtins.includes(k)) return `<span class="hl-builtin">${k}</span>`;
                    return `<span class="hl-keyword">${k}</span>`;
                }
                return match;
            });
        }

        const langLabel = lang ? `<span class="code-block-lang-label" style="display:none;">${lang}</span>` : '';

        return `<div class="code-block-wrapper" data-code-hash="${simpleHash(text)}">
            <div class="code-block-actions">
                ${langLabel}
                <button class="collapse-code-button" title="Collapse code" aria-label="Collapse code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>
                <button class="copy-code-button" title="Copy code" onclick="
                    const code = this.closest('.code-block-wrapper').querySelector('code').innerText; 
                    navigator.clipboard.writeText(code); 
                    const button = this;
                    const originalInner = button.innerHTML;
                    button.innerHTML = '<svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg>';
                    button.style.color = 'var(--color-easy)';
                    setTimeout(() => { 
                        button.innerHTML = originalInner;
                        button.style.color = '';
                    }, 2000);
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
            <pre><code class="language-${lang}">${escapedText}</code></pre>
        </div>`;
    };
    return renderer;
}

export function renderMarkdown(content: string) {
    const renderer = getMarkdownRenderer();
    return marked.parse(content, { renderer });
}