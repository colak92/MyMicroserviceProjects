#!/bin/sh
set -ex

if [ -n "$WAIT_FOR_HOST" ] && [ -n "$WAIT_FOR_PORT" ]; then
  echo "Waiting for $WAIT_FOR_HOST:$WAIT_FOR_PORT..."
  for i in $(seq ${WAIT_TIMEOUT:-60}); do
    if nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"; then
      echo "$WAIT_FOR_HOST:$WAIT_FOR_PORT is available!"
      break
    fi
    echo "Waiting... $i"
    sleep 1
  done

  if ! nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"; then
    echo "Timeout waiting for $WAIT_FOR_HOST:$WAIT_FOR_PORT"
    exit 1
  fi
fi

exec java -Xms128m -Xmx256m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp -jar app.jar