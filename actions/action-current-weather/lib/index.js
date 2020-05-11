const DiscordiaAction = require('@discordia/action');
const fetch = require('node-fetch');
const tuc = require('temp-units-conv');

const RESPONSE_FORMAT = {
  SIMPLE: 'weather',
  RAW: 'weather!',
};

const formatResponse = (weatherJSON, format, location) => {
  const tempFahrenheit = Math.round(tuc.k2f(weatherJSON.main.temp));
  const tempCelsius = Math.round(tuc.k2c(weatherJSON.main.temp));
  const tempMinFahrenheit = Math.round(tuc.k2f(weatherJSON.main.temp_min));
  const tempMinCelsius = Math.round(tuc.k2c(weatherJSON.main.temp_min));
  const tempMaxFahrenheit = Math.round(tuc.k2f(weatherJSON.main.temp_max));
  const tempMaxCelsius = Math.round(tuc.k2c(weatherJSON.main.temp_max));

  const simpleResponse = `The weather for ${location} is ${weatherJSON.weather[0].description}
Current Temperature: ${tempFahrenheit}°F  |  ${tempCelsius}°C
Min Temperature    : ${tempMinFahrenheit}°F  |  ${tempMinCelsius}°C
Max Temperature    : ${tempMaxFahrenheit}°F  |  ${tempMaxCelsius}°C`;

  switch (format) {
    case 'simple': {
      return simpleResponse;
    }
    case 'advanced': {
      return `\`\`\`json
${JSON.stringify(weatherJSON, null, 2)}
\`\`\``;
    }
    default: {
      return simpleResponse;
    }
  }
};

module.exports = (APIKey) => {
  /*
   * https://openweathermap.org/current
   * api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
   * api.openweathermap.org/data/2.5/weather?q={city name},{state}&appid={your api key}
   * api.openweathermap.org/data/2.5/weather?q={city name},{state},{country code}&appid={your api key}
   */
  const response = async (msgContent, msg, framework, userArgs) => {
    // Try to make the request and format it as JSON
    const [city, state, country] = userArgs;

    const cityString = city.replace(/[^a-zA-Z ]/g, '') || '';
    const stateString = state ? `,${state.replace(/[^a-zA-Z ]/g, '')}` : '';
    const countryString = country ? `,${country.replace(/[^a-zA-Z ]/g, '')}` : '';

    const location = `${cityString}${stateString}${countryString}`;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;

      const weather = await fetch(url);
      const weatherJSON = await weather.json();

      if (weatherJSON.cod !== 200) {
        return msg.reply(`\`\`\`json
${JSON.stringify(weatherJSON, null, 2)}
\`\`\``);
      }

      let format = 'simple';
      if (msgContent.includes(RESPONSE_FORMAT.RAW)) {
        format = 'advanced';
      } else if (msgContent.includes(RESPONSE_FORMAT.SIMPLE)) {
        format = 'simple';
      }

      return msg.channel.send(formatResponse(weatherJSON, format, location.split(',').join(', ')));
    } catch (err) {
      return msg.reply('There was an error with the `weather` action :frowning:');
    }
  };

  return new DiscordiaAction(
    [RESPONSE_FORMAT.SIMPLE, RESPONSE_FORMAT.RAW],
    response,
    'Make a query to a weather API in the form `{city name} {state} {country code}` where state and/or country are optional. `weather` returns formatted data, `weather!` returns raw data. <https://openweathermap.org/current>'
  );
};
