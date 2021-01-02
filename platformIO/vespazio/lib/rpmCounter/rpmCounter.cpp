#include <Arduino.h>

#include "rpmCounter.h"

void RpmCounter::doCount( void ) {
	count++;
}

void RpmCounter::init( void ) {
	pNm = _RPMCOUNTER_DEFAULT_PIN_;
	md = _RPMCOUNTER_DEFAULT_MODE_;
	enabled = false;
}
void RpmCounter::enable( void ) {
	if( ! enabled ) {
		attachInterrupt( digitalPinToInterrupt( pNm ), doCount, md );
		enabled = true;
	}
}
void RpmCounter::setPin( unsigned int pin ) {
	if( ! enabled ) {
		pNm = pin;
	}
}
void RpmCounter::setMode( unsigned int mode ) {
	if( ! enabled ) {
		md = mode; 
	}
}
void RpmCounter::disable( void ) {
	if( enabled ) {
		detachInterrupt( digitalPinToInterrupt( pNm ) );
		enabled = false;
	}
}
void RpmCounter::reset( void ) {
	count = 0;
}
unsigned int RpmCounter::getCount( void ) {
	return count;
}
