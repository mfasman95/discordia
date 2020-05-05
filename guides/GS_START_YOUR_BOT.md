# Previous
You should have gotten to this page after completing [Getting Started - Setup](gs_setup).

# Setting Up Your Bot
```js
// src/index.js //
// Import Your Dependencies
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Set Up Your Bot
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions);

// Start Your Bot
myBot.start();
```
The first two lines of the example above import things into this file. The first line imports the `@discordia/framework` module that we installed earlier and the second line imports the empty array we exported from `src/actions.js` earlier.

The third line sets up your bot. The `DiscordiaFramework` class has two mandatory parameters - your discord bot token and an array of actions. Remember in the last guide where we told you to add the `start` script to your `package.json` (`"start": "DISCORD_TOKEN=$(cat .discord_token) node src/index.js"`)? That command will load your Discord token from the `.discord_token` file and set it as an environment variable you can access from `process.env`. This ensures that you do not need to include your token in your source code if you are using source control such as `git`.

The fourth line actually starts your bot.

# ⚠️Test Your Bot⚠️
```bash
# Start Your Bot
npm start
# Stop Your Bot (once you are done with this step)
ctrl+c
```
At this point you should be able to send the bot a message and see a response.
1) `@BotName h` or `@BotName help` should display a help message
2) `@BotName action` should display a missing action message

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

# Next
Now that we have a working bot, lets make some actions for it - proceed to [Getting Started - Write An Action](gs_write_an_action).