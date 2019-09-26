"use strict";

const COMMANDS_DEFINITIONS = {
	"checkUser": {
		cmd: "whoami",
		parameters: []
	},
	"uname": {
		cmd: "uname -a",
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