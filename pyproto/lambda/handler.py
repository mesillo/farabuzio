import subprocess
import json

LAMBDA_NAME = "stocazzo"
LAMBDA_PORT = "9999"

def handler( event, context ):
	body = {
		"lambda" : LAMBDA_NAME,
		"event" : event,
		"context" : context
	}
	bodyJSON = json.dumps( body )
	returned_output = subprocess.check_output( [
		"curl",
		"-d",
		bodyJSON,
		"-X",
		"POST",
		"localhost:" + LAMBDA_PORT
	] )
	print( returned_output.decode( "utf-8" ) )

	return { 
		'message' : 'Lambda End.'
	}

#handler( 'event', 'context' ) #TODO: remove