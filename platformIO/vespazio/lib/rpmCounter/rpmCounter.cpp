#include <Arduino.h>

#include "rpmCounter.h"

volatile unsigned int RpmCounter::count = 0;
unsigned int RpmCounter::pNm = _RPMCOUNTER_DEFAULT_PIN_;
unsigned int RpmCounter::md = _RPMCOUNTER_DEFAULT_MODE_;
bool RpmCounter::enabled = false;

void RpmCounter::doCount( void ) {
	RpmCounter::count++;
}

void RpmCounter::init( void ) { // TODO: is it needed?
	RpmCounter::count = 0;
	RpmCounter::pNm = _RPMCOUNTER_DEFAULT_PIN_;
	RpmCounter::md = _RPMCOUNTER_DEFAULT_MODE_;
	RpmCounter::enabled = false;
}
void RpmCounter::enable( void ) {
	if( ! RpmCounter::enabled ) {
		attachInterrupt( digitalPinToInterrupt( RpmCounter::pNm ), RpmCounter::doCount, RpmCounter::md );
		RpmCounter::enabled = true;
	}
}
void RpmCounter::setPin( unsigned int pin ) {
	if( ! RpmCounter::enabled ) {
		RpmCounter::pNm = pin;
	}
}
void RpmCounter::setMode( unsigned int mode ) {
	if( ! RpmCounter::enabled ) {
		RpmCounter::md = mode; 
	}
}
void RpmCounter::disable( void ) {
	if( RpmCounter::enabled ) {
		detachInterrupt( digitalPinToInterrupt( RpmCounter::pNm ) );
		RpmCounter::enabled = false;
	}
}
void RpmCounter::reset( void ) {
	RpmCounter::count = 0;
}
unsigned int RpmCounter::getCount( void ) {
	return RpmCounter::count;
}
