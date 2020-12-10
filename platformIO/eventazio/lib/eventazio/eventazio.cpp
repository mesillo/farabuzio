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
	if( ! isValidEventName( eventName ) )
		return false;
	if( addEvent( eventName, eventHandler ) != -1 )
		return true;
	return false;
}

void Eventazio::deleteEvent( const char* eventName ) {
	int index = getEventIndex( eventName );
	if( index != -1 ) {
		deleteEvent( index );
	}
}

void Eventazio::deleteHandler( const char* eventName, tEventHandler eventHandler ) {
	int index = getEventIndex( eventName );
	if( index != -1 ) {
		removeHandler( index, eventHandler );
	}
}

void Eventazio::init( void ) {
	unsigned int i;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ ) {
		eventNames[ i ][ 0 ] = '\0';
		clearHandlers( i );
	}
}

bool Eventazio::isValidEventName( const char* evNm ) {
	return ( strlen( evNm ) <= _MAX_EVENT_NAME_LEN_ );
}

void Eventazio::invokeAllHandlers( int index ) {
	unsigned int i;
	for( i = 0 ; i < _PER_EVENT_HANDLER_CAPABILITY_ ; i++ )
		if( eventHandlers[ index ][ i ] != NULL )
			( eventHandlers[ index ][ i ] )();
}

void Eventazio::deleteEvent( unsigned int index ) {
	eventNames[ index ][ 0 ] = '\0';
}

int Eventazio::addEvent( const char* evNm, tEventHandler eventHandler ) {
	int index = getEventIndex( evNm );
	if( index == -1 ) { // need to add new Event
		index = getFreeSlot();
		if( index == -1 ) {
			return -1;
		}
		strcpy( eventNames[ index ], evNm );
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
		if( eventNames[ i ][ 0 ] == '\0' )
			return i;
	return -1;
}

int Eventazio::getEventIndex( const char* evNm ) {
	unsigned int i;
	for( i = 0 ; i < _EVENT_CAPABILITY_ ; i++ ) {
		if( eventNames[ i ][ 0 ] != '\0' ) {
			if( strcmp( eventNames[ i ], evNm ) == 0 ) {
				return i;
			}
		}
	}
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

void Eventazio::removeHandler( int eventIndex, tEventHandler eventHandler ) {
	for( int index = 0 ; index < _EVENT_CAPABILITY_ ; index++ ) {
		if( eventHandlers[ eventIndex ][ index ] == eventHandler ) {
			eventHandlers[ eventIndex ][ index ] = NULL;
		}
	}
}
