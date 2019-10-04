"use strict";

const defines = require( "../defines" );

const COMMANDS_DEFINITIONS = {
	"create_kinesis_stream": {
		cmd: "awslocal kinesis create-stream --stream-name %streamName% --shard-count %shardCount%",
		parameters: [ "streamName", "shardCount" ]
	},
	"create_lambda_function": {
		cmd: `awslocal lambda create-function --function-name=%functionName% --runtime=nodejs8.10  --region=fakeRegion --role=fakeRole --handler=%handlerFile%.%handlerFunction% --zip-file fileb://${defines.STORAGEPATH}%zipFileName%`, //TODO: review Storage and runtime...
		parameters: [ "functionName", "handlerFile", "handlerFunction", "zipFileName" ]
	},
	"create_event_mapping": {
		cmd: "awslocal lambda create-event-source-mapping --function-name %functionName% --event-source arn:aws:kinesis:us-east-1:000000000000:stream/%streamName% --batch-size %batchSize% --starting-position TRIM_HORIZON --region=fakeRegion", //TODO: implement --starting-position
		parameters: [ "functionName", "streamName", "batchSize" ]
	}
	/*,	"checkUser": {
		cmd: "whoami",
		parameters: []
	},
	"uname": {
		cmd: "uname -a"
	},
	"list": {
		cmd: "ls -lah %dirname%",
		parameters: [ "dirname" ]
	},
	"touch_test": {
		cmd: "touch storage/testfile",
		parameters: []
	},
	"edit_test": {
		cmd: "echo FILE_CONTENT >> storage/testfile",
		parameters: []
	},
	"cat_test": {
		cmd: "cat storage/testfile",
		parameters: []
	}*/
};

class Commands {
	/**
	 * return the configuration json
	 * @static
	 * @returns {any}
	 */
	static getCommands() {
		return COMMANDS_DEFINITIONS;
	}

	/**
	 * return the available commands
	 * @static
	 * @returns {string[]}
	 */
	static getCommandsìList() {
		return Object.keys( Commands.getCommands() );
	}
}

module.exports = Commands;