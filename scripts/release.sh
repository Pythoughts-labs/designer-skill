#!/usr/bin/env bash
# Release designer-skill-mcp: bump versions, test, commit, tag, push, npm publish, GitHub release.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PKG_DIR="$ROOT/designer-skill-mcp"
VERSION="${1:?Usage: scripts/release.sh <semver> [release notes...]}"
shift || true
NOTES="${*:-Release designer-skill-mcp v${VERSION}.}"

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "error: version must be semver (e.g. 0.9.0)" >&2
  exit 1
fi

TAG="v${VERSION}"

echo "==> Bump package to ${VERSION}"
cd "$PKG_DIR"
npm version "$VERSION" --no-git-tag-version --allow-same-version

echo "==> Sync plugin manifests"
node <<NODE
const fs = require("fs");
const paths = [
  ["${ROOT}/.claude-plugin/plugin.json", (s) => JSON.stringify({ ...JSON.parse(s), version: "${VERSION}" }, null, 2) + "\n"],
  ["${ROOT}/.codex-plugin/plugin.json", (s) => JSON.stringify({ ...JSON.parse(s), version: "${VERSION}" }, null, 2) + "\n"],
];
for (const [file, transform] of paths) {
  fs.writeFileSync(file, transform(fs.readFileSync(file, "utf8")));
}
NODE

echo "==> Build and test"
npm run build
npm test

echo "==> Commit"
cd "$ROOT"
git add \
  designer-skill-mcp/package.json \
  designer-skill-mcp/package-lock.json \
  .claude-plugin/plugin.json \
  .codex-plugin/plugin.json

if ! git diff --cached --quiet; then
  git commit -m "$(cat <<EOF
Release designer-skill-mcp v${VERSION}.

${NOTES}
EOF
)"
else
  echo "No version file changes to commit."
fi

echo "==> Tag ${TAG}"
git tag -a "$TAG" -m "$(cat <<EOF
designer-skill-mcp v${VERSION}

${NOTES}
EOF
)"

echo "==> Push branch and tag"
git push origin HEAD
git push origin "$TAG"

echo "==> Publish to npm"
cd "$PKG_DIR"
npm publish --access public

echo "==> Create GitHub release"
cd "$ROOT"
gh release create "$TAG" \
  --title "designer-skill-mcp v${VERSION}" \
  --notes "$NOTES"

echo "==> Done: ${TAG} published to git, npm, and GitHub."
