#include <Arduino.h>

//#include <rpmCounter.h>
#include <rpmCnt.h>

#define PINTONE 8
#define PINFREQUENCY 200 // 16 <-> 200 Hz : 1000 <-> 12000 RPM (tone() low limit 31Hz)

int prevFreq = RPMCNT_UNAVAILABLE;
//int prevRpm = RPMCOUNTER_UNAVAILABLE;
int prevRpm = RPMCNT_UNAVAILABLE;

void setup() {
	Serial.begin( 9600 );

	// RpmCounter::init();
	// RpmCounter::enable();
	RpmCnt::init();
	RpmCnt::enable();

	tone( PINTONE, PINFREQUENCY );
}

void loop() {
	/*int rpm = RpmCnt::getRPM();
	if( rpm != prevRpm && rpm != RPMCNT_UNAVAILABLE ) {
		prevRpm = rpm;
		Serial.println( rpm );
	}*/
	int freq = (int) RpmCnt::getFrequency();
	if( freq != prevFreq && freq != -1 ) {
		prevFreq = freq;
		Serial.println( freq );
	}
	//////////////////////////////////////////
	// int rpm = RpmCounter::getRPM();
	// if( rpm != prevRpm && rpm != RPMCOUNTER_UNAVAILABLE ) {
	// 	prevRpm = rpm;
	// 	Serial.println( rpm );
	// }
	//////////////////////////////////////////
	// float freq = RpmCounter::getFrequency();
	//int freq = (int) RpmCounter::getFrequency();
	//if( freq != prevFreq && freq != -1 ) {
	//	prevFreq = freq;
	//	Serial.println( freq );
	//}
}