const discordiaDefaultHelp = require('./index');
const { ENUM_HELP_TYPE } = require('./constants');

const mockMsg = {};
const mockUserArgs = [];
const mockFramework = {};

const mockBotName = 'MOCK_BOT_NAME';

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

describe('@discordia/default-help', () => {
  describe('accessor', () => {
    beforeEach(() => {
      jest.spyOn(discordiaDefaultHelp, 'response').mockImplementation(jest.fn);
    });
    afterEach(() => {
      discordiaDefaultHelp.response.mockRestore();
    });

    test('responds to "h"', () => {
      discordiaDefaultHelp.checkAccessor('h', mockMsg, mockUserArgs, mockFramework);
      expect(discordiaDefaultHelp.response).toHaveBeenCalledWith(mockUserArgs, mockMsg, mockFramework);
    });

    test('responds to "help"', () => {
      discordiaDefaultHelp.checkAccessor('help', mockMsg, mockUserArgs, mockFramework);
      expect(discordiaDefaultHelp.response).toHaveBeenCalledWith(mockUserArgs, mockMsg, mockFramework);
    });

    test('does not respond to other strings', () => {
      discordiaDefaultHelp.checkAccessor('foo', mockMsg, mockUserArgs, mockFramework);
      expect(discordiaDefaultHelp.response).not.toHaveBeenCalled();
    });
  });

  describe('response', () => {
    test('should include the provided bot name', () => {
      const helpMessage = discordiaDefaultHelp.response(
        [],
        {},
        {
          nameToSend: mockBotName,
          actions: [discordiaDefaultHelp],
        }
      );
      expect(helpMessage).toMatchSnapshot();
    });

    test('should not include the action if the description is missing', () => {
      const helpMessage1 = discordiaDefaultHelp.response(
        [],
        {},
        {
          nameToSend: mockBotName,
          actions: [
            discordiaDefaultHelp,
            {
              accessor: mockAccessorString,
            },
          ],
        }
      );
      const helpMessage2 = discordiaDefaultHelp.response(
        [],
        {},
        {
          nameToSend: mockBotName,
          actions: [discordiaDefaultHelp],
        }
      );
      expect(helpMessage1).toEqual(helpMessage2);
      expect(helpMessage1).toMatchSnapshot();
    });

    describe('should return a string that includes the accessor(s)', () => {
      test('if the accessor is a String', () => {
        const helpMessage = discordiaDefaultHelp.response(
          [],
          {},
          {
            nameToSend: mockBotName,
            actions: [discordiaDefaultHelp, mockActionWithStringAccessor],
          }
        );
        expect(helpMessage).toMatchSnapshot();
      });

      test('if the accessor is an Array', () => {
        const helpMessage = discordiaDefaultHelp.response(
          [],
          {},
          {
            nameToSend: mockBotName,
            actions: [discordiaDefaultHelp, mockActionWithArrayAccessor],
          }
        );
        expect(helpMessage).toMatchSnapshot();
      });

      test('if the accessor is a Function', () => {
        const helpMessage = discordiaDefaultHelp.response(
          [],
          {},
          {
            nameToSend: mockBotName,
            actions: [discordiaDefaultHelp, mockActionWithFunctionAccessor],
          }
        );
        expect(helpMessage).toMatchSnapshot();
      });

      test('if all three types are provided', () => {
        const helpMessage = discordiaDefaultHelp.response(
          [],
          {},
          {
            nameToSend: mockBotName,
            actions: [
              discordiaDefaultHelp,
              mockActionWithStringAccessor,
              mockActionWithArrayAccessor,
              mockActionWithFunctionAccessor,
            ],
          }
        );
        expect(helpMessage).toMatchSnapshot();
      });
    });
  });

  test('should export the help type enums as a property', () => {
    expect(discordiaDefaultHelp.ENUM_HELP_TYPE).toEqual(ENUM_HELP_TYPE);
  });
});
