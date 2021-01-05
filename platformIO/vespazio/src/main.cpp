#include <Arduino.h>

//#include <timerazio.h>
#include <rpmCounter.h>

#define PINTONE 8
#define PINFREQUENCY 12000 // 16 <-> 200 Hz : 1000 <-> 12000 RPM

int prevFreq = -1;

void setup() {
	Serial.begin( 9600 );

	RpmCounter::init();
	RpmCounter::enable();

	tone( PINTONE, PINFREQUENCY );
}

void loop() {
	// float freq = RpmCounter::getFrequency();
	int freq = (int) RpmCounter::getFrequency();
	if( freq != prevFreq && freq != -1 ) {
		prevFreq = freq;
		Serial.println( freq );
	}
}