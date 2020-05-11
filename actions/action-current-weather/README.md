>Note: Some of the links in this README file work better on the [documentation site](https://mfasman95.github.io/discordia/action-weather-current)

<p align="center">
  <a href="https://www.npmjs.com/package/@discordia/action-weather-current">
    <img alt="@discordia/action-weather-current" src="https://img.shields.io/npm/v/@discordia/action-weather-current?label=%40discordia%2Fcomplete">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/action-weather-current">
    <img alt="@discordia/action-weather-current" src="https://img.shields.io/npm/dw/@discordia/action-weather-current">
  </a>
</p>

# What does this action do?
`@discordia/action-current-weather` uses the [Open Weather API](https://openweathermap.org/current) current weather endpoint to get the current weather in a location that the server member specifies. You must provide your own API key when creating an instance of this action.

The request comes in the form `@BotName weather {city name} {state} {country code}` where `{state}` and `{country code}` are each optional.

# Installation
```bash
# install the module using npm
npm install @discordia/action-weather-current

# install the module using yarn
yarn add @discordia/action-weather-current
```

# Usage
Add the query to the existing array of queries that your bot can respond to.
```js
const DiscordiaFramework = require('@discordia/framework');
const actionJsonQuery = require('@discordia/action-weather-current');

const actions = [
  // Other actions can go here...
  actionJsonQuery('OpenWeather API Key'),
];

const myBot = new DiscordiaFramework('DISCORD TOKEN', actions);

myBot.start();
```
