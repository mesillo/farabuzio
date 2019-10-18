"use strict";

const defines = require( "../../defines" );

const COMMANDS_DEFINITIONS = {
	"create_kinesis_stream": {
		cmd: "awslocal kinesis create-stream --stream-name %streamName% --shard-count %shardCount%",
		parameters: [ "streamName", "shardCount" ]
	},
	"create_lambda_function": {
		cmd: `awslocal lambda create-function --function-name=%functionName% --runtime=%runtime%  --region=fakeRegion --role=fakeRole --handler=%handlerFile%.%handlerFunction% --zip-file fileb://${defines.STORAGEPATH}%zipFileName%`, //TODO: review Storage and runtime...
		parameters: [ "functionName", "handlerFile", "handlerFunction", "zipFileName", "runtime" ]
	},
	"delete_lambda_function": {
		cmd: "awslocal lambda delete-function --function-name %functionName%",
		parameters: [ "functionName" ]
	},
	"create_event_mapping": {
		cmd: "awslocal lambda create-event-source-mapping --function-name %functionName% --event-source arn:aws:kinesis:us-east-1:000000000000:stream/%streamName% --batch-size %batchSize% --starting-position TRIM_HORIZON --region=fakeRegion", //TODO: implement --starting-position
		parameters: [ "functionName", "streamName", "batchSize" ]
	},
	"get_stream_records": {
		cmd: "./bin/kscat.js --stream-name %streamName%",
		parameters: [ "streamName" ]
	},
	"save_stream": {
		cmd: `./bin/kscat.js --stream-name %streamName% --save-stream > ${defines.STORAGEPATH}%fileName%`,  //TODO: review Storage...
		parameters: [ "streamName", "fileName" ]
	},
	"load_stream": {
		cmd: `./bin/kspush.js --stream-name %streamName% --file-name ${defines.STORAGEPATH}%fileName% --binary-payload`,  //TODO: review Storage, non binary mode option...
		parameters: [ "streamName", "fileName" ]
	},
	"create_log_groups": {
		cmd: "awslocal create-log-group --log-group-name <value>",
		parameters: []
	},
	"get_log_groups": {
		cmd: "awslocal logs describe-log-groups --query logGroups[*].logGroupName",
		parameters: []
	},
	"read_function_log": {
		cmd: `./bin/klLogs.js --function-name %functionName%`,
		parameters: [ "functionName" ]
	},
	"delete_storage_file": {
		cmd: `rm -fv ${defines.STORAGEPATH}%fileName%`, //TODO: review Storage...
		parameters: [ "fileName" ]
	},
	"read_file_content": {
		cmd: `cat ${defines.STORAGEPATH}%fileName%`, //TODO: review Storage...
		parameters: [ "fileName" ]
	},
	"=Free_CMD=": {
		cmd: `%cmd%`,
		parameters: [ "cmd" ]
	},
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