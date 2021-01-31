const DISCORD_CHANNEL = process.env.DISCORD_CHANNEL

const Constants = require('./constants')
const DiscordHelper = require('./discord-helper')
const DiscordMessageSender = require('./discord-message-sender')

function processEvent (event, callback) {
  console.log(JSON.stringify(event, 2, null))
  const eventDetails = event.detail

  if (eventDetails.action &&
    !Constants.RELEVANT_STAGES.find(stage => eventDetails.action.toUpperCase())) {
    console.log(`Untracked Stage: ${eventDetails.action.toUpperCase()}`)
    return Promise.resolve()
  }
  return DiscordHelper.createDiscordMessage(eventDetails)
    .then(DiscordMessageSender.postMessage)
}

exports.handle = (event, context, callback) => {
  processEvent(event).then(result => {
    callback(null, 'Discord Message successfully pushed')
  }).catch(err => callback(err))
}