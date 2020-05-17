// Load your `.env` file so the values will be included in `process.env.DISCORD_TOKEN`
require('dotenv').config();
// Import Your Dependencies
const { DiscordiaFramework } = require('@discordia/complete');
const actions = require('./actions'); // This should be an empty array

// Set Up Your Bot
const myBot = new DiscordiaFramework(process.env.DISCORD_TOKEN, actions);

// Start Your Bot
myBot.start();
