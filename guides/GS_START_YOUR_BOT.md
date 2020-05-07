# Previous
You should have gotten to this page after completing [Getting Started - Setup](gs_setup).

# Setting Up Your Bot
Open up `src/index.js` in your code editor of choice and add the following code.
```js
// src/index.js //
// Load your `.env` file so the values will be included in `process.env.DISCORD_TOKEN`
require('dotenv').config();
// Import Your Dependencies
const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Set Up Your Bot
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions);

// Start Your Bot
myBot.start();
```
The first line of the example above loads your `.env` file and sets all of the values in that file as environment variables. This is how we can load your discord token ***without including it in your source code***.

The next two lines of the example import dependencies into this file. The first line imports the `@discordia/framework` module that we installed earlier and the second line imports the empty array we exported from `src/actions.js`.

The next line sets up your bot. The `DiscordiaFramework` class has two mandatory parameters - your discord bot token and an array of actions. Since we ran `dotenv` already you can get the `DISCORD_TOKEN` variable from `process.env`.

The final line starts your bot. This means you are ready to test it out.

# ⚠️Test Your Bot⚠️
```bash
# Start your bot
npm start
```
At this point you should be able to send the bot a message in Discord and see a response.

- `@BotName h` or `@BotName help` should display a help message
- `@BotName action` should display a missing action message

TODO: INSERT IMAGE HERE SHOWING MESSAGE EXAMPLES

```bash
# Stop your bot
ctrl + c
```
# Next
Now that we have a working bot, lets make some actions for it - proceed to [Getting Started - Write An Action](gs_write_an_action).