#!/bin/bash

rm -fv lambdaFns.zip
zip -q lambdaFns.zip *.js *.json -r node_modules/
