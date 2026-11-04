const { default: markdownIt } = await import('markdown-it');
const { assignHeadingIds } = await import('../node_modules/collabmd/src/client/domain/markdown-headings.js');
const { install } = await import('./collabmd-markdown.mjs');
const markdown = markdownIt({ html: false });
install(markdown);
export const begin = '[meeting-toc-start]: #';
export const end = '[meeting-toc-end]: #';

export function updateMeetingToc(source) {
    const start = source.indexOf(begin);
    const finish = source.indexOf(end);
    if ((start < 0) !== (finish < 0) || (start >= 0 && finish < start)) {
        throw new Error(`Unbalanced TOC markers in weekly-sync notes`);
    }
    const marker = /^\[toc\][ \t]*(?=\r?$)/im.exec(source);
    if (start < 0 && !marker) return source;
    const tokens = markdown.parse(source, {});
    assignHeadingIds({ tokens });
    const headings = [];
    let disclosures = 0;
    tokens.forEach((token, index) => {
        if (token.type === 'pm_disclosure') disclosures += token.content.startsWith('</') ? -1 : 1;
        if (token.type !== 'heading_open' || token.tag !== 'h2' || disclosures > 0) return;
        const inline = tokens[index + 1];
        const label = (inline.children ?? []).map((child) => child.content).join('')
            .replace(/([\\\[\]])/g, '\\$1');
        headings.push(`- [${label}](#${encodeURIComponent(token.attrGet('id'))})`);
    });
    const newline = source.includes('\r\n') ? '\r\n' : '\n';
    const generated = [begin, '', ...headings, '', end].join(newline);
    return start >= 0
        ? source.slice(0, start) + generated + source.slice(finish + end.length)
        : source.slice(0, marker.index) + generated + source.slice(marker.index + marker[0].length);
}
