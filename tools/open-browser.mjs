import { spawn } from 'node:child_process';

export function openBrowser(url) {
    const [command, ...args] = process.platform === 'win32'
        ? ['rundll32.exe', 'url.dll,FileProtocolHandler', url]
        : process.platform === 'darwin' ? ['open', url] : ['xdg-open', url];
    const browser = spawn(command, args, { stdio: 'ignore' });
    const warn = () => console.warn('Could not open a browser. Open the printed URL manually.');
    browser.once('error', warn);
    browser.once('exit', (code) => { if (code !== 0) warn(); });
    browser.unref();
}
