const { isString, isArray, isFunction } = require('lodash');
const { red, yellow, cyan } = require('chalk');
const Discord = require('discord.js');
const discordiaDebug = require('@discordia/debug');
const defaultHelp = require('@discordia/help-default');

const debug = discordiaDebug('framework');

const handleAction = (action, msg, userArgs, client) => {
  if (isString(action.response)) {
    // If the response is a string, reply it to the user who triggered the action
    msg.reply(action.response);
  } else if (isFunction(action.response)) {
    // If the response is a function, execute it
    const result = action.response(userArgs, msg, client);
    if (isString(result)) {
      // If the result of the response function is a returned string, reply it to the user who triggered the action
      msg.reply(result);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(yellow('WARNING: The provided action response was not a String or Function'), JSON.stringify(action));
  }
};

const defaultCaseSensitiveName = false;
const defaultMissingCommandMessage = 'The command you typed is not available :frowning:';
const defaultName = undefined;

const optionsDefaults = {
  caseSensitiveName: defaultCaseSensitiveName,
  missingCommandMessage: defaultMissingCommandMessage,
  name: defaultName,
  help: defaultHelp,
};

module.exports = (
  token,
  actions,
  {
    caseSensitiveName = defaultCaseSensitiveName,
    missingCommandMessage = defaultMissingCommandMessage,
    name = defaultName,
    help = defaultHelp,
  } = optionsDefaults
) => {
  /* eslint-disable no-console */
  if (!isString(token)) {
    console.log(red(`The provided token ${cyan(token)} was not a string - failing to start bot`));
    process.exit(1);
  }
  if (!isArray(actions)) {
    console.log(red('The provided actions were not an array - failing to start bot'));
    process.exit(1);
  }
  /* eslint-enable no-console */

  const client = new Discord.Client();

  client.on('ready', () => {
    debug(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', (msg) => {
    const [botName, unsanitizedUserAction] = msg.content.split(' ');

    let defaultNameMatch = false;
    let caseInsensitiveNameMatch = false;
    let caseSensitiveNameMatch = false;
    if (isString(name)) {
      caseInsensitiveNameMatch = botName.toLowerCase() === name.toLowerCase() && !caseSensitiveName;
      caseSensitiveNameMatch = botName === name && caseSensitiveName;
    } else {
      defaultNameMatch = `<@!${client.user.id}>` === botName;
    }

    if (defaultNameMatch || caseInsensitiveNameMatch || caseSensitiveNameMatch) {
      const userAction = unsanitizedUserAction || '';
      const userArgs = msg.content.slice(msg.content.indexOf(userAction) + userAction.length + 1).split(' ');

      debug(botName, userAction, userArgs);

      let actionHandled = false;

      if (userAction === 'help' || userAction === 'h') {
        const nameToSend = defaultNameMatch ? `@${client.user.username}` : name;

        if (isString(help)) {
          return msg.reply(help);
        }
        if (isFunction(help)) {
          return help(nameToSend, actions, userArgs, msg);
        }
        msg.reply('I am missing a help command, sorry :frowning:');
        // eslint-disable-next-line no-console
        return console.log(yellow('WARNING: The provided help options not a String or Function'), help.toString());
      }

      actions.forEach((action) => {
        if (isString(action.accessor)) {
          if (userAction === action.accessor) {
            // If the accessor is a string and it matches the given command
            handleAction(action, msg, userArgs, client);
            actionHandled = true;
          }
        } else if (isArray(action.accessor)) {
          if (action.accessor.includes(userAction)) {
            // If the accessor is an array of strings that includes the given command
            handleAction(action, msg, userArgs, client);
            actionHandled = true;
          }
        } else if (isFunction(action.accessor)) {
          if (action.accessor(userAction, msg, userArgs)) {
            // If the accessor is a function that returns a truthy value when resolved
            handleAction(action, msg, userArgs, client);
            actionHandled = true;
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(
            yellow('WARNING: The provided action accessor was not a String, Array, or Function'),
            JSON.stringify(action)
          );
        }
      });

      if (!actionHandled) {
        if (isString(missingCommandMessage)) {
          // If the missing command message is a string, reply to the user with it
          msg.reply(missingCommandMessage);
        } else if (isFunction(missingCommandMessage)) {
          // If the missingCommandMessage is a function, execute it
          const result = missingCommandMessage(userAction, userArgs, msg, client);
          if (isString(result)) {
            // If the result of the missingCommandMessage function is a returned string, reply it to the user who triggered the action
            msg.reply(result);
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(
            yellow('WARNING: The provided missingCommandMessage was not a String or Function'),
            missingCommandMessage.toString()
          );
        }
      }
    }

    return undefined;
  });

  client.login(process.env.DISCORD_BOT_KEY);
};
