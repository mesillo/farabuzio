#include <Arduino.h>
#include <unity.h>

#include <eventazio.h>

/// UTILS and VARS ///

Eventazio evz = Eventazio();

int count;

void resetCounter( void ) {
	count = 0;
}

void increaseCounter( void ) {
	count ++;
}

void decreaseCounter( void ) {
	count --;
}

bool checkCount( int expected ) {
	return count == expected;
}

/// TESTS ///

void should_add_a_event_handler( void ) {
	resetCounter();
	evz.on( "count", increaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 1 ) );
}

void should_remove_a_event_handler( void ) {
	resetCounter();
	evz.on( "count", increaseCounter );
	evz.deleteEvent( "count" );
	evz.emit( "count" );
	TEST_ASSERT( checkCount( 0 ) );
}

void should_remove_a_single_handler_for_a_event( void ) {
	resetCounter();
	evz.on( "count", increaseCounter );
	evz.on( "count", decreaseCounter );
	evz.deleteHandler( "count", decreaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 1 ) );
}

void should_manage_multiple_handlers_for_a_event( void ) {
	resetCounter();
	evz.on( "count", increaseCounter );
	evz.on( "count", decreaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 0 ) );
}

void should_manage_multiple_events( void ) {
	resetCounter();
	evz.on( "add", increaseCounter );
	evz.on( "remove", decreaseCounter );
	evz.emit( "add" );
	evz.emit( "remove" );
	evz.deleteEvent( "add" );
	evz.deleteEvent( "remove" );
	TEST_ASSERT( checkCount( 0 ) );
}

/// SETUP and RUN ///

void setup( void ) {
	delay( 2000 ); // from unit test doc.
	UNITY_BEGIN();
}

void loop( void ) {
	RUN_TEST( should_add_a_event_handler );
	RUN_TEST( should_remove_a_event_handler );
	RUN_TEST( should_remove_a_single_handler_for_a_event );
	RUN_TEST( should_manage_multiple_handlers_for_a_event );
	RUN_TEST( should_manage_multiple_events );
	Serial.println( "[==================================================]" );
	delay( 10000 );
}