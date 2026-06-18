---
name: release
description: Release designer-skill-mcp to npm with a git tag and GitHub release. Use when the user asks to ship, publish, cut a release, bump version, push tags, or run npm publish for designer-skill-mcp.
---

# release

Ship **designer-skill-mcp** in one ordered sequence: version bump → build/test → commit → tag → push → npm → GitHub release.

## Preflight

1. Confirm the target semver (e.g. `0.9.0`). Default bump guidance:
   - **patch** (`0.9.0` → `0.9.1`): docs, fixes, detector tweaks
   - **minor** (`0.9.0` → `0.10.0`): new MCP tools, reference files, non-breaking features
   - **major** (`0.9.0` → `1.0.0`): breaking MCP or skill contract changes
2. Working tree must be clean except intentional release edits.
3. `npm whoami` must succeed (logged in as a publisher for `designer-skill-mcp`).
4. `gh auth status` must succeed.
5. Only **`elkaix`** can push to `main` (branch protection). Run the release from an authorized session.

## Version touchpoints (keep in sync)

| File | Field |
|---|---|
| `designer-skill-mcp/package.json` | `"version"` |
| `designer-skill-mcp/package-lock.json` | top-level `"version"` |
| `designer-skill-mcp/src/server.ts` | `SERVER_VERSION` |
| `.claude-plugin/plugin.json` | `"version"` |
| `.codex-plugin/plugin.json` | `"version"` |

Tag format: `v{semver}` (e.g. `v0.9.0`).

## Automated (preferred)

From repo root:

```bash
chmod +x scripts/release.sh
./scripts/release.sh 0.9.0 "Short release notes for GitHub and the tag body."
```

The script runs this sequence:

1. `npm version <semver> --no-git-tag-version` in `designer-skill-mcp/`
2. Sync `SERVER_VERSION` + plugin manifest versions
3. `npm run build` + `npm test`
4. Commit version files with a release message
5. Annotated tag `v<semver>`
6. `git push origin HEAD` + `git push origin v<semver>`
7. `npm publish --access public` from `designer-skill-mcp/`
8. `gh release create v<semver>`

## Manual sequence (when not using the script)

```bash
cd designer-skill-mcp
npm version 0.9.0 --no-git-tag-version --allow-same-version
# Update SERVER_VERSION in src/server.ts and plugin.json versions (see table above)
npm run build && npm test
cd ..
git add designer-skill-mcp/package.json designer-skill-mcp/package-lock.json \
  designer-skill-mcp/src/server.ts .claude-plugin/plugin.json .codex-plugin/plugin.json
git commit -m "Release designer-skill-mcp v0.9.0."
git tag -a v0.9.0 -m "designer-skill-mcp v0.9.0"
git push origin HEAD && git push origin v0.9.0
cd designer-skill-mcp && npm publish --access public
cd .. && gh release create v0.9.0 --title "designer-skill-mcp v0.9.0" --notes "Release notes."
```

## Verify

```bash
git tag -l 'v0.9*'
npm view designer-skill-mcp version
gh release view v0.9.0
cd designer-skill-mcp && npm test
```

## Do not

- Skip `npm test` or `npm run build` before publish (`prepublishOnly` also runs them, but verify locally first).
- Publish from a dirty tree or without committing version bumps.
- Use `--force` on npm publish unless explicitly recovering a failed release.
- Add `Co-authored-by` or agent attribution lines to commit or tag messages.
