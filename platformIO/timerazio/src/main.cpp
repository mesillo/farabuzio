#include <Arduino.h>
#include <timerazio.h>

Timerazio *tmz = new Timerazio( 500 );

unsigned long count = 0;

bool toggle() {
	static bool status = LOW;
	status = ! status;
	return status;
}

void handlerazio() {
	digitalWrite( LED_BUILTIN, toggle() );
	count++;
}

void setup() {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	tmz->setHandler( &handlerazio );
	tmz->start();
}

void loop() {
	if( tmz->loop() ) {
		Serial.println( count );
	}
}