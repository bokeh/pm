import { full as emoji } from 'markdown-it-emoji';


function renderTableOfContents(markdown, tokens, index) {
    const roots = [];
    const parents = [];
    tokens.forEach((token, position) => {
        if (token.type !== 'heading_open' || !token.attrGet('id')) return;
        const inline = tokens[position + 1];
        const label = inline.children?.map((child) => child.content).join('') ?? inline.content;
        const heading = { id: token.attrGet('id'), label, level: Number(token.tag.slice(1)), children: [] };
        while (parents.length && parents.at(-1).level >= heading.level) parents.pop();
        (parents.at(-1)?.children ?? roots).push(heading);
        parents.push(heading);
    });
    if (!roots.length) return '';
    const escape = markdown.utils.escapeHtml;
    const list = (headings) => `<ol>${headings.map((heading) => (
        `<li><a href="#${escape(encodeURIComponent(heading.id))}">${escape(heading.label)}</a>`
        + (heading.children.length ? list(heading.children) : '') + '</li>'
    )).join('')}</ol>`;
    const [start, end] = tokens[index].map;
    return `<nav aria-label="Table of contents" data-source-line="${start + 1}" data-source-line-end="${end}">${list(roots)}</nav>\n`;
}

// Keep raw HTML disabled. Only these attribute-free disclosure tags become HTML.
export function install(markdown) {
    // markdown-it 15 removed two utilities still used by markdown-it-emoji 3.
    markdown.utils = {
        ...markdown.utils,
        assign: Object.assign,
        has: (object, key) => Object.prototype.hasOwnProperty.call(object, key),
    };
    markdown.use(emoji, { shortcuts: {} });
    markdown.block.ruler.before('paragraph', 'pm-toc', (state, start, _end, silent) => {
        if (state.sCount[start] - state.blkIndent >= 4) return false;
        const text = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]).trim();
        if (!/^\[toc\]$/i.test(text)) return false;
        if (silent) return true;
        const token = state.push('pm_toc', '', 0);
        token.map = [start, start + 1];
        state.line = start + 1;
        return true;
    }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
    // Render after CollabMD has assigned IDs, including contextual duplicate IDs.
    markdown.renderer.rules.pm_toc = (tokens, index) => renderTableOfContents(markdown, tokens, index);
    markdown.block.ruler.before('code', 'pm-disclosure', (state, start, end, silent) => {
        const lineAt = (line) => state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]).trim();
        const line = lineAt(start);
        const opening = /^<details(\s+open)?>$/i.exec(line);
        const closing = /^<\/details>$/i.test(line);
        if (opening || closing) {
            if (state.sCount[start] - state.blkIndent >= 4) return false;
            if (silent) return true;
            const token = state.push('pm_disclosure', '', 0);
            token.content = opening ? (opening[1] ? '<details open>\n' : '<details>\n') : '</details>\n';
            token.map = [start, start + 1];
            state.line = start + 1;
            state.pmDetailsDepth = Math.max(0, (state.pmDetailsDepth ?? 0) + (opening ? 1 : -1));
            return true;
        }
        if (!state.pmDetailsDepth || !/^<summary>/i.test(line)) return false;
        let label = line.slice('<summary>'.length);
        let next = start + 1;
        while (!/<\/summary>\s*$/i.test(label) && next < end) {
            label += '\n' + lineAt(next++);
        }
        if (!/<\/summary>\s*$/i.test(label)) return false;
        if (silent) return true;
        const token = state.push('pm_summary', '', 0);
        token.content = label.replace(/<\/summary>\s*$/i, '').trim();
        token.map = [start, next];
        state.line = next;
        return true;
    }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
    markdown.renderer.rules.pm_disclosure = (tokens, index) => tokens[index].content;
    markdown.renderer.rules.pm_summary = (tokens, index, options, env) => (
        `<summary>${markdown.renderInline(tokens[index].content, env)}</summary>\n`
    );
}
