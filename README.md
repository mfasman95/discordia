# @discordia
> Monorepo for the @discordia Discord bot framework


<p align="center">
  <a href="https://github.com/mfasman95/discordia/blob/master/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/mfasman95/discordia">
  </a>
</p>

See the [documentation site](https://mfasman95.github.io/discordia/) for more info.

## What is Discordia?
Discordia is the Roman equivalent of [Eris, the Goddess of Discord](https://en.wikipedia.org/wiki/Eris_(mythology)).

This monorepo, on the other hand, is a tool for creating Discord bots. The core of the framework is made of two pieces - [@discordia/framework](https://mfasman95.github.io/discordia/framework) and [@discordia/action](https://mfasman95.github.io/discordia/action). The `framework` module is used to register your discord bot by giving it your discord bot token as well as giving the bot a name to respond to. The `action` module is how you handle the message responses. It allows you to specify accessors (conditions under which the bot should respond) and responses (the response to be given if the accessor is met). You can also publish the actions you make individually so that others can add those actions to their bots. For a tutorial on how to setup a project using `@discordia` you can check out the [getting started guide](https://mfasman95.github.io/discordia/gs_setup_your_bot).

## Packages
<p align="center">
  <a href="https://www.npmjs.com/package/@discordia/framework">
    <img alt="@discordia/framework" src="https://img.shields.io/npm/v/@discordia/framework?label=%40discordia%2Fframework">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/action">
    <img alt="@discordia/action" src="https://img.shields.io/npm/v/@discordia/action?label=%40discordia%2Faction">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/create-discordia-bot">
    <img alt="@discordia/create-discordia-bot" src="https://img.shields.io/npm/v/@discordia/create-discordia-bot?label=%40discordia%2Fcreate-discordia-bot">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/default-help">
    <img alt="@discordia/default-help" src="https://img.shields.io/npm/v/@discordia/default-help?label=%40discordia%2Fdefault-help">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/debug">
    <img alt="@discordia/debug" src="https://img.shields.io/npm/v/@discordia/debug?label=%40discordia%2Fdebug">
  </a>
  <a href="https://www.npmjs.com/package/@discordia/complete">
    <img alt="@discordia/complete" src="https://img.shields.io/npm/v/@discordia/complete?label=%40discordia%2Fcomplete">
  </a>
</p>

## [Getting Started](https://mfasman95.github.io/discordia/gs_setup_your_bot)
This guide will walk you through creating a bot from the [Discord developers site](http://discordapp.com/developers/) as well as setting up your workspace to develop an `@discordia` bot with Node and NPM, and then finally how to use the [@discordia/framework](https://mfasman95.github.io/discordia/framework) and [@discordia/action](https://mfasman95.github.io/discordia/action) modules.

## Contributing
This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). After you make your changes and update the appropriate tests, do the following steps:

- `npm test` - You can also use `npm run test:watch` to validate in a watch loop
- `npm run lint` - Your changes will be linted when they are staged, but this will help you catch those changes earlier
- `git add ...` - Stage the changes you want to commit
- `npm run commit` - This command will walk you through making a conventional commit
