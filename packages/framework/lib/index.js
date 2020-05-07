const { isString, isArray, isFunction, isBoolean, isNull } = require('lodash');
const { green, red, cyan, magenta, yellow } = require('chalk');
const discord = require('discord.js');
const discordiaDebug = require('@discordia/debug');
const DiscordiaAction = require('@discordia/action');
const { parseMessageContent } = require('./utils');
const {
  DEFAULT_NAME,
  DEFAULT_CASE_SENSITIVE_NAME,
  DEFAULT_MISSING_COMMAND_MESSAGE,
  DEFAULT_HELP,
  DEFAULT_OPTIONS,
  ENUM_MISSING_COMMAND_MESSAGE_TYPE,
  ENUM_HELP_TYPE,
} = require('./constants');

/**
 * @class DiscordiaFramework
 * @description The Discordia Framework class - can be used to start a bot with a set of programmed
 * actions.
 */
class DiscordiaFramework {
  /**
   * @class
   * @param {string} token Discord Bot Token
   * @param {Array<DiscordiaAction>} actions An array of DiscordiaActions provided by the bot creator
   * @param {object} [options=DEFAULT_OPTIONS] The options object
   * @param {?string} [options.name=undefined] A string to that can be used to get the bot to respond. Setting
   * this value means the bot will response to this name instead of when (AT)'d.
   * @param {?boolean} [options.caseSensitiveName=false] A boolean to set whether or not the bot name is case
   * sensitive. Requires options.Name to be a String.
   * @param {?string|Function} [options.missingCommandMessage=DEFAULT_MISSING_COMMAND_MESSAGE] The message to
   * send when a user tries to use a command that does not exist. String by default, but can be set to a new
   * Fixed string or a custom Function that receives (userAction, userArgs, msg, client).
   * @param {?DiscordiaAction|null} [options.help=DEFAULT_HELP] The message to send to a user that tries to list the
   * available commands using 'help' or 'h'. By default this will use the descriptions of each of the provided
   * actions, but can be configured to use a custom DiscordiaAction or set to `null` to remove it from the list of
   * available actions.
   * @example
   * // Simple Example
   * const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions);
   * @example
   * // Kitchen Sink Example
   * const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions, {
   *   name: 'bot-name',
   *   caseSensitiveName: true,
   *   missingCommandMessage: 'Looks like this command was missing :frowning:',
   *   help: new DiscordiaAction(['h', 'help'], (userArgs, msg, framework) => 'Include your own custom help message', 'A help message'),
   * });
   * @memberof DiscordiaFramework
   */
  constructor(
    token,
    actions,
    {
      name = DEFAULT_NAME,
      caseSensitiveName = DEFAULT_CASE_SENSITIVE_NAME,
      missingCommandMessage = DEFAULT_MISSING_COMMAND_MESSAGE,
      help = DEFAULT_HELP,
    } = DEFAULT_OPTIONS
  ) {
    // #region Validate Required Parameters
    // Set the login function here to avoid storing `token`
    this.login = () => this.client.login(token);
    this.validateToken(token);

    // Include help in the actions but remove it if it is null
    this.actions = [help, ...actions].filter((action) => action !== null);
    this.validateActions();
    // #endregion Validate Required Parameters

    // #region Validate Optional Config
    this.name = name;
    this.validateName();

    this.caseSensitiveName = caseSensitiveName;
    this.validateCaseSensitiveName();

    this.missingCommandMessage = missingCommandMessage;
    this.validateMissingCommandMessage();

    this.help = help;
    this.validateHelp();
    // #endregion Validate Optional Config

    this.client = new discord.Client();
  }

  /**
   * @function validateToken
   * @description Confirm that the provided token is a String
   * @param {string} token The Discord token used to set up this bot
   * @memberof DiscordiaFramework
   * @private
   */
  validateToken(token) {
    if (!isString(token)) {
      this.debug('Token', token);
      throw new Error(red(`ERROR: The provided token ${cyan(token)} was not a STRING - failing to start bot`));
    }
  }

