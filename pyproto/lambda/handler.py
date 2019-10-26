#import os
import subprocess

LAMBDA_NAME = "stocazzo"

def handler( event, context ):
	print( event )
	print( context )
	#print( LAMBDA_NAME )
	#os.system( 'curl google.com' )
	returned_output = subprocess.check_output( [ "curl", "google.com" ] )
	print( returned_output.decode( "utf-8" ) )

	return { 
		'message' : 'Lambda End.'
	}

handler( 'event', 'context' ) #TODO: remove