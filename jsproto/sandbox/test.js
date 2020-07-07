"use strict";

const zlib = require( "zlib" );

//let pkt = "22014b000204030401041300001300000000000f12230000000000000058c39bc3c0c0c006c4c7b4f4e24098910102fe43412c90edcb403c90001af03b06556c17cb2e96ffffd1c58086d7836c606000d9a96ac0c02098ac1d1794ae1dc704e4b3023100a37a1bfa";
//let pkt = "58c39bc3c0c0c006c4c7b4f4e24098910102fe43412c90edcb403c90001af03b06556c17cb2e96ffffd1c58086d7836c606000d9a96ac0c02098ac1d1794ae1dc704e4b3023100a37a1bfa";
//let buffer = Buffer.from( pkt, "hex" );
//let unzipBuffer = zlib.unzipSync( buffer );
//console.dir( unzipBuffer.toString( "hex" ) );
// 9c00000006000000c62a2e5ec62a2e5e0100000000000000ffffffffffffffff5d0000004d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000018010000fb5c0000000000000000000000000000ba04ba04ffff0000000000000000000000000000ba04ffffff7fffffffff0000010000002530000011632b5e52672b5e0200000005000000
// 9c00000006000000c62a2e5ec62a2e5e0100000000000000ffffffffffffffff5d0000004d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000018010000fb5c0000000000000000000000000000ba04ba04ffff0000000000000000000000000000ba04ffffff7fffffffff0000010000002530000011632b5e52672b5e0200000001000000

console.dir( zlib.gzipSync( Buffer.from(
    "9c00000006000000c62a2e5ec62a2e5e0100000000000000ffffffffffffffff5d0000004d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000018010000fb5c0000000000000000000000000000ba04ba04ffff0000000000000000000000000000ba04ffffff7fffffffff0000010000002530000011632b5e52672b5e0200000004000000",
    "hex"
) ).toString( "hex" ) );