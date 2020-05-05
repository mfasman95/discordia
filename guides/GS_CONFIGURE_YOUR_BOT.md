# Previous
You should have gotten to this page after completing [Getting Started - Write An Action](gs_write_an_action).

# Give Config Options To Your Bot
This page in the Getting Started guides is fully optional - if all you want is a bot you can @ and send a message to then you do not need to read this page.

There are a variety of configuration options available for your bot. For more detailed explanations on these options, go to the [README file for @discordia/framework](framework) or the [API Documentation](api#DiscordiaFramework).

# Custom Name
```js
// src/index.js //
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Options object
const options = {
  name: 'bot-name',
};
// Pass ptions as the third parameter to the bot constructor
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions, options);
myBot.start();
```
By setting `options.name` you stop the bot from responding to `@` and instead the bot will responds to any messages that start with the one word `options.name` key. By default the bot does not treat `name` as case sensitive - this bot would respond to `boT-Name`, `bot-name`, `bOt-NaMe` and many more variations.

# Case Sensitive Name
```js
// src/index.js //
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Options object
const options = {
  name: 'bot-name',
  caseSensitiveName: true,
};
// Pass ptions as the third parameter to the bot constructor
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions, options);
myBot.start();
```
By setting `options.caseSensitiveName` you make sure the bot only responds to `options.name` if the first word in the message matches exactly. This option does nothing if `options.name` is not set.

# Missing Command Message
```js
// src/index.js //
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Options object
const options = {
  missingCommandMessage: 'You missed that command, huh?',
};
// Pass ptions as the third parameter to the bot constructor
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions, options);
myBot.start();
```
By default the bot will respond to any missing command with the default missing command message. You can override that message with a static string or a custom function. For more details on the function go to the [README file for @discordia/framework](framework) or the [API Documentation](api#DiscordiaFramework).

# Help
```js
// src/index.js //
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Options object
const options = {
  help: 'You missed that command, huh?',
};
// Pass ptions as the third parameter to the bot constructor
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions, options);
myBot.start();
```
By default the bot will respond to any `help` or `h` action with the default help message exported by [@discordia/help-default](help-default). This default message is based on the accessors and descriptions of the provided actions. You can override that message with a static string or a custom function. For more details on the function go to the [README file for @discordia/framework](framework) or the [API Documentation](api#DiscordiaFramework).