#import os
import subprocess

LAMBDA_NAME = "stocazzo"
LAMBDA_PORT = "9999"

def handler( event, context ):
	print( event )
	print( context )
	#print( LAMBDA_NAME )
	#os.system( 'curl google.com' )
	returned_output = subprocess.check_output( [
		"curl",
		"-d",
		"",
		"-X",
		"POST",
		"localhost:" + LAMBDA_PORT
	] )
	print( returned_output.decode( "utf-8" ) )

	return { 
		'message' : 'Lambda End.'
	}

handler( 'event', 'context' ) #TODO: remove