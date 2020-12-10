#ifndef _EVENTAZIO_HEADER_
#define _EVENTAZIO_HEADER_

#include <string.h>

#define _EVENT_CAPABILITY_ 5
#define _PER_EVENT_HANDLER_CAPABILITY_ 5
#define _MAX_EVENT_NAME_LEN_ 10

typedef void ( *tEventHandler )();

class Eventazio {
	private:
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
		void removeHandler( int, tEventHandler );

	public:
		Eventazio( void );
		void emit( const char* );
		bool on( const char*, tEventHandler );
		void deleteEvent( const char* );
		void deleteHandler( const char*, tEventHandler );
};

#endif