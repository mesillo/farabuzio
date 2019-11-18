import subprocess

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
	returned_output = subprocess.check_output( [
		"curl",
		"-i",
		"--silent",
		"-d",
		payload,
		"-X",
		"POST",
		LAMBDA_ENDPOINT
	] )
	response = returned_output.decode( "utf-8" )
	status = response.split()[1]
	if status != "200" :
		raise Exception( response )

	return status

#handler( "event", "context" ) #TODO: remove
