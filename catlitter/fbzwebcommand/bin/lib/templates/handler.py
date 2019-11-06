import subprocess

LAMBDA_NAME = "=lambda=name=placeholder="
LAMBDA_ENDPOINT = "localhost:9999"

class Stringinetor:
    def __init__( self, toWrite ):
        self.str = ""
        print( toWrite, end="", file=self )
    def write( self, printed ):
        self.str += printed
    def getString( self ):
        return self.str.replace( "'", '"' ).replace( "<", '"<' ).replace( ">", '>"' )

def handler( event, context ):
	body = {
		"lambda" : LAMBDA_NAME,
		"event" : event,
		"context" : context
	}
	payload = Stringinetor( body ).getString()
	returned_output = subprocess.check_output( [
		"curl",
		"-d",
		payload,
		"-X",
		"POST",
		LAMBDA_ENDPOINT
	] )
	print( returned_output.decode( "utf-8" ) )

	return returned_output.decode( "utf-8" )
	#return { 
	#	'message' : 'Lambda End.'
	#}

#handler( 'event', 'context' ) #TODO: remove