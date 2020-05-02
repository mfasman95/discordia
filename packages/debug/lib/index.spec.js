jest.mock('debug');
const debug = require('debug');
const discordiaDebug = require('./index');
const { DEFAULT_NAMESPACE } = require('./constants');

describe('@discordia/debug', () => {
  test('should call debug with the provided namespace', () => {
    const namespace = 'MOCK_NAMESPACE';
    discordiaDebug(namespace);
    expect(debug).toHaveBeenCalledWith(`${DEFAULT_NAMESPACE}:${namespace}`);
  });
});
