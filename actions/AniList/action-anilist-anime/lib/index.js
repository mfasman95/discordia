const DiscordiaAction = require('@discordia/action');
const debug = require('@discordia/debug');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const _ = require('lodash');

const debugLog = debug('action:anilist:anime');
const upperFirst = (str) => _.upperFirst(str.toLowerCase());

const query = `
query ($search: String) {
  Media (search: $search, type: ANIME) {
    title {
      romaji
      english
      native
    }
    description
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    season
    seasonYear
    episodes
    genres
    averageScore
    popularity
    status
    siteUrl
    coverImage {
      medium
    }
    bannerImage
    characters(sort: ROLE, perPage: 20) {
      edges {
        role
        node {
          name {
            full
            native
          }
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
          search: userArgs.join(' '),
        },
      }),
    });
    const resJSON = await res.json();

    debugLog(resJSON);

    const {
      title,
      description,
      startDate,
      endDate,
      season,
      seasonYear,
      episodes,
      genres,
      averageScore,
      popularity,
      status,
      siteUrl,
      coverImage,
      bannerImage,
      characters,
    } = resJSON.data.Media;

    const startDateFormatted = `${startDate.month}/${startDate.day}/${startDate.year}`;
    const endDateFormatted = `${endDate.month}/${endDate.day}/${endDate.year}`;
    const publishedValue = endDateFormatted.includes('null')
      ? `${startDateFormatted} - Ongoing`
      : `${startDateFormatted} -  ${endDateFormatted}`;

    const embed = new MessageEmbed()
      .setTitle(`${title.english} - ${title.romaji} - ${title.native}`)
      .setURL(siteUrl)
      .setAuthor('AniList', undefined, siteUrl)
      .setThumbnail(coverImage.medium)
      .addFields(
        { name: 'Season', value: `${upperFirst(season)} ${seasonYear}`, inline: true },
        { name: 'Aired', value: publishedValue, inline: true },
        { name: 'Status', value: `${upperFirst(status)}`, inline: true },
        { name: 'Episodes', value: episodes, inline: true },
        { name: 'Average Score', value: `${averageScore}/100`, inline: true },
        { name: 'Rank', value: popularity, inline: true },
        { name: 'Genres', value: genres.join(', '), inline: true }
      )
      .setImage(bannerImage);

    if (msgContent.includes('anime!')) {
      const descriptionWithCharacters = characters.edges
        .filter(({ role }) => role === 'MAIN')
        .map(({ node }) => node.name)
        .reduce(
          (fullMessage, { full, native }) => `${fullMessage}\n${full} - ${native}`,
          `${description.replace(/<br>/g, '\n')}\n\n**Characters**`
        );

      embed.setDescription(descriptionWithCharacters);
    }

    return msg.channel.send(embed);
  } catch (err) {
    debugLog('Error');
    debugLog(err);
    return msg.reply('There was an error with the `anime` action :frowning:');
  }
};

module.exports = new DiscordiaAction(
  ['anime', 'anime!'],
  response,
  '`@bot anime {name}` finds the anime that best matches {name}. Use `anime!` for a more verbose description.'
);
