#ifndef _EVENTAZIO_HEADER_
#define _EVENTAZIO_HEADER_

#include <Arduino.h>

#define _EVENT_CAPABILITY_ 5
#define _PER_EVENT_HANDLER_CAPABILITY_ 5
#define _MAX_EVENT_NAME_LEN_ 10

// typedef char tEventName[_MAX_EVENT_NAME_LEN_ + 1];
typedef void ( *tEventHandler )();

class Eventazio {
	private:
		// tEventName eventNames[_EVENT_CAPABILITY_];
		char eventNames[_EVENT_CAPABILITY_][_MAX_EVENT_NAME_LEN_ + 1];
		tEventHandler eventHandlers[_EVENT_CAPABILITY_][_PER_EVENT_HANDLER_CAPABILITY_];

		void init( void );
		bool isValidEventName( const char* );
		void deleteEvent( unsigned int );
		int addEvent( const char*, tEventHandler );
		int getFreeSlot( void );
		int getEventIndex( const char* );
		int addHandler( int, tEventHandler );
		int getHandlerSlot( tEventHandler[] );
		void clearHandlers( int );
		void invokeAllHandlers( int );

		void stringCopy( int, const char* );

	public:
		Eventazio( void );
		void emit( const char* );
		bool on( const char*, tEventHandler );
};

#endif