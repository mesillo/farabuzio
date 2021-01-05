#include <Arduino.h>

//#include <timerazio.h>
#include <rpmCounter.h>

#define PINTONE 8
#define PINFREQUENCY 117 // 16 <-> 200 Hz : 1000 <-> 12000 RPM (tone() low limit 31Hz)

//int prevFreq = -1;
int prevRpm = RPMCOUNTER_UNAVAILABLE;

void setup() {
	Serial.begin( 9600 );

	RpmCounter::init();
	RpmCounter::enable();

	tone( PINTONE, PINFREQUENCY );
}

void loop() {
	int rpm = RpmCounter::getRPM();
	if( rpm != prevRpm && rpm != RPMCOUNTER_UNAVAILABLE ) {
		prevRpm = rpm;
		Serial.println( rpm );
	}
	//////////////////////////////////////////
	// float freq = RpmCounter::getFrequency();
	//int freq = (int) RpmCounter::getFrequency();
	//if( freq != prevFreq && freq != -1 ) {
	//	prevFreq = freq;
	//	Serial.println( freq );
	//}
}