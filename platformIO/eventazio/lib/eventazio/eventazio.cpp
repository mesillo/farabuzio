#include "eventazio.h"

Eventazio::Eventazio( void ) {
	init();
}

void Eventazio::emit( const char* eventName ) {
	int index = getEventIndex( eventName );
	if( index != -1 ) {
		invokeAllHandlers( index ); // TODO: insert a queuing logic.
	}
}

bool Eventazio::on( const char* eventName, tEventHandler eventHandler ) {
	if( addEvent( eventName, eventHandler ) != -1 )
		return true;
	return false;
}

void Eventazio::init( void ) {
	unsigned int i, y;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ ) {
		eventNames[i] = NULL;
		/* for( y = 0 ; y < _PER_EVENT_HANDLER_CAPABILITY_ ; y++ )
			eventHandlers[i][y] = NULL; */
		clearHandlers( i );
	}
}

void Eventazio::invokeAllHandlers( int index ) {
	unsigned int i;
	for( i = 0 ; i < _PER_EVENT_HANDLER_CAPABILITY_ ; i++ )
		(eventHandlers[index][i])();
}

void Eventazio::deleteEvent( unsigned int index ) {
	delete eventNames[ index ];
	eventNames[ index ] = NULL;
}

int Eventazio::addEvent( const char* evNm, tEventHandler eventHandler ) {
	int index = getEventIndex( evNm );
	if( index == -1 ) { // need to add new Event
		index = getFreeSlot();
		if( index == -1 ) {
			return -1;
		}
		eventNames[ index ] = new String( evNm );
		clearHandlers( index );
	}
	if( addHandler( index, eventHandler ) != -1 ) {
		return index;
	}
	return -1;
}

int Eventazio::getFreeSlot( void ) {
	unsigned int i;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ )
		if( eventNames[ i ] == NULL )
			return i;
	return -1;
}

int Eventazio::getEventIndex( const char* evNm ) {
	unsigned int i;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ )
		if( eventNames[ i ] != NULL )
			if( eventNames[ i ]->equals( evNm ) )
				return i;
	return -1;
}

int Eventazio::addHandler( int eventIndex, tEventHandler eventHandler ) {
	int index = getHandlerSlot( eventHandlers[ eventIndex ] );
	if( index != -1 ) {
		eventHandlers[ eventIndex ][ index ] = eventHandler;
		return index;
	}
	return -1;
}

int Eventazio::getHandlerSlot( tEventHandler eventHandlers[] ) {
	unsigned int i;
	for( i = 0 ; i < _PER_EVENT_HANDLER_CAPABILITY_ ; i++ )
		if( eventHandlers[ i ] == NULL )
			return i;
	return -1;
}

void Eventazio::clearHandlers( int index ) {
	unsigned int i;
	for( i = 0 ; i < _PER_EVENT_HANDLER_CAPABILITY_ ; i++ )
		eventHandlers[index][i] = NULL;
}
