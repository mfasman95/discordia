const DiscordiaAction = require('@discordia/action');
const debug = require('@discordia/debug');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const _ = require('lodash');

momentDurationFormatSetup(moment);

const debugLog = debug('action:anilist:anime');
const upperFirst = (str) => _.upperFirst(str.toLowerCase());

const query = `
query ($username: String) {
  User (name: $username) {
    siteUrl
    name
    about
    avatar {
      medium
    }
    bannerImage
    favourites(page: 1) {
      anime {
        edges {
          node {
            title {
              userPreferred
            }
          }
        }
      }
      manga {
        edges {
          node {
            title {
              userPreferred
            }
          }
        }
      }
    }
    statistics {
      anime {
        count
        minutesWatched
        episodesWatched
        statuses {
          status
          count
        }
      }
      manga {
        count
        chaptersRead
        volumesRead
        statuses {
          status
          count
        }
      }
    }
  }
}
`;

const response = async (msgContent, msg, framework, userArgs) => {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username: userArgs.join(' '),
        },
      }),
    });
    const resJSON = await res.json();
    debugLog(resJSON);

    if (resJSON.errors) {
      throw new Error(resJSON.errors);
    }

    const { name, about, siteUrl, avatar, bannerImage, favourites, statistics } = resJSON.data.User;

    const embed = new MessageEmbed()
      .setTitle(name)
      .setURL(siteUrl)
      .setAuthor('AniList', undefined, siteUrl)
      .setThumbnail(avatar.medium)
      .setDescription(about || '')
      .setImage(bannerImage);

    if (msgContent.includes('al user!')) {
      if (favourites.anime.edges.length > 0) {
        embed.addField(
          'Favourite Anime',
          favourites.anime.edges.map(({ node }) => node.title.userPreferred).join(', ')
        );
      }
      if (statistics.anime.count > 0) {
        embed.addField('Anime Viewing Stats', `${statistics.anime.count} Total Shows`);
        embed.addField('Time Watched', moment.duration(statistics.anime.minutesWatched, 'minutes').format(), true);
        embed.addField('Episodes Watched', statistics.anime.episodesWatched, true);

        statistics.anime.statuses.forEach(({ status, count }) =>
          embed.addField(`${upperFirst(status)}`, `${count} Anime`, true)
        );
      }
      if (favourites.manga.edges.length > 0) {
        embed.addField(
          'Favourite Manga',
          favourites.manga.edges.map(({ node }) => node.title.userPreferred).join(', ')
        );
      }
      if (statistics.manga.count > 0) {
        embed.addField('Manga Reading Stats', `${statistics.manga.count} Total Manga`);
        embed.addField('Chapters Read', statistics.manga.chaptersRead, true);
        embed.addField('Volumes Read', statistics.manga.volumesRead, true);

        statistics.manga.statuses.forEach(({ status, count }) =>
          embed.addField(`${upperFirst(status)}`, `${count} Manga`, true)
        );
      }
    }

    debugLog(embed);

    return msg.channel.send(embed);
  } catch (err) {
    debugLog('Error');
    debugLog(err);
    return msg.reply('There was an error with the `al user` action :frowning:');
  }
};

module.exports = new DiscordiaAction(
  ['al user', 'al user!'],
  response,
  '`@bot al user {name}` finds the users that matches {name}. Use `al user!` to include statistics.'
);
