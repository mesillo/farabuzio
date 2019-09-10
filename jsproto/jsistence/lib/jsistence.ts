import { EventEmitter } from "events";
import * as fs from "fs";

class JSistence extends EventEmitter {
    private filePath : string | null = null;
    private data : Map<any, any>;

    constructor( filePath : string ) {
        super();

        if( typeof filePath !== "string" ) {
            throw new Error( "Wrong parameter type; constructor need a string." );
		}
		this.filePath = filePath;		

		if( fs.existsSync( filePath ) ) { // file already exists...
			this.read();
		} else { // file don't exists
			this.data = new Map();
		}


	}

	private read() : void {
		if( this.filePath ) {
			let inputBuffer : Buffer = fs.readFileSync( this.filePath );
			let inputString : string = inputBuffer.toString();
		}
	}

	private write() : void {

	}
}

export { JSistence };