#include "eventazio.h"

bool Eventazio::on( const char* eventName, tEventHandler eventHandler ) {
	return false;
}

void Eventazio::init( void ) {
	unsigned int i, y;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ ) {
		eventNames[i] = NULL;
		for( y = 0 ; y < _PER_EVENT_HANDLER_CAPABILITY_ ; y++ )
			eventHandlers[i][y] = NULL;	
	}
}