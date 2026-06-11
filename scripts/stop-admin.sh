#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PID_FILE="$REPO_DIR/.admin-server.pid"
PORT="4321"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No pid file found ($PID_FILE)."
  echo "If a server is still running, check with: lsof -iTCP:$PORT -sTCP:LISTEN -n -P"
  exit 0
fi

PID=$(cat "$PID_FILE")

if ! kill -0 "$PID" 2>/dev/null; then
  echo "Process $PID is no longer running. Removing stale pid file."
  rm -f "$PID_FILE"
  exit 0
fi

echo "Stopping admin server (pid $PID)..."
kill "$PID"

# Wait up to 5s for clean shutdown
for i in $(seq 1 5); do
  sleep 1
  if ! kill -0 "$PID" 2>/dev/null; then
    rm -f "$PID_FILE"
    echo "Admin server stopped."
    exit 0
  fi
done

echo "Process $PID did not exit cleanly. It may still be shutting down."
echo "If it persists, check with: lsof -iTCP:$PORT -sTCP:LISTEN -n -P"
rm -f "$PID_FILE"
exit 1
