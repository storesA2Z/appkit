#!/bin/bash
# Download and install OpenVSCode Server for AppKit
# This script is called during setup or can be run manually.

set -e

INSTALL_DIR="$HOME/.appkit/openvscode-server"
VERSION="1.96.4"

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

if [ -f "$INSTALL_DIR/bin/openvscode-server" ]; then
  echo "OpenVSCode Server already installed at $INSTALL_DIR"
  echo "To reinstall, remove $INSTALL_DIR and run again."
  exit 0
fi

echo "Downloading OpenVSCode Server v${VERSION} for ${PLATFORM}-${ARCH}..."

mkdir -p "$INSTALL_DIR"
TMP_DIR=$(mktemp -d)

if command -v curl &> /dev/null; then
  curl -fsSL "$URL" -o "$TMP_DIR/openvscode.tar.gz"
elif command -v wget &> /dev/null; then
  wget -q "$URL" -O "$TMP_DIR/openvscode.tar.gz"
else
  echo "Error: curl or wget required"
  exit 1
fi

echo "Extracting..."
tar -xzf "$TMP_DIR/openvscode.tar.gz" -C "$TMP_DIR"

# Move contents to install dir
cp -r "$TMP_DIR/$FILENAME"/* "$INSTALL_DIR/"
rm -rf "$TMP_DIR"

chmod +x "$INSTALL_DIR/bin/openvscode-server"

echo ""
echo "OpenVSCode Server installed to $INSTALL_DIR"
echo "Restart 'pnpm dev' in packages/editor to use it."
