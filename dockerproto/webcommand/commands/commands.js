"use strict";

const COMMANDS_DEFINITIONS = {
	"checkUser": {
		cmd: "whoami",
		parameters: []
	}
};

let getCommands = () => {
	return COMMANDS_DEFINITIONS;
};

module.exports = getCommands;