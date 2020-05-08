/* eslint-disable no-new */
const DiscordiaAction = require('./index');
const { ENUM_ACCESSOR_TYPE, ENUM_RESPONSE_TYPE, ENUM_DESCRIPTION_TYPE } = require('./constants');

const mockBotName = 'MOCK_BOT_NAME';
const mockFramework = {
  botName: mockBotName,
  startingIndex: mockBotName.length + 1,
};

const mockAccessorString = 'MOCK_ACCESSOR_1';
const mockAccessorArray = ['MOCK_ACCESSOR_2', 'MOCK_ACCESSOR_3'];
const mockAccessorFunction = jest.fn().mockImplementation(() => mockAccessorString);

const mockResponseString = 'MOCK_RESPONSE';
const mockResponseFunction = jest.fn().mockImplementation(() => undefined);
const mockResponseFunctionReturnsString = jest.fn().mockImplementation(() => mockResponseString);

const mockDescriptionString = 'MOCK_DESCRIPTION';
const mockDescriptionNull = null;

describe('@discordia/action', () => {
  describe('constructor', () => {
    describe('should not pass the validate functions', () => {
      // [accessor, response, description]
      const invalidArgArrays = [
        [1, mockResponseString, mockDescriptionString],
        [[mockAccessorString, 1], mockResponseString, mockDescriptionString],
        [mockAccessorString, 1, mockDescriptionString],
        [mockAccessorString, mockResponseString, 1],
      ];
      test.each(invalidArgArrays)(
        'if Constructor is called with invalid args [accessor: %s, response: %s, description: %s]',
        (accessor, response, description) => {
          expect(() => new DiscordiaAction(accessor, response, description)).toThrow();
        }
      );
    });

    describe('should pass the validate functions', () => {
      describe('for accessor', () => {
        // [accessor, ENUM_ACCESOR_TYPE]
        const accessorTypesArray = [
          [mockAccessorString, ENUM_ACCESSOR_TYPE.STRING],
          [mockAccessorArray, ENUM_ACCESSOR_TYPE.ARRAY],
          [mockAccessorFunction, ENUM_ACCESSOR_TYPE.FUNCTION],
        ];
        test.each(accessorTypesArray)(
          'when provided with %s and set DiscordiaAction.accessorType to %s',
          (accessor, accessorEnum) => {
            const action = new DiscordiaAction(accessor, mockResponseString);
            expect(action.accessorType).toEqual(accessorEnum);
          }
        );
      });

      describe('for response', () => {
        // [response, ENUM_RESPONSE_TYPE]
        const accessorTypesArray = [
          [mockResponseString, ENUM_RESPONSE_TYPE.STRING],
          [mockResponseFunction, ENUM_RESPONSE_TYPE.FUNCTION],
          [mockResponseFunctionReturnsString, ENUM_RESPONSE_TYPE.FUNCTION],
        ];
        test.each(accessorTypesArray)(
          'when provided with %s and set DiscordiaAction.responseType to %s',
          (response, responseEnum) => {
            const action = new DiscordiaAction(mockAccessorString, response);
            expect(action.responseType).toEqual(responseEnum);
          }
        );
      });

      describe('for description', () => {
        // [accessor, ENUM_ACCESOR_TYPE]
        const accessorTypesArray = [
          [mockDescriptionString, ENUM_DESCRIPTION_TYPE.STRING],
          [mockDescriptionNull, ENUM_DESCRIPTION_TYPE.NULL],
        ];
        test.each(accessorTypesArray)(
          'when provided with %s and set DiscordiaAction.descriptionType to %s',
          (description, descriptionEnum) => {
            const action = new DiscordiaAction(mockAccessorString, mockResponseString, description);
            expect(action.descriptionType).toEqual(descriptionEnum);
          }
        );
      });
    });
  });

  const mockUserArgs = ['1', '2'];
  const mockClient = { mockClient: 'MOCK_CLIENT' };
  describe('checkAccessor', () => {
    const mockMessage = { mockMessage: 'MOCK_MESSAGE' };

    describe('should call handle action', () => {
      test('if accessor equals userAction and accessor is a string', () => {
        const action = new DiscordiaAction(mockAccessorString, mockResponseString);
        const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
        action.handleAction = jest.fn();
        action.checkAccessor(msgContent, mockMessage, mockFramework);
        expect(action.handleAction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, mockUserArgs);
      });

      test('if accessor equals userAction and accessor is a multi-word string', () => {
        const action = new DiscordiaAction(`${mockAccessorString} second_word`, mockResponseString);
        const msgContent = `${mockBotName} ${mockAccessorString} second_word ${mockUserArgs.join(' ')}`;
        action.handleAction = jest.fn();
        action.checkAccessor(msgContent, mockMessage, mockFramework);
        expect(action.handleAction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, mockUserArgs);
      });

      test('if accessor includes userAction and accessor is an array', () => {
        const action = new DiscordiaAction(mockAccessorArray, mockResponseString);
        const msgContent = `${mockBotName} ${mockAccessorArray[0]} ${mockUserArgs.join(' ')}`;
        action.handleAction = jest.fn();
        action.checkAccessor(msgContent, mockMessage, mockFramework);
        expect(action.handleAction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, mockUserArgs);
      });

      test('if accessor includes a multi-word userAction and accessor is an array', () => {
        const action = new DiscordiaAction([...mockAccessorArray, 'two words'], mockResponseString);
        const msgContent = `${mockBotName} two words ${mockUserArgs.join(' ')}`;
        action.handleAction = jest.fn();
        action.checkAccessor(msgContent, mockMessage, mockFramework);
        expect(action.handleAction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, mockUserArgs);
      });

      test('if accessor returns a truthy value and accessor is a function', () => {
        const action = new DiscordiaAction(mockAccessorFunction, mockResponseString);
        const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
        action.handleAction = jest.fn();
        action.checkAccessor(msgContent, mockMessage, mockFramework);
        expect(action.handleAction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, msgContent.split(' '));
      });
    });

    test('should fail if action.accessorType is modified', () => {
      const action = new DiscordiaAction(mockAccessorString, mockResponseString);
      const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
      action.accessorType = undefined;
      expect(() => action.checkAccessor(msgContent, mockMessage, mockFramework)).toThrow();
    });
  });

  describe('handleAction', () => {
    test('should call msg.reply with action.response if response is a string', () => {
      const action = new DiscordiaAction(mockAccessorString, mockResponseString);
      const mockMessage = { reply: jest.fn() };
      const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
      action.handleAction(msgContent, mockMessage, mockFramework, mockUserArgs);
      expect(mockMessage.reply).toHaveBeenCalledWith(mockResponseString);
    });

    test('should call action.response if response is a function and not call msg.reply if the function does not return a string', () => {
      const action = new DiscordiaAction(mockAccessorString, mockResponseFunction);
      const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
      const mockMessage = { reply: jest.fn() };
      action.handleAction(msgContent, mockMessage, mockFramework, mockUserArgs);
      expect(mockResponseFunction).toHaveBeenCalledWith(msgContent, mockMessage, mockFramework, mockUserArgs);
      expect(mockMessage.reply).not.toHaveBeenCalled();
    });

    test('should call action.response if response is a function and msg.reply if the function returns a string', () => {
      const action = new DiscordiaAction(mockAccessorString, mockResponseFunctionReturnsString);
      const mockMessage = { reply: jest.fn() };
      const msgContent = `${mockBotName} ${mockAccessorString} ${mockUserArgs.join(' ')}`;
      action.handleAction(msgContent, mockMessage, mockFramework, mockUserArgs);
      expect(mockMessage.reply).toHaveBeenCalledWith(mockResponseString);
    });

    test('should fail if action.responseType is modified', () => {
      const action = new DiscordiaAction(mockAccessorString, mockResponseString);
      action.responseType = undefined;
      expect(() => action.responseType(mockAccessorString, {}, mockUserArgs, mockClient)).toThrow();
    });
  });
});
