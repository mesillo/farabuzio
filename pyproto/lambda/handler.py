import os

def handler( event, context ):
    
    os.system( 'curl google.com' )

    return { 
        'message' : 'Lambda End.'
    }

handler( 'event', 'context' ) #TODO: remove