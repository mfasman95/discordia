module.exports = (msg) => {
  const [botName, unsanitizedUserAction] = msg.content.split(' ');
  const userAction = unsanitizedUserAction || '';
  const userArgs = msg.content.slice(msg.content.indexOf(userAction) + userAction.length + 1).split(' ');
  return [botName, userAction, userArgs];
};