  /**
   * @function validateActions
   * @description Confirm that the provided actions is an Array<DiscordiaAction>
   * @memberof DiscordiaFramework
   * @private
   */
  validateActions() {
    if (!isArray(this.actions)) {
      this.debug('Actions', this.actions);
      throw new Error(red('ERROR: The provided actions was not an ARRAY - failing to start bot'));
    }
    this.actions.forEach((action) => {
      const isDiscordiaAction = action instanceof DiscordiaAction;
      if (!isDiscordiaAction) {
        this.debug('Action', action);
        throw new Error(
          red('ERROR: One or more of the provided actions was not of type DiscordiaAction - failing to start bot')
        );
      }
    });
  }

  /**
   * @function validateCaseSensitiveName
   * @description Confirm that the name option is either the default or a String
   * @memberof DiscordiaFramework
   * @private
   */
  validateName() {
    if (this.name !== DEFAULT_NAME && !isString(this.name)) {
      this.debug('config.name', this.name);
      throw new Error(red('ERROR: The provided config.name was not a STRING - failing to start bot'));
    }
  }

  /**
   * @function validateCaseSensitiveName
   * @description Confirm that the caseSensitiveName option is either the default or a Boolean
   * @memberof DiscordiaFramework
   * @private
   */
  validateCaseSensitiveName() {
    if (this.caseSensitiveName !== DEFAULT_CASE_SENSITIVE_NAME && !isBoolean(this.caseSensitiveName)) {
      this.debug('config.caseSensitiveName', this.caseSensitiveName);
      throw new Error(red('ERROR: The provided config.caseSensitiveName was not a BOOLEAN - failing to start bot'));
    }
  }

  /**
   * @function validateMissingCommandMessage
   * @description Confirm that the missingCommandMessage option is either the default value or
   * one of the expected types - String or Function
   * @memberof DiscordiaFramework
   * @private
   */
  validateMissingCommandMessage() {
    if (this.missingCommandMessage === DEFAULT_MISSING_COMMAND_MESSAGE) {
      this.missingCommandMessageType = ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING;
    } else if (isString(this.missingCommandMessage)) {
      this.missingCommandMessageType = ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING;
    } else if (isFunction(this.missingCommandMessage)) {
      this.missingCommandMessageType = ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION;
    } else {
      this.debug('WARNING: The provided config.missingCommandMessage was not a STRING or FUNCTION', this.help);
    }
  }

  /**
   * @function validateHelp
   * @description Confirm that the help option is either the default value or
   * one of the expected types - DiscordiaAction or Null
   * @memberof DiscordiaFramework
   * @private
   */
  validateHelp() {
    if (this.help === DEFAULT_HELP) {
      this.helpType = ENUM_HELP_TYPE.DISCORDIA_ACTION;
    } else if (isNull(this.help)) {
      this.helpType = ENUM_HELP_TYPE.NULL;
    } else if (this.help instanceof DiscordiaAction) {
      this.helpType = ENUM_HELP_TYPE.DISCORDIA_ACTION;
    } else {
      this.debug('WARNING: The provided config.help was not a DISCORDIA_ACTION or NULL', this.help);
    }
  }

  /**
   * @function shouldHandleMessage
   * @description Determine if the incoming message was directed at this bot based on the
   * portion of the user message that would be the name of the bot and whether or not the
   * name should be case sensitive
   * @param {string} botName The portion of the user message that would be the botName
   * @returns {boolean} whether or not this bot was being addressed
   * @private
   * @memberof DiscordiaFramework
   */
  shouldHandleMessage(botName) {
    let defaultNameMatch = false;
    let caseInsensitiveNameMatch = false;
    let caseSensitiveNameMatch = false;
    if (isString(this.name)) {
      caseInsensitiveNameMatch = botName.toLowerCase() === this.name.toLowerCase() && !this.caseSensitiveName;
      caseSensitiveNameMatch = botName === this.name && this.caseSensitiveName;
    } else {
      defaultNameMatch = `<@!${this.client.user.id}>` === botName;
    }

    this.nameToSend = defaultNameMatch ? `@${this.client.user.username}` : this.name;

    return defaultNameMatch || caseInsensitiveNameMatch || caseSensitiveNameMatch;
  }

