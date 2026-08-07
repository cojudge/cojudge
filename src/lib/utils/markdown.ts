import { marked, Renderer } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { languageIconSvg } from './languageIcon';
import { PASTED_IMAGE_SCHEME, parsePastedImageLink, getPastedImage } from './imageStore';

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

        const copyBtn = target.closest('.copy-code-button') as HTMLElement | null;
        if (copyBtn) {
            e.preventDefault();
            const wrapper = copyBtn.closest('.code-block-wrapper, .md-code-copy') as HTMLElement | null;
            // Rendered blocks are <pre><code>, but blocks created in WYSIWYG
            // (toolbar button / ``` shortcut) are bare <pre>, so fall back.
            const codeEl = wrapper?.querySelector('code') ?? wrapper?.querySelector('pre');
            if (!codeEl) return;
            // Strip the ZWSP caret placeholder kept in fresh WYSIWYG blocks.
            const code = (codeEl.innerText || '').replace(/\u200B/g, '');
            navigator.clipboard.writeText(code).then(() => {
                const originalInner = copyBtn.innerHTML;
                const originalColor = copyBtn.style.color;
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                copyBtn.style.color = 'var(--color-easy)';
                setTimeout(() => {
                    copyBtn.innerHTML = originalInner;
                    copyBtn.style.color = originalColor;
                }, 2000);
            }).catch(() => {});
            return;
        }

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

// Class names used for image thumbnails (small preview + delete button).
export const THUMB_WRAPPER_CLASS = 'md-thumb';
export const THUMB_DELETE_CLASS = 'md-thumb-delete';

// Marker used for inline code created by the WYSIWYG backtick auto-matching.
// Chrome sanitizes <code> elements inserted via execCommand into styled spans
// and drops inline styles that reference CSS variables, so the span is first
// inserted with a concrete background color and then rewritten to this marker
// (a theme variable) by the caller right after insertion. htmlToMarkdown
// converts spans carrying this marker back to inline code markdown, and the
// WYSIWYG CSS styles them like code using the theme variable, so the marker
// adapts to every theme.
export const INLINE_CODE_STYLE_MARKER = 'var(--color-second-bg)';

export function inlineCodeSpanHtml(text: string): string {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Concrete color: Chrome's execCommand sanitizer preserves background-color
    // only when it is a concrete value, not a var() reference.
    return `<span style="background-color: rgb(255, 254, 253);">${escaped}</span>`;
}

const TRASH_ICON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

function escapeHtmlAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// True when the entire string is a single URL-like token (no whitespace).
// Accepts http(s)://... and www....
export function isUrlLike(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed || /\s/.test(trimmed)) return false;
    try {
        if (/^https?:\/\//i.test(trimmed)) {
            const url = new URL(trimmed);
            return url.protocol === 'http:' || url.protocol === 'https:';
        }
        if (/^www\./i.test(trimmed)) {
            new URL('http://' + trimmed);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export function normalizeUrl(text: string): string {
    const trimmed = text.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^www\./i.test(trimmed)) return 'http://' + trimmed;
    return trimmed;
}

// True when href points at a playground file (relative or absolute).
// e.g. /playground?fileId=abc, https://host/playground?fileId=abc
export function parsePlaygroundFileId(href: string): string | null {
    if (!href) return null;
    try {
        const url = new URL(href, 'http://local.invalid');
        const path = url.pathname.replace(/\/+$/, '') || '/';
        if (path !== '/playground') return null;
        const fileId = url.searchParams.get('fileId');
        return fileId && fileId.length > 0 ? fileId : null;
    } catch {
        return null;
    }
}

export function playgroundFileHref(fileId: string): string {
    return `/playground?fileId=${encodeURIComponent(fileId)}`;
}

// Notion-style inline file mention (icon + underlined label). contenteditable=false
// makes it an atomic unit in the WYSIWYG editor.
export const FILE_MENTION_CLASS = 'md-file-mention';
export const FILE_MENTION_LABEL_CLASS = 'md-file-mention-label';

export type MarkdownRenderOptions = {
    imageThumbnails?: boolean;
    /** Resolve a playground fileId to a language so mentions can show the right icon. */
    resolveFileLanguage?: (fileId: string) => string | null | undefined;
};

export function fileMentionHtml(href: string, text: string, language?: string | null): string {
    const label = text || href;
    return (
        `<a href="${escapeHtmlAttr(href)}" class="${FILE_MENTION_CLASS}" contenteditable="false">` +
        languageIconSvg(language, 14) +
        `<span class="${FILE_MENTION_LABEL_CLASS}">${escapeHtmlAttr(label)}</span>` +
        `</a>`
    );
}

// After rendering markdown into the WYSIWYG editor, ensure each file mention is an
// atomic unit with a ZWSP caret anchor after it. Without the anchor, browsers park
// the caret at the end of the block (far right) and Backspace needs two presses.
export function ensureFileMentionCarets(root: HTMLElement) {
    const mentions = Array.from(root.querySelectorAll(`.${FILE_MENTION_CLASS}`));
    for (const mention of mentions) {
        mention.setAttribute('contenteditable', 'false');
        const next = mention.nextSibling;
        if (next && next.nodeType === Node.TEXT_NODE && (next.textContent || '').startsWith('\u200B')) {
            continue;
        }
        mention.after(document.createTextNode('\u200B'));
    }
}

// HTML for a link. External links open in a new tab; playground file links are
// rendered as Notion-style file mentions (in-app navigation).
export function linkHtml(href: string, text: string, language?: string | null): string {
    if (parsePlaygroundFileId(href)) {
        return fileMentionHtml(href, text, language);
    }
    return `<a href="${escapeHtmlAttr(href)}" target="_blank" rel="noopener noreferrer">${escapeHtmlAttr(text)}</a>`;
}

// Renders an image as a small thumbnail with a delete button, instead of the
// full-size image. Click handling (lightbox / delete) is done via event
// delegation by the caller. contenteditable="false" makes the thumbnail an
// atomic unit inside the WYSIWYG editor.
export function imageThumbnailHtml(href: string, alt: string, title?: string | null): string {
    const titleAttr = title ? ` title="${escapeHtmlAttr(title)}"` : '';
    return `<span class="${THUMB_WRAPPER_CLASS}" contenteditable="false"><img src="${escapeHtmlAttr(href)}" alt="${escapeHtmlAttr(alt)}"${titleAttr}><button type="button" class="${THUMB_DELETE_CLASS}" title="Delete image" aria-label="Delete image">${TRASH_ICON_SVG}</button></span>`;
}

// Wraps every <img> under root in a thumbnail container with a delete button.
// Used by the WYSIWYG editor, where images start out as plain <img> elements
// (initial render and image paste).
export function wrapImageThumbnails(root: HTMLElement) {
    const imgs = Array.from(root.querySelectorAll('img'));
    for (const img of imgs) {
        if (img.closest(`.${THUMB_WRAPPER_CLASS}`)) continue;
        const wrapper = document.createElement('span');
        wrapper.className = THUMB_WRAPPER_CLASS;
        wrapper.setAttribute('contenteditable', 'false');
        img.replaceWith(wrapper);
        wrapper.appendChild(img);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = THUMB_DELETE_CLASS;
        btn.title = 'Delete image';
        btn.setAttribute('aria-label', 'Delete image');
        btn.innerHTML = TRASH_ICON_SVG;
        wrapper.appendChild(btn);
    }
}

// Class name of the wrapper added around code blocks in the WYSIWYG editor so
// they get a copy button (see wrapCodeBlocksWithCopy). Stripped again by
// htmlToMarkdown so only the <pre> round-trips back to markdown.
export const CODE_COPY_WRAPPER_CLASS = 'md-code-copy';

// Images pasted into markdown documents are stored in IndexedDB and referenced
// by a fake link (cojudge://image/<id>). While the payload is being resolved,
// <img> elements whose src is still the fake link stay hidden (see app.css).
// Once resolved, the data URL lives in src and the fake link is kept in the
// data-cojudge-img attribute so htmlToMarkdown round-trips it back to the fake
// link instead of the (potentially huge) base64 payload.
export async function resolvePastedImages(root: HTMLElement): Promise<void> {
    if (typeof indexedDB === 'undefined') return;
    const imgs = Array.from(root.querySelectorAll('img'));
    for (const img of imgs) {
        const fakeLink = img.getAttribute('data-cojudge-img') || img.getAttribute('src') || '';
        if (!parsePastedImageLink(fakeLink)) continue;
        img.dataset.cojudgeImg = fakeLink;
        const dataUrl = await getPastedImage(fakeLink);
        if (dataUrl && img.isConnected) img.src = dataUrl;
    }
}

// GFM task-list checkboxes are rendered disabled by marked. In the WYSIWYG
// editor we enable them so users can click to toggle, and mark them non-editable
// so the caret cannot land inside the control. A ZWSP caret anchor is kept
// immediately after each checkbox so the caret paints to the right of it
// (contenteditable otherwise often draws it on the left of replaced elements).
export function prepareTaskListCheckboxes(root: HTMLElement) {
    root.querySelectorAll('li').forEach((node) => {
        const li = node as HTMLElement;
        // Unwrap <p> or <div> wrapper inside <li> if it contains a task checkbox
        // (marked produces loose <li><p><input ...></p></li> for lists with line breaks).
        const nestedInput = li.querySelector('input[type="checkbox"]');
        if (nestedInput && nestedInput.parentElement !== li) {
            li.insertBefore(nestedInput, li.firstChild);
        }
        const p = li.querySelector(':scope > p');
        if (p && li.querySelectorAll(':scope > p').length === 1) {
            p.replaceWith(...Array.from(p.childNodes));
        }

        if (!isTaskListItem(li)) return;
        const input = li.querySelector(':scope > input[type="checkbox"]') as HTMLInputElement | null;
        if (!input) return;
        input.disabled = false;
        input.removeAttribute('disabled');
        input.setAttribute('contenteditable', 'false');
        // Keep the HTML attribute in sync with the live property so innerHTML
        // serialization (and turndown) sees the current checked state.
        if (input.checked) input.setAttribute('checked', '');
        else input.removeAttribute('checked');
        ensureTaskItemCaretAnchor(li);
    });
}

export function isTaskListItem(li: HTMLElement): boolean {
    for (let i = 0; i < li.childNodes.length; i++) {
        const child = li.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && !(child.textContent || '').replace(/\u200B/g, '').trim()) {
            continue;
        }
        if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === 'INPUT' &&
            (child as HTMLInputElement).type === 'checkbox'
        ) {
            return true;
        }
        return false;
    }
    return false;
}

