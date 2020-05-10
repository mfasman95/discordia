const DiscordiaAction = require('@discordia/action');
const { isString, isArray, isFunction, flatten } = require('lodash');
const { ENUM_HELP_TYPE } = require('./constants');

/**
 * @function helpResponse
 * @description Hello World
 *
 * @param {Array<string>} userArgs Everything in the user's message after the userAction
 * @param {any} msg The <a href="https://discord.js.org/#/docs/main/stable/class/Message">discord.js message
 * object</a> that triggered this action
 * @param {any} framework the full <a href="api#DiscordiaFramework">Discordia framework instance</a> that this
 * action is attached to
 * @returns {string} A help message based on the name of the bot and its registered actions
 * @private
 */
const helpResponse = (userArgs, msg, framework) => {
  const messageStarter = `All commands are written in the form \`${framework.botName} {command}\`:`;

  const commandToFilter = userArgs[0];
  const accessors = flatten(
    framework.actions.filter((action) => !isFunction(action.accessor)).map((action) => action.accessor)
  );

  const actionsToDescribe = !accessors.includes(commandToFilter)
    ? framework.actions
    : framework.actions
        .filter((action) => !isFunction(action.accessor))
        .filter((action) => {
          if (isArray(action.accessor) && action.accessor.includes(commandToFilter)) {
            return true;
          }
          if (isString(action.accessor) && action.accessor === commandToFilter) {
            return true;
          }
          return false;
        });

  const helpMessage = actionsToDescribe.reduce((helpMessageBuilder, { accessor, description }) => {
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
* \`${finalAccessorDescription}\` - ${description}`;
  }, `${messageStarter}\n`);

  return helpMessage;
};

module.exports = new DiscordiaAction(['help', 'h'], helpResponse, 'Display the list of available actions for this bot');

module.exports.ENUM_HELP_TYPE = ENUM_HELP_TYPE;
