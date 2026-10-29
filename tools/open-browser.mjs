import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

export async function waitForTunnel(url, { timeoutMs = 60_000, intervalMs = 1_000, request = fetch } = {}) {
    const probe = new URL(url).origin;
    const deadline = Date.now() + timeoutMs;
    do {
        try {
            const response = await request(probe, { redirect: 'manual', signal: AbortSignal.timeout(3_000) });
            await response.body?.cancel();
            if (response.status >= 200 && response.status < 400) return true;
        } catch {
            // Cloudflare can print the URL before public DNS and routing settle.
        }
        if (Date.now() >= deadline) return false;
        await setTimeout(intervalMs);
    } while (Date.now() < deadline);
    return false;
}

export async function openBrowser(url) {
    if (new URL(url).hostname.endsWith('.trycloudflare.com')) {
        console.log('Waiting for the public tunnel to become reachable...');
        if (!await waitForTunnel(url)) {
            console.warn('Tunnel is not reachable yet. Try the printed Share URL again shortly.');
            return;
        }
    }
    const [command, ...args] = process.platform === 'win32'
        ? ['rundll32.exe', 'url.dll,FileProtocolHandler', url]
        : process.platform === 'darwin' ? ['open', url] : ['xdg-open', url];
    const browser = spawn(command, args, { stdio: 'ignore' });
    const warn = () => console.warn('Could not open a browser. Open the printed URL manually.');
    browser.once('error', warn);
    browser.once('exit', (code) => { if (code !== 0) warn(); });
    browser.unref();
}
