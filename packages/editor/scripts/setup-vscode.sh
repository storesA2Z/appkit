#!/bin/bash
# Download and install OpenVSCode Server for AppKit
# Uses the official Gitpod releases from GitHub.

set -e

INSTALL_DIR="$HOME/.appkit/openvscode-server"
VERSION="1.96.2"

# Detect platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
  x86_64)  ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

case "$OS" in
  linux)  PLATFORM="linux" ;;
  darwin) PLATFORM="darwin" ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

FILENAME="openvscode-server-v${VERSION}-${PLATFORM}-${ARCH}"
URL="https://github.com/nicedoc/openvscode-server/releases/download/v${VERSION}/${FILENAME}.tar.gz"
# Fallback to official Gitpod releases
GITPOD_URL="https://github.com/nicedoc/openvscode-server/releases/download/openvscode-server-v${VERSION}/${FILENAME}.tar.gz"

if [ -f "$INSTALL_DIR/bin/openvscode-server" ]; then
  echo "OpenVSCode Server already installed at $INSTALL_DIR"
  echo "To reinstall, remove $INSTALL_DIR and run again."
  exit 0
fi

echo "Downloading OpenVSCode Server v${VERSION} for ${PLATFORM}-${ARCH}..."
echo ""

mkdir -p "$INSTALL_DIR"
TMP_DIR=$(mktemp -d)

download_failed=true

# Try downloading — try multiple URL patterns since release naming varies
for try_url in "$URL" "$GITPOD_URL"; do
  echo "Trying: $try_url"
  if command -v curl &> /dev/null; then
    if curl -fsSL "$try_url" -o "$TMP_DIR/openvscode.tar.gz" 2>/dev/null; then
      download_failed=false
      break
    fi
  elif command -v wget &> /dev/null; then
    if wget -q "$try_url" -O "$TMP_DIR/openvscode.tar.gz" 2>/dev/null; then
      download_failed=false
      break
    fi
  fi
done

if [ "$download_failed" = true ]; then
  rm -rf "$TMP_DIR"
  echo ""
  echo "Could not download OpenVSCode Server automatically."
  echo ""
  echo "Manual install options:"
  echo "  1. npm install -g @nicedoc/openvscode-server"
  echo "     Then symlink: mkdir -p $INSTALL_DIR/bin && ln -s \$(which openvscode-server) $INSTALL_DIR/bin/openvscode-server"
  echo ""
  echo "  2. Download from: https://github.com/nicedoc/openvscode-server/releases"
  echo "     Extract to: $INSTALL_DIR/"
  echo ""
  echo "AppKit works without VS Code — the preview and design mode still function."
  exit 1
fi

echo "Extracting..."
tar -xzf "$TMP_DIR/openvscode.tar.gz" -C "$TMP_DIR"

# Find the extracted directory (name varies by release)
EXTRACTED=$(find "$TMP_DIR" -maxdepth 1 -type d -name "openvscode-server*" | head -1)

if [ -z "$EXTRACTED" ]; then
  echo "Error: Could not find extracted directory"
  rm -rf "$TMP_DIR"
  exit 1
fi

# Move contents to install dir
cp -r "$EXTRACTED"/* "$INSTALL_DIR/"
rm -rf "$TMP_DIR"

# Make binary executable
if [ -f "$INSTALL_DIR/bin/openvscode-server" ]; then
  chmod +x "$INSTALL_DIR/bin/openvscode-server"
fi

echo ""
echo "OpenVSCode Server installed to $INSTALL_DIR"
echo "Restart 'pnpm dev' in packages/editor to use it."
