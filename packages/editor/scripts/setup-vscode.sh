#!/bin/bash
# Install code-server standalone binary for AppKit.
# Downloads a pre-built release from GitHub — no npm/node/brew required.

set -e

INSTALL_DIR="$HOME/.appkit/openvscode-server"
VERSION="4.114.0"

# Check if already installed
if [ -f "$INSTALL_DIR/bin/code-server" ]; then
  echo "code-server already installed at $INSTALL_DIR/bin/code-server"
  echo "To reinstall, remove $INSTALL_DIR and run again."
  exit 0
fi

if command -v code-server &> /dev/null; then
  CS_BIN=$(which code-server)
  echo "code-server is already installed globally: $CS_BIN"
  mkdir -p "$INSTALL_DIR/bin"
  ln -sf "$CS_BIN" "$INSTALL_DIR/bin/code-server"
  echo "AppKit will use it automatically."
  exit 0
fi

echo "Installing code-server v${VERSION} (standalone binary)..."
echo ""

# Detect platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  darwin) PLATFORM="macos" ;;
  linux)  PLATFORM="linux" ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64|amd64)  ARCH_SUFFIX="amd64" ;;
  arm64|aarch64) ARCH_SUFFIX="arm64" ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

TARBALL="code-server-${VERSION}-${PLATFORM}-${ARCH_SUFFIX}.tar.gz"
URL="https://github.com/coder/code-server/releases/download/v${VERSION}/${TARBALL}"

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "Downloading $URL ..."
if command -v curl &> /dev/null; then
  curl -fSL --progress-bar -o "$TMPDIR/$TARBALL" "$URL"
elif command -v wget &> /dev/null; then
  wget -q --show-progress -O "$TMPDIR/$TARBALL" "$URL"
else
  echo "Neither curl nor wget found. Install one and try again."
  exit 1
fi

echo "Extracting..."
tar -xzf "$TMPDIR/$TARBALL" -C "$TMPDIR"

# The extracted dir name matches the tarball name minus .tar.gz
EXTRACTED="$TMPDIR/code-server-${VERSION}-${PLATFORM}-${ARCH_SUFFIX}"

if [ ! -d "$EXTRACTED" ]; then
  echo "Extraction failed — expected directory $EXTRACTED not found."
  exit 1
fi

mkdir -p "$INSTALL_DIR"
cp -R "$EXTRACTED/"* "$INSTALL_DIR/"

# Ensure the binary is in bin/
if [ -f "$INSTALL_DIR/bin/code-server" ]; then
  chmod +x "$INSTALL_DIR/bin/code-server"
elif [ -f "$INSTALL_DIR/code-server" ]; then
  mkdir -p "$INSTALL_DIR/bin"
  mv "$INSTALL_DIR/code-server" "$INSTALL_DIR/bin/code-server"
  chmod +x "$INSTALL_DIR/bin/code-server"
fi

echo ""
echo "code-server v${VERSION} installed to $INSTALL_DIR/bin/code-server"
echo "Restart 'pnpm dev' in packages/editor to use it."
