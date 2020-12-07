#ifndef _EVENTAZIO_HEADER_
#define _EVENTAZIO_HEADER_

#include <Arduino.h>

#define _EVENT_CAPABILITY_ 5
#define _PER_EVENT_HANDLER_CAPABILITY_ 5

typedef void ( *tEventHandler )();

class Eventazio {
	private:
		String *eventNames[_EVENT_CAPABILITY_];
		tEventHandler eventHandlers[_EVENT_CAPABILITY_][_PER_EVENT_HANDLER_CAPABILITY_];
	
		void init( void );
		void deleteEvent( unsigned int );
		int addEvent( const char*, tEventHandler );
		int getFreeSlot( void );
		int getEventIndex( const char* );
		int addHandler( int, tEventHandler );
		int getHandlerSlot( tEventHandler[] );
		void clearHandlers( int );
		void invokeAllHandlers( int );

	public:
		void emit( const char* );
		bool on( const char*, tEventHandler );
};

#endif