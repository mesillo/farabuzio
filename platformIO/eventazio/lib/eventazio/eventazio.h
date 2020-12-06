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
	public:
		bool on( const char*, tEventHandler );
};

#endif