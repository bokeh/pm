import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { updateMeetingToc } from './notes-toc.mjs';

const assets = new URL('../node_modules/collabmd/dist/client/assets/', import.meta.url);
const asset = (prefix) => {
    const matches = readdirSync(assets).filter((name) => name.startsWith(prefix) && name.endsWith('.js'));
    assert.equal(matches.length, 1, `Expected one ${prefix} asset`);
    return new URL(matches[0], assets);
};
const { compilePreviewDocument } = await import(asset('preview-render-compiler-').href);

const render = (markdownText) => compilePreviewDocument({ markdownText }).html;
const fixture = '<details>\n<summary>**Template** :computer:</summary>\n\n# Heading\n\n- [x] :clock8:\n\n</details>';
const html = render(fixture);
assert.match(html, /<details[^>]*>\n<summary[^>]*><strong>Template<\/strong> 💻<\/summary>/);
assert.match(html, /<h1[^>]*>Heading<\/h1>/);
assert.match(html, /type="checkbox" checked/);
assert.match(html, /🕗/);
assert.match(html, /<\/details>/);
assert.match(render('<details open>\n    <summary>\n        Meeting :rocket:\n    </summary>\n\nBody\n</details>'), /<details open(?:="")?[^>]*>\n<summary[^>]*>Meeting 🚀<\/summary>/);
assert.match(render('<details>\n<summary>Outer</summary>\n\n<details>\n<summary>Inner</summary>\n\nBody\n</details>\n</details>'), /<summary[^>]*>Inner<\/summary>/);
const unsafe = render('<script>alert(1)</script>\n\n<details onclick="alert(1)">\n\n<details>\n<summary><img src=x onerror=alert(1)></summary>\n</details>');
assert.doesNotMatch(unsafe, /<script|<img|<details onclick/);
assert.match(unsafe, /&lt;script&gt;/);
assert.match(render('`:computer:`\n\n```html\n<details>\n:computer:\n</details>\n```'), /<code>:computer:<\/code>/);
assert.doesNotMatch(render('```\n<details>\n:computer:\n</details>\n```'), /💻|<details>/);
assert.match(render(':unknown_shortcode: :)'), /:unknown_shortcode: :\)/);

let disclosures = 0;
let summaries = 0;
for (const name of readdirSync('minutes/weekly-sync')) {
    if (!name.endsWith('.md')) continue;
    const text = readFileSync(`minutes/weekly-sync/${name}`, 'utf8');
    const result = render(text);
    const expected = (text.match(/^<details>\s*$/gm) ?? []).length;
    assert.equal((result.match(/<details(?:\s[^>]*)?>/g) ?? []).length, expected, name);
    assert.equal((result.match(/<summary(?:\s[^>]*)?>/g) ?? []).length, expected, name);
    disclosures += expected;
    summaries += (result.match(/<summary(?:\s[^>]*)?>/g) ?? []).length;
    assert.doesNotMatch(result, /:(?:computer|clock8|hand|rocket|tada|sparkles|heavy_check_mark|thumbsdown):/, name);
}
assert.ok(disclosures > 0);
assert.equal(summaries, disclosures);
let message;
const self = { postMessage: (value) => { message = value; } };
vm.runInNewContext(readFileSync(asset('preview-render-worker-'), 'utf8'), { self, console, setTimeout, clearTimeout, URL });
self.onmessage({ data: { markdownText: fixture, renderVersion: 1 } });
assert.equal(message.error, undefined);
const normalizeTaskIds = (html) => html.replace(/_task-[a-z0-9]+/g, '_task-ID');
assert.equal(normalizeTaskIds(message.html), normalizeTaskIds(html));
const toc = updateMeetingToc('<details>\n<summary>Template</summary>\n\n## DD MMM\n\n</details>\n\n[toc]\n\n## 20 Nov :rocket:\n');
assert.match(toc, /\[20 Nov 🚀\]\(#/);
assert.doesNotMatch(toc, /\[DD MMM\]/);
assert.equal(updateMeetingToc(toc), toc);
console.log(`Main preview and worker: escaping, code, emoji, and all ${disclosures} disclosure templates passed.`);
