import os

LAMBDA_NAME = "stocazzo"

def handler( event, context ):
    print( event )
    print( context )
    #print( LAMBDA_NAME )
    os.system( 'curl google.com' )

    return { 
        'message' : 'Lambda End.'
    }

handler( 'event', 'context' ) #TODO: remove