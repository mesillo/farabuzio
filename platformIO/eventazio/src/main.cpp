#include <Arduino.h>
#include <eventazio.h>

void setup() {
	// put your setup code here, to run once:
	Serial.begin( 9600 );

	String *teststring = NULL;

	teststring = new String( "test" );

	//delete teststring;

	if( teststring == NULL )
		Serial.println( "NULL" );
	else
		Serial.println( "... doh!" );

	Serial.println( *teststring );
}

void loop() {
	// put your main code here, to run repeatedly:
}