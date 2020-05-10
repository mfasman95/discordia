const DiscordiaAction = require('@discordia/action');

const functionAccessor = (msgContent /* msg, framework */) => {
  if (msgContent.includes('hot')) {
    return true;
  }
  if (msgContent.includes('heat')) {
    return true;
  }
  if (msgContent.includes('fire')) {
    return true;
  }
  if (msgContent.includes('flame')) {
    return true;
  }
  return false;
};

// https://mfasman95.github.io/discordia/api#DiscordiaAction
module.exports = new DiscordiaAction(functionAccessor, '🔥', 'Let the user know if their message is hot');
