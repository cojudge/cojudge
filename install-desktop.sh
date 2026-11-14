#!/bin/sh
set -eu

REPO="${COJUDGE_REPO:-cojudge/cojudge}"
VERSION="${COJUDGE_VERSION:-${1:-latest}}"
LINUX_FORMAT="${COJUDGE_LINUX_FORMAT:-appimage}"
INSTALL_DIR="${COJUDGE_INSTALL_DIR:-$HOME/.local/bin}"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command '$1' not found." >&2
    exit 1
  fi
}

need_cmd curl
need_cmd uname

OS="$(uname -s)"
ARCH="$(uname -m)"

TMP_DIR="$(mktemp -d)"
MOUNT_POINT=""

cleanup() {
  if [ -n "$MOUNT_POINT" ] && [ -d "$MOUNT_POINT" ]; then
    hdiutil detach "$MOUNT_POINT" -quiet >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

resolve_asset_url() {
  pattern="$1"
  if [ "$VERSION" = "latest" ]; then
    api_url="https://api.github.com/repos/$REPO/releases/latest"
    json="$(curl -fsSL "$api_url" 2>/dev/null || true)"
    url="$(printf '%s' "$json" | tr ',' '\n' | grep '"browser_download_url"' | sed 's/.*"browser_download_url": *"\([^"]*\)".*/\1/' | grep -E "$pattern" | grep -v '\.sig$' | head -n 1 || true)"
    if [ -n "$url" ]; then
      printf '%s\n' "$url"
      return 0
    fi
    api_url="https://api.github.com/repos/$REPO/releases?per_page=10"
  else
    case "$VERSION" in
      v*) tag="$VERSION" ;;
      *) tag="v$VERSION" ;;
    esac
    api_url="https://api.github.com/repos/$REPO/releases/tags/$tag"
  fi

  json="$(curl -fsSL "$api_url")"
  url="$(printf '%s' "$json" | tr ',' '\n' | grep '"browser_download_url"' | sed 's/.*"browser_download_url": *"\([^"]*\)".*/\1/' | grep -E "$pattern" | grep -v '\.sig$' | head -n 1 || true)"
  if [ -z "$url" ]; then
    echo "Error: could not find a release asset matching '$pattern' for '$VERSION'." >&2
    exit 1
  fi
  printf '%s\n' "$url"
}

case "$OS" in
  Darwin)
    need_cmd hdiutil
    need_cmd ditto

    echo "Resolving Cojudge macOS release ($VERSION)..."
    ASSET_URL="$(resolve_asset_url '_universal\.dmg$|\.dmg$')"
    DMG_PATH="$TMP_DIR/Cojudge.dmg"

    echo "Downloading $ASSET_URL..."
    curl -fL --progress-bar "$ASSET_URL" -o "$DMG_PATH"

    echo "Mounting disk image..."
    MOUNT_POINT="$(hdiutil attach "$DMG_PATH" -nobrowse -readonly | awk -F'\t' '/\/Volumes\// {print $NF; exit}')"
    if [ -z "$MOUNT_POINT" ] || [ ! -d "$MOUNT_POINT" ]; then
      echo "Error: failed to mount $DMG_PATH." >&2
      exit 1
    fi

    APP_SRC="$MOUNT_POINT/Cojudge.app"
    if [ ! -d "$APP_SRC" ]; then
      APP_SRC="$(find "$MOUNT_POINT" -maxdepth 2 -name '*.app' -print -quit 2>/dev/null || true)"
    fi
    if [ -z "$APP_SRC" ] || [ ! -d "$APP_SRC" ]; then
      echo "Error: Cojudge.app not found in disk image." >&2
      exit 1
    fi

    if [ -w "/Applications" ]; then
      APP_DEST="/Applications/Cojudge.app"
    else
      mkdir -p "$HOME/Applications"
      APP_DEST="$HOME/Applications/Cojudge.app"
    fi

    echo "Installing to $APP_DEST..."
    rm -rf "$APP_DEST"
    ditto "$APP_SRC" "$APP_DEST"
    xattr -dr com.apple.quarantine "$APP_DEST" >/dev/null 2>&1 || true

    echo "Cojudge installed to $APP_DEST."
    echo "Open it from Applications or run:"
    echo "  open \"$APP_DEST\""
    ;;

  Linux)
    case "$ARCH" in
      x86_64|amd64) ;;
      *)
        echo "Error: unsupported Linux architecture '$ARCH' (only x86_64/amd64 builds are currently published)." >&2
        exit 1
        ;;
    esac

    case "$LINUX_FORMAT" in
      appimage|AppImage)
        echo "Resolving Cojudge Linux AppImage ($VERSION)..."
        ASSET_URL="$(resolve_asset_url '_amd64\.AppImage$')"
        mkdir -p "$INSTALL_DIR"
        APP_DEST="$INSTALL_DIR/cojudge-desktop"

        echo "Downloading $ASSET_URL..."
        curl -fL --progress-bar "$ASSET_URL" -o "$TMP_DIR/Cojudge.AppImage"
        chmod +x "$TMP_DIR/Cojudge.AppImage"
        mv -f "$TMP_DIR/Cojudge.AppImage" "$APP_DEST"

        echo "Cojudge installed to $APP_DEST."
        case ":$PATH:" in
          *":$INSTALL_DIR:"*)
            echo "Run it with:"
            echo "  cojudge-desktop"
            ;;
          *)
            echo "Run it with:"
            echo "  $APP_DEST"
            echo "Note: add '$INSTALL_DIR' to your PATH to run 'cojudge-desktop' from anywhere."
            ;;
        esac
        ;;

      deb)
        echo "Resolving Cojudge Linux .deb ($VERSION)..."
        ASSET_URL="$(resolve_asset_url '_amd64\.deb$')"
        DEB_PATH="$TMP_DIR/Cojudge.deb"

        echo "Downloading $ASSET_URL..."
        curl -fL --progress-bar "$ASSET_URL" -o "$DEB_PATH"

        echo "Installing .deb package (requires sudo)..."
        if command -v apt-get >/dev/null 2>&1; then
          sudo apt-get install -y "$DEB_PATH"
        else
          sudo dpkg -i "$DEB_PATH"
        fi

        echo "Cojudge installed."
        echo "Launch it from your application menu or run:"
        echo "  cojudge-desktop"
        ;;

      rpm)
        echo "Resolving Cojudge Linux .rpm ($VERSION)..."
        ASSET_URL="$(resolve_asset_url '\.x86_64\.rpm$')"
        RPM_PATH="$TMP_DIR/Cojudge.rpm"

        echo "Downloading $ASSET_URL..."
        curl -fL --progress-bar "$ASSET_URL" -o "$RPM_PATH"

        echo "Installing .rpm package (requires sudo)..."
        if command -v dnf >/dev/null 2>&1; then
          sudo dnf install -y "$RPM_PATH"
        else
          sudo rpm -Uvh "$RPM_PATH"
        fi

        echo "Cojudge installed."
        echo "Launch it from your application menu or run:"
        echo "  cojudge-desktop"
        ;;

      *)
        echo "Error: unsupported COJUDGE_LINUX_FORMAT '$LINUX_FORMAT' (use 'appimage', 'deb', or 'rpm')." >&2
        exit 1
        ;;
    esac
    ;;

  *)
    echo "Error: unsupported OS '$OS'. For Windows, use install-desktop.ps1 in PowerShell." >&2
    exit 1
    ;;
esac
