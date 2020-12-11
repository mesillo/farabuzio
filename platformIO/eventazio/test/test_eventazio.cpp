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
	evz.bufferedMode( false );
	evz.on( "count", increaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 1 ) );
}

void should_remove_a_event_handler( void ) {
	resetCounter();
	evz.bufferedMode( false );
	evz.on( "count", increaseCounter );
	evz.deleteEvent( "count" );
	evz.emit( "count" );
	TEST_ASSERT( checkCount( 0 ) );
}

void should_remove_a_single_handler_for_a_event( void ) {
	resetCounter();
	evz.bufferedMode( false );
	evz.on( "count", increaseCounter );
	evz.on( "count", decreaseCounter );
	evz.deleteHandler( "count", decreaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 1 ) );
}

void should_manage_multiple_handlers_for_a_event( void ) {
	resetCounter();
	evz.bufferedMode( false );
	evz.on( "count", increaseCounter );
	evz.on( "count", decreaseCounter );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 0 ) );
}

void should_manage_multiple_events( void ) {
	resetCounter();
	evz.bufferedMode( false );
	evz.on( "add", increaseCounter );
	evz.on( "remove", decreaseCounter );
	evz.emit( "add" );
	evz.emit( "remove" );
	evz.deleteEvent( "add" );
	evz.deleteEvent( "remove" );
	TEST_ASSERT( checkCount( 0 ) );
}

void should_buffering_events( void ) {
	resetCounter();
	evz.bufferedMode( true );
	evz.on( "count", increaseCounter );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 0 ) );
	evz.flushEvents();
}

void should_flush_buffered_events( void ) {
	resetCounter();
	evz.bufferedMode( true );
	evz.on( "count", increaseCounter );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.flushEvents();
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 3 ) );
}

void should_automatically_flush_buffered_events( void ) {
	resetCounter();
	evz.bufferedMode( true );
	evz.on( "count", increaseCounter );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.emit( "count" );
	evz.deleteEvent( "count" );
	TEST_ASSERT( checkCount( 10 ) );
	evz.flushEvents();
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
	RUN_TEST( should_buffering_events );
	RUN_TEST( should_flush_buffered_events );
	RUN_TEST( should_automatically_flush_buffered_events );
	Serial.println( "[==================================================]" );
	delay( 10000 );
}