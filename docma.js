/* eslint-disable no-console */
const Docma = require('docma');
const { version } = require('./lerna.json');

const base = process.env.DOCMA_BASE || '/discordia/';

const packages = ['framework', 'action', 'default-help', 'debug'];

const config = {
  src: [
    './packages/**/*.js',
    './guides/*.md',
    './README.md',
    { content: './guides/HOME.md' },
    ...packages.map((pkg) => ({ [pkg]: `./packages/${pkg}/README.md` })),
  ],
  dest: './docs',
  clean: true,
  app: {
    title: 'Discordia',
    entrance: 'content:home',
    base,
    routing: {
      method: 'path',
    },
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
            label: 'Readme',
            href: `${base}readme`,
          },
          {
            label: 'Getting Started',
            items: [
              {
                label: 'Setup',
                href: `${base}gs_setup`,
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
