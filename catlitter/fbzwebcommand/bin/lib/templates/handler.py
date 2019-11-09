import requests

LAMBDA_NAME = "=lambda=name=placeholder="
LAMBDA_ENDPOINT = "http://localhost:9999"

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
	response = requests.post( url = LAMBDA_ENDPOINT, data = payload ) 
	if response.status_code != 200 :
		raise Exception( response.text )
		#raise Exception( "=== "+ LAMBDA_NAME +": Bad status code!!! ===" )

	return response.text
	#return "=== "+ LAMBDA_NAME +" ==="

#handler( 'event', 'context' ) #TODO: remove