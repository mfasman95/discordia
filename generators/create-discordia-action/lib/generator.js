const path = require('path');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const glob = require('fast-glob');
const _ = require('lodash');
const { cyan, yellow } = require('chalk');

const requiredValue = (value) => (_.isEmpty(value) ? 'Required' : true);

module.exports = class extends Generator {
  initializing() {
    this.config.name = '@discordia/create-discordia-action';

    this.log(
      yosay(
        yellow(`Welcome to ${cyan('create-discordia-action')}

Answer the following prompts to create your bot`),
        { maxLength: 50 }
      )
    );
  }

  async prompting() {
    await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
        store: true,
        validate: requiredValue,
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'A short description of your project',
        default: 'A discord bot',
        store: true,
        validate: requiredValue,
      },
    ]);
  }

  writing() {
    const filesArray = glob.sync([path.resolve(__dirname, './templates', '**/*')], {
      dot: true,
    });

    this.fs.copyTpl(filesArray, this.destinationRoot(), {
      ...this.config.getAll(),
    });

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
