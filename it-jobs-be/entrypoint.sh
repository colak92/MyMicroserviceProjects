#!/bin/sh
set -ex

if [ -n "$WAIT_FOR_HOST" ] && [ -n "$WAIT_FOR_PORT" ]; then
  echo "Waiting for $WAIT_FOR_HOST:$WAIT_FOR_PORT..."

  for i in $(seq ${WAIT_TIMEOUT:-60}); do
    if nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"; then
      echo "✅ $WAIT_FOR_HOST:$WAIT_FOR_PORT is available after $i seconds."
      break
    fi
    echo "Waiting... ($i/${WAIT_TIMEOUT:-60})"
    sleep 1
  done

  if ! nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"; then
    echo "❌ Timeout after ${WAIT_TIMEOUT:-60}s: $WAIT_FOR_HOST:$WAIT_FOR_PORT not reachable."
    exit 1
  fi
fi

exec java -Xms128m -Xmx256m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp -jar app.jar