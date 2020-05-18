const discordiaDebug = require('@discordia/debug');
const { isString, isArray, isFunction, isNull } = require('lodash');
const { red } = require('chalk');
const { ENUM_ACCESSOR_TYPE, ENUM_RESPONSE_TYPE, ENUM_DESCRIPTION_TYPE } = require('./constants');

const parseUsersArgs = (msgContent, userAction) =>
  msgContent.slice(msgContent.indexOf(userAction) + userAction.length + 1).split(' ');

const checkAccessor = (msgContent, accessor, startingIndex) => msgContent.indexOf(accessor) === startingIndex;

/**
 * @class DiscordiaAction
 * @description An action to be used by the discordia framework
 */
class DiscordiaAction {
  /**
   * @class
   * @param {string|Array<string>|Function} accessor The accessor used to determine
   * if the action should be run
   * @param {string|Function} response The response to send when the action is run
   * @param {?string} [description=null] The description of this action that will be
   * displayed when the bot is asked for help
   * @example
   * // String Accessor
   * const pingAction = new DiscordiaAction('ping', 'pong', 'ping -> pong');
   * @example
   * // Array Accessor
   * const arrayAccessorAction = new DiscordiaAction(['oof', 'ow', 'ouch'], 'rekt', 'Lets you know when you\'ve been rekt.');
   * @example
   * // Function Accessor
   * const functionAccessor = (userAction, msg, framework) => {
   *   if (msg.content.includes('hot')) {
   *     return true;
   *   } else if (msg.content.includes('heat')) {
   *     return true;
   *   } else if (msg.content.includes('fire')) {
   *     return true;
   *   } else if (msg.content.includes('flame')) {
   *     return true;
   *   }
   *   return false;
   * };
   * const functionAccessorAction = new DiscordiaAction(functionAccessor, '🔥', 'Let the user know if their message is hot');
   * @example
   * // Function Response
   * const generateJoke = () => 'This should probably make a user laugh';
   * const functionResponse = (userArgs, msg, framework) => {
   *   return `here is a joke for ${msg.author.username}: ${generateJoke()}`;
   * };
   * const jokeAction = new DiscordiaAction('joke', functionResponse, 'Responds to the user with a funny joke');
   * @memberof DiscordiaAction
   */
  constructor(accessor, response, description = null) {
    this.accessor = accessor;
    this.validateAccessor();
    this.response = response;
    this.validateResponse();
    this.description = description;
    this.validateDescription();

    this.debug('@@@@@@ New Action @@@@@@');
    this.debug('Accessor:', accessor);
    this.debug('Response:', response);
    this.debug('Description:', description);
  }

  /**
   * @function validateAccessor
   * @description Confirm that the accessor is one of the valid types - String, String[], or Function.
   * Set the corresponding enum on this.accessorType from enumAccessorType.
   * @returns {string} Returns this.accessorType
   * @private
   * @memberof DiscordiaAction
   */
  validateAccessor() {
    if (isString(this.accessor)) {
      this.accessorType = ENUM_ACCESSOR_TYPE.STRING;
    } else if (isArray(this.accessor)) {
      this.accessor.forEach((accessorEntry) => {
        if (!isString(accessorEntry)) {
          this.debug('ERROR: One or more of the accessors in your accessor array is not a string', this.accessor);
          throw new Error(
            red('Invalid action accessor of type array provided - all entries must be strings:', this.accessor)
          );
        }
      });
      this.accessorType = ENUM_ACCESSOR_TYPE.ARRAY;
    } else if (isFunction(this.accessor)) {
      this.accessorType = ENUM_ACCESSOR_TYPE.FUNCTION;
    } else {
      this.debug('ERROR: The provided action accessor was not a String, Array, or Function', this.accessor);
      throw new Error(red('Invalid action accessor type provided:', this.accessor));
    }
    return this.accessorType;
  }

  /**
   * @function validateResponse
   * @description Confirm that the accessor is one of the valid types - String or Function.
   * Set the corresponding enum on this.responseType from enumResponseType.
   * @returns {string} Returns this.responseType
   * @private
   * @memberof DiscordiaAction
   */
  validateResponse() {
    if (isString(this.response)) {
      this.responseType = ENUM_RESPONSE_TYPE.STRING;
    } else if (isFunction(this.response)) {
      this.responseType = ENUM_RESPONSE_TYPE.FUNCTION;
    } else {
      this.debug('ERROR: The provided action response was not a String or Function:', this.response);
      throw new Error(red('Invalid action response type provided:', this.response));
    }
    return this.responseType;
  }

  /**
   * @function validateDescription
   * @description Confirm that the description is one of the valid types - String or Null.
   * Set the corresponding enum on this.descriptionType from enumDescriptionType.
   * @returns {string} Returns this.descriptionType
   * @private
   * @memberof DiscordiaAction
   */
  validateDescription() {
    if (isString(this.description)) {
      this.descriptionType = ENUM_DESCRIPTION_TYPE.STRING;
    } else if (isNull(this.description)) {
      this.descriptionType = ENUM_DESCRIPTION_TYPE.NULL;
    } else {
      this.debug('ERROR: The provided action description was not a String:', this.description);
      throw new Error(red('Invalid action description type provided:', this.description));
    }
    return this.descriptionType;
  }

