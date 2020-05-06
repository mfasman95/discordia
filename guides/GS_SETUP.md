# ⚠️Disclaimer⚠️
These getting started guides assume you are using a Mac or Linux computer with a standard `bash` or `zsh` terminal. Some of the commands included in this guide (e.g. `touch` to make new files) might not work if you are developing on Windows. If you get to a step where you need to run code in a command line and it fails there is a chance that this is the reason.

# Get Your Bot Token And Invite It To Your Server
The first step to creating a Discord bot begins before you even start your own Node project - you must go through the Discord developer site, set up a new application, give that application a bot, and add it to your server. Following [this guide](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) (steps 2 through 4) will walk you through that process in more detail.

# Setup Node
When setting up Node you have two main options. Either way, make sure that by the end of this section you can run `node --version` and `npm --version` in your terminal and get back a [semantic version](https://docs.npmjs.com/about-semantic-versioning) back.

### Install Node
This is the easiest option, but not the recommended one. Just go to the [Node.JS website's download section](https://nodejs.org/en/download/) and click the button for your Operating System.

### Use a Version Manager
The recommended option is to use a version manager, such as [NVM](https://github.com/nvm-sh/nvm) or [Nodenv](https://github.com/nodenv/nodenv). Choose the tool that is best for you and use it to set the version of Node that you are using.

# Start Your Project
Once you have `Node` installed you will also have access to `npm`. Make an empty directory on your machine, run `npm init`, and answer the prompts.
```bash
npm init
```

# Install Your Dependencies
```bash
npm install @discordia/framework @discordia/action dotenv
```
This command installs 3 packages which we will use in this project:
- The [discordia framework](framework) constructor used to instantiate your bot
- The [discordia action](action) constructor used to make actions for your bot
- [Dotenv](https://www.npmjs.com/package/dotenv) is

## Optional - Install Nodemon
```bash
npm install -D nodemon
```
[Nodemon](https://www.npmjs.com/package/nodemon) is a tool for automatically restarting your project whenever the file system changes. Using `nodemon` means you won't have to start and stop your bot every time you change how it works. Installing this tool is not required but it will make your life easier.

# Setup Your Project Structure
```bash
# 1) The directory where all our source code will live
mkdir src
# 2) The file where we will set up our bot
touch src/index.js
# 3) The file where we will set up the actions for our bot (export an empty array for now - we'll get back to this)
echo "module.exports = [];" >> src/actions.js
# 4) The file where your DISCORD_BOT_TOKEN is stored
echo "DISCORD_TOKEN={Insert Your Discord Bot Token Here}" >> .env
# 5) Add your .env file to your .gitignore
echo ".env" >> .gitignore
```

Make sure to use your actual Discord bot token in the fourth command above - we will make use of this in the next step.

> ⚠️WARNING: Adding `.env` to your `.gitignore` is VERY IMPORTANT. If you upload your DISCORD_TOKEN to a service like GitHub or anywhere else it exposes your bot to being hacked. Adding your `.env` file to your `.gitignore` helps prevent this from happening.⚠️

# Add a Start Script to Your `package.json
Open your `package.json`. Add a `start` (and optionally `dev`) script to the `scripts` object.
```json
{
  // ...
  "scripts": {
    // Other Scripts
    "start": "node src/index.js",
    "dev": "nodemon src/index.js" // Leave this off if you didn't install nodemon
  }
  // ...
}
```
At some later points in this guide you will be asked to run `npm start` and test your bot. If you installed `nodemon` you can open a terminal window and type `npm run dev` right now - your project should refresh automatically whenever you change your code and you can ignore any time these guides tell you to run `npm start`.

# Next
Our project is now set up, let's start the bot - proceed to [Getting Started - Start Your Bot](gs_start_your_bot).
