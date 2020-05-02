const discordiaHelpDefault = require('./index');
const { ENUM_HELP_TYPE } = require('./constants');

const mockBotName = 'MOCK_BOT_NAME';
const mockMsg = {
  reply: jest.fn(),
};

const mockAccessorString = 'MOCK_ACCESOR_0';
const mockAccessorArray = ['MOCK_ACCESOR_1', 'MOCK_ACCESSOR_2'];
const mockAccessorFunction = () => 'MOCK_ACCESOR_3';

const mockDescription = 'MOCK_DESCRIPTION';

const mockActionWithStringAccessor = {
  accessor: mockAccessorString,
  description: mockDescription,
};
const mockActionWithArrayAccessor = {
  accessor: mockAccessorArray,
  description: mockDescription,
};
const mockActionWithFunctionAccessor = {
  accessor: mockAccessorFunction,
  description: mockDescription,
};

describe('@discordia/help-default', () => {
  describe('help message', () => {
    test('should include the provided bot name', () => {
      const helpMessage = discordiaHelpDefault(mockBotName, [], [], mockMsg);
      expect(helpMessage).toMatchSnapshot();
    });

    test('should not include the action if the description is missing', () => {
      const helpMessage1 = discordiaHelpDefault(
        mockBotName,
        [
          {
            accessor: mockAccessorString,
          },
        ],
        [],
        mockMsg
      );
      const helpMessage2 = discordiaHelpDefault(mockBotName, [], [], mockMsg);
      expect(helpMessage1).toEqual(helpMessage2);
      expect(helpMessage1).toMatchSnapshot();
    });

    describe('should return a string that includes the accessor(s)', () => {
      test('if the accessor is a String', () => {
        const helpMessage = discordiaHelpDefault(mockBotName, [mockActionWithStringAccessor], [], mockMsg);
        expect(helpMessage).toMatchSnapshot();
      });

      test('if the accessor is an Array', () => {
        const helpMessage = discordiaHelpDefault(mockBotName, [mockActionWithArrayAccessor], [], mockMsg);
        expect(helpMessage).toMatchSnapshot();
      });

      test('if the accessor is a Function', () => {
        const helpMessage = discordiaHelpDefault(mockBotName, [mockActionWithFunctionAccessor], [], mockMsg);
        expect(helpMessage).toMatchSnapshot();
      });

      test('if all three types are provided', () => {
        const helpMessage = discordiaHelpDefault(
          mockBotName,
          [mockActionWithStringAccessor, mockActionWithArrayAccessor, mockActionWithFunctionAccessor],
          [],
          mockMsg
        );
        expect(helpMessage).toMatchSnapshot();
      });
    });

    test('should call msg.reply with the same value that gets returned', () => {
      const helpMessage = discordiaHelpDefault(
        mockBotName,
        [mockActionWithStringAccessor, mockActionWithArrayAccessor, mockActionWithFunctionAccessor],
        [],
        mockMsg
      );
      expect(mockMsg.reply).toHaveBeenCalledWith(helpMessage);
    });
  });

  test('should export the help type enums as a property', () => {
    expect(discordiaHelpDefault.ENUM_HELP_TYPE).toEqual(ENUM_HELP_TYPE);
  });
});
