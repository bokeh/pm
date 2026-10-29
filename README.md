# Project Management

Team project resources for the Bokeh Organization.

## Local notes

Install [Pixi](https://pixi.sh), then run from this checkout on Windows, macOS,
or Linux. The launcher uses Node.js and requires no Unix shell:

```text
pixi run notes
```

Your default browser opens <http://127.0.0.1:1234> after the local server starts.
Use `pixi run notes --no-browser` to skip opening it (also supported by
`notes-share`). Stop the server with **Ctrl+C** in its terminal.
Pixi installs the locked Node.js 26.12.1 runtime. The first launch automatically
runs `npm ci` to install CollabMD 0.1.56 from `package-lock.json`. Later launches
reuse that installation unless the npm lockfile changes. Internet access is
needed for installation, but subsequent launches can use the installed files.
For strict lockfile checking, use `pixi run --locked notes`.

The command serves the repository root, binds explicitly to `127.0.0.1`, and
passes `--no-tunnel`. It needs no Docker, Google OIDC, GitHub App, or hosted
infrastructure. It starts neither PlantUML nor Structurizr services.
Edits save directly into this checkout, including files under `minutes/`.
There is no separate copy to sync. Review changes with `git diff`.
Generated `node_modules/`, `.pixi/`, and `.collabmd/` metadata are ignored by Git.
The Markdown notes themselves remain versioned.

### Git controls

CollabMD enables Git integration by default. Its UI offers staging, unstaging,
committing, pushing, pulling, and resetting files, using the host's Git identity,
credentials, and remotes. Starting the server and editing a note do not commit or
push it. Pull and reset can change checkout contents, and stage-all can include
unrelated changes. Review the checkout before using these controls and obtain
approval before publishing changes.

To hide CollabMD's Git integration in the UI for a session:

```text
pixi run notes --no-git
```

The `--no-git` option sets `COLLABMD_GIT_ENABLED=false`. In 0.1.56 this setting is a UI/status switch, not an authorization boundary.
Git command handlers remain registered. It does not prevent a trusted user from
calling those APIs, or prevent editing and deleting files.

### Temporary collaborator sharing

Stop any local notes server, then explicitly run:

```text
pixi run notes --shared
```

On first use this downloads the pinned official cloudflared binary into
`.pixi/cloudflared/` and verifies its SHA-256 checksum. No separate system
installation is needed. Later sharing sessions reuse that binary.
`pixi run notes-share` remains an alias for the same behavior.

This keeps the server bound to loopback but starts a public Cloudflare Quick
Tunnel and generates a new password for this run. Once the public tunnel responds over HTTP (allowing time for DNS propagation),
your browser opens its public Share URL with the password included in the
fragment. `--no-browser` skips this. Share the printed URL and
password only with trusted collaborators. A printed Share URL includes the
password in its fragment, so anyone holding the full link can enter.
**Ctrl+C** stops the server and tunnel. No permanent hosting is configured.

Sharing grants access to this checkout and its Git controls. Collaborators can
edit or delete checkout files and, with Git enabled, operate the host's Git
controls and credentials. To hide the Git UI while sharing, use:

```text
pixi run notes --shared --no-git
```

### Markdown compatibility patch

Startup automatically applies the repository's patch for emoji shortcodes and
`<details>` / `<summary>` sections, and standalone `[TOC]` markers. Tables of
contents link to CollabMD's existing heading IDs, including repeated headings.
Disclosure support includes indented, multiline summaries in
existing meeting templates. Markdown inside disclosures remains supported.
Other raw HTML and tag attributes remain escaped, except the boolean `open`
attribute on `<details>`. Emoji inside code stays literal. Emoticon shortcuts
such as `:)` are left alone.

The patch lives in `tools/collabmd-markdown.mjs` and
`tools/patch-collabmd.mjs`. Pinned npm dependencies bundle it into CollabMD's main
preview and worker assets on first use. Source and generated assets are patched
only under ignored `node_modules/`. Changed patches are reapplied automatically,
and browser asset URLs are versioned to avoid stale cached previews.

To check the installed patch after starting notes once:

```text
pixi run --locked node tools/test-collabmd.mjs
```

### Dependency updates

Stop the server before updating dependencies. To select a new CollabMD version:

```text
pixi run --locked npm install --package-lock-only --save-exact collabmd@VERSION
pixi run notes
```

Review and commit both `package.json` and `package-lock.json` after validation.
The patch deliberately requires CollabMD 0.1.56. Update and validate its source
and bundle insertion points before changing CollabMD versions. Check the new
version's Node requirements. To change Node, update `pixi.toml`,
run `pixi install`, and review and commit `pixi.lock` as well. `pixi update`
refreshes allowed Pixi dependencies. Never commit generated dependencies or
CollabMD metadata. These commands do not commit or push notes.

The cloudflared release and per-platform download checksums are pinned in
`tools/cloudflared.json`. To update it, select an official Cloudflare release
and update that file's version, asset names, and SHA-256 digests. The next shared
run installs the new version. `CLOUDFLARED_BIN` can select an existing binary
instead of the managed download.
