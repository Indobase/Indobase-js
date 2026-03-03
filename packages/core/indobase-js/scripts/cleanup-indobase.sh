#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "🧹 Stopping Indobase..."

# Stop functions if running
if [ -f /tmp/indobase-functions.pid ]; then
  FUNCTIONS_PID=$(cat /tmp/indobase-functions.pid)
  if kill -0 $FUNCTIONS_PID 2>/dev/null; then
    echo "Stopping functions (PID: $FUNCTIONS_PID)..."
    kill $FUNCTIONS_PID
  fi
  rm /tmp/indobase-functions.pid
fi
rm -f /tmp/indobase-functions.log

npx indobase stop

echo "✨ Cleanup complete!"
