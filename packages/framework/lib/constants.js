const DEFAULT_HELP = require('@discordia/default-help');

module.exports.DEFAULT_NAME = undefined;

module.exports.DEFAULT_CASE_SENSITIVE_NAME = false;

module.exports.DEFAULT_MISSING_COMMAND_MESSAGE = 'The command you typed is not available :frowning:';
module.exports.ENUM_MISSING_COMMAND_MESSAGE_TYPE = {
  STRING: 'STRING',
  FUNCTION: 'FUNCTION',
};

module.exports.DEFAULT_HELP = DEFAULT_HELP;
module.exports.ENUM_HELP_TYPE = DEFAULT_HELP.ENUM_HELP_TYPE;

module.exports.DEFAULT_OPTIONS = {
  name: module.exports.DEFAULT_NAME,
  caseSensitiveName: module.exports.DEFAULT_CASE_SENSITIVE_NAME,
  missingCommandMessage: module.exports.DEFAULT_MISSING_COMMAND_MESSAGE,
  help: DEFAULT_HELP,
};
