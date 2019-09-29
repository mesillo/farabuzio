#! /bin/bash

echo "=== starting sandbox ==="
# starting webcommand application
su - localstack -c 'cd /opt/code/localstack/ && node webcommand/index.js' &
# runuser -l  localstack -c 'node webcommand/index.js' &
# node webcommand/index.js &

echo "=== starting localstack services ==="
# starting localstack
docker-entrypoint.sh