# `@discordia/framework`

> The main discordia framework

## Usage

### Basic Hello World Example - ping
```js
const framework = require('@discordia/framework');

const actions = [
  {
    accessor: 'ping',
    response: 'pong',
    description: 'ping -> pong',
  }
]

framework(process.env.DISCORD_BOT_KEY, actions);
```
