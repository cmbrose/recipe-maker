#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

(rake ts:status | grep "is currently running") || rake ts:start
rake ts:rt:index

rails s

exec "$@"