#!/bin/bash
# Download and install a web-based VS Code for AppKit.
# macOS: installs code-server via Homebrew
# Linux: downloads openvscode-server from Gitpod

set -e

INSTALL_DIR="$HOME/.appkit/openvscode-server"
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Check if already installed
if [ -f "$INSTALL_DIR/bin/openvscode-server" ] || [ -f "$INSTALL_DIR/bin/code-server" ]; then
  echo "VS Code web server already installed at $INSTALL_DIR"
  echo "To reinstall, remove $INSTALL_DIR and run again."
  exit 0
fi

# Also check if code-server is globally available
if command -v code-server &> /dev/null; then
  echo "code-server is already installed globally: $(which code-server)"
  echo "AppKit will use it automatically."
  exit 0
fi

mkdir -p "$INSTALL_DIR/bin"

if [ "$OS" = "darwin" ]; then
  # macOS — use Homebrew
  echo "macOS detected."
  echo ""

  if command -v brew &> /dev/null; then
    echo "Installing code-server via Homebrew..."
    brew install code-server

    # Create a symlink so AppKit can find it
    BREW_BIN=$(which code-server 2>/dev/null || true)
    if [ -n "$BREW_BIN" ]; then
      ln -sf "$BREW_BIN" "$INSTALL_DIR/bin/code-server"
      echo ""
      echo "code-server installed and linked to $INSTALL_DIR/bin/code-server"
      echo "Restart 'pnpm dev' in packages/editor to use it."
      exit 0
    fi
  fi

  echo "Homebrew not found or install failed."
  echo ""
  echo "Install manually:"
  echo "  brew install code-server"
  echo ""
  echo "Or with npm:"
  echo "  npm install -g code-server"
  echo ""
  echo "Then restart 'pnpm dev' in packages/editor."
  exit 1

elif [ "$OS" = "linux" ]; then
  # Linux — download openvscode-server from Gitpod
  case "$ARCH" in
    x86_64)  ARCH="x64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *)
      echo "Unsupported architecture: $ARCH"
      exit 1
      ;;
  esac

  VERSION="1.96.2"
  FILENAME="openvscode-server-v${VERSION}-linux-${ARCH}"
  URL="https://github.com/gitpod-io/openvscode-server/releases/download/openvscode-server-v${VERSION}/${FILENAME}.tar.gz"

  echo "Downloading OpenVSCode Server v${VERSION} for linux-${ARCH}..."
  echo "URL: $URL"
  echo ""

  TMP_DIR=$(mktemp -d)

  if command -v curl &> /dev/null; then
    curl -fSL "$URL" -o "$TMP_DIR/openvscode.tar.gz"
  elif command -v wget &> /dev/null; then
    wget "$URL" -O "$TMP_DIR/openvscode.tar.gz"
  else
    echo "Error: curl or wget required"
    exit 1
  fi

  echo "Extracting..."
  tar -xzf "$TMP_DIR/openvscode.tar.gz" -C "$TMP_DIR"

  EXTRACTED=$(find "$TMP_DIR" -maxdepth 1 -type d -name "openvscode-server*" | head -1)
  if [ -z "$EXTRACTED" ]; then
    echo "Error: Could not find extracted directory"
    rm -rf "$TMP_DIR"
    exit 1
  fi

  cp -r "$EXTRACTED"/* "$INSTALL_DIR/"
  rm -rf "$TMP_DIR"
  chmod +x "$INSTALL_DIR/bin/openvscode-server"

  echo ""
  echo "OpenVSCode Server installed to $INSTALL_DIR"
  echo "Restart 'pnpm dev' in packages/editor to use it."

else
  echo "Unsupported OS: $OS"
  echo "Install code-server manually: npm install -g code-server"
  exit 1
fi
