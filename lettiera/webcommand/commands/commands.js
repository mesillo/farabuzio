"use strict";

const COMMANDS_DEFINITIONS = {
	"create_kinesis_stream": {
		cmd: "awslocal kinesis create-stream --stream-name %streamName% --shard-count %shardCount%",
		parameters: [ "streamName", "shardCount" ]
	},
	"checkUser": {
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
	}
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