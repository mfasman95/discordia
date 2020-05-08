const DiscordiaAction = require('@discordia/action');
const discord = require('discord.js');
const DiscordiaFramework = require('./index');
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

let framework;
describe('@discordia/framework', () => {
  afterEach(() => {
    if (framework && framework.client) {
      framework.client.destroy();
    }
  });

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
        framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.login).toEqual(expect.any(Function));
        expect(framework.actions).toEqual([DEFAULT_HELP, ...mockActions]);
        expect(framework.name).toEqual(DEFAULT_NAME);
        expect(framework.caseSensitiveName).toEqual(DEFAULT_CASE_SENSITIVE_NAME);
        expect(framework.missingCommandMessage).toEqual(DEFAULT_MISSING_COMMAND_MESSAGE);
        expect(framework.help).toEqual(DEFAULT_HELP);
      });

      test('options.name is a String', () => {
        const mockName = 'MOCK_NAME';
        framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
        expect(framework.name).toEqual(mockName);
      });

      test('options.caseSensitiveName is true', () => {
        const mockCaseSensitiveName = true;
        framework = new DiscordiaFramework(mockToken, mockActions, { caseSensitiveName: mockCaseSensitiveName });
        expect(framework.caseSensitiveName).toEqual(mockCaseSensitiveName);
      });

      test('options.caseSensitiveName is false', () => {
        const mockCaseSensitiveName = false;
        framework = new DiscordiaFramework(mockToken, mockActions, { caseSensitiveName: mockCaseSensitiveName });
        expect(framework.caseSensitiveName).toEqual(mockCaseSensitiveName);
      });

      test('options.missingCommandMessage is a String', () => {
        const mockMissingCommandMessage = 'MOCK_MISSING_COMMAND_MESSAGE';
        framework = new DiscordiaFramework(mockToken, mockActions, {
          missingCommandMessage: mockMissingCommandMessage,
        });
        expect(framework.missingCommandMessage).toEqual(mockMissingCommandMessage);
      });

      test('options.missingCommandMessage is a Function', () => {
        const mockMissingCommandMessage = jest.fn();
        framework = new DiscordiaFramework(mockToken, mockActions, {
          missingCommandMessage: mockMissingCommandMessage,
        });
        expect(framework.missingCommandMessage).toEqual(mockMissingCommandMessage);
      });

      test('options.help is a DiscordiaAction', () => {
        const mockHelp = new DiscordiaAction('h', 'MOCK_HELP_MESSAGE');
        framework = new DiscordiaFramework(mockToken, mockActions, { help: mockHelp });
        expect(framework.help).toEqual(mockHelp);
      });

      test('options.help is a null', () => {
        const mockHelp = null;
        framework = new DiscordiaFramework(mockToken, mockActions, { help: mockHelp });
        expect(framework.help).toEqual(mockHelp);
      });
    });

    describe('should set framework.missingCommandMessageType', () => {
      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING if missingCommandMessage is not set', () => {
        framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING);
      });

      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING if missingCommandMessage is a String', () => {
        framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: 'MOCK' });
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.STRING);
      });

      test('to ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION if missingCommandMessage is a Function', () => {
        framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: jest.fn() });
        expect(framework.missingCommandMessageType).toEqual(ENUM_MISSING_COMMAND_MESSAGE_TYPE.FUNCTION);
      });
    });

    describe('should set framework.helpType', () => {
      test('to ENUM_HELP_TYPE.DISCORDIA_ACTION if help is not set', () => {
        framework = new DiscordiaFramework(mockToken, mockActions);
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.DISCORDIA_ACTION);
      });

      test('to ENUM_HELP_TYPE.NULL if help is null', () => {
        framework = new DiscordiaFramework(mockToken, mockActions, { help: null });
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.NULL);
      });

      test('to ENUM_HELP_TYPE.DISCORDIA_ACTION if help is a DiscordiaAction', () => {
        framework = new DiscordiaFramework(mockToken, mockActions, {
          help: new DiscordiaAction('h', 'MOCK_HELP_MESSAGE'),
        });
        expect(framework.helpType).toEqual(ENUM_HELP_TYPE.DISCORDIA_ACTION);
      });
    });

    test('should set client to be an instance of discord.js.Client', () => {
      framework = new DiscordiaFramework(mockToken, mockActions);
      expect(framework.client).toBeInstanceOf(discord.Client);
    });
  });

  describe('shouldHandleMessage', () => {
    const mockUserId = 123;
    const defaultNamePattern = `<@!${mockUserId}>`;
    const mockName = 'MOCK_NAME';

    test('should return true if botName is based on framework.client.user.id and options are default', () => {
      framework = new DiscordiaFramework(mockToken, mockActions);
      framework.client.user = { id: mockUserId };
      expect(framework.shouldHandleMessage(defaultNamePattern)).toEqual(true);
    });

    test('should return false if botName is based on framework.client.user.id and options.name is set', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      framework.client.user = { id: mockUserId };
      expect(framework.shouldHandleMessage(defaultNamePattern)).toEqual(false);
    });

    test('should return true if botName matches options.name case sensitively', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      expect(framework.shouldHandleMessage(mockName)).toEqual(true);
    });

    test('should return true if botName matches options.name not case sensitively', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      expect(framework.shouldHandleMessage(mockName.toLowerCase())).toEqual(true);
    });

    test('should return true if botName matches options.name not case sensitively and options.caseSensitiveName is true', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName, caseSensitiveName: true });
      expect(framework.shouldHandleMessage(mockName)).toEqual(true);
    });

    test('should return false if botName matches options.name not case sensitively and options.caseSensitiveName is true', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName, caseSensitiveName: true });
      expect(framework.shouldHandleMessage(mockName.toLowerCase())).toEqual(false);
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
      framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: 'MOCK' });
      const msgContent = `${framework.name} ${mockUserAction} ${mockUserArgs.join(' ')}`;
      framework.handleMissingCommand(msgContent, mockMsg);
      expect(mockMsg.reply).toHaveBeenCalledWith(framework.missingCommandMessage);
    });

    test('should call framework.missingCommandMessage if options.missingCommandMessage is a Function', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: jest.fn() });
      const msgContent = `${framework.name} ${mockUserAction} ${mockUserArgs.join(' ')}`;
      framework.handleMissingCommand(msgContent, mockMsg);
      expect(framework.missingCommandMessage).toHaveBeenCalledWith(msgContent, mockMsg, framework);
      expect(mockMsg.reply).not.toHaveBeenCalled();
    });

    test('should call msg.reply with the result of framework.missingCommandMessage if options.missingCommandMessage is a Function and framework.missingCommandMessage returns a string', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, {
        missingCommandMessage: jest.fn().mockImplementation(() => 'MOCK_MISSING_COMMAND_RESPONSE'),
      });
      const msgContent = `${framework.name} ${mockUserAction} ${mockUserArgs.join(' ')}`;
      framework.handleMissingCommand(msgContent, mockMsg);
      expect(framework.missingCommandMessage).toHaveBeenCalledWith(msgContent, mockMsg, framework);
      expect(mockMsg.reply).toHaveBeenCalledWith(framework.missingCommandMessage());
    });

    test('should not throw if options.missingCommandMessage is not a String or Function', () => {
      framework = new DiscordiaFramework(mockToken, mockActions, { missingCommandMessage: null });
      expect(() =>
        framework.handleMissingCommand(`${framework.name} ${mockUserAction} ${mockUserArgs.join(' ')}`, mockMsg)
      ).not.toThrow();
    });
  });

  describe('handleMessage', () => {
    const mockName = 'MOCK_NAME';
    beforeEach(() => {
      framework = new DiscordiaFramework(mockToken, mockActions, { name: mockName });
      framework.startingIndex = mockName.length + 1;
    });

    test('should call framework.shouldHandleMessage', () => {
      const originalShouldHandleMessage = framework.shouldHandleMessage;
      framework.shouldHandleMessage = jest.fn();
      const mockMsg = { content: `${mockName} some message` };
      framework.handleMessage(mockMsg);
      expect(framework.shouldHandleMessage).toHaveBeenCalledWith(mockMsg.content);
      framework.shouldHandleMessage = originalShouldHandleMessage;
    });

    test('should call framework.handleMissingCommand if userAction would not trigger one of the provided actions', () => {
      const mockMsg = { content: `${mockName} some message` };
      const originalHandleMissingCommand = framework.handleMissingCommand;
      framework.handleMissingCommand = jest.fn();
      framework.handleMessage(mockMsg);
      expect(framework.handleMissingCommand).toHaveBeenCalledWith(mockMsg.content, mockMsg);
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

  const mockName = 'MOCK_NAME';
  const mockUserId = 123;
  const mockUsername = 123;
  describe('start', () => {
    beforeEach(() => {
      framework = new DiscordiaFramework(mockToken, mockActions);
      framework.client.on = jest.fn();
      framework.client.login = jest.fn();
      framework.client.user = { id: mockUserId, username: mockUsername };
      framework.start();
    });

    test('should call framework.client.on "ready"', () => {
      expect(framework.client.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });

    test('should call framework.client.on "message" with framework.handleMessage', () => {
      expect(framework.client.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    test('should call framework.client.login with framework.token', () => {
      expect(framework.client.login).toHaveBeenCalledWith(mockToken);
    });

    test('should set this.botName based on framework.client.user.id if options are default', () => {
      expect(framework.botName).toEqual(`@${mockUsername}`);
    });
  });

  test('start should set this.botName based on this.name if this.name is set', () => {
    framework = new DiscordiaFramework(mockToken, mockActions);
    framework.client.on = jest.fn();
    framework.client.login = jest.fn();
    framework.name = mockName;
    framework.start();
    expect(framework.botName).toEqual(mockName);
  });
});
