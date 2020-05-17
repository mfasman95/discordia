const actionOpenweatherCurrent = require('@discordia/action-openweather-current');
const stringAccessorAction = require('./string-accessor-action');
const arrayAccessorAction = require('./array-accessor-action');
const functionAccessorAction = require('./function-accessor-action');
const functionResponseAction = require('./function-response-action');

module.exports = [
  stringAccessorAction,
  arrayAccessorAction,
  functionAccessorAction,
  functionResponseAction,
  actionOpenweatherCurrent(process.env.OPEN_WEATHER_TOKEN),
];
