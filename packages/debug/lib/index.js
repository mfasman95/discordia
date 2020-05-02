const debug = require('debug');
const { DEFAULT_NAMESPACE } = require('./constants');

module.exports = (namespace) => debug(`${DEFAULT_NAMESPACE}:${namespace}`);
