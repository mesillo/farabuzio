"use strict";

const COMMANDS_DEFINITIONS = {
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
	"create_kinesis_stream": {
		cmd: "awslocal kinesis create-stream --stream-name %streamName% --shard-count %shardCount%",
		parameters: [ "streamName", "shardCount" ]
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