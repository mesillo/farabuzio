/**
 * Potentiometer NodeMCU
 */
#include "Arduino.h"
#include <ESP8266WiFi.h>
//#include <WiFiClient.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <FS.h>
//#include <LittleFS.h>

#define FSLIB SPIFFS

#define DELAY 250
#define SERIAL_SPEED 9600
#define SERIAL_WIFI_DEBUG true

// IP 192.168.4.1
#define SSID "nodeMcu"
#define PASSWD "_nodeMcu_"

#define WEBSERVER_PORT 80
#define WEBSOCKET_PORT 81

#define DEFAULT_HOMEPAGE_NAME "index.html"

/* Set these to your desired credentials. */
//const char *ssid = "iPhone di mesillo"; //Enter your WIFI ssid
//const char *password = "Venerdi42!"; //Enter your WIFI password

ESP8266WebServer server( WEBSERVER_PORT );
WebSocketsServer webSocket = WebSocketsServer( WEBSOCKET_PORT );
int cacheValue = 0;
int auxLedStatus = 0;

void loopWait();
bool checkValue();
int getValue();

void startSoftAP();

void configureWebServer();
void startWebServer();
bool initFileSystem();

void handleClientsRequest();
void handlerOnRoot();
void handlerToggleLed();
void handlerNotFound();
bool handlerFileSystemRead( String );
String getContentType( String );
void webSocketEvent( uint8_t, WStype_t, uint8_t *, size_t );

void turnOffLeds();
void toggleAuxLed();

//void listDir(const char *);

void setup() {
	Serial.begin( SERIAL_SPEED );
	Serial.setDebugOutput( SERIAL_WIFI_DEBUG );
	pinMode( A0, INPUT );
	startSoftAP();
	configureWebServer();
	if( ! initFileSystem() ) {
		Serial.println( "Error: unable to mount local FS!" );
	}
	startWebServer();
	turnOffLeds();
	// Serial.println( "=== Setup Done ===" ); // TODO: non funge! Perchè???
}

void loop() {
	loopWait();
	handleClientsRequest();
	if( checkValue() ) {
		//Serial.println( getValue() );
		String valueStr = String( getValue() );
		webSocket.broadcastTXT( valueStr );
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
	//server.on( "/", handlerOnRoot );
	server.on( "/toggleLed", handlerToggleLed );
	server.onNotFound( handlerNotFound );

	webSocket.onEvent( webSocketEvent );
}

void startWebServer() {
	webSocket.begin();
	//webSocket.enableHeartbeat( 2000, 1500, 0 );
	//webSocket.disableHeartbeat();

	server.begin();
}

bool initFileSystem() {
	return FSLIB.begin(); // TODO: CHECk the bool
}

void handleClientsRequest() {
	webSocket.loop();

	server.handleClient();
}

void handlerOnRoot() {
	server.send( 200, "text/plain", "Hello World!" );
	//handlerFileSystemRead( DEFAULT_HOMEPAGE_NAME );
	//listDir("/");
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
	if( FSLIB.exists( path ) ) {
    	File file = FSLIB.open( path, "r" );
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

void webSocketEvent( uint8_t num, WStype_t type, uint8_t * payload, size_t length ) {
	switch( type ) {
		case WStype_DISCONNECTED:
			Serial.printf( "[%u] Disconnected!\n", num );
			break;
		case WStype_CONNECTED:
			{
				IPAddress ip = webSocket.remoteIP( num );
				Serial.printf( "[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload );
				//webSocket.sendTXT( num, "Connected" );
			}
			break;
		case WStype_TEXT:
			//Serial.printf( "[%u] get Text: %s\n", num, payload );
			// webSocket.sendTXT( num, "message here" );
			// webSocket.broadcastTXT( "message here" );
			break;
		case WStype_BIN:
			//Serial.printf( "[%u] get binary length: %u\n", num, length );
			//hexdump(payload, length);
			// webSocket.sendBIN( num, payload, length );
			break;
	}
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

//void listDir(const char * dirname) {
//	Serial.printf("Listing directory: %s\n", dirname);
//
//	Dir root = FSLIB.openDir(dirname);
//
//	while (root.next()) {
//		File file = root.openFile("r");
//		Serial.print("  FILE: ");
//		Serial.print(root.fileName());
//		Serial.print("  SIZE: ");
//		Serial.print(file.size());
//		time_t cr = file.getCreationTime();
//		time_t lw = file.getLastWrite();
//		file.close();
//		struct tm * tmstruct = localtime(&cr);
//		Serial.printf("    CREATION: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
//		tmstruct = localtime(&lw);
//		Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
//	}
//	Serial.println( "=== list done ===" );
//}