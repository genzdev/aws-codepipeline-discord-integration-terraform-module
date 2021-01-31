const relevantStages = process.env.RELEVANT_STAGES || 'BUILD,DEPLOY'

module.exports.ACTION_LEVEL_STATES = {
  STARTED: 'STARTED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED'
}
module.exports.STAGES = {
  SOURCE: 'SOURCE',
  BUILD: 'BUILD',
  DEPLOY: 'DEPLOY'
}
module.exports.DISCORD_COLORS = {
  INFO: 3447003,
  WARNING: 15158332,
  SUCCESS: 15844367,
  ERROR: 10038562
}

module.exports.RELEVANT_STAGES =
  relevantStages
    .split(',')
    .map(stage => module.exports.STAGES[stage.toUpperCase()])
    .filter(stage => stage != null)