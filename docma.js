/* eslint-disable no-console */
const Docma = require('docma');
const { version } = require('./lerna.json');

const base = process.env.DOCMA_BASE || '/discordia/';

const config = {
  src: ['./packages/**/*.js', './guides/*.md', { guide: './README.md' }],
  dest: './docs',
  clean: true,
  app: {
    title: 'Discordia',
    entrance: 'content:guide',
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
            label: 'Discordia',
            href: `${base}`,
          },
          {
            label: 'Getting Started',
            items: [
              {
                label: 'Setting Up A Bot',
                href: `${base}make_your_bot`,
              },
              {
                label: 'Creating An Action',
                href: `${base}create_an_action`,
              },
              {
                label: 'Discordia Quick Start',
                href: `${base}quick_start`,
              },
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
