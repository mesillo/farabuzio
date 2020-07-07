const socketio = require( "socket.io" );

const server = socketio( {
	path: "/ws-receiver",
	serveClient: false,
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
} );

server.on( "connect", () => {
	console.info( "New Client." );
} );

server.on( "disconnect", () => {
	console.info( "Bye Client." );
} );

server.listen( 8000 );