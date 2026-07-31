#!/usr/bin/env bash
# Build the Cojudge macOS .dmg locally.
#
# Usage:
#   scripts/build-dmg.sh                # build for the host architecture
#   scripts/build-dmg.sh --universal    # universal (arm64 + x64) binary, like CI
#   COJUDGE_DESKTOP_ARCH=universal scripts/build-dmg.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "The .dmg can only be built on macOS" >&2
    exit 1
fi

VERSION="$(node -p "require('./package.json').version")"

ARCH="${COJUDGE_DESKTOP_ARCH:-host}"
if [[ "${1:-}" == "--universal" ]]; then
    ARCH="universal"
fi

case "$ARCH" in
    universal)
        TARGET="universal-apple-darwin"
        RUST_TARGETS="aarch64-apple-darwin x86_64-apple-darwin"
        ARTIFACT="src-tauri/target/universal-apple-darwin/release/bundle/dmg/Cojudge_${VERSION}_universal.dmg"
        ;;
    host)
        case "$(uname -m)" in
            arm64) RUST_TARGET="aarch64-apple-darwin" ;;
            x86_64) RUST_TARGET="x86_64-apple-darwin" ;;
            *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
        esac
        TARGET="$RUST_TARGET"
        RUST_TARGETS="$RUST_TARGET"
        ARTIFACT="src-tauri/target/${RUST_TARGET}/release/bundle/dmg/Cojudge_${VERSION}_$(uname -m).dmg"
        ;;
    *)
        echo "Unknown arch: $ARCH (use 'host' or 'universal')" >&2
        exit 1
        ;;
esac

echo "==> Cojudge ${VERSION} (${ARCH})"
echo "==> Installing Node dependencies"
npm ci

echo "==> Ensuring Rust targets: ${RUST_TARGETS}"
rustup target add ${RUST_TARGETS}

echo "==> Building desktop app (this takes a few minutes)"
export APPLE_SIGNING_IDENTITY="${APPLE_SIGNING_IDENTITY:--}"
export COJUDGE_DESKTOP_TARGET="$TARGET"
npm run desktop:build -- --target "$TARGET" --bundles dmg

echo
echo "==> Done: ${ROOT}/${ARTIFACT}"
