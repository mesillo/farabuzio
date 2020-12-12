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

void handlerCount() {
	static unsigned int count = 0;
	Serial.println( count++ );
}

String *pippo;
void setup() {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	evz.on( "dots", handlerWriteDots );
	evz.on( "count", handlerCount );
	evz.bufferedMode( true );
	Serial.println( "Setup done..." );
}

void loop() {
	evz.emit( "count" );
	evz.emit( "dots" );
	delay( INTERVAL );
}