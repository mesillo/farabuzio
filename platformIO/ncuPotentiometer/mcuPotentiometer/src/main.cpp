/**
 * Potentiometer NodeMCU
 */
#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
//#include <ESP8266WebServer.h>

#define DELAY 1000

/* Set these to your desired credentials. */
const char *ssid = "iPhone di mesillo"; //Enter your WIFI ssid
const char *password = "Venerdi42!"; //Enter your WIFI password

int cacheValue = 0;

void setup() {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	pinMode( LED_BUILTIN_AUX, OUTPUT );
	digitalWrite( LED_BUILTIN, 1 );
	digitalWrite( LED_BUILTIN_AUX, 1 );
	pinMode( A0, INPUT );
	Serial.println( "=== Setup Done ===" );
}
void loop() {
	delay( DELAY );
	int value = analogRead( A0 );
	if( value != cacheValue ) {
		Serial.println( value );
		cacheValue = value;
	}
}