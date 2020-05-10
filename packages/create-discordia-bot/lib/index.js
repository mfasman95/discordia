#!/usr/bin/env node

const yeomanEnv = require('yeoman-environment');
const Generator = require('./generator');

const namespace = 'discordia-bot:app';

const env = yeomanEnv.createEnv();
env.registerStub(Generator, namespace);
env.run(namespace);
