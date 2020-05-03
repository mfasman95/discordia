const parseMessageContent = require('./parseMessageContent');

const message = { content: 'NAME ACTION ARG1 ARG2 ARG3' };
const [botName, userAction, userArgs] = parseMessageContent(message);

describe('parseMessageContent', () => {
  test('botName should be the first word in msg.content', () => expect(botName).toEqual('NAME'));
  test('userAction should be the second word in msg.content', () => expect(userAction).toEqual('ACTION'));
  test('userArgs should be the rest of the words in msg.content', () =>
    expect(userArgs).toEqual(['ARG1', 'ARG2', 'ARG3']));
});
