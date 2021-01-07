#include <Arduino.h>

#include "rpmCnt.h"

volatile unsigned long RpmCnt::prevMicros = _RPMCNT_MICROS_INVALID_VALUE_;
volatile long RpmCnt::period = RPMCNT_UNAVAILABLE; // in microsec
unsigned int RpmCnt::pNm = _RPMCNT_DEFAULT_PIN_;
unsigned int RpmCnt::md = _RPMCNT_DEFAULT_MODE_;
bool RpmCnt::enabled = false;

void RpmCnt::getPeriod( void ) {
	// value returned by millis() will not increment -> https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/
	unsigned long now = micros();
	if( now > RpmCnt::prevMicros &&
		RpmCnt::prevMicros != _RPMCNT_MICROS_INVALID_VALUE_ ) { // else we have hit the overflow... 70 min circa.
		RpmCnt::period = now - RpmCnt::prevMicros;
	} else {
		RpmCnt::period = RPMCNT_UNAVAILABLE;
	}
	RpmCnt::prevMicros = now;
}

bool RpmCnt::isMeasureValid( void ) {
	if( micros() < RpmCnt::prevMicros + _RPMCNT_MAX_PERIOD_ ) {
		return true;
	}
	return false;
}


void RpmCnt::init( void ) { // TODO: is it needed?
	RpmCnt::prevMicros = _RPMCNT_MICROS_INVALID_VALUE_;
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
	if( RpmCnt::period != RPMCNT_UNAVAILABLE &&
		RpmCnt::isMeasureValid() ) {
		return 1000000 / RpmCnt::period;
	} else {
		return RPMCNT_UNAVAILABLE;
	}
}
int RpmCnt::getRPM( void ) {
	float frequency = RpmCnt::getFrequency();
	return frequency == RPMCNT_UNAVAILABLE ? RPMCNT_UNAVAILABLE : (int) frequency * _HZ_TO_RPM_;
}

