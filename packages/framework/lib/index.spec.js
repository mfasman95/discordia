const DiscordiaAction = require('@discordia/action');
const discord = require('discord.js');
const DiscordiaFramework = require('./index');
const { parseMessageContent } = require('./utils');
const {
  DEFAULT_NAME,
  DEFAULT_CASE_SENSITIVE_NAME,
  DEFAULT_MISSING_COMMAND_MESSAGE,
  DEFAULT_HELP,
  ENUM_MISSING_COMMAND_MESSAGE_TYPE,
  ENUM_HELP_TYPE,
} = require('./constants');

const mockToken = 'MOCK_TOKEN';
const mockActions = [new DiscordiaAction('ping', 'pong', 'ping -> pong')];

describe('@discordia/framework', () => {
  describe('constructor', () => {
    describe('should not pass the validate functions', () => {
      // [token, actions, options]
      const invalidArgArrays = [
        [1, mockActions, undefined],
        [mockToken, 1, undefined],
        [mockToken, [...mockActions, 1], undefined],
        [mockToken, mockActions, { name: 1 }],
        [mockToken, mockActions, { caseSensitiveName: 1 }],
      ];
      test.each(invalidArgArrays)(
        'if Constructor is called with invalid args [token: %s, actions: %s, options: %s]',
        (token, actions, options) => {
          expect(() => new DiscordiaFramework(token, actions, options)).toThrow();
        }
      );
    });

    describe('should set passed in values as properties on framework if token and actions are valid and ', () => {
      test('options are default', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.token).toEqual(mockToken);
        expect(framework.actions).toEqual(mockActions);
        expect(framework.name).toEqual(DEFAULT_NAME);
        expect(framework.caseSensitiveName).toEqual(DEFAULT_CASE_SENSITIVE_NAME);
        expect(framework.missingCommandMessage).toEqual(DEFAULT_MISSING_COMMAND_MESSAGE);
        expect(framework.help).toEqual(DEFAULT_HELP);
      });

      test('options.name is a String', () => {
        const mockName = 'MOCK_NAME';
        const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
        expect(framework.name).toEqual(mockName);
      });

      test('options.caseSensitiveName is true', () => {
        const mockCaseSensitiveName = true;
        const framework = new DiscordiaFramework(mockToken, mockActions, { caseSensitiveName: mockCaseSensitiveName });
        expect(framework.caseSensitiveName).toEqual(mockCaseSensitiveName);
      });

      test('options.caseSensitiveName is false', () => {
        const mockCaseSensitiveName = false;
        const framework = new DiscordiaFramework(mockToken, mockActions, { caseSensitiveName: mockCaseSensitiveName });
        expect(framework.caseSensitiveName).toEqual(mockCaseSensitiveName);
      });

      test('options.missingCommandMessage is a String', () => {
        const mockMissingCommandMessage = 'MOCK_MISSING_COMMAND_MESSAGE';
        const framework = new DiscordiaFramework(mockToken, mockActions, {
          missingCommandMessage: mockMissingCommandMessage,
        });
        expect(framework.missingCommandMessage).toEqual(mockMissingCommandMessage);
      });

      test('options.missingCommandMessage is a Function', () => {
        const mockMissingCommandMessage = jest.fn();
        const framework = new DiscordiaFramework(mockToken, mockActions, {
          missingCommandMessage: mockMissingCommandMessage,
        });
        expect(framework.missingCommandMessage).toEqual(mockMissingCommandMessage);
      });

      test('options.help is a String', () => {
        const mockHelp = 'MOCK_HELP';
        const framework = new DiscordiaFramework(mockToken, mockActions, { help: mockHelp });
        expect(framework.help).toEqual(mockHelp);
      });

      test('options.help is a Function', () => {
        const mockHelp = jest.fn();
        const framework = new DiscordiaFramework(mockToken, mockActions, { help: mockHelp });
        expect(framework.help).toEqual(mockHelp);
      });
    });

    describe('should set framework.missingCommandMessageType', () => {
      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING if missingCommandMessage is not set', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING);
      });

      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING if missingCommandMessage is a String', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: 'MOCK' });
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING);
      });

      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION if missingCommandMessage is a Function', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: jest.fn() });
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION);
      });
    });

    describe('should set framework.helpType', () => {
      test('to ENUM_HELP_TYPE.STRING if help is not set', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.FUNCTION);
      });

      test('to ENUM_HELP_TYPE.STRING if help is a String', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions, { help: 'MOCK' });
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.STRING);
      });

      test('to ENUM_HELP_TYPE.FUNCTION if help is a Function', () => {
        const framework = new DiscordiaFramework(mockToken, mockActions, { help: jest.fn() });
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.FUNCTION);
      });
    });

    test('should set client to be an instance of discord.js.Client', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      expect(framework.client).toBeInstanceOf(discord.Client);
    });
  });

  describe('shouldHandleMessage', () => {
    const mockUserId = 123;
    const mockUsername = 123;
    const defaultNamePattern = `<@!${mockUserId}>`;
    const mockName = 'MOCK_NAME';

    test('should return true if botName is based on framework.client.user.id and options are default', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      framework.client = { user: { id: mockUserId } };
      expect(framework.shouldHandleMessage(defaultNamePattern)).toEqual(true);
    });

    test('should return false if botName is based on framework.client.user.id and options.name is set', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      framework.client = { user: { id: mockUserId } };
      expect(framework.shouldHandleMessage(defaultNamePattern)).toEqual(false);
    });

    test('should return true if botName matches options.name case sensitively', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      expect(framework.shouldHandleMessage(mockName)).toEqual(true);
    });

    test('should return true if botName matches options.name not case sensitively', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      expect(framework.shouldHandleMessage(mockName.toLowerCase())).toEqual(true);
    });

    test('should return true if botName matches options.name not case sensitively and options.caseSensitiveName is true', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName, caseSensitiveName: true });
      expect(framework.shouldHandleMessage(mockName)).toEqual(true);
    });

    test('should return false if botName matches options.name not case sensitively and options.caseSensitiveName is true', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName, caseSensitiveName: true });
      expect(framework.shouldHandleMessage(mockName.toLowerCase())).toEqual(false);
    });

    test('should set this.nameToSend based on framework.client.user.id if options are default', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      framework.client = { user: { id: mockUserId, username: mockUsername } };
      framework.shouldHandleMessage(defaultNamePattern);
      expect(framework.nameToSend).toEqual(`@${mockUsername}`);
    });

    test('should set this.nameToSend based on options.name if options.name is set', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      framework.shouldHandleMessage(defaultNamePattern);
      expect(framework.nameToSend).toEqual(mockName);
    });
  });

  describe('handleHelp', () => {
    const mockMsg = { reply: jest.fn() };

    test('should return true if userAction is "help"', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      expect(framework.handleHelp('help', [], mockMsg)).toEqual(true);
    });

    test('should return true if userAction is "h"', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      expect(framework.handleHelp('h', [], mockMsg)).toEqual(true);
    });

    test('should return false if userAction is not "help" or "h"', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions);
      expect(framework.handleHelp('NOT_HELP', [], mockMsg)).toEqual(false);
    });

    test('should call msg.reply with framework.help if options.help is a String', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { help: 'MOCK_HELP' });
      framework.handleHelp('h', [], mockMsg);
      expect(mockMsg.reply).toHaveBeenCalledWith(framework.help);
    });

    test('should call framework.help with expected params if options.help is Function', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { help: jest.fn() });
      framework.handleHelp('h', [], mockMsg);
      expect(framework.help).toHaveBeenCalledWith(framework.nameToSend, framework.actions, [], mockMsg);
    });

    test('should call msg.reply with a default value options.help is not a String or Function', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { help: null });
      framework.handleHelp('h', [], mockMsg);
      expect(mockMsg.reply).toHaveBeenCalledWith('I am missing a help command, sorry :frowning:');
    });

    test('should not throw if options.help is not a String or Function', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { help: null });
      expect(() => framework.handleHelp('h', [], mockMsg)).not.toThrow();
    });
  });

  describe('handleMissingCommand', () => {
    const mockUserAction = 'MOCK_ACTION';
    const mockUserArgs = [];
    const mockMsg = { reply: jest.fn() };

    afterEach(() => {
      mockMsg.reply.mockReset();
    });

    test('should call msg.reply with framework.missingCommandMessage if options.missingCommandMessage is a String', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: 'MOCK' });
      framework.handleMissingCommand(mockUserAction, mockUserArgs, mockMsg);
      expect(mockMsg.reply).toHaveBeenCalledWith(framework.missingCommandMessage);
    });

    test('should call framework.missingCommandMessage if options.missingCommandMessage is a Function', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: jest.fn() });
      framework.handleMissingCommand(mockUserAction, mockUserArgs, mockMsg);
      expect(framework.missingCommandMessage).toHaveBeenCalledWith(
        mockUserAction,
        mockUserArgs,
        mockMsg,
        framework.client
      );
      expect(mockMsg.reply).not.toHaveBeenCalled();
    });

    test('should call msg.reply with the result of framework.missingCommandMessage if options.missingCommandMessage is a Function and framework.missingCommandMessage returns a string', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, {
        missingCommandMessage: jest.fn().mockImplementation(() => 'MOCK_MISSING_COMMAND_RESPONSE'),
      });
      framework.handleMissingCommand(mockUserAction, mockUserArgs, mockMsg);
      expect(framework.missingCommandMessage).toHaveBeenCalledWith(
        mockUserAction,
        mockUserArgs,
        mockMsg,
        framework.client
      );
      expect(mockMsg.reply).toHaveBeenCalledWith(framework.missingCommandMessage());
    });

    test('should not throw if options.missingCommandMessage is not a String or Function', () => {
      const framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: null });
      expect(() => framework.handleMissingCommand(mockUserAction, mockUserArgs, mockMsg)).not.toThrow();
    });
  });

  describe('handleMessage', () => {
    const mockName = 'MOCK_NAME';
    const framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });

    test('should call framework.shouldHandleMessage', () => {
      const originalShouldHandleMessage = framework.shouldHandleMessage;
      framework.shouldHandleMessage = jest.fn();
      framework.handleMessage({ content: `${mockName} some message` });
      expect(framework.shouldHandleMessage).toHaveBeenCalledWith(mockName);
      framework.shouldHandleMessage = originalShouldHandleMessage;
    });

    test('should call framework.handleMissingCommand if userAction would not trigger one of the provided actions', () => {
      const msg = { content: `${mockName} some message` };
      const originalHandleMissingCommand = framework.handleMissingCommand;
      framework.handleMissingCommand = jest.fn();
      framework.handleMessage(msg);
      const [, userAction, userArgs] = parseMessageContent(msg);
      expect(framework.handleMissingCommand).toHaveBeenCalledWith(userAction, userArgs, msg);
      framework.handleMissingCommand = originalHandleMissingCommand;
    });

    test('should not call framework.handleMissingCommand if userAction would trigger one of the provided actions', () => {
      const msg = { content: `${mockName} ping message`, reply: jest.fn() };
      const originalHandleMissingCommand = framework.handleMissingCommand;
      framework.handleMissingCommand = jest.fn();
      framework.handleMessage(msg);
      expect(framework.handleMissingCommand).not.toHaveBeenCalled();
      framework.handleMissingCommand = originalHandleMissingCommand;
    });

    test('should return true if the userAction is "help"', () => {
      const msg = { content: `${mockName} help message`, reply: jest.fn() };
      expect(framework.handleMessage(msg)).toEqual(true);
    });

    test('should return true if the userAction is "h"', () => {
      const msg = { content: `${mockName} h message`, reply: jest.fn() };
      expect(framework.handleMessage(msg)).toEqual(true);
    });

    test('should return true if the userAction would trigger one of the provided actions', () => {
      const msg = { content: `${mockName} ping message`, reply: jest.fn() };
      expect(framework.handleMessage(msg)).toEqual(true);
    });

    test('should return false if the userAction would not trigger any of the provided actions', () => {
      const msg = { content: `${mockName} some message`, reply: jest.fn() };
      expect(framework.handleMessage(msg)).toEqual(false);
    });

    test('should return false if the message does not target framework.name', () => {
      const msg = { content: 'some random message' };
      expect(framework.handleMessage(msg)).toEqual(false);
    });
  });

  describe('start', () => {
    const framework = new DiscordiaFramework(mockToken, mockActions);
    beforeAll(() => {
      framework.client = {
        on: jest.fn(),
        login: jest.fn(),
      };

      framework.start();
    });

    test('should call framework.client.on "ready"', () => {
      expect(framework.client.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });

    test('should call framework.client.on "message" with framework.handleMessage', () => {
      expect(framework.client.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    test('should call framework.client.login with framework.token', () => {
      expect(framework.client.login).toHaveBeenCalledWith(framework.token);
    });
  });
});
