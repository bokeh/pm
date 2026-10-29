import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmod, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export async function ensureCloudflared(root) {
    if (process.env.CLOUDFLARED_BIN) return process.env.CLOUDFLARED_BIN;
    const manifest = JSON.parse(await readFile(new URL('./cloudflared.json', import.meta.url), 'utf8'));
    const platform = `${process.platform}-${process.arch}`;
    const asset = manifest.platforms[platform];
    if (!asset) throw new Error(`No pinned cloudflared download for ${platform}. Set CLOUDFLARED_BIN to your installation.`);
    const directory = join(root, '.pixi/cloudflared', manifest.version, platform);
    const executable = join(directory, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
    if (existsSync(executable)) return executable;

    await mkdir(directory, { recursive: true });
    const temporary = await mkdtemp(join(directory, 'download-'));
    try {
        console.log(`Installing cloudflared ${manifest.version} for temporary sharing...`);
        const url = `https://github.com/cloudflare/cloudflared/releases/download/${manifest.version}/${asset.name}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
        if (!response.ok) throw new Error(`cloudflared download failed: HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
            throw new Error('cloudflared download checksum does not match tools/cloudflared.json');
        }
        const download = join(temporary, asset.name);
        await writeFile(download, bytes);
        let binary = download;
        if (asset.name.endsWith('.tgz')) {
            // macOS ships tar. Windows and Linux assets are already executables.
            const result = spawnSync('/usr/bin/tar', ['-xzf', download, '-C', temporary, 'cloudflared'], { stdio: 'inherit' });
            if (result.error) throw result.error;
            if (result.status !== 0) throw new Error('Could not extract cloudflared');
            binary = join(temporary, 'cloudflared');
        }
        await chmod(binary, 0o755);
        await rename(binary, executable);
    } finally {
        await rm(temporary, { recursive: true, force: true });
    }
    return executable;
}
