#!/bin/bash
# Install a web-based VS Code (code-server) for AppKit.

set -e

INSTALL_DIR="$HOME/.appkit/openvscode-server"

# Check if already installed
if [ -f "$INSTALL_DIR/bin/openvscode-server" ] || [ -f "$INSTALL_DIR/bin/code-server" ]; then
  echo "VS Code web server already installed at $INSTALL_DIR"
  echo "To reinstall, remove $INSTALL_DIR and run again."
  exit 0
fi

if command -v code-server &> /dev/null; then
  echo "code-server is already installed globally: $(which code-server)"
  echo "AppKit will use it automatically."
  exit 0
fi

echo "Installing code-server..."
echo ""

# Use npm — works on macOS (including ARM/Rosetta) and Linux
if command -v npm &> /dev/null; then
  npm install -g code-server --unsafe-perm

  CS_BIN=$(which code-server 2>/dev/null || true)
  if [ -n "$CS_BIN" ]; then
    mkdir -p "$INSTALL_DIR/bin"
    ln -sf "$CS_BIN" "$INSTALL_DIR/bin/code-server"
    echo ""
    echo "code-server installed successfully."
    echo "Restart 'pnpm dev' in packages/editor to use it."
    exit 0
  fi
fi

echo ""
echo "Automatic install failed. Install manually:"
echo ""
echo "  npm install -g code-server"
echo ""
echo "Then restart 'pnpm dev' in packages/editor."
echo "AppKit works without VS Code — preview and design mode still function."
exit 1
