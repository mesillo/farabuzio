#include <Arduino.h>

#include <rpmCnt.h>
#include <dashboard.h>

#define PINTONE 8
#define PINFREQUENCY 150 // 16 <-> 200 Hz : 1000 <-> 12000 RPM (tone() low limit 31Hz)

int prevFreq = RPMCNT_UNAVAILABLE;
int prevRpm = RPMCNT_UNAVAILABLE;

void setup() {
	tone( PINTONE, PINFREQUENCY );
	Serial.begin( 9600 );

	RpmCnt::init();
	RpmCnt::enable();

	dashboard::begin();
}

void loop() {
	int freq = (int) RpmCnt::getFrequency();
	int rpm = RpmCnt::getRPM();
	if( rpm != prevRpm ) {
		prevRpm = rpm == RPMCNT_UNAVAILABLE ? 0 : rpm;
		dashboard::setRPM( prevRpm );
		Serial.println( prevRpm );
	}
	//if( freq != prevFreq && freq != RPMCNT_UNAVAILABLE ) {
	//	prevFreq = freq;
	//	dashboard::setRPM( freq );
	//	//Serial.println( freq );
	//}
}