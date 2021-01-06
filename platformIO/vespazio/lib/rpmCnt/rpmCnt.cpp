#include <Arduino.h>

#include "rpmCnt.h"

volatile unsigned long RpmCnt::prevMicros = micros();
volatile long RpmCnt::period = RPMCNT_UNAVAILABLE; // in microsec
unsigned int RpmCnt::pNm = _RPMCNT_DEFAULT_PIN_;
unsigned int RpmCnt::md = _RPMCNT_DEFAULT_MODE_;
bool RpmCnt::enabled = false;

void RpmCnt::getPeriod( void ) {
	// value returned by millis() will not increment -> https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/
	unsigned long now = micros();
	RpmCnt::period = now - RpmCnt::prevMicros;
	RpmCnt::prevMicros = now;
}

void RpmCnt::init( void ) { // TODO: is it needed?
	RpmCnt::prevMicros = micros();
	RpmCnt::period = RPMCNT_UNAVAILABLE;
	RpmCnt::pNm = _RPMCNT_DEFAULT_PIN_;
	RpmCnt::md = _RPMCNT_DEFAULT_MODE_;
	RpmCnt::enabled = false;
}
void RpmCnt::enable( void ) {
	if( ! RpmCnt::enabled ) {
		attachInterrupt( digitalPinToInterrupt( RpmCnt::pNm ), RpmCnt::getPeriod, RpmCnt::md );
		RpmCnt::enabled = true;
	}
}
void RpmCnt::setPin( unsigned int pin ) {
	if( ! RpmCnt::enabled ) {
		RpmCnt::pNm = pin;
	}
}
void RpmCnt::setMode( unsigned int mode ) {
	if( ! RpmCnt::enabled ) {
		RpmCnt::md = mode; 
	}
}
void RpmCnt::disable( void ) {
	if( RpmCnt::enabled ) {
		detachInterrupt( digitalPinToInterrupt( RpmCnt::pNm ) );
		RpmCnt::enabled = false;
	}
}
void RpmCnt::reset( void ) {
	RpmCnt::prevMicros = micros();
	RpmCnt::period = RPMCNT_UNAVAILABLE;
}
float RpmCnt::getFrequency( void ) {
	return RpmCnt::period != RPMCNT_UNAVAILABLE ? 1000000 / RpmCnt::period : RPMCNT_UNAVAILABLE;
	// return RpmCnt::period;
}
int RpmCnt::getRPM( void ) {
	float frequency = RpmCnt::getFrequency();
	return frequency == RPMCNT_UNAVAILABLE ? RPMCNT_UNAVAILABLE : (int) frequency * _HZ_TO_RPM_;
}