export function isEmptyTaskListItem(li: HTMLElement): boolean {
    const clone = li.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input').forEach((el) => el.remove());
    return !(clone.textContent || '').replace(/\u200B/g, '').trim();
}

export function createTaskCheckbox(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('contenteditable', 'false');
    return input;
}

// Returns the text node immediately after the checkbox, starting with ZWSP.
export function ensureTaskItemCaretAnchor(li: HTMLElement): Text | null {
    let checkbox: HTMLInputElement | null = null;
    for (let i = 0; i < li.childNodes.length; i++) {
        const child = li.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && !(child.textContent || '').replace(/\u200B/g, '').trim()) {
            continue;
        }
        if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === 'INPUT' &&
            (child as HTMLInputElement).type === 'checkbox'
        ) {
            checkbox = child as HTMLInputElement;
            break;
        }
        return null;
    }
    if (!checkbox) return null;

    const next = checkbox.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE) {
        const text = next as Text;
        if (!(text.textContent || '').startsWith('\u200B')) {
            text.textContent = '\u200B' + (text.textContent || '').replace(/^\u200B+/, '');
        }
        return text;
    }
    const zwsp = document.createTextNode('\u200B');
    checkbox.after(zwsp);
    return zwsp;
}

export function ensureTaskCheckbox(li: HTMLElement): HTMLInputElement {
    for (let i = 0; i < li.childNodes.length; i++) {
        const child = li.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && !(child.textContent || '').replace(/\u200B/g, '').trim()) {
            continue;
        }
        if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === 'INPUT' &&
            (child as HTMLInputElement).type === 'checkbox'
        ) {
            const input = child as HTMLInputElement;
            input.disabled = false;
            input.removeAttribute('disabled');
            input.setAttribute('contenteditable', 'false');
            ensureTaskItemCaretAnchor(li);
            return input;
        }
        break;
    }
    const input = createTaskCheckbox();
    li.insertBefore(input, li.firstChild);
    ensureTaskItemCaretAnchor(li);
    return input;
}

export function removeTaskCheckbox(li: HTMLElement) {
    const nodes = Array.from(li.childNodes);
    for (const child of nodes) {
        if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === 'INPUT' &&
            (child as HTMLInputElement).type === 'checkbox'
        ) {
            const next = child.nextSibling;
            child.remove();
            if (next && next.nodeType === Node.TEXT_NODE) {
                next.textContent = (next.textContent || '').replace(/^\u200B+/, '').replace(/^ /, '');
                if (!next.textContent) next.parentNode?.removeChild(next);
            }
            return;
        }
    }
}

