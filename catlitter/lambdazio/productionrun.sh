#! /bin/bash

OUTPUTDIR="../storage/"

while true; do
	LOGFILENAME=$OUTPUTDIR$(date +%Y%m%d-%H%M)_nodelambda.log;
	echo "Starting lambdazio..."
	echo "... log writed also on :"$LOGFILENAME"..."
	npm start | tee $LOGFILENAME
	echo "... exited."
done