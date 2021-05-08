#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

service mysql start

rake ts:rebuild

rails s

exec "$@"