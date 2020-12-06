#include <Arduino.h>
#include <unity.h>

#include <timerazio.h>

/// UTILS and VARS ///

#define TIMESLOT 250
#define TIMETOLLERANCE TIMESLOT/4

unsigned int count;
unsigned long sTime;

Timerazio tmz = Timerazio( TIMESLOT );

void resetCounter( void ) {
	count = 0;
}

void increaseCounter( void ) {
	count ++;
}

bool checkCount( unsigned int expected ) {
	return count == expected;
}

void startTime( void ) {
	sTime = millis();
}

bool checkTime( unsigned int mls ) {
	if( millis() > sTime + mls ) {
		return true;
	}
	return false;
}

/// TEST ///

void prepare() {
	tmz.setPeriod( TIMESLOT );
	tmz.reset();
}

void should_not_start_before_activation( void ) {
	prepare();
	startTime();
	while( ! checkTime( ( TIMESLOT * 3 ) ) ) {
		if( tmz.isElapsed() || tmz.check() ) {
			TEST_FAIL();
		}
	}
}

void should_correctly_signal_elapsed_time( void ) {
	prepare();
	tmz.start();
	startTime();
	delay( TIMESLOT + TIMETOLLERANCE );
	if( ! tmz.isElapsed() ) { // first test this...
		TEST_FAIL();
	}
	if( ! tmz.check() ) { // ... this after because it reload() the timer!
		TEST_FAIL();
	}
}

void should_correcly_reload_after_check( void ) {
	prepare();
	tmz.start();
	startTime();
	while( ! tmz.check() ) {
		if( checkTime( TIMESLOT + TIMETOLLERANCE ) ) { // timer should to be elapsed...
			TEST_FAIL_MESSAGE( "Timer did not work as it should have." );
		}
	}
	if( tmz.check() ) { // if is correclty reloaded this must be false.
		TEST_FAIL();
	}
}

void should_correctly_trigger_handler( void ) {
	prepare();
	resetCounter();
	tmz.setHandler( increaseCounter );
	tmz.start();
	startTime();
	while( ! checkTime( ( TIMESLOT * 3 ) + TIMETOLLERANCE ) ) {
		tmz.loop();
	}
	if( ! checkCount( 3 ) ) {
		TEST_FAIL();
	}
}

void should_correctly_stop_triggering_handler( void ) {
	prepare();
	resetCounter();
	tmz.setHandler( increaseCounter );
	tmz.start();
	startTime();
	while( ! checkTime( ( TIMESLOT * 1 ) + TIMETOLLERANCE ) ) {
		tmz.loop();
	}
	if( ! checkCount( 1 ) ) {
		TEST_FAIL_MESSAGE( "Handler never triggered!" );
	}
	tmz.stop();
	while( ! checkTime( ( TIMESLOT * 3 ) + TIMETOLLERANCE ) ) {
		tmz.loop();
	}
	if( ! checkCount( 1 ) ) {
		TEST_FAIL();
	}
}

void should_correctly_reset( void ) {
	prepare();
	resetCounter();
	tmz.setHandler( increaseCounter );
	tmz.start();
	startTime();
	tmz.reset();
	while( ! checkTime( ( TIMESLOT * 2 ) + TIMETOLLERANCE ) ) {
		tmz.loop();
	}
	if( ! checkCount( 0 ) ) {
		TEST_FAIL();
	}
	if( tmz.isElapsed() ) {
		TEST_FAIL();
	}
}

void should_correcly_change_period( void ) {
	prepare();
	resetCounter();
	tmz.setHandler( increaseCounter );
	tmz.setPeriod( TIMESLOT * 2 );
	tmz.start();
	startTime();
	while( ! checkTime( ( TIMESLOT * 2 ) + TIMETOLLERANCE ) ) {
		tmz.loop();
	}
	if( ! checkCount( 1 ) ) {
		TEST_FAIL();
	}
}

/// SETUP and RUN ///

void setup( void ) {
	delay( 2000 ); // from unit test doc.
	UNITY_BEGIN();
}

void loop( void ) {
	RUN_TEST( should_not_start_before_activation );
	RUN_TEST( should_correctly_signal_elapsed_time );
	RUN_TEST( should_correcly_reload_after_check );
	RUN_TEST( should_correctly_trigger_handler );
	RUN_TEST( should_correctly_stop_triggering_handler );
	RUN_TEST( should_correctly_reset );
	RUN_TEST( should_correcly_change_period );
	Serial.println( "[==================================================]" );
	delay( 10000 );
}