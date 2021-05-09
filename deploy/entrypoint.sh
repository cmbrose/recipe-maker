#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

rake ts:start

rails s

exec "$@"