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

void Timerazio::start() {
	reload();
	armed = true;
}

void Timerazio::stop() {
	armed = false;
}

bool Timerazio::isElapsed() {
	if( armed ) { // Lazy evaluation...
		if( millis() > lastTick + millisPeriod ) { // ... dont call millis() if not armed.
			return true;
		}
	}
	return false;
}

void Timerazio::reload() {
	lastTick = millis();
}

bool Timerazio::check() {
	if( isElapsed() ) {
		reload();
		return true;
	}
	return false;
}

void Timerazio::setHandler( tmzHandlerFn handler ) {
	handlerFn = handler;
}

bool Timerazio::loop() {
	if( handlerFn != NULL ) {
		if( check() ) {
			handlerFn();
			return true;
		}
	}
	return false;
}