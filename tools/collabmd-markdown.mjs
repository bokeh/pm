import { full as emoji } from 'markdown-it-emoji';

// Keep raw HTML disabled. Only these attribute-free disclosure tags become HTML.
export function install(markdown) {
    // markdown-it 15 removed two utilities still used by markdown-it-emoji 3.
    markdown.utils = {
        ...markdown.utils,
        assign: Object.assign,
        has: (object, key) => Object.prototype.hasOwnProperty.call(object, key),
    };
    markdown.use(emoji, { shortcuts: {} });
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
