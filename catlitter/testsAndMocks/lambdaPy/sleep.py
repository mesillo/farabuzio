import time

def handler( event, context ):
	print( "Lambda start..." )
	time.sleep( 1 )
	print( "...end!" )

	return 0

#handler( 'event', 'context' ) #TODO: remove