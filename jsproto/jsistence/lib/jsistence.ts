"use strict"

import { EventEmitter } from "events";
import * as fs from "fs";

class JSistence extends EventEmitter {
    private filePath : string = null;
    private data : Map<any, any>;

    constructor( filePath ) {
        super();

        if( typeof filePath !== "string" ) {
            throw new Error( "Wrong parameter type; constructor need a string." );
        }

		if( fs.existsSync( filePath ) ) { // file already exists...
			this.filePath = filePath;
			this.read();
		} else { // file don't exists
			this.data = new Map();
		}


	}

	private read() : void {

	}	

	private write() : void {

	}
}

export { JSistence };