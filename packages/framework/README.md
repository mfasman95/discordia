- [Installation](#installation)
- [Kitchen Sink Example](#kitchen-sink-example)
- [Usage](#usage)
  - [Token](#token)
  - [Actions](#actions)
  - [Options](#options)
- [Testing](#testing)

>Note: Some of the links in this README file work better on the [documentation site](https://mfasman95.github.io/discordia/)

# Installation
Discordia instantiates and starts Discord bots using the [@discordia/framework](https://github.com/mfasman95/discordia/tree/master/packages/framework) module.
```bash
# install the module using npm
npm install @discordia/framework

# install the module using yarn
yarn add @discordia/framework
```

# Kitchen Sink Example
```js
const DiscordiaFramework = require('@discordia/framework');
// actions is an array of DiscordiaAction objects
const actions = require('./actions');
const options = {
  name: 'myBot',
  caseSensitiveName: false,
  missingCommandMessage: 'The command you tried to send was not available',
  help: 'You should probably configure a useful help message or leave the default',
};

const myBot = new DiscordiaFramework('DISCORD_BOT_TOKEN', actions, options);

// Set up the event listeners and log the bot in using the provided token
myBot.start();
```

# Usage
Every Discordia framework is made of three pieces: a token, an array of actions, and a set of optional options.

## Token
>String

Your private Discord bot token. The token for your bot should be located at https://discordapp.com/developers/applications/{client-id}/bot (replace {client-id} with the Client ID of your Discord application) in a hidden field that you can reveal by clicking "Click to Reveal Token". [This guide](gs_setup_your_bot) will help you make a new Discord bot if you have not done so before.

>⚠️This token is a sensitive piece of information. DO NOT commit it with your source code. Regenerate it if it ever becomes compromised.⚠️

## Actions
>Array[DiscordiaAction]

An array of [DiscordiaAction](api#DiscordiaAction) objects. See [our guide](gs_write_an_action) on how to use the [@discordia/action](https://github.com/mfasman95/discordia/tree/master/packages/action) module to create your own actions. You can also install them from third party modules.

## Options
>Object

The options object is prepopulated with overrideable defaults. More in-depth explanations of the available options are below.
|Option|Default|
|---|---|
|`name`|`undefined`|
|`caseSensitiveName`|`false`|
|`missingCommandMessage`|"The command you typed is not available 🙁"|
|`help`|[@discordia/default-help](https://github.com/mfasman95/discordia/tree/master/packages/default-help)|

**name**
>String - Default = undefined

Your discord bot will see all messages sent in a server you invite it to. By default, it will only respond when you @ the bot. If `name` is set then the bot will instead respond to any message that begins with a string matching `name`. By default this is not case sensitive but you can set `caseSensitiveName` to `true` if you want the `name` to be case sensitive.

**caseSensitiveName**
>Boolean - Default = false

Controls whether or not the bot name should be treated as if it is case sensitive. This field is ignored if `name` is not set.

**missingCommandMessage**
>String|Function - Default = "The command you typed is not available 🙁"

The message to send if a server member tries to ask the bot to do an action it does not know how to handle. You can either customize the `string` or provide a `function` to give a more involved response.

**help**
>String|Function - Default = [@discordia/default-help](https://github.com/mfasman95/discordia/tree/master/packages/default-help)

The message to send if a server member tries to ask the bot for help. By default it will use [@discordia/default-help](https://github.com/mfasman95/discordia/tree/master/packages/default-help) to read your actions and send a response based on their [accessors](action#accessor) and [descriptions](action#description). You can provide `null` to disable the help message or provide a custom [DiscordiaAction](api#DiscordiaAction) to control what the message responds to and what it says.

# Testing
🚧 Coming Soon! 🚧