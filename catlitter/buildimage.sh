#! /bin/bash

docker image rm catlitter
docker build --rm -t catlitter ./
