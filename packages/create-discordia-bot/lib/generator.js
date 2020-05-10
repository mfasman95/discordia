const path = require('path');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const glob = require('fast-glob');
const _ = require('lodash');
const { cyan, yellow } = require('chalk');

module.exports = class extends Generator {
  initializing() {
    this.log(
      yosay(
        yellow(`Welcome to ${cyan('create-discordia-bot')}

Answer the following prompts to create your bot`),
        { maxLength: 50 }
      )
    );
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
        store: true,
        validate: (value) => !_.isEmpty(value),
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'A short description of your project',
        default: 'A discord bot',
        store: true,
        validate: (value) => !_.isEmpty(value),
      },
      {
        type: 'input',
        name: 'discordToken',
        message:
          'The token for your discord bot - it will only be stored in a `.env` file that is listed in the provided `.gitignore`',
        validate: (value) => !_.isEmpty(value),
      },
    ]);

    this.config.set(answers);
  }

  writing() {
    const filesArray = glob.sync([path.resolve(__dirname, './templates', '**/*')], {
      dot: true,
    });

    this.fs.copyTpl(filesArray, this.destinationRoot(), this.config.getAll());

    /*
     * The generator cannot be published with a `package.json` or `.gitignore` in the templates folder
     * rename the files after writing them
     */
    this.fs.move(this.destinationPath('_package.json'), this.destinationPath('package.json'));
    this.fs.move(this.destinationPath('_gitignore'), this.destinationPath('.gitignore'));
  }

  end() {
    this.installDependencies({
      bower: false,
      npm: true,
    });
  }
};
