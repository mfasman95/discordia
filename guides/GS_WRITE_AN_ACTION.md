# Previous
You should have gotten to this page after completing [Getting Started - Start Your Bot](gs_start_your_bot).

# Write A Basic `ping` Action
Open `src/action.js` and add the following code to set up your first action.
```js
// src/actions.js //
// Import Your Dependencies
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong', 'ping -> pong');

module.exports = [pingAction];
```

Every action is made up of an accessor, a response, and a description. For more detailed explanations on these, go to the [README file for @discordia/action](action) or the [API Documentation](api#DiscordiaAction).

The accessor is how the bot knows when a server member wants to trigger this action. The response is how the bot knows what to respond with when the action is triggered. The description is how the bot knows what to say when you ask it for `help`. If you leave off the description then it will not be included when you ask the bot for help.

# ⚠️Test Your Bot - Ping⚠️
```bash
# Start your bot
npm start
```
You have given your bot its first action! Try out the following commands:

- `@BotName h` or `@BotName help` should display a help message that describes how to use `ping`
- `@BotName ping` should reply with `pong`

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

```bash
# Stop your bot
ctrl + c
```

# Write An Action with an Array of Accessors
```js
// src/actions.js //
// Import Your Dependencies
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong', 'ping -> pong');

// ADD A NEW ACTION //
const arrayAccessorAction = new DiscordiaAction(['oof', 'ow', 'ouch'], 'rekt', 'Lets you know when you\'ve been rekt.');

// MAKE SURE TO EXPORT THE NEW ACTION //
module.exports = [pingAction, arrayAccessorAction];
```

The accessor can also be an array of strings instead of a single string. You can use this to respond to multiple triggers with the same action.

# ⚠️Test Your Bot - Accessor Array⚠️
```bash
# Start your bot
npm start
```
Try out the following commands:

- `@BotName h` or `@BotName help` should display a help message that describes how to use all the actions you've created
- `@BotName oof` should reply with `rekt`
- `@BotName ow` should reply with `rekt`
- `@BotName ouch` should reply with `rekt`

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

```bash
# Stop your bot
ctrl + c
```

# Write An Action with a Function Accessor
```js
// src/actions.js //
// Import Your Dependencies
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong', 'ping -> pong');
const arrayAccessorAction = new DiscordiaAction(['oof', 'ow', 'ouch'], 'rekt', 'Lets you know when you\'ve been rekt.');

// ADD A NEW ACTION //
const functionAccessor = (msgContent, msg, framework) => {
  if (msgContent.includes('hot')) {
    return true;
  } else if (msgContent.includes('heat')) {
    return true;
  } else if (msgContent.includes('fire')) {
    return true;
  } else if (msgContent.includes('flame')) {
    return true;
  }
  return false;
};
const functionAccessorAction = new DiscordiaAction(functionAccessor, '🔥', 'Let the user know if their message is hot');

// MAKE SURE TO EXPORT THE NEW ACTION //
module.exports = [pingAction, arrayAccessorAction, functionAccessorAction];
```

The accessor can also be a function. Once you use a function you get a lot more freedom with the types of messages you can respond to.

# ⚠️Test Your Bot - Accessor Function⚠️
```bash
# Start your bot
npm start
```
Try out the following commands:

- `@BotName h` or `@BotName help` should display a help message that describes how to use all the actions you've created
- `@BotName this is really hot` should reply with `🔥`
- `@BotName do you like lighting things on fire?` should reply with `🔥`
- `@BotName roasting marshmallows on an open flame` should reply with `🔥`

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

```bash
# Stop your bot
ctrl + c
```

# Write An Action with a Function Response
```js
// src/actions.js //
// Import Your Dependencies
const DiscordiaAction = require('@discordia/action');

const pingAction = new DiscordiaAction('ping', 'pong', 'ping -> pong');
const arrayAccessorAction = new DiscordiaAction(['oof', 'ow', 'ouch'], 'rekt', 'Lets you know when you\'ve been rekt.');
const functionAccessor = (msgContent, msg, framework) => {
  if (msgContent.includes('hot')) {
    return true;
  } else if (msgContent.includes('heat')) {
    return true;
  } else if (msgContent.includes('fire')) {
    return true;
  } else if (msgContent.includes('flame')) {
    return true;
  }
  return false;
};
const functionAccessorAction = new DiscordiaAction(functionAccessor, '🔥', 'Let the user know if their message is hot');

// ADD A NEW ACTION - Try implementing your own generateJoke function, maybe calling a joke API //
const generateJoke = () => 'This should probably make a user laugh';
const functionResponse = (msgContent, msg, framework, userArgs) => {
  return `here is a joke for ${msg.author.username}: ${generateJoke()}`;
};
const jokeAction = new DiscordiaAction('joke', functionResponse, 'Responds to the user with a funny joke');

// MAKE SURE TO EXPORT THE NEW ACTION //
module.exports = [pingAction, arrayAccessorAction, functionAccessorAction, jokeAction];
```

The response can be a function. This is where you can make the most powerful actions - actions that leverage the whole Discord client object, actions that make API calls to inform responses, and pretty much anything else you can think of.

# ⚠️Test Your Bot - Response Function⚠️
```bash
# Start your bot
npm start
```
Try out the following commands:

- `@BotName h` or `@BotName help` should display a help message that describes how to use all the actions you've created
- `@BotName joke` should reply with a message that includes my username and a generated joke

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

```bash
# Stop your bot
ctrl + c
```

# Optional - Write Your Own Action
You now have all of the information you need to write your own actions with potentially complex accessors and responses. Try flexing your coding muscles and writing something a little more complex than the examples above or skip ahead to the next section to learn a little more about how to configure your framework.

# Next
Now that we have a working bot with actions, lets experiment with some of the configuration options the bot provides - proceed to [Getting Started - Configure Your Bot](gs_configure_your_bot).