const DiscordiaAction = require('@discordia/action');

const generateJoke = () => 'This should probably make a user laugh';
const functionResponse = (messageContent, message /* framework, userArgs */) =>
  `here is a joke for ${message.author.username}: ${generateJoke()}`;

// https://mfasman95.github.io/discordia/api#DiscordiaAction
module.exports = new DiscordiaAction('joke', functionResponse, 'Responds to the user with a funny joke');
