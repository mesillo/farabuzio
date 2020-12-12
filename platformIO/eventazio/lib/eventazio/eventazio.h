#ifndef _EVENTAZIO_HEADER_
#define _EVENTAZIO_HEADER_

#include <string.h>

#define _EVENT_CAPABILITY_ 5
#define _PER_EVENT_HANDLER_CAPABILITY_ 5
#define _MAX_EVENT_NAME_LEN_ 10
#define _EVENT_QUEUE_CAPABILITY_ 10

typedef void ( *tEventHandler )( void );

typedef enum eTriggerMode {
	immediate,
	buffered
} triggerMode;

class Eventazio {
	private:
		triggerMode mode;
		int eventQueueIndex;
		int eventQueue[_EVENT_QUEUE_CAPABILITY_];
		char eventNames[_EVENT_CAPABILITY_][_MAX_EVENT_NAME_LEN_ + 1];
		tEventHandler eventHandlers[_EVENT_CAPABILITY_][_PER_EVENT_HANDLER_CAPABILITY_];

		void init( void );
		void initEventQueue( void );
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
		void enqueueEvent( int );

	public:
		/**
		 *  Constructor
		 *  @param void
		 */
		Eventazio( void );
		/**
		 * Used to emit a Event.
		 * @param char* the event name
		 * @return void
		 */
		void emit( const char* );
		/**
		 * Bind the Event Handler to a Event
		 * @param char* the Event name
		 * @param tEventHandler the Event Handler
		 * @return bool the result of operation
		 */
		bool on( const char*, tEventHandler );
		/**
		 * Delete a Event (and all relative handlers)
		 * @param char* the Event name
		 * @return void
		 */
		void deleteEvent( const char* );
		/**
		 * Delete the given Event Handler for the given Event.
		 * @param char* the Event name
		 * @param tEventHandler the Event Handler
		 * @return void
		 */
		void deleteHandler( const char*, tEventHandler );
		/**
		 * Execute all Handlers for cached Events
		 * @param void
		 * @return void
		 */
		void flushEvents( void );
		/**
		 * Set or Unset the Buffered Mode for events execution.
		 * @param bool the Buffered Mode enabling flag
		 * @return void
		 */ 
		void bufferedMode( bool );
};

#endif