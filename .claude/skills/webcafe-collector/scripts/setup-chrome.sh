#!/usr/bin/env bash
# Setup Chrome DevTools CDP for webcafe-collector
# Launches Chrome with --remote-debugging-port for CDP connection
# Usage: setup-chrome.sh [--port PORT] [--user-data-dir DIR]

set -euo pipefail

PORT="${1:-9222}"
USER_DATA_DIR="${2:-/tmp/chrome-debug-$$}"
CHROME="/usr/bin/google-chrome-stable"

if [ ! -f "$CHROME" ]; then
  CHROME="/usr/bin/google-chrome"
fi

if [ ! -f "$CHROME" ]; then
  echo "ERROR: google-chrome not found at /usr/bin/google-chrome-stable or /usr/bin/google-chrome" >&2
  exit 1
fi

# Kill any existing Chrome instance on the same port
pkill -f "chrome.*--remote-debugging-port=$PORT" 2>/dev/null || true

# Wait for port to be free
for i in {1..5}; do
  if ! ss -tlnp | grep -q ":$PORT "; then
    break
  fi
  sleep 1
done

# Launch Chrome with remote debugging
nohup "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$USER_DATA_DIR" \
  --no-first-run \
  --no-default-browser-check \
  > /dev/null 2>&1 &

echo "Chrome launched with --remote-debugging-port=$PORT"
echo "User data dir: $USER_DATA_DIR"
echo "Verify with: curl -s http://127.0.0.1:$PORT/json/version"