  /**
   * @function handleMissingCommand
   * @description Determines the message to send back to the user if the command
   * they attempted to use was not available based on this.missingCommandMessageType.
   * String - Replies to the user with this.missingCommandMessage
   * Function - Passes userAction, userArgs, the
   * <a href="https://discord.js.org/#/docs/main/stable/class/Message">Discord.js Message object</a>,
   * and the <a href="https://discord.js.org/#/docs/main/stable/class/Client">Discord.js Client object</a>,
   * as parameters.
   *
   * @param {string} userAction The action taken by the user
   * @param {Array<string>} userArgs Everything in the message after the userAction as an Array
   * @param {any} msg The <a href="https://discord.js.org/#/docs/main/stable/class/Message">discord.js
   * message object</a> that triggered this action
   * @private
   * @memberof DiscordiaFramework
   */
  handleMissingCommand(userAction, userArgs, msg) {
    switch (this.missingCommandMessageType) {
      // If the missing command message is a string
      case ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING: {
        // Reply to the user with it
        msg.reply(this.missingCommandMessage);
        break;
      }
      // If the missingCommandMessage is a function, execute it
      case ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION: {
        const result = this.missingCommandMessage(userAction, userArgs, msg, this.client);
        // If the result of the missingCommandMessage function is a string
        if (isString(result)) {
          // Reply the result to the user who triggered the action
          msg.reply(result);
        }
        break;
      }
      default: {
        this.debug(
          'WARNING: The provided missingCommandMessage was not a String or Function',
          this.missingCommandMessage
        );
        break;
      }
    }
  }

  /**
   * @function handleMessage
   * @description Determines based on the Message object received whether the message was intended for
   * this bot, if it was a help request, if it can be handled by an action, or if it should be handled
   * as a missing action.
   * @param {any} msg The <a href="https://discord.js.org/#/docs/main/stable/class/Message">discord.js
   * message object</a> that triggered this action
   * @returns {boolean} Returns whether or not the action was handled
   * @private
   * @memberof DiscordiaFramework
   */
  handleMessage(msg) {
    const [botName, userAction, userArgs] = parseMessageContent(msg);

    if (this.shouldHandleMessage(botName)) {
      this.debug(botName, userAction, userArgs);

      let actionHandled = false;

      this.actions.forEach((action) => {
        // If any of the actions are handled, make sure to track it
        if (action.checkAccessor(userAction, msg, userArgs, this)) {
          actionHandled = true;
        }
      });

      if (!actionHandled) {
        this.handleMissingCommand(userAction, userArgs, msg);
      }

      return actionHandled;
    }

    return false;
  }

  /**
   * @function start
   * @description Initialize the Discord.js client using the provided token and sets up
   * the message listener to pass all messages to <DiscordiaFramework#handleMessage>
   * @private
   * @memberof DiscordiaFramework
   */
  start() {
    this.client.on('ready', () => {
      const startMessage = green(`Your bot has logged in as ${cyan(this.client.user.tag)}...`);
      const loggingMessage = magenta(
        `You can run this bot with additional logs by setting
${yellow('DEBUG=@discordia*')} as an environment variable`
      );
      // eslint-disable-next-line no-console
      console.log(`${startMessage}\n\n${loggingMessage}`);
      this.debug(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on('message', (msg) => this.handleMessage(msg));
    this.login();
    delete this.login;
  }
}

DiscordiaFramework.prototype.debug = discordiaDebug('framework');

module.exports = DiscordiaFramework;