// Appends an empty line at the end of the WYSIWYG editor when it does not
// already end with one. A contenteditable="false" thumbnail at the very end of
// the document would trap the caret, so an empty <p> is always kept after it
// (and after the last paragraph in general), letting the user move past a
// pasted image and keep typing. htmlToMarkdown trims the empty line away.
export function ensureTrailingEmptyLine(root: HTMLElement) {
    const last = root.lastElementChild as HTMLElement | null;
    if (last) {
        const children = Array.from(last.children);
        const onlyBr = children.length === 0 || (children.length === 1 && children[0].tagName === 'BR');
        if (last.tagName === 'P' && onlyBr && !last.textContent?.trim()) return;
    }
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    root.appendChild(p);
}

// Wraps every <pre> under root with a copy button. The button is
// contenteditable="false" so it stays out of the editable content; the <pre>
// itself remains editable.
export function wrapCodeBlocksWithCopy(root: HTMLElement) {
    const preElements = Array.from(root.querySelectorAll('pre'));
    for (const pre of preElements) {
        if (pre.closest(`.${CODE_COPY_WRAPPER_CLASS}`)) continue;
        const wrapper = document.createElement('div');
        wrapper.className = `code-block-wrapper ${CODE_COPY_WRAPPER_CLASS}`;
        pre.replaceWith(wrapper);
        wrapper.appendChild(pre);
        const actions = document.createElement('div');
        actions.className = 'code-block-actions';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-code-button';
        btn.title = 'Copy code';
        btn.setAttribute('aria-label', 'Copy code');
        btn.setAttribute('contenteditable', 'false');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        actions.appendChild(btn);
        wrapper.appendChild(actions);
    }
}

function configureLinks(renderer: Renderer, options?: MarkdownRenderOptions) {
    const originalLink = renderer.link.bind(renderer);
    renderer.link = (token: any) => {
        const href = token.href ?? '';
        const fileId = parsePlaygroundFileId(href);
        // Playground file refs render as Notion-style mentions and navigate in-app.
        if (fileId) {
            const language = options?.resolveFileLanguage?.(fileId);
            return fileMentionHtml(href, token.text ?? href, language);
        }
        const html = originalLink(token);
        if (typeof html !== 'string' || !html.startsWith('<a ')) return html;
        return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
    };
}

