#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

rake ts:start
rake ts:rt:index

rails s

exec "$@"