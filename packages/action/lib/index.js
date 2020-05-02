const discordiaDebug = require('@discordia/debug');
const { isString, isArray, isFunction, isNull } = require('lodash');
const { red } = require('chalk');
const { ENUM_ACCESSOR_TYPE, ENUM_RESPONSE_TYPE, ENUM_DESCRIPTION_TYPE } = require('./constants');

/**
 * @class DiscordiaAction
 * @description An action to be used by the discordia framework
 */
class DiscordiaAction {
  /**
   * @constructor
   * @param {String|Array<String>|Function} accessor
   * @param {String|Function} response
   * @param {?String} [description=null] The description
   * of this action that will be displayed when the bot is asked for help
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
    return this.description;
  }

  /**
   * @function checkAccessor
   * @description Check if the provided userAction and/or other parameters meet the requirements of the accessor.
   * - enumAccessorType.STRING: if userAction matches accessor
   * - enumAccessorType.ARRAY: if userAction matches anything in the accessor array
   * - enumAccessorType.FUNCTION: if accessor returns true when provided with userAction, msg, and args
   * @param {string} userAction The action the user is attempting to take. This is the first word in the user's
   * message after they addressed this bot by name.
   * @param msg The message object from discord.js
   * - https://discord.js.org/#/docs/main/stable/class/Message
   * @param {Array<string>} userArgs Everything in the user's message after the userAction
   * @param client The full discord.js Client instance - USE WITH CAUTION
   * - https://discord.js.org/#/docs/main/stable/class/Client
   * @returns {Boolean}
   * @memberof DiscordiaAction
   */
  checkAccessor(userAction, msg, userArgs, client) {
    switch (this.accessorType) {
      // If the accessor is a string
      case ENUM_ACCESSOR_TYPE.STRING: {
        // If the accessor matches the given command
        if (userAction === this.accessor) {
          this.debug(`Handling "${userAction}" as a ${ENUM_ACCESSOR_TYPE.STRING}`);
          this.handleAction(msg, userArgs, client);
          return true;
        }
        return false;
      }
      // If the accessor is an array of strings
      case ENUM_ACCESSOR_TYPE.ARRAY: {
        // If the array includes the given command
        if (this.accessor.includes(userAction)) {
          this.debug(`Handling "${userAction}" as an ${ENUM_ACCESSOR_TYPE.ARRAY}`);
          this.handleAction(msg, userArgs, client);
          return true;
        }
        return false;
      }
      // If the accessor is a function
      case ENUM_ACCESSOR_TYPE.FUNCTION: {
        // If the accessor returns a truthy value when resolved
        if (this.accessor(userAction, msg, userArgs)) {
          this.debug(`Handling "${userAction}" as a ${ENUM_ACCESSOR_TYPE.FUNCTION}`);
          this.handleAction(msg, userArgs, client);
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
   * - enumResponseType.STRING: Reply to the user with this.response
   * - enumResponseType.FUNCTION: Execute the response function providing msg, userArgs, and client
   * If the function returns a string, reply to the user with that string
   * @param msg The message object from discord.js
   * - https://discord.js.org/#/docs/main/stable/class/Message
   * @param {Array<string>} userArgs Everything in the user's message after the userAction
   * @param client The full discord.js Client instance - USE WITH CAUTION
   * - https://discord.js.org/#/docs/main/stable/class/Client
   * @returns {undefined}
   * @memberof DiscordiaAction
   */
  handleAction(msg, userArgs, client) {
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
        const result = this.response(userArgs, msg, client);
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
