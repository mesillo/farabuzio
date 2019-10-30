#! /bin/bash

echo "=== starting sandbox ==="
# starting webcommand application
su - localstack -c 'cd /opt/code/localstack/fbzwebcommand/ && npm start' &

echo "=== starting node lambda server ==="
# starting node lambda server
su - localstack -c 'cd /opt/code/localstack/lambdazio/ && npm start' &

echo "=== starting localstack services ==="
# starting localstack
docker-entrypoint.sh