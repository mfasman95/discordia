// Load your `.env` file so the values will be included in `process.env`
require('dotenv').config();

const DiscordiaFramework = require('@discordia/framework');
const actions = require('./actions'); // This should be an empty array

// Set Up Your Bot - https://mfasman95.github.io/discordia/api#DiscordiaFramework
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions);

// Start Your Bot
myBot.start();
