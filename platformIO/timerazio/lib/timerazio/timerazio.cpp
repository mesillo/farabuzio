#include <Arduino.h>
#include "timerazio.h"

Timerazio::Timerazio( unsigned long mls ) {
	init( mls );
}

void Timerazio::setPeriod( unsigned long mls ) {
	millisPeriod = mls;
}

void Timerazio::init( unsigned long mls ) {
	setPeriod( mls );
	stop();
	setHandler( NULL );
}

void Timerazio::start( void ) {
	reload();
	armed = true;
}

void Timerazio::stop( void ) {
	armed = false;
}

bool Timerazio::isElapsed( void ) {
	if( armed ) { // Lazy evaluation...
		if( millis() > lastTick + millisPeriod ) { // ... dont call millis() if not armed.
			return true;
		}
	}
	return false;
}

void Timerazio::reload( void ) {
	lastTick = millis();
}

bool Timerazio::check( void ) {
	if( isElapsed() ) {
		reload();
		return true;
	}
	return false;
}

void Timerazio::setHandler( tmzHandlerFn handler ) {
	handlerFn = handler;
}

bool Timerazio::loop( void ) {
	if( handlerFn != NULL ) {
		if( check() ) {
			if( handlerFn != NULL ) {
				handlerFn();
			}
			return true;
		}
	}
	return false;
}

void Timerazio::reset( void ) {
	init( millisPeriod );
}