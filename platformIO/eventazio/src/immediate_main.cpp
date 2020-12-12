#include <Arduino.h>
#include <eventazio.h>

#define INTERVAL 1000

Eventazio evz = Eventazio();

bool toggle( void ) {
	static bool status = LOW;
	status = ! status;
	return status;
}

void handlerBlink( void ) {
	digitalWrite( LED_BUILTIN, toggle() );
}

void handlerWriteBlink( void ) {
	Serial.println( "blink" );
}

void handlerWriteDots( void ) {
	Serial.println( "..." );
}

String *pippo;
void setup() {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	evz.on( "blink", handlerBlink );
	evz.on( "blink", handlerWriteBlink );
	evz.on( "dots", handlerWriteDots );
	Serial.println( "Setup done..." );
}

void loop() {
	static unsigned int counter = 0;
	int blinkTimes;
	for( blinkTimes = 0 ; blinkTimes < 3 ; blinkTimes++ ) {
		evz.emit( "blink" );
		delay(INTERVAL);
	}
	evz.emit( "dots" );
	if( counter++ > 3 ) {
		evz.deleteHandler( "blink", handlerWriteBlink );
	}
	if( counter++ > 10 ) {
		evz.deleteEvent( "blink" );
	}
}