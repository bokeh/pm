import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(new URL('../node_modules/collabmd/scripts/cloudflare-tunnel.mjs', import.meta.url));
const source = readFileSync(path, 'utf8');
if (source.includes('process.env.PM_NOTES_BROWSER_MODULE')) process.exit(0);

function replaceOnce(source, before, after) {
    if (source.split(before).length !== 2) throw new Error('CollabMD tunnel patch target changed or is ambiguous');
    return source.replace(before, after);
}

// Keep CollabMD's existing tunnel lifecycle. Open only its authenticated Share
// URL, after Cloudflare reports it, rather than opening localhost prematurely.
const updated = replaceOnce(
    source,
    '  console.log(`[tunnel] Share URL: ${shareUrl}`);',
    '  console.log(`[tunnel] Share URL: ${shareUrl}`);\n'
        + '  if (process.env.PM_NOTES_BROWSER_MODULE) {\n'
        + '    void import(process.env.PM_NOTES_BROWSER_MODULE)\n'
        + '      .then(({ openBrowser }) => openBrowser(shareUrl))\n'
        + '      .catch(() => console.warn("Could not open a browser. Open the Share URL manually."));\n'
        + '  }',
);

writeFileSync(path, updated);
console.log('Applied CollabMD Share URL browser hook.');
