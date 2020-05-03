const { isString, isArray, isFunction } = require('lodash');
const { ENUM_HELP_TYPE } = require('./constants');

module.exports = (botName, actions, userArgs, msg) => {
  const messageStarter = `All commands are written in the form \`${botName} {command}\`:`;

  const helpMessage = actions.reduce((helpMessageBuilder, { accessor, description }) => {
    if (!description) {
      return `${helpMessageBuilder}`;
    }

    let finalAccessorDescription = '';
    if (isString(accessor)) {
      finalAccessorDescription = accessor;
    } else if (isArray(accessor)) {
      finalAccessorDescription = accessor.join('` | `');
    } else if (isFunction(accessor)) {
      finalAccessorDescription = '{Dynamic Accessor}';
    }

    return `${helpMessageBuilder}
-------------------------
**Command**: \`${finalAccessorDescription}\`

${description}`;
  }, messageStarter);

  msg.reply(helpMessage);

  return helpMessage;
};

module.exports.ENUM_HELP_TYPE = ENUM_HELP_TYPE;
