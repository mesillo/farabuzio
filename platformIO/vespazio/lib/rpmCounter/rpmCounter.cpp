#include <Arduino.h>

#include "rpmCounter.h"

volatile unsigned int RpmCounter::count = 0;
unsigned int RpmCounter::pNm = _RPMCOUNTER_DEFAULT_PIN_;
unsigned int RpmCounter::md = _RPMCOUNTER_DEFAULT_MODE_;
bool RpmCounter::enabled = false;
unsigned long RpmCounter::strTm = millis();

void RpmCounter::doCount( void ) {
	RpmCounter::count++;
}

void RpmCounter::init( void ) { // TODO: is it needed?
	RpmCounter::count = 0;
	RpmCounter::pNm = _RPMCOUNTER_DEFAULT_PIN_;
	RpmCounter::md = _RPMCOUNTER_DEFAULT_MODE_;
	RpmCounter::enabled = false;
	RpmCounter::strTm = millis();
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
float RpmCounter::getFrequency( void ) {
	unsigned int cnt = RpmCounter::count;  // TODO: call getCount instead?
	if( cnt < MINSAMPLES ) {
		return RPMCOUNTER_UNAVAILABLE;
	}
	RpmCounter::count = 0; // TODO: call reset instead?

	unsigned long now = millis();
	if( now == RpmCounter::strTm ) {
		return RPMCOUNTER_UNAVAILABLE;
	}
	float elapsed = ( now - RpmCounter::strTm );
	RpmCounter::strTm = now; // TODO: write and call a method to do this?

	return ( cnt / elapsed ) * 1000;
}
int RpmCounter::getRPM( void ) {
	float frequency = RpmCounter::getFrequency();
	return frequency == RPMCOUNTER_UNAVAILABLE ? RPMCOUNTER_UNAVAILABLE : (int) frequency * HZ_TO_RPM_FACTOR;
}

