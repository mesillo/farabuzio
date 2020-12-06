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

void should_not_start_before_activation( void ) {
	tmz.reset();
	startTime();
	while( ! checkTime( ( TIMESLOT * 3 ) ) ) {
		if( tmz.isElapsed() || tmz.check() ) {
			TEST_FAIL();
		}
	}
}

void should_correctly_signal_elapsed_time( void ) {
	tmz.reset();
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
	tmz.reset();
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

/// SETUP and RUN ///

void setup( void ) {
	delay( 2000 ); // from unit test doc.
	UNITY_BEGIN();
}

void loop( void ) {
	RUN_TEST( should_not_start_before_activation );
	RUN_TEST( should_correctly_signal_elapsed_time );
	RUN_TEST( should_correcly_reload_after_check );
	Serial.println( "============================================" );
}