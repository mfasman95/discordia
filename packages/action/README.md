- [Installation](#installation)
- [Basic Example](#basic-example)
- [Usage](#usage)
  - [Accessor](#accessor)
  - [Response](#response)
  - [Description](#description)
- [Examples](#examples)
  - [String Accessor and String Response](#string-accessor-and-string-response)
  - [Array Accessor](#array-accessor)
  - [Function Accessor](#function-accessor)
  - [Function Response](#function-response)
- [Testing](#testing)

>Note: Some of the links in this README file work better on the [documentation site](https://mfasman95.github.io/discordia/)

# Installation
```bash
# install the module using npm
npm install @discordia/action

# install the module using yarn
yarn add @discordia/action
```

Discordia actions are designed to be used with a Discordia framework instance. See the [section on testing](#testing) below for details on how to validate your actions.

# Basic Example
```js
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong');
```
```
# Conversation Example(s)

User: @BotName ping
BotName: @User, pong
```

# Usage
Every Discordia action is made of three pieces: an accessor, a response, and an optional description.

## Accessor
The accessor is how the Discordia framework determines whether or not this action should give its [response](#response). The Discordia framework calls the action's [checkAccessor](api#DiscordiaAction.checkAccessor) method which in turn determines whether or not to call the action's [handleAction](api#DiscordiaAction.handleAction) method based on the type of the accessor. The [checkAccessor](api#DiscordiaAction.checkAccessor) method is given four parameters:

|Parameter|Description
|---|---|
|`userAction`|The first `string` after the name of the bot that triggered the framework|
|`msg`|The full [Message object](https://discord.js.org/#/docs/main/stable/class/Message) that contains `userAction` and `userArgs` in its `content`|
|`userArgs`|Everything in side the `msg.content` field after `userAction` as an array|
|`framework`|The full [Discordia Framework](api#DiscordiaFramework) instance - USE WITH CAUTION|


**String**

If the accessor is a string and matches `userAction` exactly then [handleAction](api#DiscordiaAction.handleAction) for this action will be called.

**Array**

If the accessor is an array and any of its entries matches `userAction` exactly then [handleAction](api#DiscordiaAction.handleAction) for this action will be called.

**Function**

If the accessor is a function that returns true when provided with `userAction`, `msg`, and `framework` then [handleAction](api#DiscordiaAction.handleAction) for this action will be called.

## Response
The response is how the Discordia framework responds to a user that tries to interact with the bot it creates. Once [handleAction](api#DiscordiaAction.handleAction) is called it will determine how to respond to the user based on the type of the response. The [handleAction](api#DiscordiaAction.handleAction) method is given three parameters:

|Parameter|Description
|---|---|
|`msg`|The full [Message object](https://discord.js.org/#/docs/main/stable/class/Message) that contains `userAction` and `userArgs` in its `content`|
|`userArgs`|Everything in side the `msg.content` field after `userAction` as an array|
|`framework`|The full [Discordia Framework](api#DiscordiaFramework) instance - USE WITH CAUTION|

**String**

If the response is a string then [msg.reply](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=reply) is called with response as the `content` parameter.

**Function**

If the response is a function then that function will be called with `msg`, `userArgs`, and `framework` as parameters. If the function returns a string then [msg.reply](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=reply) is called with the result of that function as the `content` parameter.

## Description
Description is an optional parameter that must be a string used to enable a `help` (or `h`) action on the Discordia framework. By default the discordia framework will attempt to supply usage information to server members who ask the bot created by the Discordia framework for help.
```js
// Default Behavior
`-------------------------
**Command**: \`${accessor}\`

${description}`
```
Accessor is formatted based on its type to show the available options (with "{Dynamic Accessor}" sent if the accessor is a function). The description is the exact contents of the description parameter given to the Discordia action constructor.

If description is ommitted or set to `null` then the whole action will be left off when the the help action is triggered.

The behavior of the help command can be overriden - see the [Discordia Framework constructor](api#DiscordiaFramework).

# Examples
## String Accessor and String Response
```js
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong');
```
```
# Conversation Example(s)

User: @BotName ping
BotName: @User, pong
```
## Array Accessor
```js
const DiscordiaAction = require('@discordia/action');

const ouchAction = new DiscordiaAction(['oof', 'ow', 'ouch'], 'rekt');
```
```
# Conversation Example(s)

User: @BotName oof
BotName: @User, rekt
---
User: @BotName ow
BotName: @User, rekt
---
User: @BotName ouch
BotName: @User, rekt
```
## Function Accessor
```js
const DiscordiaAction = require('@discordia/action');

const accessor = (userAction, msg, framework) => {
  if (msg.content.includes('potato')) {
    return true;
  }
  return false;
};
const potatoAction = new DiscordiaAction(accessor, 'delicious');
```
```
# Conversation Example(s)

User: @BotName Do you like potatoes?
BotName: @User, delicious
```
## Function Response
```js
const DiscordiaAction = require('@discordia/action');

const response = (userArgs, msg, framework) => {
  return `here is a joke for ${msg.author.username}: ${generateJoke()}`;
};
const jokeAction = new DiscordiaAction('joke', response);
```
```
# Conversation Example(s)

User: @BotName joke
BotName: @User, here is a joke for User: {something funny}
```
# Testing
🚧 Coming Soon! 🚧