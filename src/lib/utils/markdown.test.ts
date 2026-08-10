import { describe, it, expect } from 'vitest';
import { renderMarkdown, renderMarkdownPlain, htmlToMarkdown, highlightCodeHtml, removeFencedCodeBlock, isUrlLike, normalizeUrl, linkHtml, parsePlaygroundFileId, playgroundFileHref } from './markdown';

describe('markdown utils', () => {
    it('renders markdown with the interactive code-block renderer', () => {
        const html = renderMarkdown('```js\nconsole.log("hi");\n```');
        expect(html).toContain('code-block-wrapper');
        expect(html).toContain('console');
    });

    it('syntax-highlights common code language aliases', () => {
        const html = renderMarkdown('```js\nconst value = "hi";\n```');
        expect(html).toContain('<span class="hl-keyword">const</span>');
        expect(html).toContain('<span class="hl-string">&quot;hi&quot;</span>');
        expect(highlightCodeHtml('if True:\n    print("ok")', 'python')).toContain('<span class="hl-keyword">if</span>');
    });

    it('renders plain GFM markdown to HTML', () => {
        const html = renderMarkdownPlain('# Title\n\nSome **bold** text');
        expect(html).toContain('<h1>Title</h1>');
        expect(html).toContain('<strong>bold</strong>');
    });

    it('opens links in a new tab', () => {
        const html = renderMarkdown('[link](https://example.com)') as string;
        expect(html).toContain('href="https://example.com"');
        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noopener noreferrer"');

        const plain = renderMarkdownPlain('[link](https://example.com)') as string;
        expect(plain).toContain('target="_blank"');
        expect(plain).toContain('rel="noopener noreferrer"');
    });

    it('parses playground file links and renders them as file mentions', () => {
        expect(parsePlaygroundFileId('/playground?fileId=abc-123')).toBe('abc-123');
        expect(parsePlaygroundFileId('https://example.com/playground?fileId=xyz')).toBe('xyz');
        expect(parsePlaygroundFileId('/playground?fileId=abc&x=1')).toBe('abc');
        expect(parsePlaygroundFileId('/playground')).toBe(null);
        expect(parsePlaygroundFileId('https://example.com/other?fileId=abc')).toBe(null);
        expect(playgroundFileHref('abc-123')).toBe('/playground?fileId=abc-123');

        const href = playgroundFileHref('file-1');
        const html = renderMarkdown(`[Notes](${href})`, {
            resolveFileLanguage: () => 'go'
        }) as string;
        expect(html).toContain(`href="${href}"`);
        expect(html).toContain('md-file-mention');
        expect(html).toContain('md-file-mention-label');
        expect(html).toContain('md-file-mention-icon');
        expect(html).toContain('>Go</text>');
        expect(html).toContain('>Notes</span>');
        expect(html).not.toContain('target="_blank"');

        const plain = renderMarkdownPlain(`[Notes](${href})`, {
            resolveFileLanguage: () => 'markdown'
        }) as string;
        expect(plain).toContain('md-file-mention');
        expect(plain).toContain('>MD</text>');
        expect(plain).not.toContain('target="_blank"');
        expect(linkHtml(href, 'Notes', 'java')).toContain('>J</text>');
        expect(htmlToMarkdown(plain)).toContain(`[Notes](${href})`);
        // Round-trip stays stable
        expect(htmlToMarkdown(renderMarkdownPlain(htmlToMarkdown(plain)))).toContain(`[Notes](${href})`);
    });

    it('detects URL-like paste strings', () => {
        expect(isUrlLike('https://example.com')).toBe(true);
        expect(isUrlLike('http://example.com/path?q=1')).toBe(true);
        expect(isUrlLike('www.example.com')).toBe(true);
        expect(isUrlLike('  https://example.com  ')).toBe(true);
        expect(isUrlLike('not a url')).toBe(false);
        expect(isUrlLike('https://example.com and more')).toBe(false);
        expect(isUrlLike('ftp://example.com')).toBe(false);
        expect(normalizeUrl('www.example.com')).toBe('http://www.example.com');
        expect(normalizeUrl('https://example.com')).toBe('https://example.com');
        expect(linkHtml('https://example.com', 'https://example.com')).toContain('target="_blank"');
        expect(linkHtml('https://example.com', 'click')).toContain('>click</a>');
    });

    it('round-trips markdown through HTML and back', () => {
        const md = [
            '# Heading',
            '',
            'Some **bold** and *italic* and ~~struck~~ text.',
            '',
            '- item one',
            '- item two',
            '',
            '1. first',
            '2. second',
            '',
            '> a quote',
            '',
            '```js',
            'console.log("hi");',
            '```',
            '',
            '[link](https://example.com)',
            '',
            '| A | B |',
            '|---|---|',
            '| 1 | 2 |',
            ''
        ].join('\n');
        const html = renderMarkdownPlain(md);
        const back = htmlToMarkdown(html);
        expect(back).toContain('# Heading');
        expect(back).toContain('**bold**');
        expect(back).toContain('*italic*');
            expect(back).toContain('~struck~');
            expect(back).toMatch(/^-\s+item one/m);
            expect(back).toMatch(/^1\.\s+first/m);
        expect(back).toContain('> a quote');
        expect(back).toContain('```js');
        expect(back).toContain('[link](https://example.com)');
        expect(back).toContain('| A | B |');
        // Round-tripping is stable: md -> html -> md -> html -> md converges
        expect(htmlToMarkdown(renderMarkdownPlain(back))).toBe(back);
    });

    it('removes a matching fenced code block from markdown', () => {
        const md = ['before', '', '```python', 'if True:', '    print("ok")', '```', '', 'after'].join('\n');
        expect(removeFencedCodeBlock(md, 'python', 'if True:\n    print("ok")')).toBe('before\n\nafter');
        // Non-matching language or content leaves the block untouched
        expect(removeFencedCodeBlock(md, 'js', 'if True:\n    print("ok")')).toBe(md);
        expect(removeFencedCodeBlock(md, 'python', 'else')).toBe(md);
        // Longer fences (content containing backticks) still match
        const backticks = ['a', '', '````', 'x`y', '````', '', 'b'].join('\n');
        expect(removeFencedCodeBlock(backticks, '', 'x`y')).toBe('a\n\nb');
        // Tilde fences and language-less blocks match too
        const tilde = ['a', '', '~~~', 'z', '~~~', '', 'b'].join('\n');
        expect(removeFencedCodeBlock(tilde, '', 'z')).toBe('a\n\nb');
        // No fence at all returns the input unchanged
        expect(removeFencedCodeBlock('plain text', '', 'plain')).toBe('plain text');
    });

    it('round-trips bare <pre> elements (WYSIWYG code-block button) to fenced code', () => {
        // execCommand('formatBlock', 'pre') produces <pre> without a <code> child
        const back = htmlToMarkdown('<pre>const x = 1;</pre>');
        expect(back).toContain('```');
        expect(back).toContain('const x = 1;');
        expect(back).toMatch(/^```\nconst x = 1;\n```$/m);

        // Multi-line content keeps every line inside the fence
        const multi = htmlToMarkdown('<pre>line one\nline two</pre>');
        expect(multi).toMatch(/^```\nline one\nline two\n```$/m);

        const language = htmlToMarkdown('<pre data-language="python">if True:</pre>');
        expect(language).toMatch(/^```python\nif True:\n```$/m);

        // Backticks inside the code grow the fence instead of breaking it
        const tricky = htmlToMarkdown('<pre>```js\nfn()</pre>');
        expect(tricky).toContain('````');

        // Normal <pre><code> blocks (from rendered markdown) are unaffected
        expect(htmlToMarkdown('<pre><code class="language-js">fn()</code></pre>')).toContain('```js');

        // A freshly created empty code block holds a ZWSP (turndown skips blank
        // elements); it round-trips as an empty fence
        expect(htmlToMarkdown('<p>before</p><pre>\u200B</pre>')).toBe('before\n\n```\n```');
    });

    it('converts base64 images back to markdown image syntax', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
        const html = renderMarkdownPlain(`![image](${dataUrl})`);
        expect(htmlToMarkdown(html)).toContain(`![image](${dataUrl})`);
    });

    it('round-trips pasted-image fake links (IndexedDB) back to markdown', () => {
        const fake = 'cojudge://image/abc-123';
        const html = renderMarkdownPlain(`![image](${fake})`);
        expect(html).toContain(`src="${fake}"`);
        expect(htmlToMarkdown(html)).toBe(`![image](${fake})`);
        // Round-trip stays stable
        expect(htmlToMarkdown(renderMarkdownPlain(`![image](${fake})`))).toBe(`![image](${fake})`);
    });

    it('resolved pasted images serialize back to the fake link, not the payload', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
        const fake = 'cojudge://image/abc-123';
        const html = `<p><img src="${dataUrl}" alt="image" data-cojudge-img="${fake}"></p>`;
        expect(htmlToMarkdown(html)).toBe(`![image](${fake})`);
        expect(htmlToMarkdown(html)).not.toContain(dataUrl);
    });

    it('renders images as thumbnails with a delete button when imageThumbnails is enabled', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
        const html = renderMarkdown(`![image](${dataUrl})`, { imageThumbnails: true }) as string;
        expect(html).toContain('md-thumb');
        expect(html).toContain('md-thumb-delete');
        expect(html).toContain(`src="${dataUrl}"`);
        expect(html).toContain('aria-label="Delete image"');
    });

    it('renders plain <img> without thumbnail wrapper by default', () => {
        const html = renderMarkdown('![image](https://example.com/a.png)') as string;
        expect(html).not.toContain('md-thumb');
        expect(html).toContain('<img');
    });

    it('thumbnail HTML round-trips back to markdown image syntax', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
        const html = renderMarkdown(`![image](${dataUrl})`, { imageThumbnails: true }) as string;
        expect(htmlToMarkdown(html)).toContain(`![image](${dataUrl})`);
    });

    it('converts WYSIWYG auto-matched inline code spans back to backticks', () => {
        const html = '<p>hello <span style="background-color: var(--color-second-bg);">code</span></p>';
        const md = htmlToMarkdown(html);
        expect(md).toContain('`code`');
        // Plain spans with other styles are left as-is (plain text)
        const plain = htmlToMarkdown('<p>hello <span style="color: red;">world</span></p>');
        expect(plain).toContain('world');
    });

    it('preserves checklist checkboxes when round-tripping with text or loose paragraphs', () => {
        const md = '- [ ] sdf\n\nabc\n\n- [ ] adsf\n- [ ] adfsa';
        const html = renderMarkdownPlain(md);
        expect(html).toContain('type="checkbox"');
        
        const back = htmlToMarkdown(html);
        expect(back).toMatch(/\[\s\]\s+sdf/);
        expect(back).toMatch(/\[\s\]\s+adsf/);
        expect(back).toMatch(/\[\s\]\s+adfsa/);

        // Loose list with <p> around <input>
        const looseHtml = '<ul><li><p><input type="checkbox"> sdf</p></li></ul>';
        expect(htmlToMarkdown(looseHtml)).toMatch(/\[\s\]\s+sdf/);

        // Div wrapped <input>
        const divHtml = '<ul><li><div><input type="checkbox"> sdf</div></li></ul>';
        expect(htmlToMarkdown(divHtml)).toMatch(/\[\s\]\s+sdf/);
    });

    it('WYSIWYG inline code spans round-trip stably', () => {
        const md = 'hello `code`';
        const html = renderMarkdownPlain(md);
        const back = htmlToMarkdown(html);
        expect(back).toBe(md);
    });

    it('round-trips horizontal rules as three hyphens', () => {
        expect(renderMarkdownPlain('---')).toContain('<hr>');
        expect(htmlToMarkdown('<p>before</p><hr><p>after</p>')).toBe('before\n\n---\n\nafter');
    });

    it('trailing empty lines are trimmed so WYSIWYG round-trips stay stable', () => {
        // The WYSIWYG editor keeps an empty line at the end of the document
        // (ensureTrailingEmptyLine); converting it back must not grow the
        // markdown with trailing blank lines.
        expect(htmlToMarkdown('<p>hello</p><p><br></p>')).toBe('hello');
        expect(htmlToMarkdown('<p>hello</p><p>more</p><p><br></p>')).toBe('hello\n\nmore');
        // No growth when round-tripping twice
        expect(htmlToMarkdown(renderMarkdownPlain(htmlToMarkdown('<p>hello</p><p><br></p>')))).toBe('hello');
    });

    it('round-trips GFM task list checkboxes', () => {
        const md = '- [ ] todo\n- [x] done';
        const html = renderMarkdownPlain(md);
        expect(html).toContain('type="checkbox"');
        expect(html).toContain('checked');
        const back = htmlToMarkdown(html);
        expect(back).toMatch(/\[\s\]\s+todo/);
        expect(back).toMatch(/\[x\]\s+done/i);
        const again = htmlToMarkdown(renderMarkdownPlain(back));
        expect(again).toMatch(/\[\s\]\s+todo/);
        expect(again).toMatch(/\[x\]\s+done/i);
    });

    it('serializes live checkbox toggles from HTML attributes', () => {
        const unchecked = htmlToMarkdown('<ul><li><input type="checkbox"> item</li></ul>');
        const checked = htmlToMarkdown('<ul><li><input type="checkbox" checked=""> item</li></ul>');
        expect(unchecked).toMatch(/\[\s\]\s+item/);
        expect(checked).toMatch(/\[x\]\s+item/i);
    });
});
