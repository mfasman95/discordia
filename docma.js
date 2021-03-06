/* eslint-disable no-console */
const Docma = require('docma');
const _ = require('lodash');
const { version } = require('./lerna.json');

const base = process.env.DOCMA_BASE || '/discordia/';

const packages = ['framework', 'action', 'default-help', 'debug', 'complete'];
const generators = ['create-discordia-bot', 'create-discordia-action'];
const aniListActions = ['anime', 'manga', 'user'];
const openWeatherActions = ['current'];

const config = {
  src: [
    './packages/**/*.js',
    './guides/*.md',
    './README.md',
    { content: './README.md' },
    ...packages.map((pkg) => ({ [pkg]: `./packages/${pkg}/README.md` })),
    ...generators.map((pkg) => ({ [pkg]: `./generators/${pkg}/README.md` })),
    ...aniListActions.map((pkg) => ({
      [`action-anilist-${pkg}`]: `./actions/AniList/action-anilist-${pkg}/README.md`,
    })),
    ...openWeatherActions.map((pkg) => ({
      [`action-openweather-${pkg}`]: `./actions/OpenWeather/action-openweather-${pkg}/README.md`,
    })),
  ],
  dest: './docs',
  clean: true,
  app: {
    title: 'Discordia',
    entrance: 'content:readme',
    base,
    routing: {
      method: 'path',
    },
  },
  assets: {
    '/': './guides/img',
  },
  markdown: {
    sanitize: false,
  },
  template: {
    options: {
      title: {
        label: 'Discordia',
      },
      navbar: {
        dark: true,
        menu: [
          {
            label: 'Getting Started',
            items: [
              {
                label: 'Setup Bot',
                href: `${base}gs_setup_your_bot`,
              },
              {
                label: 'Setup Workspace',
                href: `${base}gs_setup_your_workspace`,
              },
              {
                label: 'Start Your Bot',
                href: `${base}gs_start_your_bot`,
              },
              {
                label: 'Write An Action',
                href: `${base}gs_write_an_action`,
              },
              {
                label: 'Configure Your Bot',
                href: `${base}gs_configure_your_bot`,
              },
            ],
          },
          {
            label: 'Packages',
            items: packages.map((pkg) => ({ label: pkg, href: `${base}${pkg}` })),
          },
          {
            label: 'Generators',
            items: generators.map((pkg) => ({ label: pkg, href: `${base}${pkg}` })),
          },
          {
            label: 'Actions',
            items: [
              { separator: true },
              { label: '<b>AniList</b>' },
              { separator: true },
              ...aniListActions.map((pkg) => ({ label: _.upperFirst(pkg), href: `${base}action-anilist-${pkg}` })),
              { separator: true },
              { label: '<b>OpenWeather</b>' },
              { separator: true },
              ...openWeatherActions.map((pkg) => ({
                label: _.upperFirst(pkg),
                href: `${base}action-openweather-${pkg}`,
              })),
            ],
          },
          {
            // https://fontawesome.com/icons/at?style=solid
            iconClass: 'fas fa-lg fa-at',
            label: `API ${version}`,
            href: `${base}api`,
          },
          {
            // https://fontawesome.com/icons/github?style=brands
            iconClass: 'fab fa-lg fa-github',
            label: '',
            href: 'https://github.com/mfasman95/discordia',
            target: '_blank',
          },
        ],
      },
    },
  },
};

Docma.create()
  .build(config)
  .then((success) => console.log('Documentation built successfully - ', success))
  .catch((error) => console.log(error));
