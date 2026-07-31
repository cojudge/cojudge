import { describe, it, expect } from 'vitest';
import { renderMarkdown, renderMarkdownPlain, htmlToMarkdown } from './markdown';

describe('markdown utils', () => {
    it('renders markdown with the interactive code-block renderer', () => {
        const html = renderMarkdown('```js\nconsole.log("hi");\n```');
        expect(html).toContain('code-block-wrapper');
        expect(html).toContain('console');
    });

    it('renders plain GFM markdown to HTML', () => {
        const html = renderMarkdownPlain('# Title\n\nSome **bold** text');
        expect(html).toContain('<h1>Title</h1>');
        expect(html).toContain('<strong>bold</strong>');
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

    it('converts base64 images back to markdown image syntax', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
        const html = renderMarkdownPlain(`![image](${dataUrl})`);
        expect(htmlToMarkdown(html)).toContain(`![image](${dataUrl})`);
    });
});