export function getMarkdownRenderer(options?: MarkdownRenderOptions) {
    const renderer = new Renderer();
    configureLinks(renderer, options);
    if (options?.imageThumbnails) {
        renderer.image = (token: any) => imageThumbnailHtml(token.href ?? '', token.text ?? '', token.title);
    }
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
                <button class="copy-code-button" title="Copy code" aria-label="Copy code">
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

export function renderMarkdown(content: string, options?: MarkdownRenderOptions) {
    const renderer = getMarkdownRenderer(options);
    return marked.parse(content, { renderer });
}

// Plain GFM rendering without the interactive code-block wrapper.
// Used as the source HTML for WYSIWYG editing so it can round-trip back to markdown.
export function renderMarkdownPlain(content: string, options?: MarkdownRenderOptions): string {
    const renderer = new Renderer();
    configureLinks(renderer, options);
    return marked.parse(content, { async: false, renderer });
}

let turndownService: TurndownService | null = null;

function getTurndownService(): TurndownService {
    if (!turndownService) {
        turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-',
            emDelimiter: '*',
            hr: '---'
        });
        turndownService.use(gfm);
        // execCommand('formatBlock', 'pre') (the WYSIWYG code-block toolbar
        // button) produces a bare <pre> without the <code> child turndown's
        // default fencedCodeBlock rule expects, so round-trip those back to
        // fenced code blocks too.
        turndownService.addRule('bareCodeBlock', {
            filter: (node: HTMLElement) =>
                node.nodeName === 'PRE' && !node.querySelector('code'),
            replacement: (_content: string, node: HTMLElement) => {
                // The WYSIWYG ``` shortcut keeps a ZWSP in a freshly created
                // empty code block (turndown skips truly blank elements), which
                // is stripped here so the fence round-trips as ```\n```.
                const code = (node.textContent || '').replace(/\u200B/g, '');
                let fence = '```';
                while (code.includes(fence)) fence += '`';
                return '\n\n' + fence + (code ? '\n' + code.replace(/\n$/, '') + '\n' : '\n') + fence + '\n\n';
            }
        });
        // Inline code created by the WYSIWYG backtick auto-matching (see
        // inlineCodeSpanHtml) round-trips back to inline code markdown.
        turndownService.addRule('wysiwygInlineCode', {
            filter: (node: HTMLElement) =>
                node.nodeName === 'SPAN' && (node.getAttribute('style') || '').includes(INLINE_CODE_STYLE_MARKER),
            replacement: (content: string) => {
                if (!content) return '';
                content = content.replace(/\r?\n|\r/g, ' ');
                let delimiter = '`';
                while (content.includes(delimiter)) delimiter += '`';
                const extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? ' ' : '';
                return delimiter + extraSpace + content + extraSpace + delimiter;
            }
        });
        // Notion-style file mentions round-trip to [label](/playground?fileId=...).
        turndownService.addRule('fileMention', {
            filter: (node: HTMLElement) =>
                node.nodeName === 'A' && node.classList.contains(FILE_MENTION_CLASS),
            replacement: (_content: string, node: HTMLElement) => {
                const href = node.getAttribute('href') || '';
                const labelEl = node.querySelector(`.${FILE_MENTION_LABEL_CLASS}`);
                const label = (labelEl?.textContent || node.textContent || href).trim();
                return `[${label}](${href})`;
            }
        });
        // Pasted images resolve to a data URL in src but keep the IndexedDB
        // fake link in data-cojudge-img; serialize the fake link back to
        // markdown so the document stays small and stable.
        turndownService.addRule('pastedImage', {
            filter: (node: HTMLElement) =>
                node.nodeName === 'IMG' &&
                (node.getAttribute('data-cojudge-img') || node.getAttribute('src') || '').startsWith(PASTED_IMAGE_SCHEME),
            replacement: (_content: string, node: HTMLElement) => {
                const fakeLink = node.getAttribute('data-cojudge-img') || node.getAttribute('src') || '';
                const alt = (node.getAttribute('alt') || '').replace(/(\n+\s*)+/g, '\n').replace(/[[\]]/g, '\\$&');
                return `![${alt}](${fakeLink})`;
            }
        });
        // Custom taskListItems rule that matches ANY checkbox input, even if
        // wrapped inside a <p>, <div>, or <span> inside <li> (which marked produces
        // for loose list items).
        turndownService.addRule('taskListItems', {
            filter: (node: HTMLElement) =>
                node.nodeName === 'INPUT' && (node as HTMLInputElement).type === 'checkbox',
            replacement: (_content: string, node: HTMLElement) => {
                const input = node as HTMLInputElement;
                const checked = input.checked || input.hasAttribute('checked');
                return (checked ? '[x]' : '[ ]') + ' ';
            }
        });
    }
    return turndownService;
}

export function htmlToMarkdown(html: string): string {
    // Strip interactive wrappers (thumbnail delete buttons, code-block copy
    // buttons, contenteditable markers) and normalize task-list checkboxes so
    // that checkboxes inside loose list items (<p><input ...></p>) or nested
    // elements round-trip back to markdown instead of being dropped by turndown.
    if (typeof DOMParser !== 'undefined') {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (html.includes(THUMB_WRAPPER_CLASS) || html.includes(CODE_COPY_WRAPPER_CLASS)) {
            doc.querySelectorAll(`.${THUMB_DELETE_CLASS}`).forEach((el) => el.remove());
            doc.querySelectorAll(`.${THUMB_WRAPPER_CLASS}`).forEach((el) => {
                const img = el.querySelector('img');
                if (img) el.replaceWith(img);
                else el.remove();
            });
            doc.querySelectorAll(`.${CODE_COPY_WRAPPER_CLASS}`).forEach((el) => {
                el.querySelector('.code-block-actions')?.remove();
                el.replaceWith(...Array.from(el.childNodes));
            });
        }
        doc.querySelectorAll('li').forEach((li) => {
            const input = li.querySelector('input[type="checkbox"]');
            if (input && input.parentElement !== li) {
                li.insertBefore(input, li.firstChild);
            }
        });
        html = doc.body.innerHTML;
    }
    // Trailing whitespace (e.g. the empty line kept by
    // ensureTrailingEmptyLine) is insignificant in markdown, so drop it to
    // keep repeated WYSIWYG round-trips stable. Also strip ZWSP caret anchors
    // inserted after contenteditable=false file mentions.
    return getTurndownService().turndown(html).replace(/\u200B/g, '').replace(/\s+$/, '');
}
