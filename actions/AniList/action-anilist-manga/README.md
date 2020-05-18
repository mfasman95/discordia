>Note: Some of the links in this README file work better on the [documentation site](https://mfasman95.github.io/discordia/action-anilist-manga)

<p align="center">
  <a href="https://www.npmjs.com/package/@discordia/action-anilist-manga">
    <img alt="@discordia/action-anilist-manga" src="https://img.shields.io/npm/v/@discordia/action-anilist-manga?label=%40discordia%2Faction-anilist-manga">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/action-anilist-manga">
    <img alt="@discordia/action-anilist-manga" src="https://img.shields.io/npm/dw/@discordia/action-anilist-manga">
  </a>
</p>

# What does this action do?
`@discordia/action-current-weather` uses the [Open Weather API](https://openweathermap.org/current) current weather endpoint to get the current weather in a location that the server member specifies. You must provide your own API key when creating an instance of this action.

The request comes in the form `@BotName weather {city name} {state} {country code}` where `{state}` and `{country code}` are each optional.

# Installation
```bash
# install the module using npm
npm install @discordia/action-anilist-manga

# install the module using yarn
yarn add @discordia/action-anilist-manga
```

# Usage
Add the query to the existing array of queries that your bot can respond to.
```js
const DiscordiaFramework = require('@discordia/framework');
const actionAniListManga = require('@discordia/action-anilist-manga');

const actions = [
  // Other actions can go here...
  actionAniListManga,
];

const myBot = new DiscordiaFramework('DISCORD TOKEN', actions);

myBot.start();
```
