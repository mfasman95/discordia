const { isString, isArray, isFunction, isBoolean } = require('lodash');
const { red, cyan } = require('chalk');
const Discord = require('discord.js');
const discordiaDebug = require('@discordia/debug');
const defaultHelp = require('@discordia/help-default');
const DiscordiaAction = require('@discordia/action');

const enumHelp = {
  STRING: 'STRING',
  FUNCTION: 'FUNCTION',
};

const defaultCaseSensitiveName = false;

const defaultMissingCommandMessage = 'The command you typed is not available :frowning:';
const enumMissingCommandMessage = {
  STRING: 'STRING',
  FUNCTION: 'FUNCTION',
};

const defaultName = undefined;

const optionsDefaults = {
  caseSensitiveName: defaultCaseSensitiveName,
  missingCommandMessage: defaultMissingCommandMessage,
  name: defaultName,
  help: defaultHelp,
};

class DiscordiaFramework {
  /**
   * @param {string} token Discord Bot Token
   * @param {Array<DiscordiaAction>}actions An array of DiscordiaActions provided by the bot creator
   *
   * @memberof DiscordiaFramework
   */
  constructor(
    token,
    actions,
    {
      caseSensitiveName = defaultCaseSensitiveName,
      missingCommandMessage = defaultMissingCommandMessage,
      name = defaultName,
      help = defaultHelp,
    } = optionsDefaults
  ) {
    // #region Validate Required Parameters
    this.token = token;
    this.validateToken();

    this.actions = actions;
    this.validateActions();
    // #endregion Validate Required Parameters

    // #region Validate Optional Config
    this.caseSensitiveName = caseSensitiveName;
    this.validateCaseSensitiveName();

    this.missingCommandMessage = missingCommandMessage;
    this.validateMissingCommandMessage();

    this.name = name;
    this.validateName();

    this.help = help;
    this.validateHelp();
    // #endregion Validate Optional Config

    this.client = new Discord.Client();
  }

  validateToken() {
    if (!isString(this.token)) {
      this.debug('Token', this.token);
      throw new Error(red(`ERROR: The provided token ${cyan(this.token)} was not a STRING - failing to start bot`));
    }
  }

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

  validateCaseSensitiveName() {
    if (this.caseSensitiveName !== defaultCaseSensitiveName && !isBoolean(this.caseSensitiveName)) {
      this.debug('config.caseSensitiveName', this.caseSensitiveName);
      throw new Error(red('ERROR: The provided config.caseSensitiveName was not an OBJECT - failing to start bot'));
    }
  }

  validateMissingCommandMessage() {
    if (this.missingCommandMessage === defaultMissingCommandMessage) {
      this.missingCommandMessage = enumMissingCommandMessage.STRING;
    } else if (isString(this.missingCommandMessage)) {
      this.missingCommandMessageType = enumMissingCommandMessage.STRING;
    } else if (isFunction(this.missingCommandMessage)) {
      this.missingCommandMessageType = enumMissingCommandMessage.FUNCTION;
    } else {
      this.debug('config.missingCommandMessage', this.missingCommandMessage);
      throw new Error(
        red('ERROR: The provided config.missingCommandMessage was not a STRING or FUNCTION - failing to start bot')
      );
    }
  }

  validateName() {
    if (this.name !== defaultName && !isString(this.name)) {
      this.debug('config.name', this.name);
      throw new Error(red('ERROR: The provided config.name was not a STRING - failing to start bot'));
    }
  }

  validateHelp() {
    if (this.help === defaultHelp) {
      this.helpType = enumHelp.FUNCTION;
    } else if (isString(this.help)) {
      this.helpType = enumHelp.STRING;
    } else if (isFunction(this.help)) {
      this.helpType = enumHelp.FUNCTION;
    } else {
      this.debug('WARNING: The provided config.help was not a STRING or FUNCTION', this.help);
    }
  }

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

  handleHelp(userAction, userArgs, msg) {
    if (userAction === 'help' || userAction === 'h') {
      switch (this.helpType) {
        case enumHelp.STRING: {
          msg.reply(this.help);
          break;
        }
        case enumHelp.FUNCTION: {
          this.help(this.nameToSend, this.actions, userArgs, msg);
          break;
        }
        default: {
          msg.reply('I am missing a help command, sorry :frowning:');
          break;
        }
      }
    }
  }

  handleMissingCommand(userAction, userArgs, msg) {
    switch (this.missingCommandMessageType) {
      // If the missing command message is a string
      case enumMissingCommandMessage.STRING: {
        // Reply to the user with it
        msg.reply(this.missingCommandMessage);
        break;
      }
      // If the missingCommandMessage is a function, execute it
      case enumMissingCommandMessage.FUNCTION: {
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

  handleMessage(msg) {
    const [botName, unsanitizedUserAction] = msg.content.split(' ');

    if (this.shouldHandleMessage(botName)) {
      const userAction = unsanitizedUserAction || '';
      const userArgs = msg.content.slice(msg.content.indexOf(userAction) + userAction.length + 1).split(' ');

      this.debug(botName, userAction, userArgs);

      this.handleHelp(userAction, userArgs);

      let actionHandled = false;
      this.actions.forEach((action) => {
        actionHandled = action.checkAccessor(userAction, msg, userArgs, this.client).bind(action);
      });

      if (!actionHandled) {
        this.handleMissingCommand(userAction, userArgs, msg);
      }
    }

    return undefined;
  }

  start() {
    this.client.on('ready', () => this.debug(`Logged in as ${this.client.user.tag}!`));
    this.client.on('message', this.handleMessage);
    this.client.login(this.token);
  }
}

DiscordiaFramework.prototype.debug = discordiaDebug('framework');

module.exports = DiscordiaFramework;
