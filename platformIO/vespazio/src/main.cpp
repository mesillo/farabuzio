#include <Arduino.h>

//#include <timerazio.h>
#include <rpmCounter.h>

#define PINTONE 8
#define PINFREQUENCY 12000

/// TIMER ///
//Timerazio tmz = Timerazio( 1000 );
//bool toggle( void ) {
//	static bool status = LOW;
//	status = ! status;
//	return status;
//}
//void handlerFn( void ) {
//	digitalWrite( LED_BUILTIN, toggle() );
//}
/////////////

// unsigned int prevCount = 0;
// float prevFreq = -1;
int prevFreq = -1;

void setup() {
	/// TIMER ///
	//pinMode( LED_BUILTIN, OUTPUT );
	//tmz.setHandler( &handlerFn );
	//tmz.start();
	/////////////
	Serial.begin( 9600 );

	RpmCounter::init();
	RpmCounter::enable();

	tone( PINTONE, PINFREQUENCY );
}

void loop() {
	/// TIMER ///
	//tmz.loop();
	/////////////
	// float freq = RpmCounter::getFrequency();
	int freq = (int) RpmCounter::getFrequency();
	if( freq != prevFreq && freq != -1 ) {
		prevFreq = freq;
		Serial.println( freq );
	}
	/////////////
	//unsigned int count = RpmCounter::getCount();
	//if( count != prevCount ) {
	//	prevCount = count;
	//	Serial.println( count );
	//}
}