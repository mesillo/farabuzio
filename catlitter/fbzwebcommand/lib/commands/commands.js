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
	"create_lambda_log_group": {
		cmd: "awslocal create-log-group --log-group-name \"/aws/lambda/%functionName%\"",
		parameters: [ "functionName" ]
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
	"deploy_zip_node_lambda": {
		cmd: `./bin/lbzioAddLambda.js --name %functionName% --zip-file ${defines.STORAGEPATH}%zipFileName% --filename %handlerFileName% --handler %handlerName%`,  //TODO: review Storage...
		parameters: [ "functionName", "zipFileName", "handlerFileName", "handlerName" ]
	},
	"list_node_lambda": { //TODO: remove or improve...
		cmd: `curl localhost:9999`,
		parameters: []
	},
	"restart_node_lambda_server": { //TODO: remove or improve...
		cmd: `curl localhost:9999/reboot`,
		parameters: []
	},
	"deploy_lambda": {
		cmd: `./bin/lbzioDeployLambda.js --name %functionName% --temp-dir ${defines.TEMPFS}`,
		parameters: [ "functionName" ]
	},
	"FULL_deploy_zip_node_lambda": {
		cmd: `./bin/lbzioAddLambda.js --name %functionName% --zip-file ${defines.STORAGEPATH}%zipFileName% --filename %handlerFileName% --handler %handlerName% && curl localhost:9999/reboot && ./bin/lbzioDeployLambda.js --name %functionName% --temp-dir ${defines.TEMPFS}`,  //TODO: review Storage...
		parameters: [ "functionName", "zipFileName", "handlerFileName", "handlerName" ]
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