  /**
   * @function checkAccessor
   * @description Check if the provided userAction and/or other parameters meet the requirements of the accessor.
   * <ul>
   * <li>enumAccessorType.STRING: if userAction matches accessor</li>
   * <li>enumAccessorType.ARRAY: if userAction matches anything in the accessor array</li>
   * <li>enumAccessorType.FUNCTION: if accessor returns true when provided with userAction, msg, and args</li>
   * </ul>
   * message after they addressed this bot by name.
   * @param {string} msgContent The exact content of the message that might trigger this action
   * @param {any} msg The <a href="https://discord.js.org/#/docs/main/stable/class/Message">discord.js message
   * object</a> that might trigger this action
   * @param {any} framework The full <a href="api#DiscordiaFramework">Discordia framework instance</a> that this
   * action is attached to
   * @returns {boolean} Returns if the action will be handled
   * @private
   * @memberof DiscordiaAction
   */
  checkAccessor(msgContent, msg, framework) {
    switch (this.accessorType) {
      // If the accessor is a string
      case ENUM_ACCESSOR_TYPE.STRING: {
        // If the accessor matches the given command
        if (checkAccessor(msgContent, this.accessor, framework.startingIndex)) {
          this.debug(`Handling "${this.accessor}" as a ${ENUM_ACCESSOR_TYPE.STRING}`);
          this.handleAction(msgContent, msg, framework, parseUsersArgs(msgContent, this.accessor));
          return true;
        }
        return false;
      }
      // If the accessor is an array of strings
      case ENUM_ACCESSOR_TYPE.ARRAY: {
        // If the array includes the given command
        let userAction = false;
        this.accessor.forEach((accessor) => {
          if (checkAccessor(msgContent, accessor, framework.startingIndex)) {
            if (userAction !== false && accessor.length > userAction.length) {
              userAction = accessor;
            } else if (userAction === false) {
              userAction = accessor;
            }
          }
        });
        if (userAction) {
          this.debug(`Handling "${userAction}" as an ${ENUM_ACCESSOR_TYPE.ARRAY}`);
          this.handleAction(msgContent, msg, framework, parseUsersArgs(msgContent, userAction));
          return true;
        }
        return false;
      }
      // If the accessor is a function
      case ENUM_ACCESSOR_TYPE.FUNCTION: {
        // If the accessor returns a truthy value when resolved
        if (this.accessor(msgContent, msg, framework)) {
          this.debug(`Handling "${msgContent}" as a ${ENUM_ACCESSOR_TYPE.FUNCTION}`);
          this.handleAction(msgContent, msg, framework, msgContent.split(' '));
          return true;
        }
        return false;
      }
      // This case should not be reached - accessor type is validated in the constructor
      default: {
        throw new Error(
          red(
            'Something has gone terribly wrong with checkAccessor - you should not be manually setting this.accessorType if you are doing so.'
          )
        );
      }
    }
  }

  /**
   * @function handleAction
   * @description Handle the userAction with this.response based on this.responseType
   * <ul>
   * <li>enumResponseType.STRING: Reply to the user with this.response</li>
   * <li>enumResponseType.FUNCTION: Execute the response function providing msg, userArgs, and client</li>
   * </ul>
   * If the function returns a string, reply to the user with that string
   * @param {string} msgContent The exact content of the message that did trigger this action
   * @param {any} msg The <a href="https://discord.js.org/#/docs/main/stable/class/Message">discord.js message
   * object</a> that triggered this action
   * @param {any} framework the full <a href="api#DiscordiaFramework">Discordia framework instance</a> that
   * this action is attached to
   * @param {Array<string>} userArgs Everything in the user's message after the accessor that triggered this
   * action
   * @private
   * @memberof DiscordiaAction
   */
  handleAction(msgContent, msg, framework, userArgs) {
    switch (this.responseType) {
      // If the response is a string
      case ENUM_RESPONSE_TYPE.STRING: {
        // Send the response as a reply to the user who triggered the action
        msg.reply(this.response);
        break;
      }
      // If the response is a function
      case ENUM_RESPONSE_TYPE.FUNCTION: {
        // Execute it and store the result
        const result = this.response(msgContent, msg, framework, userArgs);
        // If the result of the response function is a string
        if (isString(result)) {
          // Send the response as a reply to the user who triggered the action
          msg.reply(result);
        }
        break;
      }
      default: {
        throw new Error(
          red(
            'Something has gone terribly wrong with handleAction - you should not be manually setting this.responseType if you are doing so.'
          )
        );
      }
    }
  }
}

DiscordiaAction.prototype.debug = discordiaDebug('action');

module.exports = DiscordiaAction;
module.exports.ENUM_ACCESSOR_TYPE = ENUM_ACCESSOR_TYPE;
module.exports.ENUM_RESPONSE_TYPE = ENUM_RESPONSE_TYPE;
module.exports.ENUM_DESCRIPTION_TYPE = ENUM_DESCRIPTION_TYPE;
