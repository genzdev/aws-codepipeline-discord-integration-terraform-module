const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const axios = require('axios')

module.exports.postMessage = (message) => {
  axios({
    method: 'post',
    headers: { 
      'Content-Type': 'application/json'
    },
    url: DISCORD_WEBHOOK_URL,
    data: message
  });
}