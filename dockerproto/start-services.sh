#! /bin/bash

echo "=== starting sandbox ==="
# starting webcommand application
node webcommand/index.js &

echo "=== starting localstack services ==="
#starting localstack
docker-entrypoint.sh