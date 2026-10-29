import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dependency = join(root, 'node_modules/collabmd');
const version = JSON.parse(readFileSync(join(dependency, 'package.json'))).version;
if (version !== '0.1.56') throw new Error(`Review the CollabMD patch before using version ${version}`);
const helper = readFileSync(join(root, 'tools/collabmd-markdown.mjs'), 'utf8');
const patchScript = readFileSync(fileURLToPath(import.meta.url), 'utf8');
const fingerprint = createHash('sha256').update(helper).update(patchScript)
    .update(readFileSync(join(root, 'package-lock.json'))).digest('hex');
const marker = join(dependency, '.pm-markdown-patch');
try {
    if (readFileSync(marker, 'utf8') === fingerprint) process.exit(0);
} catch (error) {
    if (error.code !== 'ENOENT') throw error;
}

// Restore the upstream inputs before reapplying a changed patch.
for (const directory of ['src/client/application', 'scripts', 'dist/client', 'dist/client/assets']) {
    for (const name of readdirSync(join(dependency, directory))) {
        if (name.endsWith('.pm-original')) {
            const path = join(dependency, directory, name);
            writeFileSync(path.slice(0, -'.pm-original'.length), readFileSync(path));
        }
    }
}

// The npm package ships source and prebuilt browser assets, but no Vite project.
// Keep pristine originals so patch edits can be reapplied without npm reinstall.
function patch(relative, transform) {
    const path = join(dependency, relative);
    let original;
    try {
        original = readFileSync(path + '.pm-original', 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        original = readFileSync(path, 'utf8');
        writeFileSync(path + '.pm-original', original);
    }
    writeFileSync(path, transform(original));
}
function replaceOnce(source, before, after) {
    if (source.split(before).length !== 2) throw new Error('CollabMD patch target changed or is ambiguous');
    return source.replace(before, after);
}

// Keep CollabMD's existing tunnel lifecycle. Open only its authenticated Share
// URL, after Cloudflare reports it, rather than opening localhost prematurely.
patch('scripts/cloudflare-tunnel.mjs', (source) => replaceOnce(
    source,
    '  console.log(`[tunnel] Share URL: ${shareUrl}`);',
    '  console.log(`[tunnel] Share URL: ${shareUrl}`);\n'
        + '  if (process.env.PM_NOTES_BROWSER_MODULE) {\n'
        + '    void import(process.env.PM_NOTES_BROWSER_MODULE)\n'
        + '      .then(({ openBrowser }) => openBrowser(shareUrl))\n'
        + '      .catch(() => console.warn("Could not open a browser. Open the Share URL manually."));\n'
        + '  }',
));

patch('src/client/application/preview-render-compiler.js', (source) => (
    replaceOnce("import { install as installPmMarkdown } from '../domain/pm-markdown.js';\n" + source,
        '  enableMarkdownMath(markdown);',
        '  enableMarkdownMath(markdown);\n  installPmMarkdown(markdown);')
));
writeFileSync(join(dependency, 'src/client/domain/pm-markdown.js'), helper);
const result = await build({
    entryPoints: [join(root, 'tools/collabmd-markdown.mjs')],
    bundle: true, format: 'iife', globalName: 'bokehPmMarkdown',
    target: 'es2022', minify: true, write: false,
});
for (const name of ['preview-render-compiler-B_gyVIfk.js', 'preview-render-worker-DYGDgbKA.js']) {
    patch(`dist/client/assets/${name}`, (source) => result.outputFiles[0].text + '\n' + replaceOnce(
        source,
        'i.core.ruler.push(`collabmd-source-lines`',
        'bokehPmMarkdown.install(i),i.core.ruler.push(`collabmd-source-lines`',
    ));
}
// Upstream assets have immutable cache headers. Version the whole JS import
// graph from the uncached HTML entry points so existing browsers see the patch.
const assets = join(dependency, 'dist/client/assets');
const scriptNames = readdirSync(assets).filter((name) => name.endsWith('.js'));
for (const directory of ['dist/client', 'dist/client/assets']) {
    for (const name of readdirSync(join(dependency, directory))) {
        if (!/\.(?:html|js)$/.test(name)) continue;
        const path = join(dependency, directory, name);
        const original = readFileSync(path, 'utf8');
        let updated = original;
        for (const script of scriptNames) {
            updated = updated.replaceAll(script, `${script}?pm=${fingerprint}`);
        }
        if (updated !== original) {
            if (!existsSync(path + '.pm-original')) writeFileSync(path + '.pm-original', original);
            writeFileSync(path, updated);
        }
    }
}
writeFileSync(marker, fingerprint);
console.log('Applied CollabMD emoji and disclosure patch.');
