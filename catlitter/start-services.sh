#! /bin/bash

echo "=== starting sandbox ==="
# starting webcommand application
su - localstack -c 'cd /opt/code/localstack/fbzwebcommand/ && npm start' &

echo "=== starting localstack services ==="
# starting localstack
docker-entrypoint.sh