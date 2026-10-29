import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { compilePreviewDocument } from '../node_modules/collabmd/dist/client/assets/preview-render-compiler-B_gyVIfk.js';

const render = (markdownText) => compilePreviewDocument({ markdownText }).html;
const fixture = '<details>\n<summary>**Template** :computer:</summary>\n\n# Heading\n\n- [x] :clock8:\n\n</details>';
const html = render(fixture);
assert.match(html, /<details>\n<summary><strong>Template<\/strong> 💻<\/summary>/);
assert.match(html, /<h1[^>]*>Heading<\/h1>/);
assert.match(html, /type="checkbox" checked/);
assert.match(html, /🕗/);
assert.match(html, /<\/details>/);
assert.match(render('<details open>\n    <summary>\n        Meeting :rocket:\n    </summary>\n\nBody\n</details>'), /<details open>\n<summary>Meeting 🚀<\/summary>/);
assert.match(render('<details>\n<summary>Outer</summary>\n\n<details>\n<summary>Inner</summary>\n\nBody\n</details>\n</details>'), /<summary>Inner<\/summary>/);
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
    assert.equal((result.match(/<details>/g) ?? []).length, expected, name);
    assert.equal((result.match(/<summary>/g) ?? []).length, expected, name);
    disclosures += expected;
    summaries += (result.match(/<summary>/g) ?? []).length;
    assert.doesNotMatch(result, /:(?:computer|clock8|hand|rocket|tada|sparkles|heavy_check_mark|thumbsdown):/, name);
}
assert.equal(disclosures, 14);
assert.equal(summaries, 14);
let message;
const self = { postMessage: (value) => { message = value; } };
vm.runInNewContext(readFileSync('node_modules/collabmd/dist/client/assets/preview-render-worker-DYGDgbKA.js', 'utf8'), { self, console, setTimeout, clearTimeout, URL });
self.onmessage({ data: { markdownText: fixture, renderVersion: 1 } });
assert.equal(message.error, undefined);
assert.equal(message.html, html);
console.log('Main preview and worker: emoji, disclosures, Markdown, escaping, code, and all 14 existing templates passed.');
