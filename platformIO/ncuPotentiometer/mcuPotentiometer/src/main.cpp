/**
 * Potentiometer NodeMCU
 */
#include "Arduino.h"
#include <ESP8266WiFi.h>
//#include <WiFiClient.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <FS.h>
#include <LittleFS.h>

#define DELAY 1000
#define SERIAL_SPEED 9600
#define SERIAL_WIFI_DEBUG true

// IP 192.168.4.1
#define SSID "nodeMcu"
#define PASSWD "_nodeMcu_"

#define WEBSERVER_PORT 80

#define DEFAULT_HOMEPAGE_NAME "index.html"

/* Set these to your desired credentials. */
//const char *ssid = "iPhone di mesillo"; //Enter your WIFI ssid
//const char *password = "Venerdi42!"; //Enter your WIFI password

ESP8266WebServer server( WEBSERVER_PORT );
int cacheValue = 0;
int auxLedStatus = 0;

void loopWait();
bool checkValue();
int getValue();

void startSoftAP();

void configureWebServer();
void startWebServer();
void handleClientsRequest();
void handlerOnRoot();
void handlerToggleLed();
void handlerNotFound();
bool handlerFileSystemRead( String );
String getContentType( String );

void turnOffLeds();
void toggleAuxLed();

void setup() {
	Serial.begin( SERIAL_SPEED );
	Serial.setDebugOutput( SERIAL_WIFI_DEBUG );
	pinMode( A0, INPUT );
	startSoftAP();
	configureWebServer();
	startWebServer();
	turnOffLeds();
	// Serial.println( "=== Setup Done ===" ); // TODO: non funge! Perchè???
}

void loop() {
	loopWait();
	handleClientsRequest();
	if( checkValue() ) {
		Serial.println( getValue() );
	}
}

void loopWait() {
	delay( DELAY );
}

bool checkValue() {
	int value = analogRead( A0 );
	if( value != cacheValue ) {
		//Serial.println( value );
		cacheValue = value;
		return true;
	}
	return false;
}

int getValue() {
	return cacheValue;
}

void startSoftAP() {
	WiFi.mode( WIFI_AP );
	WiFi.softAP( SSID, PASSWD );
}

void configureWebServer() {
	server.on( "/", handlerOnRoot );
	server.on( "/toggleLed", handlerToggleLed );
	server.onNotFound( handlerNotFound );
}

void startWebServer() {
	server.begin();
}

void handleClientsRequest() {
	server.handleClient();
}

void handlerOnRoot() {
	//server.send( 200, "text/plain", "Hello World!" );
	handlerFileSystemRead( DEFAULT_HOMEPAGE_NAME );
}

void handlerToggleLed() {
	toggleAuxLed();
	server.send( 200, "text/plain", "Toggled!" );
}

void handlerNotFound() {
	if( ! handlerFileSystemRead( server.uri() ) ) {
		server.send( 404, "text/plain", "Not found!" );
	}
}

bool handlerFileSystemRead( String path ) {
	if( path.endsWith( "/" ) ) {
		path += DEFAULT_HOMEPAGE_NAME;
	}
	String contentType = getContentType( path );
	if( LittleFS.exists( path ) ) {
    	File file = LittleFS.open( path, "r" );
		server.streamFile( file, contentType );
		file.close();
    	return true;
  	}
	Serial.println( "File not found: " + path );
  	return false;
}

String getContentType( String filename ) {
	if( filename.endsWith( ".htm" ) ) return "text/html";
	else if( filename.endsWith( ".html" ) ) return "text/html";
	else if( filename.endsWith( ".css" ) ) return "text/css";
	else if( filename.endsWith( ".js" ) ) return "application/javascript";
	else if( filename.endsWith( ".png" ) ) return "image/png";
	else if( filename.endsWith( ".gif" ) ) return "image/gif";
	else if( filename.endsWith( ".jpg" ) ) return "image/jpeg";
	else if( filename.endsWith( ".ico" ) ) return "image/x-icon";
	else if( filename.endsWith( ".xml" ) ) return "text/xml";
	else if( filename.endsWith( ".pdf" ) ) return "application/x-pdf";
	else if( filename.endsWith( ".zip" ) ) return "application/x-zip";
	else if( filename.endsWith( ".gz" ) ) return "application/x-gzip";
	return "text/plain";
}

void turnOffLeds() {
	pinMode( LED_BUILTIN, OUTPUT );
	pinMode( LED_BUILTIN_AUX, OUTPUT );
	digitalWrite( LED_BUILTIN, 1 );
	digitalWrite( LED_BUILTIN_AUX, 1 );
}

void toggleAuxLed() {
	auxLedStatus = auxLedStatus == 0 ? 1 : 0;
	digitalWrite( LED_BUILTIN_AUX, auxLedStatus );
}