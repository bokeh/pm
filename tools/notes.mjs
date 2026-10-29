import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const [mode = 'local', ...options] = process.argv.slice(2);
if (!['local', 'share'].includes(mode) || options.some((arg) => !['--no-git', '--no-browser'].includes(arg))) {
    console.error('Usage: node tools/notes.mjs [local|share] [--no-git] [--no-browser]');
    process.exit(2);
}

const cli = join(root, 'node_modules/collabmd/bin/collabmd.js');
const lock = readFileSync('package-lock.json');
const marker = 'node_modules/.notes-package-lock';
if (!existsSync(cli) || !existsSync(marker) || !lock.equals(readFileSync(marker))) {
    // Run npm's JavaScript entry point directly, including on Windows where
    // npm.cmd cannot be spawned without a command shell.
    const nodeDir = dirname(process.execPath);
    const npmCli = [
        join(nodeDir, 'node_modules/npm/bin/npm-cli.js'),
        resolve(nodeDir, '../lib/node_modules/npm/bin/npm-cli.js'),
        resolve(nodeDir, '../node_modules/npm/bin/npm-cli.js'),
    ].find(existsSync);
    if (!npmCli) {
        throw new Error('Cannot find npm beside the Pixi Node runtime. Run pixi install.');
    }
    const result = spawnSync(process.execPath, [npmCli, 'ci', '--no-audit', '--no-fund'], {
        stdio: 'inherit',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
    writeFileSync(marker, lock);
}

const patch = spawnSync(process.execPath, ['tools/patch-collabmd.mjs'], { stdio: 'inherit' });
if (patch.error) throw patch.error;
if (patch.status !== 0) process.exit(patch.status ?? 1);

if (options.includes('--no-git')) process.env.COLLABMD_GIT_ENABLED = 'false';
const args = [root, '--host', '127.0.0.1', '--port', '1234'];
if (mode === 'share') {
    const cloudflared = process.env.CLOUDFLARED_BIN || 'cloudflared';
    const check = spawnSync(cloudflared, ['--version'], { stdio: 'ignore' });
    if (check.error || check.status !== 0) {
        throw new Error('Install cloudflared before sharing. See README.md.');
    }
    delete process.env.AUTH_PASSWORD;
    args.push('--auth', 'password');
} else {
    args.push('--auth', 'none', '--no-tunnel');
}

// Run in this process so CollabMD handles Ctrl+C and tunnel shutdown itself.
process.argv = [process.execPath, cli, ...args];
await import(pathToFileURL(cli).href);

if (!options.includes('--no-browser')) {
    const url = 'http://127.0.0.1:1234';
    const [command, ...browserArgs] = process.platform === 'win32'
        ? ['rundll32.exe', 'url.dll,FileProtocolHandler', url]
        : process.platform === 'darwin' ? ['open', url] : ['xdg-open', url];
    const browser = spawn(command, browserArgs, { stdio: 'ignore' });
    const warn = () => console.warn(`Could not open a browser. Open ${url} manually.`);
    browser.once('error', warn);
    browser.once('exit', (code) => { if (code !== 0) warn(); });
    browser.unref();
}
