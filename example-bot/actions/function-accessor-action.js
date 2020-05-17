const DiscordiaAction = require('@discordia/action');

const functionAccessor = (messageContent) => {
  if (messageContent.includes('hot')) {
    return true;
  }

  if (messageContent.includes('heat')) {
    return true;
  }

  if (messageContent.includes('fire')) {
    return true;
  }

  if (messageContent.includes('flame')) {
    return true;
  }

  return false;
};

// https://mfasman95.github.io/discordia/api#DiscordiaAction
module.exports = new DiscordiaAction(functionAccessor, '🔥', 'Let the user know if their message is hot');
