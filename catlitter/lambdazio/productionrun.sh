#! /bin/bash

OUTPUTDIR="../storage/"
LOGFILENAME=$OUTPUTDIR$(date +%Y%m%d-%H%M)_nodelambda.log;

echo $LOGFILENAME

while true; do
	echo "Starting lambdazio..."
	echo "... log writed also on :"$LOGFILENAME"..."
	npm start | tee $LOGFILENAME
	echo "... exited."
done