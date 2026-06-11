#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PID_FILE="$REPO_DIR/.admin-server.pid"
LOG_FILE="$REPO_DIR/.admin-server.log"
HOST="127.0.0.1"
PORT="4321"
URL="http://$HOST:$PORT/keystatic"
MAX_WAIT=20

cd "$REPO_DIR"

# Check if server is already responding
if curl -s -o /dev/null -w "%{http_code}" "http://$HOST:$PORT" 2>/dev/null | grep -q "^[23]"; then
  echo "Server already running at http://$HOST:$PORT"
  echo "Opening $URL ..."
  open "$URL"
  exit 0
fi

# Check for stale pid
if [[ -f "$PID_FILE" ]]; then
  STALE_PID=$(cat "$PID_FILE")
  if kill -0 "$STALE_PID" 2>/dev/null; then
    echo "Found running process (pid $STALE_PID) but it's not responding on port $PORT."
    echo "Run 'npm run admin:stop' to clean up, then try again."
    exit 1
  else
    echo "Removing stale pid file (pid $STALE_PID is no longer running)."
    rm -f "$PID_FILE"
  fi
fi

# Check if another process owns port 4321
if lsof -iTCP:"$PORT" -sTCP:LISTEN -n -P 2>/dev/null | grep -q .; then
  echo "Port $PORT is in use by another process."
  echo "Check with: lsof -iTCP:$PORT -sTCP:LISTEN -n -P"
  echo "Stop that process first, then run 'npm run admin:open' again."
  exit 1
fi

# Start dev server in background
echo "Starting Keystatic admin server..."
nohup npm run admin > "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"
echo "Server started (pid $SERVER_PID). Log: $LOG_FILE"

# Wait for server to respond
echo -n "Waiting for server"
for i in $(seq 1 $MAX_WAIT); do
  sleep 1
  echo -n "."
  if curl -s -o /dev/null -w "%{http_code}" "http://$HOST:$PORT" 2>/dev/null | grep -q "^[23]"; then
    echo ""
    echo "Ready."
    open "$URL"
    exit 0
  fi
done

echo ""
echo "Server did not respond within ${MAX_WAIT}s."
echo "Check the log: $LOG_FILE"
exit 1
